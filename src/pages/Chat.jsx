import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../components/Context";
import { io } from "socket.io-client";
const ENDPOINT = "https://chat-8nmt.onrender.com";
const Chat = () => {
  const { localUser, members, friends } = useContext(MyContext);
  const [value, setValue] = useState("");

  const [live, setLive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [other, setOther] = useState(null);
  const socket = useRef(null);
  const [online, setOnline] = useState(null);
  let user = localUser;

  useEffect(() => {
    console.log("calling", live, "value", value);
    socket.current = io(ENDPOINT);
    socket.current.on("connect", () => {
      socket.current.emit("firstConnect", {
        _id: user._id,
        sender: user.name,
        receiver: other?.name,
        senderText: value,
      });
      socket.current.on("conn", (data) => {
        const temp = data.map((d) => d.name);
        setOnline(temp);
      });
      socket.current.on("disc", (data) => {
        const temp = data.map((d) => d.name);
        setOnline(temp);
      });
      socket.current.emit("send", {
        _id: user._id,
        sender: user.name,
        receiver: other?.name,
        senderText: value,
      });
      socket.current.on("receive", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    });
    console.log(value);
    setValue("");
  }, [other?.name, user._id, user.name, live]);
  const startChat = async (user, member) => {
    console.log("sc", live);
    const res = await fetch(`${ENDPOINT}/user/chat`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin: user,
        other: member,
        adminText: value,
      }),
    });
    const data = await res.json();
    if (res.status == 200) {
      setOther(member);
      setMessages(data.messages);
    }

    setLive((prev) => !prev);
    console.log(live);
  };

  const handleSearch = (e) => {
    user = {
      ...user,
      filteredFriends: user.friends.filter((friend) =>
        friend.name.toLowerCase().includes(e.target.value.toLowerCase())
      ),
    };
  };
  return (
    <>
      {user !== undefined ? (
        <div className="w-full h-screen flex bg-gradient-to-bl from-pink-100 via-blue-200 to-pink-100 text-sm sm:text-lg">
          <div className="w-[20%]  border-r-2 border-blue-300 h-full">
            <div className="mb-6 p-4 flex items-center gap-3 border-b border-blue-500 pb-4 ">
              <div className="hidden sm:inline-block">
                <img
                  className="md:w-10 md:h-10 rounded-full"
                  src="https://via.placeholder.com/150/771796"
                  alt=""
                />
              </div>
              <div className="">{user.name}</div>
            </div>
            <div className=" flex flex-col gap-1">
              <input
                className=" bg-slate-200 w-[85%] self-center px-4 py-0.5 mb-3 rounded-xl border-none outline-none shadow-md"
                onChange={(e) => handleSearch(e)}
                type="text"
                placeholder="Search..."
              />
              {members?.map((memb) => {
                if (memb.name !== user.name)
                  return (
                    <div
                      key={memb._id}
                      className="flex items-center px-2 transition-all hover:bg-blue-300 cursor-pointer"
                      onClick={() => startChat(user, memb, value)}
                    >
                      <div className="flex w-full pl-2 py-1  items-center gap-3  ">
                        <div className="relative">
                          <img
                            className="hidden sm:inline-block sm:w-9 sm:h-9 rounded-full"
                            src={
                              memb.img
                                ? memb.img
                                : "https://via.placeholder.com/150/771796"
                            }
                            alt=""
                          />
                          {online?.includes(memb.name) && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="relative">{memb.name}</div>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
          <div className="w-[80%] border-r-2 border-blue-300  h-full">
            {other ? (
              <>
                <div className="h-full">
                  <div className=" p-3 flex items-center gap-3 justify-center border-b border-blue-500">
                    <div className="py-0.5">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://via.placeholder.com/150/771796"
                        alt=""
                      />
                    </div>
                    <div>{other.name}</div>
                  </div>
                  <div className="h-[90%] flex flex-col text-xl ">
                    <div className="h-[85%]  overflow-y-auto flex flex-col ">
                      {messages?.length > 0 ? (
                        <>
                          {messages.map((message) => (
                            <div
                              key={message._id}
                              className=" w-full  flex flex-col px-3 py-2"
                            >
                              <div
                                className={`w-fit px-4 py-1 rounded-2xl shadow-md  ${
                                  message.sender == user.name
                                    ? "self-end text-white font-semibold bg-blue-500 "
                                    : "font-semibold bg-yellow-50 "
                                }`}
                              >
                                {message.senderText}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="relative h-full flex justify-center items-center">
                          <img className="opacity-30 " src="empty.gif" alt="" />
                          <div className="absolute top-20 text-5xl text-emerald-950">
                            No Old Chatting ...
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-full relative text-center p-3">
                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={(e) => {
                          e.key === "Enter" && startChat(user, other, value);
                        }}
                        className="font-semibold resize-none scrollbar-hide break-words w-[90%] h-14 rounded-md py-3 pl-3 pr-16 border border-pink-500 bg-gray-100 cursor-context-menu transition-all delay-50 focus:bg-blue-300 focus:text-blue-950 hover:bg-blue-200 hover:outline-pink-500"
                        type="text"
                      />
                      <span
                        onClick={() => startChat(user, other, value)}
                        className="absolute top-[1.2rem] right-[5rem] text-3xl text-pink-600 "
                      >
                        &#x27A4;
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col w-full h-full relative">
                <div className="py-5 absolute top-[40%] left-[5%] font-bold text-teal-900 text-4xl">
                  Click on your Friend & Start Chat !!!
                </div>
                <img
                  className="w-full h-full opacity-10"
                  src="chat2.gif"
                  alt="Let'Chat"
                />
              </div>
            )}
          </div>
          <div className="w-[20%] h-full">
            {/* <div className=""> */}
            <div className="px-2 py-6 border-b border-blue-500 ">
              <div className="h-6 sm:text-[0.9rem] md:text-[0.9rem] text-center">
                {user.name} &#39;s Friend
              </div>
            </div>
            <div className="pt-2">
              {friends?.map((friend) => (
                <div
                  key={friend._id}
                  onClick={() => startChat(user, friend, value)}
                  className="flex items-center gap-1 pl-3 py-0.5"
                >
                  <div className="relative">
                    <img
                      className="hidden sm:inline-block w-9 h-9 rounded-full"
                      src="https://via.placeholder.com/150/771796"
                      alt=""
                    />
                    {online?.includes(friend.name) && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex justify-center p-2">{friend.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-3xl py-14">Loading...</div>
      )}
    </>
  );
};

export default Chat;
