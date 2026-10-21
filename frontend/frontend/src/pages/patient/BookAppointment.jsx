import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaSpinner, FaUserMd, FaVideo } from "react-icons/fa";
import { bookAppointmentSchema } from "../../schemas/appointmentSchema";
import {
  getDepartments,
  getDoctorsByDepartment,
  bookAppointment,
} from "../../services/appointmentService";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM",
];

const BookAppointment = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      department: "",
      doctorId: "",
      date: "",
      timeSlot: "",
      type: "in-person",
      reason: "",
    },
  });

  const selectedDepartment = watch("department");
  const selectedType = watch("type");

  useEffect(() => {
    getDepartments()
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (!selectedDepartment) {
      setDoctors([]);
      return;
    }
    setLoadingDoctors(true);
    getDoctorsByDepartment(selectedDepartment)
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, [selectedDepartment]);

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      await bookAppointment(data);
      setIsSuccess(true);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Could not book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
          <FaCheckCircle className="text-emerald-500 text-2xl" />
        </div>
        <div>
          <p className="text-slate-800 dark:text-white font-semibold text-lg">
            Appointment Requested!
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            You'll receive a confirmation once the doctor accepts your
            appointment request.
          </p>
        </div>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline"
        >
          Book Another Appointment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Book an Appointment
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Select a department, doctor, and preferred time slot.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
        noValidate
      >
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-2"
            >
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consultation Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Consultation Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("type", "in-person")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${
                selectedType === "in-person"
                  ? "border-sky-400 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <FaUserMd /> In-Person
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "video")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${
                selectedType === "video"
                  ? "border-sky-400 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <FaVideo /> Video Call
            </button>
          </div>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1.5">{errors.type.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Department
          </label>
          <select
            {...register("department")}
            className={`w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
              errors.department
                ? "border-red-400"
                : "border-slate-200 dark:border-slate-700"
            } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept._id || dept} value={dept.name || dept}>
                {dept.name || dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.department.message}
            </p>
          )}
          {departments.length === 0 && (
            <p className="text-xs text-slate-400 mt-1.5">
              No departments loaded yet — connect the backend /departments
              route to populate this list.
            </p>
          )}
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Doctor
          </label>
          <select
            {...register("doctorId")}
            disabled={!selectedDepartment || loadingDoctors}
            className={`w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
              errors.doctorId
                ? "border-red-400"
                : "border-slate-200 dark:border-slate-700"
            } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all disabled:opacity-50`}
          >
            <option value="">
              {loadingDoctors ? "Loading doctors..." : "Select doctor"}
            </option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name} {doc.specialization ? `(${doc.specialization})` : ""}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.doctorId.message}
            </p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Preferred Date
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("date")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
                  errors.date
                    ? "border-red-400"
                    : "border-slate-200 dark:border-slate-700"
                } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
              />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Time Slot
            </label>
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <select
                {...register("timeSlot")}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
                  errors.timeSlot
                    ? "border-red-400"
                    : "border-slate-200 dark:border-slate-700"
                } text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-300 transition-all`}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            {errors.timeSlot && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.timeSlot.message}
              </p>
            )}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Reason for Visit
          </label>
          <textarea
            rows={4}
            placeholder="Briefly describe your symptoms or reason for the appointment..."
            {...register("reason")}
            className={`w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border ${
              errors.reason
                ? "border-red-400"
                : "border-slate-200 dark:border-slate-700"
            } text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-300 transition-all resize-none`}
          />
          {errors.reason && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.reason.message}
            </p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Booking...
            </>
          ) : (
            "Book Appointment"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default BookAppointment;