import { useEffect, useState } from "react";
import API from "../api";
import { socket } from "../socket";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ user, selectedChat }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  if (!selectedChat) return;

  socket.emit("join chat", selectedChat._id);

  socket.on("message received", (msg) => {
    console.log("Received:", msg);
    setMessages((prev) => [...prev, msg]);
  });

  return () => socket.off("message received");
}, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  if (!selectedChat) return <div className="flex-1 p-4">Select a chat</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-3 border-b font-bold">
        {selectedChat.name}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} msg={msg} user={user} />
        ))}
      </div>

      <MessageInput user={user} selectedChat={selectedChat} />
    </div>
  );
}