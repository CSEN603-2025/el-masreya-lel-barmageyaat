import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AppointmentScheduler = ({ context, studentId, reportId, studentName }) => {
  const [userType, setUserType] = useState(context === 'report_review' ? 'scad' : 'student');
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    purpose: '',
    status: 'pending',
    studentId: studentId || '',
    studentName: studentName || '',
    reportId: reportId || '',
    context: context || 'career_guidance',
    scadApproval: 'pending',
    studentApproval: 'pending'
  });

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments);
      // Filter appointments based on context and user
      const filteredAppointments = parsedAppointments.filter(app => {
        if (context === 'report_review') {
          return app.reportId === reportId;
        } else if (studentId) {
          return app.studentId === studentId;
        }
        return true;
      });
      setAppointments(filteredAppointments);
    }
  }, [context, reportId, studentId]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    const existingAppointments = savedAppointments ? JSON.parse(savedAppointments) : [];
    
    // Filter out appointments we're managing and add our current ones
    const otherAppointments = existingAppointments.filter(app => {
      if (context === 'report_review') {
        return app.reportId !== reportId;
      } else if (studentId) {
        return app.studentId !== studentId;
      }
      return false;
    });
    
    localStorage.setItem('appointments', JSON.stringify([...otherAppointments, ...appointments]));
  }, [appointments, context, reportId, studentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAppointment.date || !newAppointment.time || !newAppointment.purpose) {
      alert('Please fill in all fields');
      return;
    }

    const appointment = {
      ...newAppointment,
      id: Date.now(),
      studentId: studentId || newAppointment.studentId,
      studentName: studentName || newAppointment.studentName,
      reportId: reportId || newAppointment.reportId,
      context: context || newAppointment.context,
      scadApproval: userType === 'scad' ? 'approved' : 'pending',
      studentApproval: userType === 'student' ? 'approved' : 'pending',
      status: 'pending'
    };

    setAppointments([...appointments, appointment]);
    
    setNewAppointment({
      date: '',
      time: '',
      purpose: '',
      status: 'pending',
      studentId: studentId || '',
      studentName: studentName || '',
      reportId: reportId || '',
      context: context || 'career_guidance',
      scadApproval: 'pending',
      studentApproval: 'pending'
    });
  };

  const handleApproval = (appointmentId, approvalType, value) => {
    setAppointments(appointments.map(app => {
      if (app.id === appointmentId) {
        const updatedApp = {
          ...app,
          [approvalType]: value
        };
        
        // Update the overall status based on both approvals
        if (updatedApp.scadApproval === 'rejected' || updatedApp.studentApproval === 'rejected') {
          updatedApp.status = 'rejected';
        } else if (updatedApp.scadApproval === 'approved' && updatedApp.studentApproval === 'approved') {
          updatedApp.status = 'approved';
        } else {
          updatedApp.status = 'pending';
        }
        
        return updatedApp;
      }
      return app;
    }));
  };

  const getApprovalButtons = (appointment) => {
    const approvalType = userType === 'scad' ? 'scadApproval' : 'studentApproval';
    const currentApproval = appointment[approvalType];

    if (currentApproval === 'approved') {
      return (
        <button
          onClick={() => handleApproval(appointment.id, approvalType, 'rejected')}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          Cancel Approval
        </button>
      );
    } else if (currentApproval === 'rejected') {
      return (
        <button
          onClick={() => handleApproval(appointment.id, approvalType, 'approved')}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
        >
          Approve
        </button>
      );
    } else {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleApproval(appointment.id, approvalType, 'approved')}
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
          >
            Approve
          </button>
          <button
            onClick={() => handleApproval(appointment.id, approvalType, 'rejected')}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Reject
          </button>
        </div>
      );
    }
  };

  // Don't show the user type toggle in report review context
  const showUserTypeToggle = context !== 'report_review';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {context === 'report_review' 
            ? 'Schedule Report Review Call'
            : 'Video Call Appointment System'}
        </h1>
        {showUserTypeToggle && (
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${userType === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setUserType('student')}
            >
              Student View
            </button>
            <button
              className={`px-4 py-2 rounded ${userType === 'scad' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setUserType('scad')}
            >
              SCAD Office View
            </button>
          </div>
        )}
      </div>

      {(userType === 'student' || context === 'report_review') && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {context === 'report_review' 
              ? 'Schedule Report Review'
              : 'Request an Appointment'}
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>
            {context !== 'report_review' && (
              <div>
                <label className="block text-sm font-medium mb-1">Purpose</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newAppointment.purpose}
                  onChange={(e) => setNewAppointment({ ...newAppointment, purpose: e.target.value })}
                >
                  <option value="">Select purpose</option>
                  <option value="career guidance">Career Guidance</option>
                  <option value="report clarification">Report Clarification</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Request Appointment
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {context === 'report_review' 
            ? 'Report Review Appointments'
            : userType === 'student' 
              ? 'Your Appointments' 
              : 'All Appointments'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                {context !== 'report_review' && <th className="px-4 py-2">Purpose</th>}
                {userType === 'scad' && <th className="px-4 py-2">Student</th>}
                <th className="px-4 py-2">SCAD Approval</th>
                <th className="px-4 py-2">Student Approval</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t">
                  <td className="px-4 py-2">{appointment.date}</td>
                  <td className="px-4 py-2">{appointment.time}</td>
                  {context !== 'report_review' && <td className="px-4 py-2">{appointment.purpose}</td>}
                  {userType === 'scad' && <td className="px-4 py-2">{appointment.studentName}</td>}
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      appointment.scadApproval === 'approved' ? 'bg-green-100 text-green-800' :
                      appointment.scadApproval === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.scadApproval}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      appointment.studentApproval === 'approved' ? 'bg-green-100 text-green-800' :
                      appointment.studentApproval === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.studentApproval}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {getApprovalButtons(appointment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler; 