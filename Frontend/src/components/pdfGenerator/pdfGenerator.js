// PDF Generation utility function
const generateRoadmapPDF = (roadmapData) => {
  // Create a new window for the PDF content
  const printWindow = window.open('', '_blank');
  
  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${roadmapData.title} Roadmap - PDF</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #f97316;
        }
        
        .header h1 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header .subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          margin-bottom: 15px;
        }
        
        .meta-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 20px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .meta-item {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        
        .meta-label {
          font-weight: bold;
          color: #374151;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        
        .meta-value {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .difficulty-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          display: inline-block;
        }
        
        .difficulty-beginner {
          background: #dcfce7;
          color: #166534;
        }
        
        .difficulty-intermediate {
          background: #fef3c7;
          color: #92400e;
        }
        
        .difficulty-advanced {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .skills-section {
          margin: 30px 0;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .skills-title {
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        
        .skill-tag {
          background: white;
          color: #374151;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          border: 2px solid #f97316;
          font-weight: 500;
        }
        
        .roadmap-steps {
          margin-top: 40px;
        }
        
        .steps-title {
          font-size: 2rem;
          color: #1f2937;
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f97316;
        }
        
        .step {
          margin-bottom: 30px;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          page-break-inside: avoid;
          background: #fefefe;
        }
        
        .step-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .step-number {
          background: linear-gradient(45deg, #f97316, #ea580c);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
          font-size: 1.1rem;
        }
        
        .step-title {
          font-size: 1.4rem;
          color: #1f2937;
          font-weight: bold;
          flex-grow: 1;
        }
        
        .step-type {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: capitalize;
        }
        
        .type-foundation { background: #dbeafe; color: #1e40af; }
        .type-core { background: #fed7aa; color: #c2410c; }
        .type-tool { background: #dcfce7; color: #166534; }
        .type-enhancement { background: #e9d5ff; color: #7c3aed; }
        .type-advanced { background: #fee2e2; color: #dc2626; }
        .type-final { background: #e0e7ff; color: #4338ca; }
        
        .step-description {
          color: #6b7280;
          margin-bottom: 15px;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .step-details {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .detail-section h4 {
          font-weight: bold;
          color: #374151;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        
        .topics-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .topic-tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          border: 1px solid #d1d5db;
        }
        
        .time-estimate {
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .resources-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }
        
        .resources-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .resources-list li {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        
        .resources-list li::before {
          content: "▶";
          position: absolute;
          left: 0;
          color: #f97316;
          font-size: 0.8rem;
          top: 1px;
        }
        
        .resource-link {
          color: #2563eb;
          text-decoration: underline;
          font-size: 0.9rem;
          word-break: break-all;
          display: block;
          margin-bottom: 2px;
        }
        
        .resource-url {
          color: #6b7280;
          font-size: 0.75rem;
          font-style: italic;
          margin-top: 2px;
          word-break: break-all;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #f97316;
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .completion-section {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #fff7ed, #fed7aa);
          border: 2px solid #f97316;
          border-radius: 12px;
          text-align: center;
        }
        
        .completion-section h3 {
          color: #ea580c;
          font-size: 1.3rem;
          margin-bottom: 10px;
        }
        
        .completion-section p {
          color: #9a3412;
          font-size: 1rem;
        }
        
        @media print {
          body {
            padding: 15px;
          }
          
          .step {
            page-break-inside: avoid;
            margin-bottom: 25px;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .meta-info {
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
          }
          
          .step-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${roadmapData.title} Roadmap</h1>
        <div class="subtitle">${roadmapData.description}</div>
        <div class="meta-info">
          <div class="meta-item">
            <div class="meta-label">Difficulty</div>
            <div class="meta-value">
              <span class="difficulty-badge difficulty-${roadmapData.difficulty.toLowerCase()}">
                ${roadmapData.difficulty}
              </span>
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Duration</div>
            <div class="meta-value">${roadmapData.duration}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Total Steps</div>
            <div class="meta-value">${roadmapData.totalSteps}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Last Updated</div>
            <div class="meta-value">${roadmapData.lastUpdated}</div>
          </div>
        </div>
      </div>
      
      <div class="skills-section">
        <h2 class="skills-title">Skills You'll Learn</h2>
        <div class="skills-list">
          ${roadmapData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      
      <div class="roadmap-steps">
        <h2 class="steps-title">Learning Path</h2>
        ${roadmapData.steps.map((step, index) => `
          <div class="step">
            <div class="step-header">
              <div class="step-number">${step.id}</div>
              <div class="step-title">${step.title}</div>
              <div class="step-type type-${step.type}">${step.type}</div>
            </div>
            <div class="step-description">${step.description}</div>
            <div class="step-details">
              <div class="detail-section">
                <h4>📚 Topics Covered:</h4>
                <div class="topics-list">
                  ${step.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                </div>
              </div>
              <div class="detail-section">
                <h4>⏱️ Estimated Time:</h4>
                <div class="time-estimate">${step.estimatedTime}</div>
              </div>
            </div>
            ${step.resources && Array.isArray(step.resources) && step.resources.length > 0 ? `
              <div class="resources-section">
                <h4>🔗 Learning Resources:</h4>
                <ul class="resources-list">
                  ${step.resources.map(resource => {
                    // Handle both object and string formats
                    if (typeof resource === 'object' && resource.title && resource.url) {
                      return `
                        <li>
                          <a href="${resource.url}" class="resource-link" target="_blank" rel="noopener">
                            ${resource.title}
                          </a>
                          <div class="resource-url">${resource.url}</div>
                        </li>
                      `;
                    } else if (typeof resource === 'string') {
                      return `
                        <li>
                          <span class="resource-link">${resource}</span>
                        </li>
                      `;
                    }
                    return '';
                  }).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
        
        <div class="completion-section">
          <h3>🎉 Congratulations!</h3>
          <p>You've completed the ${roadmapData.title} roadmap! You're now ready to build amazing applications and take your skills to the next level.</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</strong></p>
        <p>Keep learning and building amazing things! 🚀</p>
        <p style="margin-top: 10px; font-size: 0.8rem;">This roadmap is designed to guide your learning journey. Adjust the pace according to your schedule and prior experience.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    }, 500);
  };
};

// Enhanced PDF generation with better error handling and debugging
const handleDownloadPDF = async (roadmapData, setIsGeneratingPdf) => {
  if (!roadmapData) {
    alert('Roadmap data not available');
    return;
  }
  
  // Debug: Log roadmap data to console
  console.log('Generating PDF for roadmap:', roadmapData.title);
  console.log('Steps with resources:', roadmapData.steps.filter(step => step.resources && step.resources.length > 0));
  
  setIsGeneratingPdf(true);
  
  try {
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate the PDF
    generateRoadmapPDF(roadmapData);
    
    // Success feedback (optional)
    setTimeout(() => {
      console.log('PDF generation initiated successfully');
    }, 1000);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or check if pop-ups are blocked.');
  } finally {
    setIsGeneratingPdf(false);
  }
};

// Export the functions for use in your component
export { generateRoadmapPDF, handleDownloadPDF };