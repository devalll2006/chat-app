import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Chat({ user }) {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex w-full h-screen">
      <Sidebar setSelectedChat={setSelectedChat} />
      <ChatBox user={user} selectedChat={selectedChat} />
    </div>
  );
}