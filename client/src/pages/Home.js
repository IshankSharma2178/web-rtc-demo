import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const [userDetails, setUserDetails] = useState({ emailId: "", roomId: "" });
  const navigate = useNavigate();

  const handleJoiningRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    socket.on("room-joined", handleJoiningRoom);
  }, [socket]);

  const JoinHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", userDetails);
    setUserDetails({ emailId: "", roomId: "" });
  };

  return (
    <div>
      <form onSubmit={JoinHandler}>
        <input
          type="email"
          value={userDetails.emailId}
          onChange={(e) => {
            setUserDetails({ ...userDetails, emailId: e.target.value });
          }}
          required
          placeholder="Enter your email"
        />
        <input
          type="text"
          value={userDetails.roomId}
          onChange={(e) =>
            setUserDetails({ ...userDetails, roomId: e.target.value })
          }
          required
          placeholder="Enter Room Code"
        />
        <button type="">Enter Room</button>
      </form>
    </div>
  );
};

export default Home;
