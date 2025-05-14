/**
 * Email notification service
 * 
 * In a real application, this would integrate with an email service API like SendGrid, Mailgun, etc.
 * For the purposes of this demonstration, we'll simulate email sending with console logs
 * and localStorage to store sent emails for viewing in the application.
 */

// Store sent emails in localStorage
const getSentEmails = () => {
  const emails = localStorage.getItem('sentEmails');
  return emails ? JSON.parse(emails) : [];
};

const saveSentEmail = (email) => {
  const emails = getSentEmails();
  emails.push({
    ...email,
    id: Date.now(),
    sentAt: new Date().toISOString()
  });
  localStorage.setItem('sentEmails', JSON.stringify(emails));
};

/**
 * Send an email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.body - Email body (HTML or plain text)
 * @param {string} options.from - Sender email (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmail = async ({ to, subject, body, from = 'noreply@el-masreya-lel-barmageyaat.com' }) => {
  // In a real app, this would call an API endpoint to send the email
  console.log(`Sending email to ${to} from ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Store the email in localStorage for demonstration purposes
  saveSentEmail({ to, subject, body, from });
  
  return { success: true, message: 'Email sent successfully' };
};

/**
 * Send an application notification email to a company
 * @param {Object} options - Options
 * @param {Object} options.company - Company data
 * @param {Object} options.student - Student data
 * @param {Object} options.internship - Internship data
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendApplicationNotificationEmail = async ({ company, student, internship }) => {
  const to = company.email || `${company.username}@example.com`;
  const subject = `New Application: ${student.firstName} ${student.lastName} applied for ${internship.title}`;
  
  const body = `
    <h2>New Internship Application</h2>
    <p>Hello ${company.name || company.username},</p>
    <p>A new application has been submitted for your internship position.</p>
    
    <h3>Application Details:</h3>
    <ul>
      <li><strong>Position:</strong> ${internship.title}</li>
      <li><strong>Applicant:</strong> ${student.firstName} ${student.lastName}</li>
      <li><strong>Date Applied:</strong> ${new Date().toLocaleDateString()}</li>
    </ul>
    
    <p>You can log in to the system to view the complete application details.</p>
    
    <p>Thank you for using our platform!</p>
    <p>El-Masreya-Lel-Barmageyaat Team</p>
  `;
  
  return sendEmail({ to, subject, body });
};

/**
 * Get all sent emails (for demo purposes)
 * @returns {Array} - Array of sent emails
 */
export const getAllSentEmails = () => {
  return getSentEmails();
}; 