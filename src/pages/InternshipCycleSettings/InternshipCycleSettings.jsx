import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InternshipCycleSettings.css';

function InternshipCycleSettings({ currUser, internshipCycles, setInternshipCycles, addNotification }) {
  const navigate = useNavigate();
  const [currentCycle, setCurrentCycle] = useState(null);
  const [newCycle, setNewCycle] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: true,
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Check if the user is authorized (SCAD office)
  useEffect(() => {
    if (!currUser || currUser.username !== 'scad') {
      navigate('/login');
    }
    
    // Set the current cycle if one exists
    const activeCycle = internshipCycles?.find(cycle => cycle.isActive);
    if (activeCycle) {
      setCurrentCycle(activeCycle);
    }
  }, [currUser, navigate, internshipCycles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCycle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewCycle(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(newCycle.startDate);
    const endDate = new Date(newCycle.endDate);
    
    if (endDate <= startDate) {
      addNotification('End date must be after start date.', 'error');
      return;
    }
    
    // Create new cycle object
    const cycleToSave = {
      ...newCycle,
      id: isEditing && currentCycle ? currentCycle.id : Date.now(),
      createdAt: isEditing && currentCycle ? currentCycle.createdAt : new Date().toISOString()
    };
    
    let updatedCycles;
    
    if (isEditing && currentCycle) {
      // Update existing cycle
      updatedCycles = internshipCycles.map(cycle => 
        cycle.id === currentCycle.id ? cycleToSave : { ...cycle, isActive: cycleToSave.isActive ? false : cycle.isActive }
      );
    } else {
      // If new cycle is active, deactivate all others
      updatedCycles = [...(internshipCycles || [])].map(cycle => ({
        ...cycle,
        isActive: cycleToSave.isActive ? false : cycle.isActive
      }));
      
      // Add new cycle
      updatedCycles.push(cycleToSave);
    }
    
    // Update state
    setInternshipCycles(updatedCycles);
    
    // Reset form and state
    setNewCycle({
      name: '',
      startDate: '',
      endDate: '',
      isActive: true,
      description: ''
    });
    
    setIsEditing(false);
    setCurrentCycle(cycleToSave.isActive ? cycleToSave : null);
    
    // Show success message
    addNotification(
      isEditing ? 'Internship cycle updated successfully!' : 'New internship cycle created successfully!', 
      'success'
    );
  };

  const handleEdit = () => {
    if (currentCycle) {
      setNewCycle({
        name: currentCycle.name,
        startDate: currentCycle.startDate,
        endDate: currentCycle.endDate,
        isActive: currentCycle.isActive,
        description: currentCycle.description || ''
      });
      setIsEditing(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="cycle-settings-container">
      <h1>Internship Cycle Settings</h1>
      
      {/* Display current cycle if it exists */}
      {currentCycle && (
        <div className="current-cycle-card">
          <h2>Current Active Cycle</h2>
          <div className="cycle-details">
            <h3>{currentCycle.name}</h3>
            <p className="cycle-date">
              <strong>Start Date:</strong> {formatDate(currentCycle.startDate)}
            </p>
            <p className="cycle-date">
              <strong>End Date:</strong> {formatDate(currentCycle.endDate)}
            </p>
            {currentCycle.description && (
              <p className="cycle-description">{currentCycle.description}</p>
            )}
            <div className="cycle-status">
              <span className="status-badge active">Active</span>
            </div>
          </div>
          <button className="edit-button" onClick={handleEdit}>
            Edit Current Cycle
          </button>
        </div>
      )}
      
      {/* Form to create/edit cycle */}
      <div className="cycle-form-container">
        <h2>{isEditing ? 'Edit Internship Cycle' : 'Create New Internship Cycle'}</h2>
        <form onSubmit={handleSubmit} className="cycle-form">
          <div className="form-group">
            <label htmlFor="name">Cycle Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCycle.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. Fall 2023 Internship Cycle"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newCycle.startDate}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newCycle.endDate}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={newCycle.isActive}
              onChange={handleCheckboxChange}
              className="form-checkbox"
            />
            <label htmlFor="isActive">Set as active cycle</label>
            <p className="help-text">
              Note: Only one cycle can be active at a time. Activating this cycle will deactivate all others.
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (Optional):</label>
            <textarea
              id="description"
              name="description"
              value={newCycle.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter any additional details about this internship cycle"
              className="form-control"
            />
          </div>
          
          <div className="form-actions">
            {isEditing && (
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setIsEditing(false);
                  setNewCycle({
                    name: '',
                    startDate: '',
                    endDate: '',
                    isActive: true,
                    description: ''
                  });
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="save-button">
              {isEditing ? 'Update Cycle' : 'Create Cycle'}
            </button>
          </div>
        </form>
      </div>
      
      {/* List of previous cycles */}
      {internshipCycles && internshipCycles.length > 0 && (
        <div className="previous-cycles">
          <h2>Previous Internship Cycles</h2>
          <div className="cycles-list">
            {internshipCycles
              .filter(cycle => !cycle.isActive)
              .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
              .map(cycle => (
                <div key={cycle.id} className="cycle-item">
                  <h3>{cycle.name}</h3>
                  <p>
                    {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                  </p>
                  {cycle.description && (
                    <p className="cycle-item-description">{cycle.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div className="navigation-footer">
        <button onClick={() => navigate('/ScadDashboard')} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default InternshipCycleSettings; 