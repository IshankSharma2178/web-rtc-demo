import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../providers/socket";

const Room = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();

  const handleNewUserJoined = (emailId) => {
    console.log("user email is " + emailId);
  };

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
  }, [socket]);

  return <div>Room</div>;
};

export default Room;
