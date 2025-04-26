import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { LineChart, BarChart, User } from 'lucide-react';

const ProgressDashboard = ({ userId }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Fetch all progress items for the user
  const fetchProgressItems = async () => {
    const _id = localStorage.getItem("psnUserId");

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/progress/following',
        { id: _id },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        // Extract progress items from the new data structure
        const items = response.data.payload || [];
        // Transform the data to have consistent format
        const formattedItems = items.map(item => ({
          ...item.progress,
          user: item.user
        }));
        
        setProgressItems(formattedItems);
  
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedItems.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch progress items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (current, initial, target) => {
    if (target === initial) return 0;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };
  
  // Filter progress items by category
  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return progressItems;
    }
    return progressItems.filter(item => item.category === selectedCategory);
  };
  
  // Get statistics
  const getStats = () => {
    const stats = {
      total: progressItems.length,
      completed: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) >= 100
      ).length,
      inProgress: progressItems.filter(item => {
        const progress = calculateProgress(item.currentValue, item.initialValue, item.targetValue);
        return progress > 0 && progress < 100;
      }).length,
      notStarted: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) === 0
      ).length
    };
    
    return stats;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Load progress data on component mount
  useEffect(() => {
    fetchProgressItems();
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  const filteredItems = getFilteredItems();
  const stats = getStats();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #7c2d12, #b45309)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }}>
        {/* Circular elements */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'white',
              opacity: 0.1,
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.05}s`
            }}
          />
        ))}
        
        {/* Background shapes */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`shape-${i}`}
            style={{
              position: 'absolute',
              borderRadius: '20%',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              width: `${Math.random() * 100 + 150}px`,
              height: `${Math.random() * 100 + 150}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
              transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.1 + 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
      }}>
        <div style={{
          backgroundColor: '#ffff',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <LineChart size={32} style={{ color: '#b45309' }} />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#ffff',
          margin: 0
        }}>PROGRESS DASHBOARD</h1>
      </div>

      {/* Main content container */}
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s'
      }}>
        <div style={{
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Track and visualize your progress across different categories</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #f87171',
            backdropFilter: 'blur(5px)'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <Spinner animation="border" style={{ color: '#d97706' }} />
          </div>
        ) : progressItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(5px)'
          }}>
            <p style={{ color: '#ffff', fontSize: '1.125rem' }}>No progress items found. Start by creating your first progress tracker.</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Total</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f97316' }}>{stats.total}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Completed</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#22c55e' }}>{stats.completed}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>In Progress</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#facc15' }}>{stats.inProgress}</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#ffff', fontSize: '1rem' }}>Not Started</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f87171' }}>{stats.notStarted}</p>
              </div>
            </div>
            
            {/* Category Filters Header */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <h3 style={{
                color: '#ffff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                padding: '0 1rem'
              }}>
                Categories
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: '#d97706',
                  borderRadius: '2px'
                }}></div>
              </h3>
            </div>
            
            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.3s'
            }}>
              <button 
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: selectedCategory === 'all' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffff',
                  border: selectedCategory === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)'
                }}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category} 
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: selectedCategory === category ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffff',
                    border: selectedCategory === category ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Progress List Header */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <h3 style={{
                color: '#ffff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                padding: '0 1rem'
              }}>
                Progress Items
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: '#d97706',
                  borderRadius: '2px'
                }}></div>
              </h3>
            </div>
            
            {/* Progress List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {filteredItems.map((progress, index) => {
                const progressPercent = calculateProgress(
                  progress.currentValue,
                  progress.initialValue,
                  progress.targetValue
                );
                
                const progressColor = 
                  progressPercent >= 100 ? '#22c55e' : 
                  progressPercent > 50 ? '#facc15' : 
                  progressPercent > 25 ? '#fb923c' : '#f87171';
                
                return (
                  <div 
                    key={progress.id} 
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      backdropFilter: 'blur(5px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                      opacity: animationProgress / 100,
                      transition: 'transform 0.8s, opacity 0.8s',
                      transitionDelay: `${0.3 + index * 0.05}s`
                    }}
                  >
                    {/* User info - new addition */}
                    {progress.user && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '0.5rem'
                      }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          backgroundColor: '#f97316',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: '0.75rem'
                        }}>
                          <User size={18} color="#fff" />
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {progress.user.firstName} {progress.user.lastName}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            opacity: 0.7
                          }}>
                            {progress.user.email}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <h3 style={{ 
                      margin: '0 0 0.75rem', 
                      fontSize: '1.25rem',
                      color: '#ffff',
                      fontWeight: 'bold'
                    }}>
                      {progress.title}
                    </h3>
                    
                    {progress.category && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffff',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        marginBottom: '1rem'
                      }}>
                        {progress.category}
                      </span>
                    )}
                    
                    <div style={{
                      height: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.25rem',
                      overflow: 'hidden',
                      margin: '1rem 0',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: progressColor,
                        borderRadius: '0.25rem',
                        transition: 'width 1s ease-in-out',
                      }} />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      <div>{progress.currentValue} {progress.unit}</div>
                      <div>{progress.targetValue} {progress.unit}</div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1.5rem',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <div>Updated: {formatDate(progress.updatedAt)}</div>
                      <div style={{
                        backgroundColor: progressColor,
                        color: '#000',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {Math.round(progressPercent)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      
      {/* Decorative elements */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, rgba(180, 83, 9, 0.1), transparent)',
        zIndex: '-1'
      }}></div>
      
      {/* Floating decorative elements */}
      <div style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: '-1'
        }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                opacity: 0.05,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${animationProgress / 100})`,
                transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.05}s`
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default ProgressDashboard;