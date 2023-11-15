import { useState } from "react";
import { Link } from "react-router-dom";
const ENDPOINT = "https://chat-8nmt.onrender.com";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const register = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${ENDPOINT}/user/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
      }),
    });
    const data = await res.json();
    console.log(data);
    setUser({ name: "", email: "", password: "" });
  };
  return (
    <div className="w-full h-screen flex justify-center pt-24 bg-gradient-to-tr from-sky-800  to-indigo-950 ">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-[30%] flex flex-col gap-6"
      >
        <div className="text-3xl text-white mb-14 text-center font-semibold">
          Sign Up
        </div>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={(e) => register(e)}
          placeholder="Enter your Name..."
          className="bg-inherit border-b-2 outline-none w-full text-xl  text-white px-1"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={(e) => register(e)}
          placeholder="Enter your Email..."
          className="bg-inherit border-b-2 outline-none w-full text-xl text-white px-1"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={(e) => register(e)}
          placeholder="Enter your Password..."
          className="bg-inherit border-b-2 outline-none w-full text-xl text-white px-1"
        />
        <input
          type="submit"
          value="Register"
          placeholder="Enter your Password..."
          className="bg-[rgba(255,255,255,0.4)]  w-full text-xl text-blue-950 font-bold px-1 py-1 rounded-md mt-3 transition-all  hover:bg-[rgba(255,255,255,0.65)] hover:cursor-pointer active:scale-95  "
        />
        <div className="text-white flex justify-center gap-3">
          Already a user ?
          <Link className="text-green-300" to={"/sign-in"}>
            Sign-In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
