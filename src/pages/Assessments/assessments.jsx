import React, { useState, useEffect } from "react";
import './Assessments.css';

const mockAssessments = [
  {
    id: 1,
    title: "JavaScript Basics",
    taken: false,
    score: null,
    questions: [
      {
        question: "What is the output of `typeof null`?",
        options: ["'object'", "'null'", "'undefined'", "'number'"],
        correctAnswer: 0,
      },
      {
        question: "Which method converts JSON to a JS object?",
        options: [
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.toObject()",
          "parse.JSON()",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    taken: false,
    score: null,
    questions: [
      {
        question: "What hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
      },
      {
        question: "Which prop is used to pass data from parent to child?",
        options: ["state", "props", "data", "context"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Data Structures",
    taken: false,
    score: null,
    questions: [
      {
        question: "Which data structure uses FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: 1,
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
      },
    ],
  },
];

const STORAGE_KEY = "savedAssessments";

const Assessments = ({ onPostToProfile }) => {
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  // Load assessments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAssessments(JSON.parse(stored));
    } else {
      setAssessments(mockAssessments);
    }
  }, []);

  // Save to localStorage whenever assessments change
  useEffect(() => {
    if (assessments.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
    }
  }, [assessments]);

  const handleTakeAssessment = (assessment) => {
    setCurrentAssessment(assessment);
    setUserAnswers(Array(assessment.questions.length).fill(null));
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[qIndex] = optionIndex;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let correct = 0;
    currentAssessment.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round(
      (correct / currentAssessment.questions.length) * 100
    );

    setAssessments((prev) =>
      prev.map((a) =>
        a.id === currentAssessment.id ? { ...a, taken: true, score } : a
      )
    );

    setCurrentAssessment(null);
    setUserAnswers([]);
  };

  const handleCancel = () => {
    setCurrentAssessment(null);
    setUserAnswers([]);
  };

  const handleRetakeAssessment = (assessment) => {
    setCurrentAssessment({
      ...assessment,
      taken: false,
      score: null,
    });
    setUserAnswers(Array(assessment.questions.length).fill(null));
  };

  // New handler for "Post in Profile" button
  const handlePostInProfile = (assessment) => {
    if (onPostToProfile && typeof onPostToProfile === "function") {
      onPostToProfile({
        id: assessment.id,
        title: assessment.title,
        score: assessment.score,
      });
    }
  };

  return (
    <div className="container">
      <h1>Online Assessments</h1>

      {currentAssessment ? (
        <div>
          <h2>{currentAssessment.title}</h2>
          {currentAssessment.questions.map((q, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p>
                <strong>
                  {index + 1}. {q.question}
                </strong>
              </p>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optIndex}
                      checked={userAnswers[index] === optIndex}
                      onChange={() => handleAnswerChange(index, optIndex)}
                    />
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
            Submit
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {assessments.map((assessment) => (
            <li
              key={assessment.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{assessment.title}</strong>
              <div>
                {assessment.taken ? (
                  <>
                    <p>Score: {assessment.score}%</p>
                    <button
                      onClick={() => handleRetakeAssessment(assessment)}
                      style={{ marginRight: "10px" }}
                    >
                      Retake Assessment
                    </button>
                    <button
                      onClick={() => handlePostInProfile(assessment)}
                    >
                      Post in Profile
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleTakeAssessment(assessment)}>
                    Take Assessment
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Assessments;
