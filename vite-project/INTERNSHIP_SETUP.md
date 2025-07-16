# Internship Platform Setup Guide

## Features Implemented

✅ **Attractive Internship Page** with domain cards
✅ **Interactive Domain Selection** - Click on cards to apply
✅ **Comprehensive Application Form** with all necessary fields
✅ **EmailJS Integration Ready** - Configure to send applications via email
✅ **Responsive Design** - Works on all devices
✅ **Modern UI/UX** with gradients and animations

## Domain Categories Available

1. **Frontend Development** - React, Vue, Angular
2. **Backend Development** - Node.js, Python, Java
3. **UI/UX Design** - Figma, Adobe XD, Sketch
4. **Mobile Development** - React Native, Flutter
5. **Data Science** - Python, R, TensorFlow
6. **DevOps** - Docker, Kubernetes, AWS
7. **Full Stack Development** - MERN, LAMP, MEAN
8. **Product Management** - Agile, Scrum, Strategy

## EmailJS Setup Instructions

### 1. Install EmailJS
```bash
npm install emailjs-com
```

### 2. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new Email Service (Gmail, Outlook, etc.)

### 3. Create Email Template
1. In EmailJS dashboard, go to "Email Templates"
2. Create a new template with variables like:
   - `{{from_name}}` - Applicant's name
   - `{{from_email}}` - Applicant's email
   - `{{domain}}` - Selected domain
   - `{{skills}}` - Technical skills
   - `{{motivation}}` - Why they want the internship
   - `{{message}}` - Full application details

### 4. Configure Email Service
1. Open `src/services/emailService.js`
2. Replace the placeholder values:
   ```javascript
   export const emailConfig = {
     serviceId: 'YOUR_EMAILJS_SERVICE_ID', // From EmailJS dashboard
     templateId: 'YOUR_EMAILJS_TEMPLATE_ID', // From EmailJS dashboard
     userId: 'YOUR_EMAILJS_USER_ID', // From EmailJS dashboard
   };
   ```

### 5. Enable Email Sending
1. In `src/services/emailService.js`, uncomment the emailjs.send code
2. Add the import: `import emailjs from 'emailjs-com';`

## How to Use

1. **Navigate to Internships**: Click "Internships" in the header navigation
2. **Browse Domains**: View different internship domains with attractive cards
3. **Apply**: Click on any domain card to open the application form
4. **Fill Form**: Complete all required fields with your information
5. **Submit**: Click "Submit Application" to send via email

## Form Fields

- **Full Name** (required)
- **Email** (required)
- **Phone Number** (optional)
- **University/College** (optional)
- **Expected Graduation Year** (optional)
- **Portfolio/Projects Link** (optional)
- **Technical Skills** (required)
- **Relevant Experience** (optional)
- **Motivation Statement** (required)

## Customization

### Adding New Domains
Edit the `domains` array in `src/Pages/Frontend/Internship.jsx`:

```javascript
{
  id: 9,
  name: 'New Domain',
  icon: <YourIcon className="w-8 h-8" />,
  description: 'Description of the domain',
  skills: ['Skill 1', 'Skill 2', 'Skill 3'],
  color: 'from-color1-500 to-color2-500'
}
```

### Changing Colors
Update the `color` property in domain objects using Tailwind CSS gradient classes.

### Modifying Form Fields
Edit the form structure in the Internship component to add/remove fields.

## Troubleshooting

### EmailJS Issues
1. Check that all IDs are correctly configured
2. Verify your EmailJS account is active
3. Test the email template in EmailJS dashboard

### Form Issues
1. Ensure all required fields are filled
2. Check browser console for JavaScript errors
3. Verify network connectivity

## Next Steps

1. Configure EmailJS with your actual credentials
2. Customize the email template to match your brand
3. Add form validation if needed
4. Consider adding a database to store applications
5. Add admin panel to manage applications

## Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **EmailJS** - Email functionality
- **React Router** - Navigation 