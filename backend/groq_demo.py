import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage

class ResponseGenerator:
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Fetch the API key from environment
        self.api_key = os.getenv('GROQ_API_KEY')

        # Raise an error if the API key is missing
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        # Initialize the ChatGroq model
        self.llm = ChatGroq(
            groq_api_key=self.api_key,
            model_name="llama3-70b-8192",
            temperature=0.7,
            timeout=30
        )

    def generate_response(self, prompt):
        # Prepare the input message
        messages = [HumanMessage(content=prompt)]
        
        try:
            # Generate a response using the model
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            raise RuntimeError(f"Error generating response: {e}")

# Instantiate the generator class
generator = ResponseGenerator()

# Standalone function to call the method in ResponseGenerator class
def generate_response(prompt):
    return generator.generate_response(prompt)

