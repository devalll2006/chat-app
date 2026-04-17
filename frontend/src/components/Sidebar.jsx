export default function Sidebar({ setSelectedChat }) {
  const users = [
    { _id: "user1", name: "Deval" },
    { _id: "user2", name: "Rahul" },
  ];

  const createFakeChat = (user) => {
    const chat = {
      _id: "chat123", // fake chat id
      name: user.name,
      users: [
        { _id: "user1", name: "Deval" },
        { _id: "user2", name: "Rahul" },
      ],
    };

    console.log("Selected Chat:", chat);

    setSelectedChat(chat);
  };

  return (
    <div className="w-1/3 border-r">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => createFakeChat(user)}
          className="p-3 hover:bg-gray-200 cursor-pointer"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}