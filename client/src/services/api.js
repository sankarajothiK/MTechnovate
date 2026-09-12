/**
 * M TECHNOVATE SOLUTIONS — Unified API & Firebase Service Facade
 * Connects the existing frontend and all 9 Admin modules to Firebase Auth, Cloud Firestore,
 * Firebase Storage, and the secure backend SMTP mailer.
 */

import { authService } from './authService';
import { jobService } from './jobService';
import { applicationService } from './applicationService';
import { galleryService } from './galleryService';
import { serviceService } from './serviceService';
import { websiteService } from './websiteService';
import { inquiryService } from './inquiryService';
import { settingsService } from './settingsService';

export {
  authService,
  jobService,
  applicationService,
  galleryService,
  serviceService,
  websiteService,
  inquiryService,
  settingsService
};

export const api = {
  // ==========================================
  // PUBLIC WEBSITE APIS
  // ==========================================
  getCompany: () => websiteService.getCompanyProfile(),
  getServices: () => serviceService.getServices(),
  getService: async (id) => {
    const res = await serviceService.getServices();
    const service = res.data?.find(s => String(s.id) === String(id) || s.slug === id);
    return { success: !!service, data: service };
  },
  getGallery: () => galleryService.getGallery(),
  getJobs: () => jobService.getJobs(true),
  getJob: (id) => jobService.getJob(id),
  submitApplication: (formData) => applicationService.submitApplication(formData),
  submitContact: (body) => inquiryService.submitInquiry(body),

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================
  adminLogin: (credentials) => authService.signIn(credentials.email, credentials.password),
  getAdminMe: async () => {
    const admin = authService.getCurrentAdmin();
    if (admin) return { success: true, admin };
    const token = authService.getAuthToken();
    if (!token) throw new Error('Not authenticated');
    const res = await fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================
  getAdminDashboard: () => settingsService.getDashboardMetrics(),

  // ==========================================
  // ADMIN ATS & APPLICATIONS
  // ==========================================
  getApplications: (params) => applicationService.getApplications(params),
  getApplication: async (id) => {
    const res = await applicationService.getApplications();
    const app = res.data?.find(a => String(a.id) === String(id));
    return { success: !!app, data: app };
  },
  updateApplicationStatus: (id, payload) => applicationService.updateApplicationStatus(id, payload),
  deleteApplication: (id) => applicationService.deleteApplication(id),

  // ==========================================
  // ADMIN JOB VACANCIES
  // ==========================================
  getAdminJobs: () => jobService.getJobs(false),
  createJob: (jobData) => jobService.createJob(jobData),
  updateJob: (id, jobData) => jobService.updateJob(id, jobData),
  toggleJobActive: (id) => jobService.toggleJobActive(id),
  deleteJob: (id) => jobService.deleteJob(id),

  // ==========================================
  // ADMIN SERVICES
  // ==========================================
  getAdminServices: () => serviceService.getServices(),
  createService: (serviceData) => serviceService.createService(serviceData),
  updateService: (id, serviceData) => serviceService.updateService(id, serviceData),
  deleteService: (id) => serviceService.deleteService(id),

  // ==========================================
  // ADMIN GALLERY
  // ==========================================
  uploadGalleryImages: (formData) => galleryService.uploadGalleryImages(formData),
  deleteGalleryItem: (id) => galleryService.deleteGalleryItem(id),

  // ==========================================
  // ADMIN COMPANY PROFILE & WEBSITE CONTENT
  // ==========================================
  updateCompanyProfile: (formData) => websiteService.updateCompanyProfile(formData),

  // ==========================================
  // ADMIN EMAIL AUTOMATION
  // ==========================================
  getEmailTemplates: () => settingsService.getEmailTemplates(),
  updateEmailTemplate: (id, data) => settingsService.updateEmailTemplate(id, data),
  getEmailLogs: () => settingsService.getEmailLogs(),

  // ==========================================
  // ADMIN CLIENT INQUIRIES
  // ==========================================
  getContactMessages: () => inquiryService.getInquiries(),
  markContactMessageRead: (id) => inquiryService.markAsRead(id),
  deleteContactMessage: (id) => inquiryService.deleteInquiry(id)
};

export default api;
