// EmailJS Configuration
// You'll need to install emailjs-com: npm install emailjs-com
// Then configure your EmailJS account and replace the placeholders below

import emailjs from 'emailjs-com';
// import emailjs from '@emailjs/browser'; // New import for emailjs-com


export const emailConfig = {
  serviceId: 'service_or971hc', // Replace with your EmailJS service ID
  templateId: 'template_d376ucz', // Replace with your EmailJS template ID
  userId: 'BGY7jApzW11krwll_', // Replace with your EmailJS user ID
};

export const sendApplicationEmail = async (formData, selectedDomain) => {
  try {
    const templateParams = {
      to_name: 'Recruitment Team',
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      university: formData.university,
      graduation_year: formData.graduationYear,
      skills: formData.skills,
      experience: formData.experience,
      motivation: formData.motivation,
      portfolio: formData.portfolio,
      domain: selectedDomain.name,
      message: `
        New Internship Application
        
        Domain: ${selectedDomain.name}
        Applicant: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        University: ${formData.university}
        Graduation Year: ${formData.graduationYear}
        
        Skills: ${formData.skills}
        Experience: ${formData.experience}
        Motivation: ${formData.motivation}
        Portfolio: ${formData.portfolio}
      `
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams,
      emailConfig.userId
    );
    return { success: true, message: 'Application submitted successfully!' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send application. Please try again.' };
  }
};

export const sendServiceOrderEmail = async (formData, selectedService) => {
  try {
    const templateParams = {
      to_name: 'Client Team',
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      service: selectedService.title,
      message: formData.message,
    };
    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams,
      emailConfig.userId
    );
    return { success: true, message: 'Order sent successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to send order. Please try again.' };
  }
};

// Instructions for EmailJS setup:
/*
1. Sign up at https://www.emailjs.com/
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create an email template with variables like {{from_name}}, {{domain}}, etc.
4. Get your Service ID, Template ID, and User ID
5. Replace the placeholders in emailConfig above
6. Uncomment the emailjs.send code in sendApplicationEmail function
7. Install emailjs-com: npm install emailjs-com
8. Import emailjs in your Internship component: import emailjs from 'emailjs-com';
*/ 