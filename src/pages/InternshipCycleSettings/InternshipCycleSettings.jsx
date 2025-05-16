import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './InternshipCycleSettings.css';
import { notifyCycleToStudents } from '../../utils/notificationService';

function InternshipCycleSettings({ currUser, internshipCycles, setInternshipCycles, studentUsers, setStudentUsers, addNotification }) {
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
    
    // Notify students about the new or updated cycle
    if (studentUsers && setStudentUsers) {
      notifyCycleToStudents(cycleToSave, studentUsers, setStudentUsers);
    }
    
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
    if (!currentCycle) return;
    
    setNewCycle({
      name: currentCycle.name,
      startDate: currentCycle.startDate,
      endDate: currentCycle.endDate,
      isActive: currentCycle.isActive,
      description: currentCycle.description || ''
    });
    
    setIsEditing(true);
  };

  // Calculate previous cycles (non-active)
  const previousCycles = internshipCycles?.filter(cycle => !cycle.isActive) || [];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCAD Office</h2>
          <div className="sidebar-divider"></div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/login">
                <i className="nav-icon logout-icon">🚪</i>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© 2023 SCAD Office</p>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <div className="cycle-settings-container">
          <h1>Internship Cycle Settings</h1>
          
          {currentCycle && (
            <div className="current-cycle-card">
              <h2>Current Active Cycle</h2>
              <div className="cycle-details">
                <h3>{currentCycle.name}</h3>
                <div className="cycle-date">Start Date: {new Date(currentCycle.startDate).toLocaleDateString()}</div>
                <div className="cycle-date">End Date: {new Date(currentCycle.endDate).toLocaleDateString()}</div>
                {currentCycle.description && (
                  <div className="cycle-description">{currentCycle.description}</div>
                )}
                <div className="cycle-status">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
              <button className="edit-button" onClick={handleEdit}>Edit Cycle</button>
            </div>
          )}
          
          <div className="cycle-form-container">
            <h2>{isEditing ? 'Edit Internship Cycle' : 'Create New Internship Cycle'}</h2>
            <form className="cycle-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Cycle Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control" 
                  value={newCycle.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Summer 2023 Internship Cycle"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate" 
                  className="form-control" 
                  value={newCycle.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  name="endDate" 
                  className="form-control" 
                  value={newCycle.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    name="isActive" 
                    className="form-checkbox" 
                    checked={newCycle.isActive}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isActive">Set as Active Cycle</label>
                  <div className="help-text">
                    Only one cycle can be active at a time. Setting this as active will deactivate any other active cycle.
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="form-control" 
                  value={newCycle.description}
                  onChange={handleInputChange}
                  placeholder="Add any additional information about this internship cycle."
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
          
          {previousCycles.length > 0 && (
            <div className="previous-cycles">
              <h2>Previous Cycles</h2>
              <div className="cycles-list">
                {previousCycles.map(cycle => (
                  <div key={cycle.id} className="cycle-item">
                    <h3>{cycle.name}</h3>
                    <div className="cycle-dates">
                      <span>{new Date(cycle.startDate).toLocaleDateString()}</span> to <span>{new Date(cycle.endDate).toLocaleDateString()}</span>
                    </div>
                    {cycle.description && <p className="cycle-description">{cycle.description}</p>}
                    <div className="cycle-actions">
                      <button 
                        className="activate-button"
                        onClick={() => {
                          // Activate this cycle and deactivate others
                          const updatedCycles = internshipCycles.map(c => ({
                            ...c,
                            isActive: c.id === cycle.id
                          }));
                          
                          setInternshipCycles(updatedCycles);
                          setCurrentCycle({...cycle, isActive: true});
                          
                          // Notify students
                          if (studentUsers && setStudentUsers) {
                            notifyCycleToStudents({...cycle, isActive: true}, studentUsers, setStudentUsers);
                          }
                          
                          addNotification(`${cycle.name} has been set as the active cycle.`, 'success');
                        }}
                      >
                        Set as Active
                      </button>
                    </div>
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
      </main>
    </div>
  );
}

export default InternshipCycleSettings; 