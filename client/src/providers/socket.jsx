import React, { useMemo } from "react";
import { io } from "socket.io-client";

const socketContext = React.createContext(null);

export const useSocket = () => {
  return React.useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8001"), []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};
