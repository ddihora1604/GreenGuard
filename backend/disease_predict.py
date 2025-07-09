import os
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.layers import Layer

model_path = "D:/Darshan College/IPD/1. GreenGaurd/backend/models/adgf_combinedagain60.keras"

class AdaptiveLesionModule(Layer):
    def __init__(self, filters, trainable=True, **kwargs):
        super(AdaptiveLesionModule, self).__init__(trainable=trainable, **kwargs)
        self.filters = filters
        
    def build(self, input_shape):
        self.spatial_conv = tf.keras.layers.Conv2D(1, (1, 1), padding='same', activation='sigmoid')
        self.channel_pool = tf.keras.layers.GlobalAveragePooling2D()
        self.channel_attention = tf.keras.layers.Dense(self.filters, activation='sigmoid')
        
        super().build(input_shape)
        
    def call(self, inputs):
        # Spatial attention
        spatial_att = self.spatial_conv(inputs)
        
        # Channel attention
        channel_att = self.channel_pool(inputs)
        channel_att = self.channel_attention(channel_att)
        channel_att = tf.reshape(channel_att, [-1, 1, 1, self.filters])
        
        # Combined attention
        return inputs * spatial_att * channel_att
    
    def get_config(self):
        config = super().get_config()
        config.update({
            "filters": self.filters
        })
        return config

def adaptive_focal_loss(y_true, y_pred, gamma=2.0):
    epsilon = tf.keras.backend.epsilon()
    y_pred = tf.clip_by_value(y_pred, epsilon, 1.0 - epsilon)
    
    cross_entropy = -y_true * tf.math.log(y_pred)
    
    pt = tf.where(y_true == 1, y_pred, 1 - y_pred)
    difficulty_weight = tf.pow(1. - pt, gamma)
    
    class_weight = 1 + tf.reduce_max(y_true[:, 1:], axis=1) * 0.5
    
    final_loss = difficulty_weight * cross_entropy * tf.expand_dims(class_weight, -1)
    
    return tf.reduce_mean(final_loss)

class DiseasePredictor:
    def __init__(self, model_path):
        self.model = self.initialize_model(model_path)
        self.target_size = (224, 224)  # Standard input size
        self.class_indices = {
            i: name for i, name in enumerate(['Bean_Healthy', 'Bean_Rust', 'Bean_Angular_Leaf_Spot', 
               'Cotton_Aphids', 'Cotton_Army_worm', 'Cotton_Bacterial_Blight', 
               'Cotton_Curl_virus', 'Cotton_Fussarium_wilt', 'Cotton_Healthy', 
               'Cotton_Powdery_Mildew', 'Cotton_Target_spot',
               'Groundnut_Early_leaf_spot', 'Groundnut_Early_rust', 
               'Groundnut_Healthy_leaf', 'Groundnut_Late_leaf_spot', 
               'Groundnut_Nutrition_deficiency', 'Groundnut_Rust',
               'Maize_Blight', 'Maize_Common_Rust', 'Maize_Gray_Leaf_Spot', 
               'Maize_Healthy', 'Pepper_bell_Bacterial_spot', 'Pepper_bell_Healthy',
               'Potato_Early_Blight', 'Potato_Healthy', 'Potato_Late_Blight',  
               'Rice_Bacterialblight', 'Rice_Blast', 'Rice_Brownspot', 'Rice_Tungro',
               'Spinach_Anthracnose', 'Spinach_Bacterial_Spot', 'Spinach_Downy_Mildew', 
               'Spinach_Healthy_Leaf', 'Spinach_Pest_Damage', 'Spinach_Straw_Mite',
               'Sugarcane_Bacterial_Blights', 'Sugarcane_Brown_Rust', 
               'Sugarcane_Dried_Leaves', 'Sugarcane_Healthy', 'Sugarcane_Mawa', 
               'Sugarcane_Mites', 'Sugarcane_Mosaic', 'Sugarcane_Red_Spot', 
               'Sugarcane_Yellow_Leaf', 'Tomato_Bacterial_spot', 'Tomato_Early_blight', 
               'Tomato_healthy', 'Tomato_Late_blight', 'Tomato_Leaf_Mold', 
               'Tomato_mosaic_virus', 'Tomato_Septoria_leaf_spot', 
               'Tomato_Spider_mites Two-spotted_spider_mite', 'Tomato_Target_Spot', 
               'Tomato_Yellow_Leaf_Curl_Virus', 'Turmeric_Aphids_Disease',
               'Turmeric_Dry_Leaf', 'Turmeric_Healthy_Leaf', 'Turmeric_Leaf_Blotch', 
               'Turmeric_Leaf_Spot', 'Turmeric_Rhizome_Rot'
            ])
        }
        self.valid_crops = {'Bean','Cotton','Groundnut', 'Maize', 'Pepper','Potato','Rice', 'Spinach', 'Sugarcane', 'Tomato' ,'Turmeric'}

    def initialize_model(self, model_path):
        try:
            # Define custom objects dictionary
            custom_objects = {
                'AdaptiveLesionModule': AdaptiveLesionModule,
                'adaptive_focal_loss': adaptive_focal_loss
            }
            # Load the model with custom objects
            model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
            print("Model loaded successfully!")
            return model
            
        except Exception as e:
            raise RuntimeError(f"Error loading model: {e}")

    def preprocess_image(self, image_path):
        """
        Load and preprocess image for Keras model.
        """
        try:
            # Load image
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            
            # Resize
            img = img.resize(self.target_size)
            
            # Convert to array and preprocess
            img_array = img_to_array(img)
            
            # Expand dimensions for batch
            img_array = np.expand_dims(img_array, axis=0)
            
            # Normalize to [0,1]
            img_array = img_array / 255.0
            
            return img_array
            
        except Exception as e:
            raise ValueError(f"Error preprocessing image: {e}")

    def get_crop_and_condition(self, class_name):
        """Extract crop type and condition from the full class name."""
        parts = class_name.split('_')
        crop = parts[0]
        condition = '_'.join(parts[1:])
        return crop, condition

    def analyze_image(self, image_path):
        """
        Analyze an image to detect crop type and disease condition.
        
        Args:
            image_path (str): Path to the image file
        
        Returns:
            dict: Analysis results containing crop type, disease, and confidence levels
        """
        try:
            # Validate image path
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found at {image_path}")

            # Process image and get predictions
            preprocessed_image = self.preprocess_image(image_path)
            predictions = self.model.predict(preprocessed_image)
            
            # Get the class with highest probability
            predicted_class_index = np.argmax(predictions[0])
            predicted_class = self.class_indices[predicted_class_index]
            confidence = float(predictions[0][predicted_class_index])
            
            # Extract crop type and condition
            crop_type, condition = self.get_crop_and_condition(predicted_class)
            
            # Calculate probabilities for each class
            class_probabilities = {}
            crop_probabilities = {crop: 0.0 for crop in self.valid_crops}
            
            for idx, prob in enumerate(predictions[0]):
                class_name = self.class_indices[idx]
                class_probabilities[class_name] = float(prob)
                crop, _ = self.get_crop_and_condition(class_name)
                crop_probabilities[crop] += float(prob)
            
            result = {
                'status': 'success',
                'crop_type': crop_type,
                'condition': condition,
                'confidence': confidence,
                'class_probabilities': class_probabilities,
                'crop_probabilities': crop_probabilities
            }
            
            print("Analysis completed successfully")
            return result

        except Exception as e:
            error_msg = f"Error during analysis: {str(e)}"
            print(error_msg)
            return {
                'status': 'failed',
                'error': error_msg
            }

def analyze_image(image_path):
    """Global function to analyze image using a new DiseasePredictor instance."""
    try:
        predictor = DiseasePredictor(model_path)
        return predictor.analyze_image(image_path)
    except Exception as e:
        return {'status': 'failed', 'error': str(e)}