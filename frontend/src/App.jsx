import { useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  // const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem("user"))
  // );
  const [user, setUser] = useState({
  _id: "user1",
  name: "Deval",
});

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      {!user ? <Login setUser={setUser} /> : <Chat user={user} />}
    </div>
  );
}

export default App;