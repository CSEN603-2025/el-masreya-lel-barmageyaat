// Notification Service for handling cycle notifications to students

/**
 * Send notifications to all students when a new internship cycle is created or updated
 * @param {Object} cycle - The internship cycle data
 * @param {Array} studentUsers - Array of student users
 * @param {Function} setStudentUsers - Function to update student users state
 * @returns {Array} - Updated student users array with new notifications
 */
export const notifyCycleToStudents = (cycle, studentUsers, setStudentUsers) => {
  if (!cycle || !studentUsers || !setStudentUsers) return studentUsers;

  const now = new Date();
  const cycleStartDate = new Date(cycle.startDate);
  const cycleEndDate = new Date(cycle.endDate);
  
  // Format dates for display
  const formattedStartDate = cycleStartDate.toLocaleDateString();
  const formattedEndDate = cycleEndDate.toLocaleDateString();
  
  let notificationType = "info";
  let notificationMessage = "";
  
  // Calculate days until cycle starts
  const daysUntilStart = Math.ceil((cycleStartDate - now) / (1000 * 60 * 60 * 24));
  
  // Determine notification message based on timing
  if (now >= cycleStartDate && now <= cycleEndDate && cycle.isActive) {
    // Cycle is currently active
    notificationType = "success";
    notificationMessage = `A new internship cycle "${cycle.name}" has started! It will run until ${formattedEndDate}.`;
  } else if (daysUntilStart <= 7 && daysUntilStart > 0) {
    // Cycle will start within a week
    notificationType = "info";
    notificationMessage = `An internship cycle "${cycle.name}" will begin in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}! (${formattedStartDate} to ${formattedEndDate})`;
  } else if (daysUntilStart > 7) {
    // Cycle will start in more than a week
    notificationType = "info";
    notificationMessage = `A new internship cycle "${cycle.name}" has been scheduled from ${formattedStartDate} to ${formattedEndDate}.`;
  }

  if (notificationMessage) {
    // Add notification to each student
    const updatedStudents = studentUsers.map(student => {
      // Initialize notifications array if it doesn't exist
      const studentNotifications = student.notifications || [];
      
      // Create the new notification
      const newNotification = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        message: notificationMessage,
        date: now.toISOString(),
        read: false,
        type: notificationType,
        cycleId: cycle.id,
        category: "internship_cycle"
      };
      
      // Add notification to student
      return {
        ...student,
        notifications: [newNotification, ...studentNotifications]
      };
    });
    
    // Update state with new student data
    setStudentUsers(updatedStudents);
    return updatedStudents;
  }
  
  return studentUsers;
};

/**
 * Check for upcoming internship cycles and notify students
 * @param {Array} internshipCycles - Array of all internship cycles
 * @param {Array} studentUsers - Array of student users
 * @param {Function} setStudentUsers - Function to update student users state
 * @returns {void}
 */
export const checkUpcomingCycles = (internshipCycles, studentUsers, setStudentUsers) => {
  if (!internshipCycles || !studentUsers || !setStudentUsers) return;
  
  const now = new Date();
  
  // Filter for active or upcoming cycles
  internshipCycles.forEach(cycle => {
    const cycleStartDate = new Date(cycle.startDate);
    const cycleEndDate = new Date(cycle.endDate);
    
    // Check if this cycle has a notification flag
    const hasNotified = cycle.hasNotifiedStart || false;
    const hasNotifiedUpcoming = cycle.hasNotifiedUpcoming || false;
    
    // Update notifications if conditions are met
    if (cycle.isActive && now >= cycleStartDate && now <= cycleEndDate && !hasNotified) {
      // Notify for cycle start
      notifyCycleToStudents(cycle, studentUsers, setStudentUsers);
      
      // Mark this cycle as notified
      cycle.hasNotifiedStart = true;
    } else if (!hasNotifiedUpcoming) {
      // Calculate days until cycle starts
      const daysUntilStart = Math.ceil((cycleStartDate - now) / (1000 * 60 * 60 * 24));
      
      // Notify when cycle is about to begin (7 days before)
      if (daysUntilStart <= 7 && daysUntilStart > 0) {
        notifyCycleToStudents(cycle, studentUsers, setStudentUsers);
        cycle.hasNotifiedUpcoming = true;
      }
    }
  });
}; 