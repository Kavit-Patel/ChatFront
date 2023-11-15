import React, { useEffect, useState } from "react";

export const MyContext = React.createContext();
export const ContextProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(null);
  const [members, setMembers] = useState(null);
  const [friends, setFriends] = useState(null);

  const myFriends = async () => {
    const res = await fetch("http://localhost:5500/user/friends", {
      credentials: "include",
    });
    const data = await res.json();
    if (res.status == 200) {
      setFriends(data);
    }
  };
  const me = async () => {
    const res = await fetch("http://localhost:5500/user/auth", {
      credentials: "include",
    });
    const data = await res.json();
    // console.log(res.status, data);
    if (res.status == 200) {
      setLocalUser(data);
    }
  };
  const memb = async () => {
    try {
      const res = await fetch("http://localhost:5500/user/memb", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.status == 200) {
        setMembers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   socket.current = client.connect("http://localhost:5500");
  // }, []);
  useEffect(() => {
    me();
    memb();
    myFriends();
  }, []);
  return (
    <MyContext.Provider
      value={{ localUser, setLocalUser, members, setMembers, friends }}
    >
      {children}
    </MyContext.Provider>
  );
};
