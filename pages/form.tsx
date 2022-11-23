import { useState } from "react";

export default function Form() {
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState("");
  const [msisdn, setMsisdn] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const res = await fetch("/api/score", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ msisdn, playerName, score }),
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phoneNumber">Phone number</label>
        <br />
        <input value={msisdn} type="tel" id="phoneNumber" onChange={(e) => setMsisdn(e.target.value)} />
        <br />
        <br />
        <label htmlFor="playerName">Player name</label>
        <br />
        <input value={playerName} type="text" id="playerName" onChange={(e) => setPlayerName(e.target.value)} />
        <br />
        <br />
        <label htmlFor="playerName">Score</label>
        <br />
        <input value={score} onChange={(e) => setScore(e.target.value)} type="number" id="playerName" />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      protected: true,
      userTypes: ["admin"],
    },
  };
}
