import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './ScadReports.css';

function ScadReports({ companyUsers, studentUsers }) {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('internCompanies');
  const [dateRange, setDateRange] = useState('all');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [loading, setLoading] = useState(false);

  const getDateRangeFilter = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch(dateRange) {
      case 'lastMonth':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'last3Months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last6Months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'lastYear':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(2000); // A long time ago to include all
    }
    
    return startDate;
  };
  
  const generateCompanyReport = () => {
    setLoading(true);
    const pdf = new jsPDF();
    const startDate = getDateRangeFilter();
    
    // Set up fonts and styling
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    
    // Add title
    pdf.text('Companies Hosting Interns Report', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 23, { align: 'center' });
    
    let yPos = 40;
    
    // Add time period info
    pdf.setFontSize(14);
    pdf.text(`Period: ${dateRange === 'all' ? 'All Time' : `Past ${dateRange.replace('last', '').toLowerCase()}`}`, 20, yPos);
    yPos += 15;
    
    // Process each company
    let totalInterns = 0;
    let totalCompaniesWithInterns = 0;
    
    // Function to add text with pagination support
    const addText = (text, indent = 0) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(text, 20 + indent, yPos);
      yPos += 7;
    };
    
    companyUsers.forEach(company => {
      let companyInterns = 0;
      let hasActiveInterns = false;
      let hasCompletedInterns = false;
      
      // Count interns for this company
      company.internships?.forEach(internship => {
        internship.applications?.forEach(application => {
          if (application.internshipStatus === 'currentIntern' || application.internshipStatus === 'InternshipComplete') {
            const completionDate = application.completionDate ? new Date(application.completionDate) : null;
            if (application.internshipStatus === 'currentIntern' || 
                (completionDate && completionDate >= startDate)) {
              companyInterns++;
              totalInterns++;
              if (application.internshipStatus === 'currentIntern') hasActiveInterns = true;
              if (application.internshipStatus === 'InternshipComplete') hasCompletedInterns = true;
            }
          }
        });
      });
      
      if (companyInterns > 0) {
        totalCompaniesWithInterns++;
        
        // Add company details
        pdf.setFontSize(14);
        pdf.setTextColor(44, 62, 80);
        addText(`${company.name || company.username}`, 0);
        
        if (includeDetails) {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          addText(`Industry: ${company.industry || 'Not specified'}`, 10);
          addText(`Total Interns: ${companyInterns}`, 10);
          addText(`Status: ${hasActiveInterns ? 'Currently hosting interns' : 'No active interns'}`, 10);
          
          if (hasCompletedInterns) {
            addText('Completed Internships:', 10);
            
            company.internships?.forEach(internship => {
              const completedApps = internship.applications?.filter(app => 
                app.internshipStatus === 'InternshipComplete' && 
                new Date(app.completionDate) >= startDate
              ) || [];
              
              if (completedApps.length > 0) {
                addText(`${internship.title}: ${completedApps.length} interns`, 20);
              }
            });
          }
          
          addText('');  // Add blank line
        }
      }
    });
    
    // Add summary
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(16);
    pdf.setTextColor(44, 62, 80);
    addText('Summary');
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addText(`Total Companies Hosting Interns: ${totalCompaniesWithInterns}`, 10);
    addText(`Total Interns: ${totalInterns}`, 10);
    
    // Save the PDF
    pdf.save(`companies_hosting_interns_${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };
  
  const generateStudentReport = () => {
    setLoading(true);
    const pdf = new jsPDF();
    const startDate = getDateRangeFilter();
    
    // Set up fonts and styling
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    
    // Add title
    pdf.text('Student Internships Report', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 23, { align: 'center' });
    
    let yPos = 40;
    
    // Add time period info
    pdf.setFontSize(14);
    pdf.text(`Period: ${dateRange === 'all' ? 'All Time' : `Past ${dateRange.replace('last', '').toLowerCase()}`}`, 20, yPos);
    yPos += 15;
    
    // Process each student
    let totalInternships = 0;
    let totalStudentsWithInternships = 0;
    let activeInternships = 0;
    let completedInternships = 0;
    
    // Function to add text with pagination support
    const addText = (text, indent = 0) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(text, 20 + indent, yPos);
      yPos += 7;
    };
    
    studentUsers.forEach(student => {
      if (!student.appliedInternships) return;
      
      const relevantInternships = student.appliedInternships.filter(internship => {
        if (internship.internshipStatus === 'currentIntern') return true;
        
        if (internship.internshipStatus === 'InternshipComplete') {
          const completionDate = internship.completionDate ? new Date(internship.completionDate) : null;
          return completionDate && completionDate >= startDate;
        }
        
        return false;
      });
      
      if (relevantInternships.length > 0) {
        totalStudentsWithInternships++;
        totalInternships += relevantInternships.length;
        
        const activeCount = relevantInternships.filter(i => i.internshipStatus === 'currentIntern').length;
        const completedCount = relevantInternships.filter(i => i.internshipStatus === 'InternshipComplete').length;
        
        activeInternships += activeCount;
        completedInternships += completedCount;
        
        // Add student details
        pdf.setFontSize(14);
        pdf.setTextColor(44, 62, 80);
        addText(`${student.firstName} ${student.lastName}`, 0);
        
        if (includeDetails) {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          addText(`Student ID: ${student.studentId}`, 10);
          addText(`Major: ${student.major || 'Not specified'}`, 10);
          addText(`Total Internships: ${relevantInternships.length}`, 10);
          addText(`Active: ${activeCount}, Completed: ${completedCount}`, 10);
          
          if (relevantInternships.length > 0) {
            addText('Internship Details:', 10);
            
            relevantInternships.forEach(internship => {
              const companyName = companyUsers.find(c => c.username === internship.companyUsername)?.name || internship.companyUsername;
              
              addText(`${internship.internshipTitle || 'Internship'} at ${companyName}`, 20);
              addText(`Status: ${internship.internshipStatus === 'currentIntern' ? 'Active' : 'Completed'}`, 30);
              
              if (internship.internshipStatus === 'InternshipComplete') {
                addText(`Completed: ${new Date(internship.completionDate).toLocaleDateString()}`, 30);
              }
            });
          }
          
          addText('');  // Add blank line
        }
      }
    });
    
    // Add summary
    pdf.addPage();
    yPos = 20;
    pdf.setFontSize(16);
    pdf.setTextColor(44, 62, 80);
    addText('Summary');
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addText(`Total Students with Internships: ${totalStudentsWithInternships}`, 10);
    addText(`Total Internships: ${totalInternships}`, 10);
    addText(`Active Internships: ${activeInternships}`, 10);
    addText(`Completed Internships: ${completedInternships}`, 10);
    
    // Save the PDF
    pdf.save(`student_internships_${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };
  
  const generateEvaluationReport = () => {
    setLoading(true);
    const pdf = new jsPDF();
    const startDate = getDateRangeFilter();
    
    // Set up fonts and styling
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    
    // Add title
    pdf.text('Internship Evaluations Report', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 23, { align: 'center' });
    
    let yPos = 40;
    
    // Add time period info
    pdf.setFontSize(14);
    pdf.text(`Period: ${dateRange === 'all' ? 'All Time' : `Past ${dateRange.replace('last', '').toLowerCase()}`}`, 20, yPos);
    yPos += 15;
    
    // Collect all evaluations
    const evaluations = [];
    
    companyUsers.forEach(company => {
      company.internships?.forEach(internship => {
        internship.applications?.forEach(application => {
          if (
            application.internshipStatus === 'InternshipComplete' && 
            application.evaluation &&
            new Date(application.completionDate) >= startDate
          ) {
            evaluations.push({
              studentName: `${application.firstName} ${application.lastName}`,
              companyName: company.name || company.username,
              internshipTitle: internship.title,
              completionDate: application.completionDate,
              evaluation: application.evaluation
            });
          }
        });
      });
    });
    
    // Function to add text with pagination support
    const addText = (text, indent = 0) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(text, 20 + indent, yPos);
      yPos += 7;
    };
    
    // Overall statistics
    const avgRatings = {
      technical: 0,
      communication: 0,
      teamwork: 0,
      initiative: 0,
      overall: 0
    };
    
    evaluations.forEach(item => {
      avgRatings.technical += item.evaluation.technicalSkillsRating || 0;
      avgRatings.communication += item.evaluation.communicationSkillsRating || 0;
      avgRatings.teamwork += item.evaluation.teamworkRating || 0;
      avgRatings.initiative += item.evaluation.initiativeRating || 0;
      avgRatings.overall += item.evaluation.overallRating || 0;
    });
    
    const count = evaluations.length;
    if (count > 0) {
      avgRatings.technical = (avgRatings.technical / count).toFixed(1);
      avgRatings.communication = (avgRatings.communication / count).toFixed(1);
      avgRatings.teamwork = (avgRatings.teamwork / count).toFixed(1);
      avgRatings.initiative = (avgRatings.initiative / count).toFixed(1);
      avgRatings.overall = (avgRatings.overall / count).toFixed(1);
    }
    
    // Add summary statistics
    pdf.setFontSize(16);
    pdf.setTextColor(44, 62, 80);
    addText('Evaluation Summary');
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addText(`Total Evaluations: ${count}`, 10);
    addText(`Average Technical Skills Rating: ${avgRatings.technical}/5`, 10);
    addText(`Average Communication Skills Rating: ${avgRatings.communication}/5`, 10);
    addText(`Average Teamwork Rating: ${avgRatings.teamwork}/5`, 10);
    addText(`Average Initiative Rating: ${avgRatings.initiative}/5`, 10);
    addText(`Average Overall Performance Rating: ${avgRatings.overall}/5`, 10);
    
    yPos += 5;
    
    // Add individual evaluations if requested
    if (includeDetails && evaluations.length > 0) {
      pdf.addPage();
      yPos = 20;
      
      pdf.setFontSize(16);
      pdf.setTextColor(44, 62, 80);
      addText('Individual Evaluations');
      
      evaluations.forEach((item, index) => {
        pdf.setFontSize(14);
        pdf.setTextColor(44, 62, 80);
        
        if (index > 0) {
          addText('');
        }
        
        addText(`${index + 1}. ${item.studentName} - ${item.internshipTitle} at ${item.companyName}`, 0);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        addText(`Completed: ${new Date(item.completionDate).toLocaleDateString()}`, 10);
        addText(`Technical Skills: ${item.evaluation.technicalSkillsRating}/5`, 10);
        addText(`Communication Skills: ${item.evaluation.communicationSkillsRating}/5`, 10);
        addText(`Teamwork: ${item.evaluation.teamworkRating}/5`, 10);
        addText(`Initiative: ${item.evaluation.initiativeRating}/5`, 10);
        addText(`Overall Performance: ${item.evaluation.overallRating}/5`, 10);
        
        if (index < evaluations.length - 1) {
          addText('-------------------------------------------');
        }
      });
    }
    
    // Save the PDF
    pdf.save(`internship_evaluations_${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };
  
  const handleGenerateReport = () => {
    switch(reportType) {
      case 'internCompanies':
        generateCompanyReport();
        break;
      case 'internStudents':
        generateStudentReport();
        break;
      case 'evaluations':
        generateEvaluationReport();
        break;
      default:
        alert('Please select a report type');
    }
  };

  return (
    <div className="scad-reports-container">
      <h1>SCAD Office Reports</h1>
      <p className="reports-description">
        Generate comprehensive reports about internships, participating companies, 
        and student performance evaluations.
      </p>
      
      <div className="report-form">
        <div className="form-group">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-select"
          >
            <option value="internCompanies">Companies Hosting Interns</option>
            <option value="internStudents">Students with Internships</option>
            <option value="evaluations">Internship Evaluations</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dateRange">Time Period:</label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="all">All Time</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="includeDetails"
            checked={includeDetails}
            onChange={(e) => setIncludeDetails(e.target.checked)}
            className="form-checkbox"
          />
          <label htmlFor="includeDetails">Include Detailed Information</label>
        </div>
        
        <div className="form-actions">
          <button 
            onClick={handleGenerateReport} 
            className="generate-button"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate PDF Report'}
          </button>
        </div>
      </div>
      
      <div className="report-description">
        {reportType === 'internCompanies' && (
          <div className="description-box">
            <h2>Companies Hosting Interns Report</h2>
            <p>This report provides details about companies that are currently hosting interns or have hosted interns in the selected time period.</p>
            <ul>
              <li>List of companies with active interns</li>
              <li>Number of interns per company</li>
              <li>Internship positions offered</li>
              <li>Summary statistics</li>
            </ul>
          </div>
        )}
        
        {reportType === 'internStudents' && (
          <div className="description-box">
            <h2>Students with Internships Report</h2>
            <p>This report provides information about students who are currently in internships or have completed internships in the selected time period.</p>
            <ul>
              <li>List of students with internship details</li>
              <li>Active vs. completed internships</li>
              <li>Company and position information</li>
              <li>Summary statistics</li>
            </ul>
          </div>
        )}
        
        {reportType === 'evaluations' && (
          <div className="description-box">
            <h2>Internship Evaluations Report</h2>
            <p>This report provides an overview of intern performance evaluations from companies for the selected time period.</p>
            <ul>
              <li>Average ratings across different skill areas</li>
              <li>Individual evaluation details (if selected)</li>
              <li>Performance trends and statistics</li>
              <li>Overall rating summary</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="navigation-footer">
        <button onClick={() => navigate(-1)} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ScadReports; 