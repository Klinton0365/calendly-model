import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/user").then(res => setUser(res.data));
  }, []);

  return (
    <div>
      <h2>Welcome {user?.name}</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
}
