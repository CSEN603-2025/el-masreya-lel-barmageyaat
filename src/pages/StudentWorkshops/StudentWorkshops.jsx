import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import "./StudentWorkshops.css";

function StudentWorkshops() {
  const [showVideoIndex, setShowVideoIndex] = useState(null);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("workshopNotes");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentNote, setCurrentNote] = useState("");
  const [activeWorkshop, setActiveWorkshop] = useState(null);
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("workshopRatings");
    return saved ? JSON.parse(saved) : {};
  });
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem("workshopFeedbacks");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentRating, setCurrentRating] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [activeFeedbackForm, setActiveFeedbackForm] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState(() => {
    const saved = localStorage.getItem("watchedWorkshopVideos");
    return saved ? JSON.parse(saved) : {};
  });
  const [videoProgress, setVideoProgress] = useState({});
  const [workshops, setWorkshops] = useState(() => {
    const saved = localStorage.getItem("workshops");
    return saved ? JSON.parse(saved) : [];
  });
  const [registeredWorkshops, setRegisteredWorkshops] = useState(() => {
    const saved = localStorage.getItem("registeredWorkshops");
    return saved ? JSON.parse(saved) : [];
  });
  const [registrationData, setRegistrationData] = useState(() => {
    const saved = localStorage.getItem("workshopRegistrationData");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentRegistration, setCurrentRegistration] = useState({
    name: "",
    email: "",
    studentId: ""
  });

  useEffect(() => {
    console.log('Loading saved data...');
    const savedRegistrations = localStorage.getItem("registeredWorkshops");
    const savedRegistrationData = localStorage.getItem("workshopRegistrationData");
    const savedWorkshops = localStorage.getItem("workshops");

    console.log('Saved registrations:', savedRegistrations);
    console.log('Saved registration data:', savedRegistrationData);
    console.log('Saved workshops:', savedWorkshops);

    if (savedWorkshops) {
      try {
        const parsedWorkshops = JSON.parse(savedWorkshops);
        // Ensure each workshop has an ID
        const workshopsWithIds = parsedWorkshops.map((w, index) => ({
          ...w,
          id: w.id || `workshop-${index}`
        }));
        setWorkshops(workshopsWithIds);
        console.log('Loaded workshops with IDs:', workshopsWithIds);
      } catch (error) {
        console.error("Error parsing workshops:", error);
        setWorkshops([]);
      }
    }

    if (savedRegistrations) {
      try {
        const parsedRegistrations = JSON.parse(savedRegistrations);
        console.log('Setting registered workshops:', parsedRegistrations);
        setRegisteredWorkshops(parsedRegistrations);
      } catch (error) {
        console.error("Error parsing registeredWorkshops:", error);
        setRegisteredWorkshops([]);
      }
    }
    
    if (savedRegistrationData) {
      try {
        const parsedData = JSON.parse(savedRegistrationData);
        console.log('Setting registration data:', parsedData);
        setRegistrationData(parsedData);
      } catch (error) {
        console.error("Error parsing workshopRegistrationData:", error);
        setRegistrationData({});
      }
    }
  }, []);

  const toggleVideo = (index) => {
    setShowVideoIndex(showVideoIndex === index ? null : index);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const startTakingNotes = (workshopId) => {
    if (!isRegistered(workshopId)) return;
    setActiveWorkshop(workshopId);
    setCurrentNote(notes[workshopId] || "");
  };

  const saveNote = (workshopId) => {
    const updatedNotes = {
      ...notes,
      [workshopId]: currentNote,
    };
    setNotes(updatedNotes);
    localStorage.setItem("workshopNotes", JSON.stringify(updatedNotes));
    setActiveWorkshop(null);
  };

  const cancelNote = () => {
    setActiveWorkshop(null);
    setCurrentNote("");
  };

  const startRating = (workshopId) => {
    if (!isRegistered(workshopId)) return;
    setActiveFeedbackForm(workshopId);
    setCurrentRating(ratings[workshopId] || 0);
    setCurrentFeedback(feedbacks[workshopId] || "");
  };

  const submitRating = (workshopId) => {
    const updatedRatings = {
      ...ratings,
      [workshopId]: currentRating,
    };
    const updatedFeedbacks = {
      ...feedbacks,
      [workshopId]: currentFeedback,
    };

    setRatings(updatedRatings);
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem("workshopRatings", JSON.stringify(updatedRatings));
    localStorage.setItem("workshopFeedbacks", JSON.stringify(updatedFeedbacks));
    setActiveFeedbackForm(null);
  };

  const cancelRating = () => {
    setActiveFeedbackForm(null);
    setCurrentRating(0);
    setCurrentFeedback("");
  };

  const markVideoAsWatched = (workshopId) => {
    const updatedWatched = {
      ...watchedVideos,
      [workshopId]: true,
    };
    setWatchedVideos(updatedWatched);
    localStorage.setItem("watchedWorkshopVideos", JSON.stringify(updatedWatched));
  };

  const handleVideoProgress = (workshopId, progress) => {
    setVideoProgress(prev => ({
      ...prev,
      [workshopId]: progress
    }));
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setCurrentRegistration(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const registerForWorkshop = (workshopId) => {
    console.log('Attempting to register for workshop:', workshopId);
    console.log('Current registeredWorkshops:', registeredWorkshops);
    console.log('Current registrationData:', registrationData);

    if (!workshopId) {
      console.error('Workshop ID is missing');
      return;
    }

    // Check if already registered
    if (registeredWorkshops.includes(workshopId)) {
      console.log('Already registered for workshop:', workshopId);
      alert("You are already registered for this workshop!");
      return;
    }

    if (!currentRegistration.name || !currentRegistration.email) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedRegistrations = [...registeredWorkshops, workshopId];
    const updatedRegistrationData = {
      ...registrationData,
      [workshopId]: {
        name: currentRegistration.name,
        email: currentRegistration.email,
        studentId: currentRegistration.studentId,
        date: new Date().toISOString()
      }
    };

    console.log('Updating with:', {
      registrations: updatedRegistrations,
      data: updatedRegistrationData
    });

    // Update state
    setRegisteredWorkshops(updatedRegistrations);
    setRegistrationData(updatedRegistrationData);
    
    // Save to localStorage
    try {
      localStorage.setItem("registeredWorkshops", JSON.stringify(updatedRegistrations));
      localStorage.setItem("workshopRegistrationData", JSON.stringify(updatedRegistrationData));
      localStorage.setItem("userName", currentRegistration.name);
      
      console.log('Successfully saved registration data to localStorage');
      alert("Successfully registered for the workshop!");
    } catch (error) {
      console.error("Error saving registration data:", error);
      alert("There was an error saving your registration. Please try again.");
    }
  };

  const isRegistered = (workshopId) => {
    if (!workshopId) {
      console.error('Workshop ID is missing in isRegistered check');
      return false;
    }
    const isReg = Array.isArray(registeredWorkshops) && 
                  registeredWorkshops.includes(workshopId) && 
                  registrationData[workshopId];
    console.log('Checking registration for workshop:', workshopId, 'Result:', isReg);
    return isReg;
  };

  const getRegistrationInfo = (workshopId) => {
    return registrationData[workshopId] || null;
  };

  const generateCertificate = (workshop) => {
    if (!isRegistered(workshop.id)) {
      alert("You need to register for this workshop first");
      return;
    }

    const certificateWindow = window.open("", "_blank");
    const userName = localStorage.getItem("userName") || currentRegistration.name || "Participant";
    const currentDate = new Date().toLocaleDateString();

    certificateWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body { font-family: 'Times New Roman', serif; text-align: center; padding: 0; margin: 0; background-color: #f9f9f9; }
          .certificate-container { padding: 50px; }
          .certificate { border: 15px solid #1a5276; padding: 60px; max-width: 900px; margin: 0 auto; background-color: white; position: relative; }
          h1 { color: #1a5276; font-size: 36px; margin-bottom: 30px; }
          h2 { font-size: 28px; margin: 20px 0; color: #333; }
          h3 { font-size: 24px; margin: 20px 0; color: #1a5276; }
          p { font-size: 18px; margin: 10px 0; color: #555; }
          .signature { margin-top: 80px; display: flex; justify-content: space-around; }
          .signature-line { border-top: 1px solid #000; width: 250px; margin: 0 auto; }
          .signature p { margin-top: 5px; }
          .certificate-id { position: absolute; top: 20px; right: 20px; font-size: 14px; color: #777; }
          .date { margin-top: 30px; }
          .watermark { position: absolute; opacity: 0.1; font-size: 120px; transform: rotate(-45deg); top: 30%; left: 10%; }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate">
            <div class="watermark">CERTIFICATE</div>
            <div class="certificate-id">ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
            <h1>CERTIFICATE OF COMPLETION</h1>
            <p>This is to certify that</p>
            <h2>${userName}</h2>
            <p>has successfully completed the workshop</p>
            <h3>"${workshop.name}"</h3>
            <p>held from ${workshop.startDate} to ${workshop.endDate}</p>
            <div class="date">
              <p>Awarded on: ${currentDate}</p>
            </div>
            <div class="signature">
              <div>
                <div class="signature-line"></div>
                <p>Participant Signature</p>
              </div>
              <div>
                <div class="signature-line"></div>
                <p>Workshop Organizer</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    certificateWindow.document.close();
    setTimeout(() => certificateWindow.print(), 500);
  };

  const renderStars = (rating) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => setCurrentRating(star)}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );

  const renderRegistrationForm = (workshopId) => {
    const registrationInfo = registrationData[workshopId];
    
    if (isRegistered(workshopId) && registrationInfo) {
      return (
        <div className="registration-info">
          <h4>Registration Details</h4>
          <p><strong>Name:</strong> {registrationInfo.name}</p>
          <p><strong>Email:</strong> {registrationInfo.email}</p>
          {registrationInfo.studentId && <p><strong>Student ID:</strong> {registrationInfo.studentId}</p>}
          <p><strong>Registered on:</strong> {new Date(registrationInfo.date).toLocaleDateString()}</p>
          <div className="registration-status">
            <p className="registered-badge">✓ Registered</p>
          </div>
        </div>
      );
    }

    return (
      <div className="registration-form">
        <h4>Register for this Workshop</h4>
        <div className="form-group">
          <label>Full Name*</label>
          <input
            type="text"
            name="name"
            value={currentRegistration.name}
            onChange={handleRegistrationChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={currentRegistration.email}
            onChange={handleRegistrationChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={currentRegistration.studentId}
            onChange={handleRegistrationChange}
          />
        </div>
        <button 
          onClick={() => registerForWorkshop(workshopId)}
          className="btn register-btn"
        >
          Register Now
        </button>
      </div>
    );
  };

  return (
    <div className="student-workshops-container">
      <h1>Available Workshops</h1>

      <div className="student-workshop-list">
        {workshops.length > 0 ? (
          workshops.map((workshop, index) => {
            const workshopId = workshop.id || `workshop-${index}`;
            console.log('Rendering workshop:', workshopId, 'Registration status:', isRegistered(workshopId));
            
            return (
              <div key={workshopId} className="student-workshop-card">
                {workshop.image && (
                  <img src={workshop.image} alt={workshop.name} className="student-card-image" />
                )}
                <h3>{workshop.name}</h3>
                <p>{workshop.description}</p>
                <p className="student-date-range">
                  {workshop.startDate} → {workshop.endDate}
                </p>

                {workshop.speakers?.length > 0 && (
                  <div className="student-speakers-list">
                    <h4>Speakers</h4>
                    <ul>
                      {workshop.speakers.map((speaker, i) => (
                        <li key={i}><strong>{speaker.name}</strong>: {speaker.bio}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {workshop.agenda?.length > 0 && (
                  <div className="student-agenda-list">
                    <h4>Agenda</h4>
                    <ul>
                      {workshop.agenda.map((item, i) => (
                        <li key={i}><strong>{item.time}</strong>: {item.activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {renderRegistrationForm(workshopId)}

                {isRegistered(workshopId) && (
                  <>
                    {workshop.videoUrl && (
                      <div className="student-video-container">
                        <button onClick={() => toggleVideo(index)} className="student-video-btn">
                          {showVideoIndex === index ? "Hide Video" : "Show Workshop Video"}
                        </button>
                        {showVideoIndex === index && (
                          <>
                            <div className="student-video-embed">
                              {workshop.videoUrl.includes("youtube") || workshop.videoUrl.includes("youtu.be") ? (
                                <YouTube
                                  videoId={getYouTubeId(workshop.videoUrl)}
                                  onEnd={() => markVideoAsWatched(workshopId)}
                                  opts={{
                                    width: "100%",
                                    height: "390",
                                    playerVars: {
                                      autoplay: 0,
                                    },
                                  }}
                                />
                              ) : (
                                <video
                                  controls
                                  onEnded={() => markVideoAsWatched(workshopId)}
                                  onTimeUpdate={(e) => {
                                    const duration = e.target.duration;
                                    const currentTime = e.target.currentTime;
                                    const progress = (currentTime / duration) * 100;
                                    handleVideoProgress(workshopId, progress);
                                  }}
                                >
                                  <source src={workshop.videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </div>
                            {watchedVideos[workshopId] ? (
                              <button onClick={() => generateCertificate(workshop)} className="btn download-certificate-btn">
                                Download Certificate
                              </button>
                            ) : (
                              <div className="certificate-message">
                                <p>Finish watching the video to unlock certificate</p>
                                {videoProgress[workshopId] && (
                                  <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${videoProgress[workshopId]}%` }}></div>
                                    <span>{Math.round(videoProgress[workshopId])}% watched</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <div className="student-notes-section">
                      {activeWorkshop === workshopId ? (
                        <div className="notes-editor">
                          <textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Take your notes here..."
                            className="notes-textarea"
                          />
                          <div className="notes-buttons">
                            <button onClick={() => saveNote(workshopId)} className="btn save-note-btn">Save Notes</button>
                            <button onClick={cancelNote} className="btn cancel-note-btn">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="notes-viewer">
                          {notes[workshopId] && (
                            <div className="saved-notes">
                              <h4>Your Notes</h4>
                              <p>{notes[workshopId]}</p>
                            </div>
                          )}
                          <button onClick={() => startTakingNotes(workshopId)} className="btn take-notes-btn">
                            {notes[workshopId] ? "Edit Notes" : "Take Notes"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="student-feedback-section">
                      {activeFeedbackForm === workshopId ? (
                        <div className="feedback-form">
                          <h4>Rate this workshop</h4>
                          {renderStars(currentRating)}
                          <textarea
                            value={currentFeedback}
                            onChange={(e) => setCurrentFeedback(e.target.value)}
                            placeholder="Share your feedback about this workshop..."
                            className="feedback-textarea"
                          />
                          <div className="feedback-buttons">
                            <button onClick={() => submitRating(workshopId)} className="btn submit-feedback-btn">Submit Feedback</button>
                            <button onClick={cancelRating} className="btn cancel-feedback-btn">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="feedback-viewer">
                          {ratings[workshopId] && (
                            <div className="saved-feedback">
                              <h4>Your Rating</h4>
                              <div className="display-rating">
                                {renderStars(ratings[workshopId])}
                                <span className="rating-value">({ratings[workshopId]}/5)</span>
                              </div>
                              {feedbacks[workshopId] && (
                                <>
                                  <h4>Your Feedback</h4>
                                  <p className="saved-feedback-text">{feedbacks[workshopId]}</p>
                                </>
                              )}
                            </div>
                          )}
                          <button onClick={() => startRating(workshopId)} className="btn give-feedback-btn">
                            {ratings[workshopId] ? "Update Feedback" : "Rate Workshop"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-workshops">
            <p>No workshops available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentWorkshops;