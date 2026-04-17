export default function MessageBubble({ msg, user }) {
  const isMe = msg.sender._id === user._id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 rounded max-w-xs ${
          isMe ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {msg.content}

        <div className="text-xs mt-1 text-right">
          {msg.status === "seen" ? "✔✔" :
           msg.status === "delivered" ? "✔✔" : "✔"}
        </div>
      </div>
    </div>
  );
}