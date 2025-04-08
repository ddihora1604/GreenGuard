import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronLeft, Leaf, Flower, Sprout, Users, Users2, History, BookOpen } from 'lucide-react';
import PropTypes from 'prop-types';
import ProfileSlider from './ProfileSlider';
// Import logo images with relative paths
import logoFull from '../assets/images/Logo2 Without Background.png';
import logoIcon from '../assets/images/Logo3 Light Green Without Background.png';

const Sidebar = ({ isCollapsed, onToggle, showChatbot }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const menuItems = [
    { 
      icon: Leaf, 
      label: 'GreenGuard', 
      hoverLabel: 'New Detection',
      path: '/dashboard',
      isSpecial: true,
      color: 'bg-white',
      key: 'greenguard',
      isMainLogo: true
    },
    { 
      icon: Flower,
      label: 'Dashboard',
      path: '/dashboard',
      color: 'bg-white',
      key: 'dashboard',
      iconClass: 'text-emerald-600 group-hover:text-emerald-700',
      isFirstGroup: true
    },
    { 
      icon: History, 
      label: 'Detection History', 
      path: '/detection-history',
      color: 'bg-white',
      key: 'history',
      iconClass: 'text-green-600 group-hover:text-green-700'
    },
    { 
      icon: BookOpen,
      label: 'Crops and Diseases',
      path: '/crops-diseases',
      color: 'bg-white',
      key: 'crops-diseases',
      iconClass: 'text-green-600 group-hover:text-green-700'
    },
    { 
      icon: Sprout,
      label: 'Treatment',
      path: '/fertilizers',
      color: 'bg-white',
      key: 'fertilizers',
      iconClass: 'text-emerald-600 group-hover:text-emerald-700'
    },
    { 
      icon: Users,
      label: 'Connect to Farmers',
      path: '/connect-farmers',
      color: 'bg-white',
      key: 'connect-farmers',
      iconClass: 'text-green-600 group-hover:text-green-700'
    },
    { 
      icon: Users2,
      label: 'Connect to Team',
      path: '/connect-team',
      color: 'bg-white',
      key: 'connect-team',
      iconClass: 'text-emerald-600 group-hover:text-emerald-700'
    }
  ];

  // Add chatbot item conditionally
  const getDynamicMenuItems = () => {
    // Create a new array from the original menuItems
    let items = [...menuItems];
    
    // If chatbot should be shown, insert it after Dashboard
    if (showChatbot) {
      const chatbotItem = { 
        icon: MessageSquare, 
        label: 'Chatbot', 
        path: '/chatbot',
        color: 'bg-white',
        key: 'chatbot',
        iconClass: 'text-emerald-500 group-hover:text-emerald-600',
        isSubpage: true,  // Mark this as a subpage
        parentKey: 'dashboard' // Link to parent
      };
      
      // Find the index of the Dashboard item
      const dashboardIndex = items.findIndex(item => item.key === 'dashboard');
      
      // Insert chatbot item after dashboard
      if (dashboardIndex !== -1) {
        items.splice(dashboardIndex + 1, 0, chatbotItem);
      }
    }
    
    return items;
  };

  // Function to check if an item is active 
  const isItemActive = (item) => {
    // For normal items
    if (location.pathname === item.path) return true;
    
    // For parent items with active subpages
    if (item.key === 'dashboard' && location.pathname === '/chatbot' && showChatbot) return true;
    
    return false;
  };

  // Special rendering for collapsed sidebar subpages
  const renderCollapsedSubpage = (item) => {
    if (!isCollapsed || !item.isSubpage) return null;
    
    return (
      <>
        {/* Visual indicator showing it's a subpage */}
        <div className="absolute -right-1 top-0 transform w-1 h-full rounded-r-full bg-emerald-500/30"></div>
        {/* Small dot indicator */}
        <div className="absolute -left-0.5 bottom-0 transform w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
      </>
    );
  };

  // Dedicated function to handle logo click - reload site and redirect to dashboard
  const handleLogoClick = () => {
    navigate('/dashboard', { replace: true });
    window.location.reload();
  };

  const handleGreenGuardClick = (e, item) => {
    if (item.isSpecial) {
      e.preventDefault();
      navigate('/dashboard', { replace: true });
      window.location.reload();
    }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '72px' : '288px'
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
        className="fixed top-0 left-0 h-full bg-[#1a1a1a] shadow-xl z-50 backdrop-blur-sm border-r border-[#8B4513]/30"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo container with fixed height to prevent "dancing" */}
          <div className="flex flex-col items-center justify-center h-24 mb-8 relative">
            {/* Direct onClick handler on the div wrapping the logo */}
            <div 
              onClick={handleLogoClick} 
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="GreenGuard Logo - Click to reload dashboard"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLogoClick();
                }
              }}
            >
              <motion.div
                initial={false}
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
              >
                {/* Using an img instead of motion.img to reduce animation complexity */}
                <img
                  src={isCollapsed ? logoIcon : logoFull}
                  alt="GreenGuard"
                  className="drop-shadow-xl object-contain relative z-10 brightness-110"
                  style={{ 
                    height: isCollapsed ? '48px' : '96px',
                    width: isCollapsed ? '48px' : 'auto',
                    maxWidth: isCollapsed ? '48px' : '240px',
                  }}
                />
                
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/20 to-[#3CB371]/20 rounded-xl blur-xl z-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: 1, 
                    scale: 1.1
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </div>
          </div>

          <nav className="flex flex-col space-y-1.5 flex-1">
            {getDynamicMenuItems().map((item) => {
              // Check if this item has a subpage that follows it
              const hasActiveSubpage = item.key === 'dashboard' && location.pathname === '/chatbot' && showChatbot;
              const isActive = isItemActive(item);
              
              return (
                <React.Fragment key={item.key}>
                  {item.isFirstGroup && <div className="h-4" />}
                  <motion.div
                    initial={false}
                    style={{
                      width: isCollapsed ? '40px' : item.isSubpage ? '90%' : '100%',
                      margin: '0 auto'
                    }}
                    className={`relative ${item.isSubpage ? (!isCollapsed ? 'ml-6 -mt-1' : '') : ''}`}
                  >
                    {/* Add a vertical connector line between Dashboard and Chatbot when not collapsed */}
                    {!isCollapsed && item.isSubpage && (
                      <div className="absolute left-2 top-0 w-[1px] h-[10px] bg-emerald-500/30"></div>
                    )}
                    
                    <Link
                      to={item.path}
                      onClick={(e) => handleGreenGuardClick(e, item)}
                      className={`
                        relative flex rounded-xl transition-all duration-200 group
                        ${item.isSpecial 
                          ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-gray-100 shadow-md' 
                          : isActive
                            ? 'bg-[#222222] text-[#3CB371] shadow-sm border border-[#A0522D]/50'
                            : 'hover:bg-[#222222] text-gray-300 hover:text-[#3CB371] border border-transparent hover:border-[#8B4513]/30'
                        }
                        ${isCollapsed 
                          ? `justify-center w-10 h-10 p-2 ${item.isSubpage ? 'w-8 h-8 mt-1 ml-1 bg-[#1f1f1f]' : ''}` 
                          : 'justify-start w-full px-4 py-3'
                        }
                        ${item.isSubpage 
                          ? (!isCollapsed 
                            ? 'text-sm py-1.5 pl-4 pr-2 bg-[#1f1f1f] shadow-inner shadow-black/20' 
                            : 'border-l-2 border-emerald-500/30')
                          : ''
                        } 
                        backdrop-blur-sm hover:shadow-[#1a1a1a]/20
                        ${hasActiveSubpage && !item.isSubpage ? 'border-l-2 border-l-emerald-500' : ''}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      {/* For subpages, show a small connector line
                      {!isCollapsed && item.isSubpage && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-0 flex items-center">
                          <div className="w-2 h-[1px] bg-emerald-500/50"></div>
                        </div>
                      )} */}
                      
                      {/* Show indicator for collapsed subpages */}
                      {renderCollapsedSubpage(item)}
                      
                      <div className="relative flex items-center justify-center">
                        <item.icon 
                          className={`
                            transition-all duration-200
                            ${isCollapsed ? 'w-5 h-5' : item.isSubpage ? 'w-3.5 h-3.5' : 'w-5 h-5'}
                            ${item.isSpecial 
                              ? 'text-gray-100' 
                              : isActive
                                ? 'text-[#3CB371]'
                                : item.isSubpage
                                  ? 'text-emerald-500/70 group-hover:text-emerald-500'
                                  : 'text-gray-400 group-hover:text-[#3CB371]'
                            }
                            group-hover:scale-105
                          `}
                        />
                      </div>
                      
                      {!isCollapsed && (
                        <span className={`ml-4 font-medium whitespace-nowrap overflow-hidden 
                          ${item.isSubpage ? 'text-xs opacity-90 font-normal' : ''}`}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Add hover label for the GreenGuard menu item */}
                      {item.isSpecial && item.hoverLabel && (
                        <div className={`
                          absolute ${isCollapsed ? 'left-12' : 'right-0 translate-x-[105%]'}
                          top-1/2 -translate-y-1/2
                          px-3 py-1.5
                          rounded-lg
                          bg-gradient-to-r from-[#2E8B57] to-[#3CB371]
                          text-white text-sm font-medium
                          shadow-lg
                          opacity-0 group-hover:opacity-100
                          pointer-events-none
                          transition-opacity duration-200
                          flex items-center
                          whitespace-nowrap
                          z-50
                        `}>
                          {/* Arrow pointing to the menu item */}
                          <div className={`
                            absolute ${isCollapsed ? 'left-0 -translate-x-1/2' : 'right-full translate-x-1/2'}
                            top-1/2 -translate-y-1/2
                            w-2 h-2
                            bg-[#2E8B57]
                            transform ${isCollapsed ? 'rotate-45' : '-rotate-45'}
                          `}></div>
                          {item.hoverLabel}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </nav>

          <motion.button
            layout
            transition={{
              layout: { duration: 0.3, ease: "easeInOut" }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-[#222222] mx-auto mb-4 bg-[#1a1a1a] shadow-sm border border-[#8B4513]/30 transition-all duration-200"
          >
            <ChevronLeft 
              className={`w-5 h-5 transform transition-transform duration-200 text-[#3CB371] ${
                isCollapsed ? 'rotate-180' : ''
              }`} 
            />
          </motion.button>

          <motion.div
            initial={false}
            style={{
              width: isCollapsed ? '40px' : '100%',
              margin: '0 auto'
            }}
          >
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setIsProfileOpen(true);
              }}
              className={`
                relative flex items-center rounded-xl transition-all duration-200
                hover:bg-[#222222]
                ${location.pathname === '/profile' 
                  ? 'bg-[#222222] text-[#3CB371]' 
                  : 'text-gray-300 hover:text-[#3CB371]'
                }
                ${isCollapsed 
                  ? 'justify-center w-10 h-10 p-2' 
                  : 'justify-start px-4 py-3'
                }
                group backdrop-blur-sm hover:shadow-sm border border-transparent hover:border-[#8B4513]/30
              `}
              title={isCollapsed ? 'Profile' : ''}
            >
              <motion.img
                initial={false}
                className={`
                  rounded-full transition-transform group-hover:scale-105 shadow-sm ring-2 ring-[#A0522D]/30
                  ${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'}
                `}
                src="https://t3.ftcdn.net/jpg/03/26/84/88/360_F_326848805_qtf1DQC7b5IOsOw0f4PhUV5ubr3W7Oho.jpg"
                alt="Profile"
              />
              
              {!isCollapsed && (
                <span className="ml-3 font-medium whitespace-nowrap overflow-hidden text-gray-200">
                  Darshan Dihora
                </span>
              )}
            </Link>
          </motion.div>
        </div>
      </motion.aside>

      <ProfileSlider 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  showChatbot: PropTypes.bool
};

Sidebar.defaultProps = {
  isCollapsed: false,
  onToggle: () => {},
  showChatbot: false
};

export default Sidebar;
