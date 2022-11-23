import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserStateContext } from "./_app";

const USER_NAME = "test";
const PASSWORD = "test";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser }: any = useContext(UserStateContext);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (userName === USER_NAME && password === PASSWORD) {
      setUser({ name: userName, type: "admin" });
      router.push("/form");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="playerName">user name</label>
        <br />
        <input value={userName} type="text" id="playerName" onChange={(e) => setUserName(e.target.value)} />
        <br />
        <label htmlFor="playerName">password</label>
        <br />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" id="playerName" />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
