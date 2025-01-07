import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { SocketProvider } from "./providers/socket";
import Room from "./pages/Room";
import { PeerProvider } from "./providers/peer";

const App = () => {
  return (
    <SocketProvider>
      <PeerProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/room/:roomId" element={<Room></Room>} />
          </Routes>
        </div>
      </PeerProvider>
    </SocketProvider>
  );
};

export default App;
