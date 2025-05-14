import { useState, useEffect } from "react";
import "./Workshops.css";

function Workshops() {
  const [workshopName, setWorkshopName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [speakers, setSpeakers] = useState([{ name: "", bio: "" }]);
  const [agenda, setAgenda] = useState([{ time: "", activity: "" }]);
  const [showVideoIndex, setShowVideoIndex] = useState(null);

  const [workshops, setWorkshops] = useState(() => {
    const saved = localStorage.getItem("workshops");
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("workshops", JSON.stringify(workshops));
  }, [workshops]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakerChange = (index, field, value) => {
    const updatedSpeakers = [...speakers];
    updatedSpeakers[index][field] = value;
    setSpeakers(updatedSpeakers);
  };

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", bio: "" }]);
  };

  const removeSpeaker = (index) => {
    if (speakers.length > 1) {
      const updated = speakers.filter((_, i) => i !== index);
      setSpeakers(updated);
    }
  };

  const handleAgendaChange = (index, field, value) => {
    const updatedAgenda = [...agenda];
    updatedAgenda[index][field] = value;
    setAgenda(updatedAgenda);
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, { time: "", activity: "" }]);
  };

  const removeAgendaItem = (index) => {
    if (agenda.length > 1) {
      const updated = agenda.filter((_, i) => i !== index);
      setAgenda(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkshop = { 
      name: workshopName, 
      description, 
      startDate, 
      endDate,
      image: imagePreview || null,
      videoUrl: videoUrl || null,
      speakers: speakers.filter(s => s.name && s.bio),
      agenda: agenda.filter(a => a.time && a.activity)
    };

    if (isEditing) {
      const updated = [...workshops];
      updated[currentEditIndex] = newWorkshop;
      setWorkshops(updated);
      setIsEditing(false);
      setCurrentEditIndex(null);
    } else {
      setWorkshops([...workshops, newWorkshop]);
    }

    setWorkshopName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setImage(null);
    setImagePreview("");
    setVideoUrl("");
    setSpeakers([{ name: "", bio: "" }]);
    setAgenda([{ time: "", activity: "" }]);
  };

  const handleDelete = (index) => {
    const updated = workshops.filter((_, i) => i !== index);
    setWorkshops(updated);
  };

  const handleEdit = (index) => {
    const w = workshops[index];
    setWorkshopName(w.name);
    setDescription(w.description);
    setStartDate(w.startDate);
    setEndDate(w.endDate);
    setImagePreview(w.image || "");
    setVideoUrl(w.videoUrl || "");
    setSpeakers(w.speakers?.length ? w.speakers : [{ name: "", bio: "" }]);
    setAgenda(w.agenda?.length ? w.agenda : [{ time: "", activity: "" }]);
    setIsEditing(true);
    setCurrentEditIndex(index);
  };

  const toggleVideo = (index) => {
    setShowVideoIndex(showVideoIndex === index ? null : index);
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="container">
      <h1>{isEditing ? "Edit Workshop" : "Add Workshop"}</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Workshop Name"
          value={workshopName}
          onChange={(e) => setWorkshopName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="date-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        
        <div className="image-upload">
          <label htmlFor="workshop-image">Workshop Image:</label>
          <input
            id="workshop-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Workshop preview" />
            </div>
          )}
        </div>
        
        <div className="video-input">
          <label>Workshop Video URL (YouTube or direct link):</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        
        <div className="speakers-section">
          <h3>Speakers</h3>
          {speakers.map((speaker, index) => (
            <div key={index} className="speaker-item">
              <input
                type="text"
                placeholder="Speaker Name"
                value={speaker.name}
                onChange={(e) => handleSpeakerChange(index, "name", e.target.value)}
                required={index === 0}
              />
              <textarea
                placeholder="Speaker Bio"
                value={speaker.bio}
                onChange={(e) => handleSpeakerChange(index, "bio", e.target.value)}
                required={index === 0}
              />
              {speakers.length > 1 && (
                <button 
                  type="button" 
                  className="btn remove-btn"
                  onClick={() => removeSpeaker(index)}
                >
                  Remove Speaker
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            className="btn add-btn"
            onClick={addSpeaker}
          >
            Add Speaker
          </button>
        </div>
        
        <div className="agenda-section">
          <h3>Workshop Agenda</h3>
          {agenda.map((item, index) => (
            <div key={index} className="agenda-item">
              <input
                type="text"
                placeholder="Time (e.g., 9:00 AM - 10:00 AM)"
                value={item.time}
                onChange={(e) => handleAgendaChange(index, "time", e.target.value)}
                required={index === 0}
              />
              <input
                type="text"
                placeholder="Activity"
                value={item.activity}
                onChange={(e) => handleAgendaChange(index, "activity", e.target.value)}
                required={index === 0}
              />
              {agenda.length > 1 && (
                <button 
                  type="button" 
                  className="btn remove-btn"
                  onClick={() => removeAgendaItem(index)}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            className="btn add-btn"
            onClick={addAgendaItem}
          >
            Add Agenda Item
          </button>
        </div>
        
        <button type="submit" className="btn submit-btn">
          {isEditing ? "Update Workshop" : "Add Workshop"}
        </button>
      </form>

      <h2>Workshops</h2>
      <div className="workshop-list">
        {workshops.map((w, index) => (
          <div key={index} className="card">
            {w.image && (
              <div className="card-image">
                <img src={w.image} alt={w.name} />
              </div>
            )}
            <h3>{w.name}</h3>
            <p>{w.description}</p>
            <p className="date-range">
              {w.startDate} → {w.endDate}
            </p>
            
            {w.speakers?.length > 0 && (
              <div className="speakers-list">
                <h4>Speakers:</h4>
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
              <div className="agenda-list">
                <h4>Agenda:</h4>
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
              <div className="video-container">
                <button 
                  onClick={() => toggleVideo(index)} 
                  className="btn video-btn"
                >
                  {showVideoIndex === index ? "Hide Video" : "Show Workshop Video"}
                </button>
                {showVideoIndex === index && (
                  <div className="video-embed">
                    {w.videoUrl.includes("youtube") || w.videoUrl.includes("youtu.be") ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(w.videoUrl)}`}
                        title="Workshop video"
                        frameBorder="0"
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
            
            <div className="card-buttons">
              <button onClick={() => handleEdit(index)} className="btn edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(index)} className="btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workshops;