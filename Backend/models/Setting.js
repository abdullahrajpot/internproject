const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'Internship Platform' },
    siteDescription: { type: String, default: 'Professional internship management system' },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    language: { type: String, default: 'en' }
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
    passwordExpiry: { type: Number, default: 90 },
    loginAttempts: { type: Number, default: 5 },
    ipWhitelist: { type: String, default: '' },
    auditLogs: { type: Boolean, default: true }
  },
  email: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPassword: { type: String, default: '' },
    fromEmail: { type: String, default: '' },
    fromName: { type: String, default: 'Internship Platform' }
  },
  appearance: {
    theme: { type: String, default: 'light' },
    primaryColor: { type: String, default: '#3B82F6' },
    logo: { type: String, default: null },
    favicon: { type: String, default: null },
    customCSS: { type: String, default: '' }
  },
  system: {
    maintenanceMode: { type: Boolean, default: false },
    debugMode: { type: Boolean, default: false },
    cacheEnabled: { type: Boolean, default: true },
    backupFrequency: { type: String, default: 'daily' },
    maxFileSize: { type: Number, default: 10 },
    allowedFileTypes: { type: String, default: 'pdf,doc,docx,jpg,png' }
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);