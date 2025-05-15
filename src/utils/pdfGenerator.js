import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} fileName - The name of the PDF file
 * @param {object} options - Additional options for PDF generation
 */
export const generatePDFFromElement = async (element, fileName, options = {}) => {
  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });
    
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generates a PDF from evaluation data
 * @param {object} evaluationData - The evaluation data
 * @param {string} fileName - The name of the PDF file
 */
export const generateEvaluationPDF = (evaluationData, fileName) => {
  const pdf = new jsPDF();
  
  // Set up fonts and styling
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  
  // Add title
  pdf.text('Internship Evaluation Report', 105, 15, { align: 'center' });
  
  // Add intern info
  pdf.setFontSize(12);
  pdf.text(`Intern: ${evaluationData.internInfo.name}`, 20, 30);
  pdf.text(`Email: ${evaluationData.internInfo.email}`, 20, 38);
  pdf.text(`Internship: ${evaluationData.internInfo.internshipTitle}`, 20, 46);
  pdf.text(`Completion Date: ${new Date(evaluationData.internInfo.completionDate).toLocaleDateString()}`, 20, 54);
  
  // Add evaluation sections
  let yPosition = 70;
  
  // Function to add a section to the PDF
  const addSection = (title, content, rating) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    
    // Add section title
    pdf.text(`${title}${rating ? ` - Rating: ${rating}/5` : ''}`, 20, yPosition);
    yPosition += 8;
    
    // Add content
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Handle multiline text
    const contentLines = pdf.splitTextToSize(content, 170);
    pdf.text(contentLines, 20, yPosition);
    yPosition += 8 + (contentLines.length * 6);
  };
  
  // Add each section of the evaluation
  addSection('Technical Skills', evaluationData.evaluation.technicalSkills.comments, evaluationData.evaluation.technicalSkills.rating);
  addSection('Communication Skills', evaluationData.evaluation.communicationSkills.comments, evaluationData.evaluation.communicationSkills.rating);
  addSection('Teamwork', evaluationData.evaluation.teamwork.comments, evaluationData.evaluation.teamwork.rating);
  addSection('Initiative & Proactivity', evaluationData.evaluation.initiative.comments, evaluationData.evaluation.initiative.rating);
  addSection('Overall Performance', evaluationData.evaluation.overallPerformance.comments, evaluationData.evaluation.overallPerformance.rating);
  addSection('Strengths & Achievements', evaluationData.evaluation.strengthsAndAchievements);
  addSection('Areas for Improvement', evaluationData.evaluation.areasForImprovement);
  
  if (evaluationData.evaluation.additionalComments) {
    addSection('Additional Comments', evaluationData.evaluation.additionalComments);
  }
  
  // Add footer with date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 285);
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
  return true;
};

/**
 * Generates a PDF from student report data
 * @param {object} reportData - The student report data
 * @param {string} fileName - The name of the PDF file
 */
export const generateReportPDF = (reportData, fileName) => {
  const pdf = new jsPDF();
  
  // Set up fonts and styling
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  
  // Add title
  pdf.text('Internship Report', 105, 15, { align: 'center' });
  
  // Add student and internship info
  pdf.setFontSize(12);
  pdf.text(`Student: ${reportData.studentName}`, 20, 30);
  pdf.text(`Student ID: ${reportData.studentId}`, 20, 38);
  pdf.text(`Company: ${reportData.companyName}`, 20, 46);
  pdf.text(`Internship: ${reportData.internshipTitle}`, 20, 54);
  pdf.text(`Period: ${reportData.period}`, 20, 62);
  
  // Add report content
  let yPosition = 80;
  
  // Function to add a section to the PDF
  const addSection = (title, content) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    
    // Add section title
    pdf.text(title, 20, yPosition);
    yPosition += 8;
    
    // Add content
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Handle multiline text
    const contentLines = pdf.splitTextToSize(content, 170);
    pdf.text(contentLines, 20, yPosition);
    yPosition += 8 + (contentLines.length * 6);
  };
  
  // Add each section of the report
  addSection('Summary', reportData.summary);
  addSection('Skills Acquired', reportData.skillsAcquired);
  addSection('Challenges Encountered', reportData.challenges);
  addSection('Projects Completed', reportData.projects);
  
  if (reportData.feedback) {
    addSection('Supervisor Feedback', reportData.feedback);
  }
  
  if (reportData.recommendations) {
    addSection('Recommendations', reportData.recommendations);
  }
  
  // Add footer with date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 285);
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
  return true;
};

/**
 * Generates a PDF from application data for SCAD office
 * @param {object} applicationData - The application data
 * @param {string} fileName - The name of the PDF file
 */
export const generateApplicationPDF = (applicationData, fileName) => {
  const pdf = new jsPDF();
  
  // Set up fonts and styling
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  
  // Add title
  pdf.text('Internship Application', 105, 15, { align: 'center' });
  
  // Add student and company info
  pdf.setFontSize(12);
  pdf.text(`Student: ${applicationData.studentName}`, 20, 30);
  pdf.text(`Student ID: ${applicationData.studentId}`, 20, 38);
  pdf.text(`Email: ${applicationData.email}`, 20, 46);
  pdf.text(`Company: ${applicationData.companyName}`, 20, 54);
  pdf.text(`Internship: ${applicationData.internshipTitle}`, 20, 62);
  pdf.text(`Status: ${applicationData.status}`, 20, 70);
  pdf.text(`Applied: ${new Date(applicationData.appliedAt).toLocaleDateString()}`, 20, 78);
  
  // Add application content
  let yPosition = 95;
  
  // Function to add a section to the PDF
  const addSection = (title, content) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    
    // Add section title
    pdf.text(title, 20, yPosition);
    yPosition += 8;
    
    // Add content
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Handle multiline text
    const contentLines = pdf.splitTextToSize(content, 170);
    pdf.text(contentLines, 20, yPosition);
    yPosition += 8 + (contentLines.length * 6);
  };
  
  // Add cover letter and other content
  if (applicationData.coverLetter) {
    addSection('Cover Letter', applicationData.coverLetter);
  }
  
  if (applicationData.skills && applicationData.skills.length > 0) {
    addSection('Skills', applicationData.skills.join(', '));
  }
  
  if (applicationData.experiences && applicationData.experiences.length > 0) {
    pdf.addPage();
    yPosition = 20;
    pdf.setFontSize(14);
    pdf.setTextColor(44, 62, 80);
    pdf.text('Experience', 20, yPosition);
    yPosition += 10;
    
    applicationData.experiences.forEach(exp => {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Position: ${exp.position}`, 20, yPosition); yPosition += 6;
      pdf.text(`Company: ${exp.company}`, 20, yPosition); yPosition += 6;
      pdf.text(`Period: ${exp.startDate} - ${exp.endDate || 'Present'}`, 20, yPosition); yPosition += 6;
      
      const descLines = pdf.splitTextToSize(exp.description, 170);
      pdf.text(descLines, 20, yPosition);
      yPosition += (descLines.length * 6) + 10;
      
      if (yPosition > 250 && applicationData.experiences.indexOf(exp) < applicationData.experiences.length - 1) {
        pdf.addPage();
        yPosition = 20;
      }
    });
  }
  
  // Add footer with date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 285);
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
  return true;
}; 