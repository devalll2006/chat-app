import { useState } from "react";
import { socket } from "../socket";

export default function MessageInput({ user, selectedChat }) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message) return;

    const msg = {
      sender: { _id: user._id },
      content: message,
      chat: selectedChat, // 🔥 important
    };

    console.log("Sending:", msg);

    socket.emit("new message", msg);
    setMessage("");
  };

  return (
    <div className="p-3 border-t flex">
      <input
        className="flex-1 border p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}