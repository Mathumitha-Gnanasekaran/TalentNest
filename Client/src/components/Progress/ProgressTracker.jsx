import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, Edit, Trash2, Award } from 'lucide-react';
import './ProgressTracker.css'; // Import your CSS styles

const ProgressTracker = ({ userId }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState({
    title: '',
    description: '',
    initialValue: 0,
    currentValue: 0,
    targetValue: 0,
    unit: 'minutes',
    category: 'Basic Cooking',
    userId: userId
  });

  // Predefined cooking-related categories
  const cookingCategories = [
    'Basic Cooking',
    'Baking',
    'Knife Skills',
    'Meal Prep',
    'Recipe Mastery',
    'Plating & Presentation',
    'Flavor Combining',
    'Dietary Cooking',
    'Culinary Techniques',
    'Cultural Cuisines'
  ];

  // Common cooking time units
  const timeUnits = [
    'minutes',
    'hours',
    'days',
    'attempts',
    'recipes'
  ];

  // Example cooking skill titles
  const skillExamples = [
    'Knife Handling',
    'Chopping Vegetables',
    'Meal Preparation',
    'Baking Bread',
    'Perfecting Pasta',
    'Mastering Sauces',
    'Recipe Creation',
    'Plating Techniques',
    'Flavor Balancing',
    'Cultural Dishes'
  ];

  // Fetch all progress items for the user
  const fetchProgressItems = async () => {
    const _id = localStorage.getItem("psnUserId");
    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/progress/user',
        { id: _id },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        setProgressItems(response.data.payload || []);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch cooking progress items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new progress item
  const createProgress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/v1/progress/create',
        currentProgress,
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        setProgressItems([response.data.payload, ...progressItems]);
        resetForm();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to create cooking progress item');
      console.error(err);
    }
  };

  // Update an existing progress item
  const updateProgress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        '/api/v1/progress/update',
        currentProgress,
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
      if (response.data.status === 'success') {
        setProgressItems(progressItems.map(item => 
          item.id === currentProgress.id ? response.data.payload : item
        ));
        resetForm();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to update cooking progress item');
      console.error(err);
    }
  };

  // Delete a progress item
  const deleteProgress = async (progressId) => {
    try {
      const response = await axios.post(
        '/api/v1/progress/delete',
        {
          id1: progressId,
          id2: userId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
      if (response.data.status === 'success') {
        setProgressItems(progressItems.filter(item => item.id !== progressId));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to delete cooking progress item');
      console.error(err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert numeric inputs to numbers
    if (['initialValue', 'currentValue', 'targetValue'].includes(name)) {
      processedValue = parseFloat(value) || 0;
    }
    
    setCurrentProgress({ ...currentProgress, [name]: processedValue });
  };

  // Calculate progress percentage
  const calculateProgress = (current, initial, target) => {
    if (target === initial) return 0;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };

  // Edit a progress item
  const handleEdit = (progress) => {
    setCurrentProgress(progress);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Update current value (quick update)
  const handleQuickUpdate = async (progressId, newValue) => {
    const progressToUpdate = progressItems.find(item => item.id === progressId);
    if (!progressToUpdate) return;
  
    const updatedProgress = {
      ...progressToUpdate,
      currentValue: newValue
    };
  
    try {
      const response = await axios.put(
        '/api/v1/progress/update',
        updatedProgress,
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
      if (response.data.status === 'success') {
        setProgressItems(progressItems.map(item => 
          item.id === progressId ? response.data.payload : item
        ));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to update cooking progress');
      console.error(err);
    }
  };

  // Reset form state
  const resetForm = () => {
    setCurrentProgress({
      title: '',
      description: '',
      initialValue: 0,
      currentValue: 0,
      targetValue: 0,
      unit: 'minutes',
      category: 'Basic Cooking',
      userId: userId
    });
    setShowForm(false);
    setEditMode(false);
  };

  // Load progress data on component mount and start animations
  useEffect(() => {
    fetchProgressItems();
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userId]);
  return (
    <div className="progress-tracker">
      {/* Background decoration */}
      <div className="background-decoration">
        {/* Circular elements */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="circular-element"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              transform: `scale(${animationProgress / 100})`,
              transitionDelay: `${i * 0.05}s`
            }}
          />
        ))}
        
        {/* Background shapes */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={`shape-${i}`}
            className="background-shape"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 150}px`,
              height: `${Math.random() * 100 + 150}px`,
              transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
              transitionDelay: `${i * 0.1 + 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="header" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
      }}>
        <div className="header-icon">
          <Award size={32} />
        </div>
        <h1>COOKING PROGRESS TRACKER</h1>
      </div>

      {/* Add/Cancel button */}
      <div className="add-button-container" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transitionDelay: '0.1s'
      }}>
        <button 
          className={`add-button ${showForm ? 'cancel' : ''}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Track New Cooking Skill'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Form for adding/editing progress */}
      {showForm && (
        <div className="form-container" style={{
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
          transitionDelay: '0.15s'
        }}>
          <h3 className="form-title">
            {editMode ? 'Edit Cooking Skill' : 'Add New Cooking Skill'}
            <div className="form-title-underline"></div>
          </h3>
          
          <form onSubmit={editMode ? updateProgress : createProgress}>
            <div className="form-group">
              <label>Skill Title</label>
              <select
                name="title"
                className="form-input"
                value={currentProgress.title}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a skill or type your own</option>
                {skillExamples.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
                <option value="custom">Custom Skill...</option>
              </select>
              {currentProgress.title === 'custom' && (
                <input
                  type="text"
                  name="customTitle"
                  className="form-input mt-2"
                  placeholder="Enter your custom skill title"
                  onChange={(e) => setCurrentProgress({...currentProgress, title: e.target.value})}
                  required
                />
              )}
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={currentProgress.description}
                onChange={handleInputChange}
                placeholder="Describe what you're trying to achieve with this skill"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Time</label>
                <input
                  type="number"
                  name="initialValue"
                  className="form-input"
                  value={currentProgress.initialValue}
                  onChange={handleInputChange}
                  placeholder="Starting time"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Current Time</label>
                <input
                  type="number"
                  name="currentValue"
                  className="form-input"
                  value={currentProgress.currentValue}
                  onChange={handleInputChange}
                  placeholder="Current time spent"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Target Time</label>
                <input
                  type="number"
                  name="targetValue"
                  className="form-input"
                  value={currentProgress.targetValue}
                  onChange={handleInputChange}
                  placeholder="Goal time"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time Unit</label>
                <select
                  name="unit"
                  className="form-input"
                  value={currentProgress.unit}
                  onChange={handleInputChange}
                >
                  {timeUnits.map((unit, index) => (
                    <option key={index} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Cooking Category</label>
                <select
                  name="category"
                  className="form-input"
                  value={currentProgress.category}
                  onChange={handleInputChange}
                >
                  {cookingCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
              >
                {editMode ? 'Update Cooking Skill' : 'Track Cooking Skill'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress items list header */}
      <div className="list-header" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
        transitionDelay: '0.2s',
      }}>
        <h3>
          My Cooking Skills Progress
          <div className="list-header-underline"></div>
        </h3>
      </div>

      {/* Progress items list */}
      <div className="progress-list" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
        transitionDelay: '0.3s'
      }}>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <style>
              {`
                @keyframes rotation {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </div>
        ) : progressItems.length === 0 ? (
          <div className="empty-list">
            <p>No cooking skills tracked yet. Add your first skill to track your progress!</p>
          </div>
        ) : (
          <div className="progress-items">
            {progressItems.map((progress, index) => {
              const progressPercent = calculateProgress(
                progress.currentValue,
                progress.initialValue,
                progress.targetValue
              );
              
              return (
                <div 
                  key={progress.id} 
                  className="progress-item"
                  style={{
                    transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                    opacity: animationProgress / 100,
                    transitionDelay: `${0.3 + index * 0.05}s`
                  }}
                >
                  <div className="progress-item-header">
                    <div className="progress-title">
                      {progress.title}
                    </div>
                    <div>
                      {progress.category && (
                        <span className="progress-category">
                          {progress.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {progress.description && (
                    <p className="progress-description">
                      {progress.description}
                    </p>
                  )}
                  
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${progressPercent >= 100 ? 'complete' : ''}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  
                  <div className="progress-values">
                    <div>
                      Current: <strong>{progress.currentValue} {progress.unit}</strong>
                    </div>
                    <div>
                      Target: <strong>{progress.targetValue} {progress.unit}</strong>
                    </div>
                  </div>
                  
                  <div className="progress-controls">
                    <div className="progress-control-group">
                      <button
                        className="progress-control-button decrease"
                        onClick={() => handleQuickUpdate(progress.id, progress.currentValue - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={progress.currentValue}
                        onChange={(e) => handleQuickUpdate(progress.id, parseFloat(e.target.value) || 0)}
                        className="progress-control-input"
                      />
                      <button
                        className="progress-control-button increase"
                        onClick={() => handleQuickUpdate(progress.id, progress.currentValue + 1)}
                      >
                        <Plus size={16} />
                      </button>
                      <span className="progress-unit">
                        {progress.unit}
                      </span>
                    </div>
                  </div>
                  <div className="progress-item-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(progress)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteProgress(progress.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Decorative bottom gradient */}
      <div className="bottom-gradient"></div>
      
      {/* Floating decorative elements */}
      <div className="floating-decorations">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="floating-decoration"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              transform: `scale(${animationProgress / 100})`,
              transitionDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;