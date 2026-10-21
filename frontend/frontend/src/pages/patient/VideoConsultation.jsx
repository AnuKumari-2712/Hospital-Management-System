import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";
import { getMyAppointments } from "../../services/appointmentService";
import { connectSocket, getSocket } from "../../services/socketService";
import VideoCallModal from "../../components/video/VideoCallModal";

const VideoConsultation = () => {
  const [upcomingCalls, setUpcomingCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCall, setActiveCall] = useState(null); // { remoteUserId, remoteUserName }
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    getMyAppointments()
      .then((data) => {
        const videoAppointments = (data.appointments || []).filter(
          (a) => a.type === "video" && a.status === "confirmed"
        );
        setUpcomingCalls(videoAppointments);
      })
      .catch(() => setUpcomingCalls([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    socket?.on("incoming_call", ({ callerId, callerName, offer }) => {
      setIncomingCall({ callerId, callerName, offer });
    });

    return () => {
      socket?.off("incoming_call");
    };
  }, []);

  const handleStartCall = (appt) => {
    setActiveCall({
      remoteUserId: appt.doctorId,
      remoteUserName: `Dr. ${appt.doctorName}`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Video Consultation
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Join your scheduled video calls with doctors.
      </p>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && upcomingCalls.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <FaVideo className="text-3xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            No video consultations scheduled
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Book an appointment and select "Video Consultation" as the type.
          </p>
        </div>
      )}

      {upcomingCalls.length > 0 && (
        <div className="space-y-3">
          {upcomingCalls.map((call, i) => (
            <motion.div
              key={call._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <FaVideo className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    Dr. {call.doctorName || "Doctor"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt /> {call.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock /> {call.timeSlot}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartCall(call)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg transition-shadow shrink-0"
              >
                Join Call
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Outgoing call */}
      {activeCall && (
        <VideoCallModal
          isOpen={!!activeCall}
          onClose={() => setActiveCall(null)}
          remoteUserId={activeCall.remoteUserId}
          remoteUserName={activeCall.remoteUserName}
          isIncoming={false}
        />
      )}

      {/* Incoming call */}
      {incomingCall && (
        <VideoCallModal
          isOpen={!!incomingCall}
          onClose={() => setIncomingCall(null)}
          remoteUserName={incomingCall.callerName}
          isIncoming={true}
          incomingOffer={incomingCall.offer}
          callerId={incomingCall.callerId}
        />
      )}
    </div>
  );
};

export default VideoConsultation;