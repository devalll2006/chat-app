// import { useState } from "react";
// import API from "./api";
// import { socket } from "./socket";

// function App() {
//   const [token, setToken] = useState("");
//   const [message, setMessage] = useState("");
//   const [chatId, setChatId] = useState("");
//   const [receiverId, setReceiverId] = useState("");

//   // 🔐 Register
//   const register = async () => {
//     const res = await API.post("/auth/register", {
//       name: "test",
//       email: "test@test.com",
//       password: "123456",
//     });
//     console.log(res.data);
//   };

//   // 🔑 Login
//   const login = async () => {
//     const res = await API.post("/auth/login", {
//       email: "test@test.com",
//       password: "123456",
//     });
//     setToken(res.data.token);
//     console.log(res.data);
//   };

//   // 💬 Access/Create Chat
//   const createChat = async () => {
//     const res = await API.post(
//       "/chat",
//       { userId: receiverId },
//       { headers: { Authorization: `Bearer ${token}` } },
//     );
//     setChatId(res.data._id);
//     console.log(res.data);
//   };

//   // 📩 Send Message
//   const sendMessage = async () => {
//     const res = await API.post(
//       "/message",
//       { content: message, chatId },
//       { headers: { Authorization: `Bearer ${token}` } },
//     );
//     console.log(res.data);
//   };

//   // 📥 Get Messages
//   const getMessages = async () => {
//     const res = await API.get(`/message/${chatId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(res.data);
//   };

//   // 🔌 Connect Socket
//   const connectSocket = () => {
//     socket.connect();

//     socket.on("connect", () => {
//       console.log("Connected:", socket.id);
//     });

//     socket.on("message received", (msg) => {
//       console.log("New Message:", msg);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
//         <h2 className="text-2xl font-bold text-center text-gray-800">
//           Test Backend
//         </h2>

//         {/* Auth */}
//         <div className="flex gap-4">
//           <button
//             onClick={register}
//             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
//           >
//             Register
//           </button>
//           <button
//             onClick={login}
//             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
//           >
//             Login
//           </button>
//         </div>

//         {/* Chat */}
//         <div className="flex gap-2">
//           <input
//             placeholder="Receiver User ID"
//             onChange={(e) => setReceiverId(e.target.value)}
//             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={createChat}
//             className="bg-purple-500 hover:bg-purple-600 text-white px-4 rounded-lg transition"
//           >
//             Create Chat
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex gap-2">
//           <input
//             placeholder="Message"
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-lg transition"
//           >
//             Send
//           </button>
//           <button
//             onClick={getMessages}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 rounded-lg transition"
//           >
//             Get
//           </button>
//         </div>

//         {/* Socket */}
//         <button
//           onClick={connectSocket}
//           className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition"
//         >
//           Connect Socket
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState } from "react";
import API from "./api";
import { socket } from "./socket";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  const log = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  // 🔐 Register
  const register = async () => {
    try {
      const res = await API.post("/auth/register", {
        name: "user1",
        email: "user1@test.com",
        password: "123456",
      });
      log("User registered");
      console.log(res.data);
    } catch (err) {
      log("Register failed");
    }
  };

  // 🔑 Login
  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email: "user1@test.com",
        password: "123456",
      });

      setToken(res.data.token);
      setUser(res.data);

      // 🔌 Socket setup
      socket.connect();
      socket.emit("setup", res.data);

      socket.on("connected", () => log("Socket connected ✅"));

      socket.on("message received", (msg) => {
        log("New message: " + msg.content);
      });

      log("Logged in ✅");
    } catch (err) {
      log("Login failed ❌");
      console.error(err);
    }
  };

  // 💬 Create Chat
  const createChat = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    try {
      const res = await API.post(
        "/chat",
        { userId: receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatId(res.data._id);

      socket.emit("join chat", res.data._id);

      log("Chat created ✅");
    } catch (err) {
      log("Chat creation failed ❌");
    }
  };

  const sendMessage = async () => {
  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await API.post(
      "/messages/send",   // ✅ THIS IS THE FIX
      {
        receiverId,
        content: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔌 socket runs AFTER success
    socket.emit("new message", res.data);

    log("Message sent ✅");
  } catch (err) {
    log("Message send failed ❌");
    console.error(err.response?.data || err.message);
  }
};

  // 📥 Get Messages
  const getMessages = async () => {
    if (!token) {
      alert("Login first");
      return;
    }

    try {
      const res = await API.get(`/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      log(`Fetched ${res.data.length} messages`);
    } catch (err) {
      log("Fetch failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Chat Backend Tester
        </h2>

        {/* Status */}
        <p className="text-center text-sm">
          {token ? (
            <span className="text-green-600">Logged in ✅</span>
          ) : (
            <span className="text-red-500">Not logged in ❌</span>
          )}
        </p>

        {/* Auth */}
        <div className="flex gap-4">
          <button
            onClick={register}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Register
          </button>
          <button
            onClick={login}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </div>

        {/* Chat */}
        <div className="flex gap-2">
          <input
            placeholder="Receiver User ID"
            onChange={(e) => setReceiverId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={createChat}
            disabled={!token}
            className={`px-4 rounded-lg transition ${
              token
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>

        {/* Messages */}
        <div className="flex gap-2">
          <input
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={sendMessage}
            disabled={!token}
            className={`px-4 rounded-lg transition ${
              token
                ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Send
          </button>
          <button
            onClick={getMessages}
            disabled={!token}
            className={`px-4 rounded-lg transition ${
              token
                ? "bg-gray-500 hover:bg-gray-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Get
          </button>
        </div>

        {/* Logs */}
        <div className="bg-black text-green-400 p-3 rounded-lg h-40 overflow-y-auto text-sm font-mono">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;