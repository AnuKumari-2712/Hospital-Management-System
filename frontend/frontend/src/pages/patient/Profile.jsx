import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import { getProfile } from "../../services/profileService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data.user))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          My Profile
        </h1>
        <Link
          to="/patient/profile/edit"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
        >
          <FaEdit className="text-xs" /> Edit Profile
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              profile?.fullName?.charAt(0) || "P"
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {profile?.fullName || "Patient Name"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {profile?.role || "Patient"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {profile?.email || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {profile?.phone || "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Date of Birth</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {profile?.dateOfBirth || "Not set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Address</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {profile?.address || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;