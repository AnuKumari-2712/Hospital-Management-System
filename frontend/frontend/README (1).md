# 🏥 MediCare+ Hospital Management System

A full-stack, production-ready Hospital Management System built with the MERN stack, featuring role-based dashboards for Patients, Doctors, and Admins, real-time chat, video consultations, AI-powered features, and integrated payments.

---

## 🚀 Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form + Zod
- Framer Motion
- React Icons
- Recharts (analytics/charts)
- Socket.io Client (real-time chat & video signaling)
- Razorpay Checkout (payments)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens)
- Socket.io (real-time chat, WebRTC signaling)
- Bcrypt.js (password hashing)
- Multer + Cloudinary (file uploads)
- Nodemailer (OTP emails)
- Razorpay (payments)
- Anthropic Claude API (AI features)
- Helmet, CORS, Express Rate Limit (security)

---

## 📁 Folder Structure

```
hospital/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── cloudinary.js          # Cloudinary config (file uploads)
│   │   └── anthropic.js           # Claude AI client config
│   │
│   ├── models/
│   │   ├── User.js                # Shared model for Patient/Doctor/Admin (role field)
│   │   ├── Appointment.js
│   │   ├── Department.js
│   │   ├── MedicalRecord.js
│   │   ├── Prescription.js
│   │   ├── LabReport.js
│   │   ├── Bill.js
│   │   ├── Notification.js
│   │   ├── Schedule.js            # Doctor weekly availability
│   │   ├── Leave.js               # Doctor leave requests
│   │   ├── Staff.js               # Non-doctor hospital staff
│   │   ├── InventoryItem.js
│   │   ├── Feedback.js
│   │   ├── Conversation.js        # Chat conversation thread
│   │   └── Message.js             # Individual chat messages
│   │
│   ├── controllers/
│   │   ├── authController.js              # Register, Login, Forgot/Reset Password, OTP
│   │   ├── appointmentController.js       # Patient-side appointments
│   │   ├── recordsController.js           # Patient-side medical records/prescriptions/labs
│   │   ├── billingController.js           # Patient billing + Razorpay
│   │   ├── notificationController.js
│   │   ├── patientController.js           # Patient profile
│   │   ├── doctorAppointmentController.js
│   │   ├── doctorRecordsController.js
│   │   ├── doctorScheduleController.js
│   │   ├── doctorProfileController.js     # Earnings, analytics, profile
│   │   ├── doctorBillingController.js     # Doctor creates bills
│   │   ├── adminDoctorController.js       # Manage doctors & patients
│   │   ├── adminOpsController.js          # Departments, staff, appointments
│   │   ├── adminBillingController.js      # Billing, payments, inventory
│   │   ├── adminReportsController.js      # Analytics, PDF reports, feedback
│   │   ├── adminBulkUploadController.js   # CSV bulk doctor import
│   │   ├── chatController.js
│   │   └── aiController.js                # Symptom checker, chatbot, summaries
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── recordsRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js      # protect([roles]) — JWT verification
│   │   ├── errorHandler.js        # Centralized error handling
│   │   └── uploadMiddleware.js    # Multer config for file uploads
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── sendEmail.js           # Nodemailer OTP emails
│   │
│   ├── seed/
│   │   └── seedDoctors.js         # Bulk-seed test doctor accounts
│   │
│   ├── uploads/                   # Temp storage before Cloudinary upload
│   ├── .env
│   └── server.js                  # Entry point, Express + Socket.io setup
│
└── frontend/
    ├── index.html                 # Includes Razorpay checkout script
    ├── .env
    └── src/
        ├── main.jsx
        ├── App.jsx                # All routes defined here
        ├── index.css              # Tailwind entry + custom dark mode variant
        │
        ├── context/
        │   └── ThemeContext.jsx   # Dark/light mode provider
        │
        ├── layouts/
        │   ├── PatientLayout.jsx  # Sidebar + topbar + AI chatbot widget
        │   ├── DoctorLayout.jsx
        │   └── AdminLayout.jsx
        │
        ├── components/
        │   ├── auth/
        │   │   ├── LoginForm.jsx
        │   │   ├── RegisterForm.jsx
        │   │   ├── ForgotPasswordForm.jsx
        │   │   ├── RoleSelector.jsx
        │   │   └── ProtectedRoute.jsx
        │   ├── ui/
        │   │   └── ThemeToggle.jsx
        │   ├── video/
        │   │   └── VideoCallModal.jsx    # WebRTC call UI (shared by Patient/Doctor)
        │   └── ai/
        │       └── AIChatbot.jsx         # Floating AI assistant widget
        │
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── ForgotPassword.jsx
        │   │   ├── OTPVerification.jsx
        │   │   └── ResetPassword.jsx
        │   │
        │   ├── patient/
        │   │   ├── Dashboard.jsx
        │   │   ├── SymptomChecker.jsx        # AI feature
        │   │   ├── BookAppointment.jsx
        │   │   ├── MyAppointments.jsx
        │   │   ├── AppointmentDetails.jsx
        │   │   ├── MedicalRecords.jsx
        │   │   ├── Prescriptions.jsx
        │   │   ├── LabReports.jsx
        │   │   ├── Billing.jsx               # Razorpay checkout wired
        │   │   ├── PaymentHistory.jsx
        │   │   ├── Chat.jsx                  # Real-time (Socket.io)
        │   │   ├── VideoConsultation.jsx      # WebRTC call
        │   │   ├── Notifications.jsx
        │   │   ├── Profile.jsx
        │   │   ├── EditProfile.jsx
        │   │   ├── Settings.jsx
        │   │   ├── ChangePassword.jsx
        │   │   └── HelpSupport.jsx
        │   │
        │   ├── doctor/
        │   │   ├── Dashboard.jsx
        │   │   ├── TodayAppointments.jsx      # Accept/Decline
        │   │   ├── PatientList.jsx
        │   │   ├── PatientDetails.jsx
        │   │   ├── MedicalRecords.jsx         # + AI summary generator
        │   │   ├── PrescriptionGenerator.jsx
        │   │   ├── UploadReports.jsx          # Cloudinary upload
        │   │   ├── CreateBill.jsx
        │   │   ├── Schedule.jsx
        │   │   ├── Leave.jsx
        │   │   ├── Chat.jsx
        │   │   ├── VideoConsultation.jsx
        │   │   ├── Notifications.jsx
        │   │   ├── Earnings.jsx
        │   │   ├── Analytics.jsx              # Recharts
        │   │   ├── Profile.jsx
        │   │   └── Settings.jsx               # Profile + password combined
        │   │
        │   └── admin/
        │       ├── Dashboard.jsx
        │       ├── ManageDoctors.jsx          # + CSV Bulk Upload
        │       ├── AddDoctor.jsx
        │       ├── EditDoctor.jsx
        │       ├── ManagePatients.jsx
        │       ├── AdminPatientDetails.jsx
        │       ├── Departments.jsx
        │       ├── StaffManagement.jsx
        │       ├── AppointmentManagement.jsx
        │       ├── AdminBilling.jsx
        │       ├── Payments.jsx
        │       ├── Inventory.jsx
        │       ├── Reports.jsx                # PDF downloads
        │       ├── Analytics.jsx              # Recharts (Line/Bar/Pie)
        │       ├── Feedback.jsx
        │       ├── AdminNotifications.jsx
        │       └── AdminSettings.jsx
        │
        ├── schemas/                # Zod validation schemas
        │   ├── authSchema.js
        │   ├── registerSchema.js
        │   ├── forgotPasswordSchema.js
        │   ├── otpSchema.js
        │   ├── profileSchema.js
        │   ├── appointmentSchema.js
        │   └── doctorSchema.js
        │
        └── services/                # Axios API call wrappers
            ├── axiosInstance.js     # Base config, token attach, error normalization
            ├── authService.js
            ├── appointmentService.js
            ├── recordsService.js
            ├── billingService.js
            ├── chatService.js
            ├── notificationService.js
            ├── profileService.js
            ├── doctorAppointmentService.js
            ├── doctorRecordsService.js
            ├── doctorScheduleService.js
            ├── doctorProfileService.js
            ├── adminDoctorService.js
            ├── adminOpsService.js
            ├── adminBillingService.js
            ├── adminReportsService.js
            ├── aiService.js
            └── socketService.js     # Socket.io connection manager
```

---

## 🔑 Core Features

### Authentication
- JWT-based login/register with role selection (Patient / Doctor / Admin)
- Forgot Password → Email OTP → Reset Password flow
- Protected routes with role-based access control

### Patient Dashboard
- Book appointments (in-person or video), track status
- View medical records, prescriptions, lab reports
- Pay bills via Razorpay, view payment history
- Real-time chat with doctors, video consultations
- AI Symptom Checker with department recommendations

### Doctor Dashboard
- Accept/decline appointments, manage schedule & leave
- Create medical records, prescriptions, and bills
- Upload lab reports (Cloudinary)
- AI-generated patient-friendly record summaries
- Earnings and analytics (charts)

### Admin Dashboard
- Manage doctors (add/edit/delete + CSV bulk upload)
- Manage patients, departments, staff, inventory
- Hospital-wide appointment and billing oversight
- Analytics dashboards, downloadable reports, feedback monitoring

### Real-Time & Advanced Features
- **Chat** — Socket.io powered, typing indicators, live delivery
- **Video Calls** — WebRTC peer-to-peer with Socket.io signaling
- **AI Features** — Powered by Anthropic Claude API (symptom checker, health chatbot, record summarizer)
- **Payments** — Razorpay order creation + signature-verified confirmation

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**backend/.env**
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ANTHROPIC_API_KEY=
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
VITE_SOCKET_URL=http://localhost:5001
```

---

## 🧪 Test Accounts

Doctors can be bulk-created via **Admin → Manage Doctors → Bulk Upload** using a CSV with columns:
```
fullName,email,phone,specialization,department,password
```
(Password column optional — defaults to `Doctor@123` if left blank.)

---

## 📌 Notes

- All API routes are versioned under `/api/v1`
- Role-based route protection is enforced both on the frontend (`ProtectedRoute`) and backend (`protect([roles])` middleware)
- Video calls use STUN-only WebRTC (no TURN server) — works on most home/office networks
