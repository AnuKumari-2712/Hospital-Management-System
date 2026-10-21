import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Layouts & Protected Route
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Patient Pages
import Dashboard from "./pages/patient/Dashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import AppointmentDetails from "./pages/patient/AppointmentDetails";
import MedicalRecords from "./pages/patient/MedicalRecords";
import Prescriptions from "./pages/patient/Prescriptions";
import LabReports from "./pages/patient/LabReports";
import Billing from "./pages/patient/Billing";
import PaymentHistory from "./pages/patient/PaymentHistory";
import Chat from "./pages/patient/Chat";
import VideoConsultation from "./pages/patient/VideoConsultation";
import Notifications from "./pages/patient/Notifications";
import Profile from "./pages/patient/Profile";
import EditProfile from "./pages/patient/EditProfile";
import Settings from "./pages/patient/Settings";
import ChangePassword from "./pages/patient/ChangePassword";
import HelpSupport from "./pages/patient/HelpSupport";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import TodayAppointments from "./pages/doctor/TodayAppointments";
import PatientList from "./pages/doctor/PatientList";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords";
import PrescriptionGenerator from "./pages/doctor/PrescriptionGenerator";
import UploadReports from "./pages/doctor/UploadReports";
import Schedule from "./pages/doctor/Schedule";
import LeaveManagement from "./pages/doctor/Leave";
import DoctorChat from "./pages/doctor/Chat";
import DoctorVideoConsultation from "./pages/doctor/VideoConsultation";
import DoctorNotifications from "./pages/doctor/Notifications";
import Earnings from "./pages/doctor/Earnings";
import DoctorAnalytics from "./pages/doctor/Analytics";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorSettings from "./pages/doctor/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import AddDoctor from "./pages/admin/AddDoctor";
import EditDoctor from "./pages/admin/EditDoctor";
import ManagePatients from "./pages/admin/ManagePatients";
import AdminPatientDetails from "./pages/admin/AdminPatientDetails";
import Departments from "./pages/admin/Departments";
import StaffManagement from "./pages/admin/StaffManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";
import AdminBilling from "./pages/admin/AdminBilling";
import Payments from "./pages/admin/Payments";
import Inventory from "./pages/admin/Inventory";
import Reports from "./pages/admin/Reports";
import AdminAnalytics from "./pages/admin/Analytics";
import Feedback from "./pages/admin/Feedback";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import CreateBill from "./pages/doctor/CreateBill";
import OTPVerification from "./pages/auth/OTPVerification";
import ResetPassword from "./pages/auth/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
<Route path="/reset-password" element={<ResetPassword />} />
        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="lab-reports" element={<LabReports />} />
          <Route path="billing" element={<Billing />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="chat" element={<Chat />} />
          <Route path="video-consultation" element={<VideoConsultation />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
          <Route path="help" element={<HelpSupport />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="create-bill" element={<CreateBill />} />
          <Route path="today-appointments" element={<TodayAppointments />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="medical-records" element={<DoctorMedicalRecords />} />
          <Route path="prescriptions" element={<PrescriptionGenerator />} />
          <Route path="upload-reports" element={<UploadReports />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="video-consultation" element={<DoctorVideoConsultation />} />
          <Route path="notifications" element={<DoctorNotifications />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="analytics" element={<DoctorAnalytics />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="doctors/add" element={<AddDoctor />} />
          <Route path="doctors/edit/:id" element={<EditDoctor />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="patients/:id" element={<AdminPatientDetails />} />
          <Route path="departments" element={<Departments />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-slate-500">
              Page not found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;