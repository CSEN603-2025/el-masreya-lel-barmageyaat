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
  const [registeredWorkshops, setRegisteredWorkshops] = useState(() => {
    const saved = localStorage.getItem("registeredWorkshops");
    return saved ? JSON.parse(saved) : [];
  });
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    studentId: ""
  });

  const workshops = JSON.parse(localStorage.getItem("workshops")) || [];

  useEffect(() => {
    // Load registration data from localStorage
    const savedRegistrations = localStorage.getItem("registeredWorkshops");
    if (savedRegistrations) {
      setRegisteredWorkshops(JSON.parse(savedRegistrations));
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
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const registerForWorkshop = (workshopId) => {
    if (!registrationForm.name || !registrationForm.email) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedRegistrations = [...registeredWorkshops, workshopId];
    setRegisteredWorkshops(updatedRegistrations);
    localStorage.setItem("registeredWorkshops", JSON.stringify(updatedRegistrations));
    
    // Save student info for certificate
    localStorage.setItem("userName", registrationForm.name);
    
    alert(`Successfully registered for the workshop!`);
  };

  const isRegistered = (workshopId) => {
    return registeredWorkshops.includes(workshopId);
  };

  const generateCertificate = (workshop) => {
    if (!isRegistered(workshop.id)) {
      alert("You need to register for this workshop first");
      return;
    }

    const certificateWindow = window.open("", "_blank");
    const userName = localStorage.getItem("userName") || registrationForm.name || "Participant";
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

  const renderRegistrationForm = (workshopId) => (
    <div className="registration-form">
      <h4>Register for this Workshop</h4>
      <div className="form-group">
        <label>Full Name*</label>
        <input
          type="text"
          name="name"
          value={registrationForm.name}
          onChange={handleRegistrationChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={registrationForm.email}
          onChange={handleRegistrationChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Student ID</label>
        <input
          type="text"
          name="studentId"
          value={registrationForm.studentId}
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

  return (
    <div className="student-workshops-container">
      <h1>Available Workshops</h1>

      <div className="student-workshop-list">
        {workshops.length > 0 ? (
          workshops.map((w, index) => (
            <div key={index} className="student-workshop-card">
              {w.image && (
                <img src={w.image} alt={w.name} className="student-card-image" />
              )}
              <h3>{w.name}</h3>
              <p>{w.description}</p>
              <p className="student-date-range">{w.startDate} → {w.endDate}</p>

              {w.speakers?.length > 0 && (
                <div className="student-speakers-list">
                  <h4>Speakers</h4>
                  <ul>
                    {w.speakers.map((s, i) => (
                      <li key={i}><strong>{s.name}</strong>: {s.bio}</li>
                    ))}
                  </ul>
                </div>
              )}

              {w.agenda?.length > 0 && (
                <div className="student-agenda-list">
                  <h4>Agenda</h4>
                  <ul>
                    {w.agenda.map((item, i) => (
                      <li key={i}><strong>{item.time}</strong>: {item.activity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!isRegistered(w.id) ? (
                renderRegistrationForm(w.id)
              ) : (
                <>
                  <div className="registration-status">
                    <p className="registered-badge">✓ Registered</p>
                  </div>

                  {w.videoUrl && (
                    <div className="student-video-container">
                      <button onClick={() => toggleVideo(index)} className="student-video-btn">
                        {showVideoIndex === index ? "Hide Video" : "Show Workshop Video"}
                      </button>
                      {showVideoIndex === index && (
                        <>
                          <div className="student-video-embed">
                            {w.videoUrl.includes("youtube") || w.videoUrl.includes("youtu.be") ? (
                              <YouTube
                                videoId={getYouTubeId(w.videoUrl)}
                                onEnd={() => markVideoAsWatched(w.id)}
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
                                onEnded={() => markVideoAsWatched(w.id)}
                                onTimeUpdate={(e) => {
                                  const duration = e.target.duration;
                                  const currentTime = e.target.currentTime;
                                  const progress = (currentTime / duration) * 100;
                                  handleVideoProgress(w.id, progress);
                                }}
                              >
                                <source src={w.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                          {watchedVideos[w.id] ? (
                            <button onClick={() => generateCertificate(w)} className="btn download-certificate-btn">
                              Download Certificate
                            </button>
                          ) : (
                            <div className="certificate-message">
                              <p>Finish watching the video to unlock certificate</p>
                              {videoProgress[w.id] && (
                                <div className="progress-bar">
                                  <div className="progress-fill" style={{ width: `${videoProgress[w.id]}%` }}></div>
                                  <span>{Math.round(videoProgress[w.id])}% watched</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="student-notes-section">
                    {activeWorkshop === w.id ? (
                      <div className="notes-editor">
                        <textarea
                          value={currentNote}
                          onChange={(e) => setCurrentNote(e.target.value)}
                          placeholder="Take your notes here..."
                          className="notes-textarea"
                        />
                        <div className="notes-buttons">
                          <button onClick={() => saveNote(w.id)} className="btn save-note-btn">Save Notes</button>
                          <button onClick={cancelNote} className="btn cancel-note-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="notes-viewer">
                        {notes[w.id] && (
                          <div className="saved-notes">
                            <h4>Your Notes</h4>
                            <p>{notes[w.id]}</p>
                          </div>
                        )}
                        <button onClick={() => startTakingNotes(w.id)} className="btn take-notes-btn">
                          {notes[w.id] ? "Edit Notes" : "Take Notes"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="student-feedback-section">
                    {activeFeedbackForm === w.id ? (
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
                          <button onClick={() => submitRating(w.id)} className="btn submit-feedback-btn">Submit Feedback</button>
                          <button onClick={cancelRating} className="btn cancel-feedback-btn">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="feedback-viewer">
                        {ratings[w.id] && (
                          <div className="saved-feedback">
                            <h4>Your Rating</h4>
                            <div className="display-rating">
                              {renderStars(ratings[w.id])}
                              <span className="rating-value">({ratings[w.id]}/5)</span>
                            </div>
                            {feedbacks[w.id] && (
                              <>
                                <h4>Your Feedback</h4>
                                <p className="saved-feedback-text">{feedbacks[w.id]}</p>
                              </>
                            )}
                          </div>
                        )}
                        <button onClick={() => startRating(w.id)} className="btn give-feedback-btn">
                          {ratings[w.id] ? "Update Feedback" : "Rate Workshop"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
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