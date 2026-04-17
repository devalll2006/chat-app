import { useState } from "react";
import API from "../api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data } = await API.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  return (
    <div className="bg-white p-8 rounded shadow w-80">
      <h2 className="text-xl mb-4">Login</h2>

      <input
        className="w-full p-2 border mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 border mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white w-full p-2"
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}