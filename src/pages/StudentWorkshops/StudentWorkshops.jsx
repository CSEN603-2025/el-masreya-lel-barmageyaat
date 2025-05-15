import React from "react";
import { useState } from "react";
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

  // Load workshops from localStorage
  const workshops = JSON.parse(localStorage.getItem("workshops")) || [];

  const toggleVideo = (index) => {
    setShowVideoIndex(showVideoIndex === index ? null : index);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const startTakingNotes = (workshopId) => {
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

  const renderStars = (rating) => {
    return (
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
  };

  return (
    <div className="student-workshops-container">
      <h1>Available Workshops</h1>

      <div className="student-workshop-list">
        {workshops.length > 0 ? (
          workshops.map((w, index) => (
            <div key={index} className="student-workshop-card">
              {w.image && (
                <img
                  src={w.image}
                  alt={w.name}
                  className="student-card-image"
                />
              )}
              <h3>{w.name}</h3>
              <p>{w.description}</p>
              <p className="student-date-range">
                {w.startDate} → {w.endDate}
              </p>

              {w.speakers?.length > 0 && (
                <div className="student-speakers-list">
                  <h4>Speakers</h4>
                  <ul>
                    {w.speakers.map((speaker, i) => (
                      <li key={i}>
                        <strong>{speaker.name}</strong>: {speaker.bio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {w.agenda?.length > 0 && (
                <div className="student-agenda-list">
                  <h4>Agenda</h4>
                  <ul>
                    {w.agenda.map((item, i) => (
                      <li key={i}>
                        <strong>{item.time}</strong>: {item.activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {w.videoUrl && (
                <div className="student-video-container">
                  <button
                    onClick={() => toggleVideo(index)}
                    className="student-video-btn"
                  >
                    {showVideoIndex === index
                      ? "Hide Video"
                      : "Show Workshop Video"}
                  </button>
                  {showVideoIndex === index && (
                    <div className="student-video-embed">
                      {w.videoUrl.includes("youtube") ||
                      w.videoUrl.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(
                            w.videoUrl
                          )}`}
                          title="Workshop video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video controls>
                          <source src={w.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
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
                      <button
                        onClick={() => saveNote(w.id)}
                        className="btn save-note-btn"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={cancelNote}
                        className="btn cancel-note-btn"
                      >
                        Cancel
                      </button>
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
                    <button
                      onClick={() => startTakingNotes(w.id)}
                      className="btn take-notes-btn"
                    >
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
                      <button
                        onClick={() => submitRating(w.id)}
                        className="btn submit-feedback-btn"
                      >
                        Submit Feedback
                      </button>
                      <button
                        onClick={cancelRating}
                        className="btn cancel-feedback-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="feedback-viewer">
                    {ratings[w.id] ? (
                      <div className="saved-feedback">
                        <h4>Your Rating</h4>
                        <div className="display-rating">
                          {renderStars(ratings[w.id])}
                          <span className="rating-value">
                            ({ratings[w.id]}/5)
                          </span>
                        </div>
                        {feedbacks[w.id] && (
                          <>
                            <h4>Your Feedback</h4>
                            <p className="saved-feedback-text">
                              {feedbacks[w.id]}
                            </p>
                          </>
                        )}
                      </div>
                    ) : null}
                    <button
                      onClick={() => startRating(w.id)}
                      className="btn give-feedback-btn"
                    >
                      {ratings[w.id] ? "Update Feedback" : "Rate Workshop"}
                    </button>
                  </div>
                )}
              </div>
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
