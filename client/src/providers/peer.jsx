import React, { useMemo } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => {
  return React.useContext(PeerContext);
};

export const PeerProvider = ({ children }) => {
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    });
  }, []);

  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};
