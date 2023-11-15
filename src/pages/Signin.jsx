import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../components/Context";
const ENDPOINT = "https://chat-8nmt.onrender.com";

const Signin = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { setLocalUser, setMembers } = useContext(MyContext);
  const navigate = useNavigate();
  const handleLogin = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ENDPOINT}/user/login`, {
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
      setUser({ email: "", password: "" });
      setLocalUser(data.user);
      setMembers(data.members);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center pt-24 bg-gradient-to-tr from-sky-800  to-indigo-950 ">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-[30%] flex flex-col gap-6"
      >
        <div className="text-3xl text-white mb-14 text-center font-semibold">
          Sign In
        </div>

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={(e) => handleLogin(e)}
          placeholder="Enter your Email..."
          className="bg-inherit border-b-2 outline-none w-full text-xl text-white px-1"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={(e) => handleLogin(e)}
          placeholder="Enter your Password..."
          className="bg-inherit border-b-2 outline-none w-full text-xl text-white px-1"
        />
        <input
          type="submit"
          value="Login"
          placeholder="Enter your Password..."
          className="bg-[rgba(255,255,255,0.4)]  w-full text-xl text-blue-950 font-bold px-1 py-1 rounded-md mt-3 transition-all  hover:bg-[rgba(255,255,255,0.65)] hover:cursor-pointer active:scale-95  "
        />
        <div className="text-white flex justify-center gap-3">
          Not a user Yet ?
          <Link className="text-green-300" to={"/sign-up"}>
            Sign-Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
