import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/socket";
import { useNavigate } from "react-router-dom";
import { Mail, Hash, ArrowRight } from "lucide-react";

const Home = () => {
  const { socket } = useSocket();
  const [userDetails, setUserDetails] = useState({ emailId: "", roomId: "" });
  const navigate = useNavigate();

  const handleJoiningRoom = useCallback(
    (roomId) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room-joined", handleJoiningRoom);
    return () => socket.off("room-joined", handleJoiningRoom);
  }, [socket, handleJoiningRoom]);

  const JoinHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", userDetails);
    setUserDetails({ emailId: "", roomId: "" });
  };

  useEffect(() => {});

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl text-center font-bold text-neon-green">
          Video Chat App
        </h1>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-6 text-center text-neon-blue">
            Join a Room
          </h2>
          <form onSubmit={JoinHandler} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={userDetails.emailId}
                onChange={(e) => {
                  setUserDetails({ ...userDetails, emailId: e.target.value });
                }}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-neon-green text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={userDetails.roomId}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, roomId: e.target.value })
                }
                required
                placeholder="Enter Room Code"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-neon-green text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-neon-green text-gray-900 py-2 px-4 rounded-md font-semibold hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
            >
              <span>Enter Room</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-gray-400">&copy;</p>
      </footer>
    </div>
  );
};

export default Home;
