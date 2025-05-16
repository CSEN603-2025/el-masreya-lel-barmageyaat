import React, { useState, useEffect } from 'react';

const VideoCall = ({ onEndCall, studentName }) => {
  const [callState, setCallState] = useState('ringing'); // ringing, connected
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate call connection after 2 seconds
    const connectionTimer = setTimeout(() => {
      setCallState('connected');
    }, 2000);

    // Start call duration timer when connected
    let durationInterval;
    if (callState === 'connected') {
      durationInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(connectionTimer);
      clearInterval(durationInterval);
    };
  }, [callState]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
      alert('Unable to share screen. Please make sure you have granted the necessary permissions.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl p-4">
        {/* Call Status Banner */}
        {callState === 'ringing' && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-full animate-pulse flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calling {studentName}...
          </div>
        )}

        {/* Video Container */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video mb-4">
          {/* Main video display */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${callState === 'connected' ? 'opacity-100' : 'opacity-50'}`}>
            {callState === 'connected' ? (
              <video className="w-full h-full object-cover" autoPlay muted loop>
                <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-typing-on-a-laptop-5784-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-white text-xl flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center text-5xl">
                  {studentName.charAt(0)}
                </div>
                <div>Connecting to {studentName}...</div>
              </div>
            )}
          </div>
          
          {/* Screen sharing indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Sharing Screen
            </div>
          )}
          
          {/* Call duration */}
          {callState === 'connected' && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
              {formatDuration(callDuration)}
            </div>
          )}
          
          {/* Small self-view */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-600 rounded-lg overflow-hidden">
            <video className="w-full h-full object-cover" autoPlay muted loop>
              <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onEndCall}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Call
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`${isMuted ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white px-8 py-3 rounded-full flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMuted ? 
                "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" :
                "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              } />
            </svg>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Toggle Camera
          </button>
          <button
            onClick={handleScreenShare}
            className={`${isScreenSharing ? 'bg-purple-500' : 'bg-purple-500 hover:bg-purple-600'} text-white px-8 py-3 rounded-full flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 