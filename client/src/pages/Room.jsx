import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/peer";
import ReactPlayer from "react-player";
import { Users, Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer } = usePeer();
  const { roomId } = useParams();

  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const handleNewUserJoined = useCallback(
    async (emailId) => {
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      const ans = await createAnswer(offer);
      console.log("call incoming");
      socket.emit("call-accepted", { emailId: from, ans });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("call accepted");
      await setRemoteAnswer(ans);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const leaveCall = () => {
    // Implement leave call functionality
    console.log("Leaving call");
  };

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-neon-green text-center">
          Video Chat Room
        </h1>
        <p className="text-neon-blue">Room ID: {roomId}</p>
      </header>
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          {myStream && (
            <ReactPlayer
              url={myStream}
              playing
              muted
              width="100%"
              height="100%"
              className="react-player"
            />
          )}
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
          {remoteStream ? (
            <ReactPlayer
              url={remoteStream}
              playing
              width="100%"
              height="100%"
              className="react-player "
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Users className="w-16 h-16 text-neon-pink" />
              <p className="text-neon-pink ml-2">Waiting for peer to join...</p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleVideo}
            className={`p-2 rounded-full ${
              isVideoOn ? "bg-neon-green" : "bg-neon-red"
            }`}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-gray-900" />
            ) : (
              <VideoOff className="w-6 h-6 text-gray-900" />
            )}
          </button>
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full ${
              isAudioOn ? "bg-neon-green" : "bg-neon-red"
            }`}
          >
            {isAudioOn ? (
              <Mic className="w-6 h-6 text-gray-900" />
            ) : (
              <MicOff className="w-6 h-6 text-gray-900" />
            )}
          </button>
          <button onClick={leaveCall} className="p-2 rounded-full bg-neon-red">
            <PhoneOff className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Room;
