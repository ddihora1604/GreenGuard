import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin, Github, Phone, MessageSquare, HelpCircle, Shield, Clock, X, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const TeamPage = ({ isCollapsed }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('mission');

  const teamMembers = [
    {
      name: 'Darshan Dihora',
      rollNo: 'S021',
      sapid: '60018220093',
      phone: '+91 8104646471',
      email: 'ddihora1604@gmail.com',
      linkedin: 'https://www.linkedin.com/in/darshan-dihora-38bb652a1',
      github: 'https://github.com/ddihora1604',
      role: 'Technical Support Lead',
      description: 'Expert in full-stack development and system architecture. Specializes in implementing robust solutions for agricultural technology.',
      color: 'from-emerald-400 to-green-500',
      image: 'team/darshan.png'
    },
    {
      name: 'Aayush Nisar',
      rollNo: 'S003',
      sapid: '60018220021',
      phone: '+91 9096025409',
      email: 'nisarayush1172004@gmail.com',
      linkedin: 'https://www.linkedin.com/in/aayush-nisar-b71715184',
      github: 'https://github.com/7Aayush11',
      role: 'AI Specialist',
      description: 'Machine learning expert focused on developing advanced crop disease detection algorithms and predictive models.',
      color: 'from-teal-400 to-emerald-500',
      image: 'team/aayush.png'
    },
    {
      name: 'Bhavy Shah',
      rollNo: 'S020',
      sapid: '60018220016',
      phone: '+91 7021093920',
      email: 'bhavysshah40@gmail.com',
      linkedin: 'https://in.linkedin.com/in/bhavy-shah-373271268',
      github: 'https://github.com/Bhavy1344',
      role: 'Disease Expert',
      description: 'Agricultural specialist with deep knowledge of crop diseases and their treatment methods.',
      color: 'from-green-400 to-emerald-500',
      image: 'team/bhavy.png'
    },
    {
      name: 'Deep Doshi',
      rollNo: 'S023',
      sapid: '60018220096',
      phone: '+91 9833051816',
      email: 'deepdoshi28@gmail.com',
      linkedin: 'https://www.linkedin.com/in/deep-doshi-666a7b275/',
      github: 'https://github.com/deepdoshi28',
      role: 'Field Advisor',
      description: 'Experienced in on-ground implementation and farmer support, ensuring practical solutions for agricultural challenges.',
      color: 'from-emerald-500 to-teal-500',
      image: 'team/deep.png'
    }
  ];

  const handleConnect = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className={`main-content-layout ${isCollapsed ? 'sidebar-collapsed' : ''} min-h-screen bg-gradient-to-b from-white to-emerald-50/30`}>
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-green-700 text-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}
        />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-3 tracking-tight">
              <span className="inline-block">
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">M</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">e</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">e</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">t</span>
              </span>
              {" "}
              <span className="inline-block">
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">O</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">u</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">r</span>
              </span>
              {" "}
              <span className="inline-block">
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">T</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">e</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">a</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">m</span>
              </span>
            </h1>
            <motion.p 
              className="text-xl text-emerald-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Here to Help You Anytime!
            </motion.p>
          </motion.div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 40">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L80,26.7C160,21,320,11,480,10.7C640,11,800,21,960,21.3C1120,21,1280,11,1360,5.3L1440,0L1440,40L1360,40C1280,40,1120,40,960,40C800,40,640,40,480,40C320,40,160,40,80,40L0,40Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20 relative z-10">
        {/* Navigation Tabs */}
        <div className="flex justify-center -mt-8 mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'mission' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' 
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
              onClick={() => setActiveTab('mission')}
            >
              Our Mission
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'team' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' 
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
              onClick={() => setActiveTab('team')}
            >
              Team Members
            </motion.button>
          </div>
        </div>

        {/* Mission Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'mission' && (
            <motion.div
              key="mission"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                <div className="relative bg-gradient-to-r from-emerald-600 to-green-500 py-10 px-8 text-white">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-32 h-32 opacity-70"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="1" className="w-full h-full">
                      {/* Main circle */}
                      <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.2" />
                      
                      {/* Wheat stalks */}
                      <g fill="white">
                        {/* Central stalk */}
                        <rect x="48" y="30" width="4" height="50" rx="1" />
                        
                        {/* Left leaves */}
                        <path d="M48 35 C35 30, 30 20, 35 15 C40 15, 45 25, 48 35" />
                        <path d="M48 45 C35 40, 25 35, 30 25 C35 30, 45 40, 48 45" />
                        <path d="M48 55 C35 50, 20 50, 25 35 C30 45, 45 50, 48 55" />
                        
                        {/* Right leaves */}
                        <path d="M52 35 C65 30, 70 20, 65 15 C60 15, 55 25, 52 35" />
                        <path d="M52 45 C65 40, 75 35, 70 25 C65 30, 55 40, 52 45" />
                        <path d="M52 55 C65 50, 80 50, 75 35 C70 45, 55 50, 52 55" />
                        
                        {/* Seeds/grain at top */}
                        <circle cx="50" cy="25" r="7" />
                        <circle cx="43" cy="20" r="5" />
                        <circle cx="57" cy="20" r="5" />
                      </g>
                      
                      {/* Circular plant cycle */}
                      <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <path d="M25 75 A30 30 0 0 1 75 75" strokeDasharray="5,3" />
                        <path d="M75 75 A30 30 0 0 1 25 75" strokeDasharray="5,3" />
                        
                        {/* Small plant icons around the circle */}
                        <circle cx="25" cy="75" r="3" fill="white" />
                        <circle cx="75" cy="75" r="3" fill="white" />
                        <circle cx="50" cy="85" r="3" fill="white" />
                      </g>
                    </svg>
                  </motion.div>
                  <div className="max-w-3xl relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg text-emerald-50">
                      At GreenGuard, we&apos;re dedicated to revolutionizing agricultural technology through innovative solutions. 
                      Our team combines expertise in artificial intelligence, agricultural science, and software development 
                      to provide farmers with cutting-edge tools for crop disease detection and management.
                    </p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Support Card 1 */}
                    <motion.div
                      whileHover={{ y: -5, boxShadow: '0 12px 20px -5px rgba(16, 185, 129, 0.15)' }}
                      className="bg-white rounded-xl p-6 border border-emerald-100 shadow-md transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <HelpCircle className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">24/7 Support</h3>
                      <p className="text-gray-600">
                        Our team is available round the clock to assist you with any queries or technical support needs.
                      </p>
                    </motion.div>
                    
                    {/* Support Card 2 */}
                    <motion.div
                      whileHover={{ y: -5, boxShadow: '0 12px 20px -5px rgba(16, 185, 129, 0.15)' }}
                      className="bg-white rounded-xl p-6 border border-emerald-100 shadow-md transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Shield className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">Expert Guidance</h3>
                      <p className="text-gray-600">
                        Get personalized advice from our team of agricultural experts and AI specialists.
                      </p>
                    </motion.div>
                    
                    {/* Support Card 3 */}
                    <motion.div
                      whileHover={{ y: -5, boxShadow: '0 12px 20px -5px rgba(16, 185, 129, 0.15)' }}
                      className="bg-white rounded-xl p-6 border border-emerald-100 shadow-md transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Clock className="w-7 h-7 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-800 mb-3">Quick Response</h3>
                      <p className="text-gray-600">
                        We ensure timely responses to all your queries, typically within 24 hours.
                      </p>
                    </motion.div>
                  </div>
                  
                  <div className="mt-12 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => setActiveTab('team')}
                    >
                      Meet Our Team
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Team Members Grid Section */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100 group-hover:shadow-xl transition-all duration-300">
                      {/* Top background gradient banner */}
                      <div className={`h-20 bg-gradient-to-r ${member.color} relative overflow-hidden`}>
                      </div>
                      
                      <div className="px-6 pt-0 pb-5 relative">
                        {/* Profile image */}
                        <div className="relative -mt-14 mb-4 flex justify-center">
                          <div className="w-28 h-28 rounded-full shadow-xl overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%2310b981"/><text x="50%" y="50%" font-family="Arial" font-size="42" fill="white" text-anchor="middle" dominant-baseline="central">${member.name.charAt(0)}</text></svg>`;
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-emerald-800 mb-1">{member.name}</h3>
                          <p className="text-emerald-600 font-medium text-sm">{member.role}</p>
                        </div>
                        
                        <div className="px-2 mb-5">
                          <p className="text-gray-600 text-sm text-center">
                            {member.description}
                          </p>
                        </div>
                        
                        {/* Social icons row */}
                        <div className="flex justify-center space-x-8 mb-5">
                          <a 
                            href={member.linkedin}
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name}'s LinkedIn profile`}
                          >
                            <Linkedin className="w-6 h-6" />
                          </a>
                          <a 
                            href={member.github}
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name}'s GitHub profile`}
                          >
                            <Github className="w-6 h-6" />
                          </a>
                        </div>
                        
                        {/* Contact details */}
                        <div className="space-y-2 mb-5 px-2">
                          <div className="flex items-center text-emerald-800">
                            <Mail className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                            <a href={`mailto:${member.email}`} className="text-sm hover:underline text-emerald-700 truncate">{member.email}</a>
                          </div>
                          <div className="flex items-center text-emerald-800">
                            <Phone className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                            <a href={`tel:${member.phone}`} className="text-sm hover:underline text-emerald-700">{member.phone}</a>
                          </div>
                        </div>
                        
                        {/* Connect button */}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleConnect(member)}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-md flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Connect Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Message Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`py-4 px-6 bg-gradient-to-r ${selectedMember.color} text-white relative`}>
                <button 
                  onClick={closeModal} 
                  className="absolute right-4 top-4 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold">Connect with {selectedMember.name}</h3>
                <p className="text-emerald-50">{selectedMember.role}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-emerald-800 text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-300"
                    rows="4"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Send Message
                </motion.button>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-emerald-800 mb-3">
                    Other ways to connect:
                  </h4>
                  <div className="flex space-x-3">
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </a>
                    <a 
                      href={`tel:${selectedMember.phone}`}
                      className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

TeamPage.propTypes = {
  isCollapsed: PropTypes.bool.isRequired
};

export default TeamPage; 