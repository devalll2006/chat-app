import { useState } from "react";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully. Now login.");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow w-80">
      <h2 className="text-xl mb-4">Register</h2>

      <input
        className="w-full p-2 border mb-2"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

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
        className="bg-green-500 text-white w-full p-2"
        onClick={register}
      >
        Register
      </button>
    </div>
  );
}