import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { getSocket } from "../../services/socketService";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoCallModal = ({ isOpen, onClose, remoteUserId, remoteUserName, isIncoming, incomingOffer, callerId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [callStatus, setCallStatus] = useState(isIncoming ? "incoming" : "calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const socket = getSocket();

    const setupCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit("ice_candidate", {
              receiverId: isIncoming ? callerId : remoteUserId,
              candidate: event.candidate,
            });
          }
        };

        if (!isIncoming) {
          // Outgoing call: create offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket?.emit("call_user", {
            receiverId: remoteUserId,
            offer,
            callerName: "User", // could be passed as a prop from the logged-in user's profile
          });
        } else {
          // Incoming call: set the received offer as remote description
          await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
        }
      } catch (err) {
        console.error("Media access error:", err);
        setCallStatus("error");
      }
    };

    setupCall();

    socket?.on("call_answered", async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
      setCallStatus("connected");
    });

    socket?.on("ice_candidate", async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    });

    socket?.on("call_rejected", () => {
      setCallStatus("rejected");
      setTimeout(handleClose, 1500);
    });

    socket?.on("call_ended", () => {
      handleClose();
    });

    return () => {
      socket?.off("call_answered");
      socket?.off("ice_candidate");
      socket?.off("call_rejected");
      socket?.off("call_ended");
    };
  }, [isOpen]);

  const handleAccept = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    getSocket()?.emit("answer_call", { callerId, answer });
    setCallStatus("connected");
  };

  const handleReject = () => {
    getSocket()?.emit("reject_call", { callerId });
    handleClose();
  };

  const handleClose = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    getSocket()?.emit("end_call", { receiverId: isIncoming ? callerId : remoteUserId });
    onClose();
  };

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
      >
        {callStatus === "incoming" ? (
          <div className="text-center text-white space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto text-3xl font-bold">
              {remoteUserName?.charAt(0) || "?"}
            </div>
            <div>
              <p className="text-xl font-semibold">{remoteUserName || "Incoming Call"}</p>
              <p className="text-sm text-slate-400 mt-1">Incoming video call...</p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handleReject}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FaPhoneSlash />
              </button>
              <button
                onClick={handleAccept}
                className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <FaVideo />
              </button>
            </div>
          </div>
        ) : callStatus === "error" ? (
          <div className="text-center text-white">
            <p className="mb-4">Could not access camera/microphone.</p>
            <button onClick={handleClose} className="px-4 py-2 rounded-xl bg-red-500">
              Close
            </button>
          </div>
        ) : callStatus === "rejected" ? (
          <div className="text-center text-white">
            <p>Call was declined.</p>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-3xl aspect-video bg-slate-900 rounded-2xl overflow-hidden">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-4 right-4 w-32 h-24 rounded-xl object-cover border-2 border-white/20"
              />
              {callStatus === "calling" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-white text-sm">Calling {remoteUserName}...</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
                } text-white`}
              >
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <button
                onClick={handleClose}
                className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors text-white"
              >
                <FaPhoneSlash />
              </button>
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
                } text-white`}
              >
                {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCallModal;