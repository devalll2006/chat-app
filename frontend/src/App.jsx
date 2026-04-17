// import { useState } from "react";
// import Login from "./pages/Login";
// import Chat from "./pages/Chat";

// function App() {
//  const [user, setUser] = useState(null);

//   return (
//     <div className="h-screen bg-gray-100 flex items-center justify-center">
//       {!user ? <Login setUser={setUser} /> : <Chat user={user} />}
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      {!user ? (
        !showLogin ? (
          <div>
            <Register />
            <p
              className="text-center mt-4 text-blue-500 cursor-pointer"
              onClick={() => setShowLogin(true)}
            >
              Already have an account? Login
            </p>
          </div>
        ) : (
          <div>
            <Login setUser={setUser} />
            <p
              className="text-center mt-4 text-blue-500 cursor-pointer"
              onClick={() => setShowLogin(false)}
            >
              New user? Register
            </p>
          </div>
        )
      ) : (
        <Chat user={user} />
      )}
    </div>
  );
}

export default App;