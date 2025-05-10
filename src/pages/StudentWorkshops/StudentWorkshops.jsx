import { useState } from "react";
import "./StudentWorkshops.css";

function StudentWorkshops() {
  const [showVideoIndex, setShowVideoIndex] = useState(null);
  
  // Load workshops from localStorage
  const workshops = JSON.parse(localStorage.getItem("workshops")) || [];

  const toggleVideo = (index) => {
    setShowVideoIndex(showVideoIndex === index ? null : index);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
                    {showVideoIndex === index ? "Hide Video" : "Show Workshop Video"}
                  </button>
                  {showVideoIndex === index && (
                    <div className="student-video-embed">
                      {w.videoUrl.includes("youtube") || w.videoUrl.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(w.videoUrl)}`}
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