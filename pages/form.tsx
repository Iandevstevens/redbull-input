import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const addedScore = () =>
  toast("Score added.", {
    duration: 3000,
    position: "bottom-center",

    // Styling
    style: {},
    className: "",

    // Custom Icon
    icon: "👍",

    // Change colors of success/error/loading icon
    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },

    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });

const errorNotify = (error: string) =>
  toast(error, {
    duration: 3000,
    position: "bottom-center",

    // Styling
    style: {},
    className: "",

    // Custom Icon
    icon: "👎",

    // Change colors of success/error/loading icon
    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },

    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });

export default function Form() {
  const [playerName, setPlayerName] = useState("");
  const [min, setMin] = useState("");
  const [second, setSecond] = useState("");
  const [milSecond, setMilSecond] = useState("");
  const [msisdn, setMsisdn] = useState("");

  const submitPhoneNumber = async (event: any) => {
    event.preventDefault();
    fetch(`/api/user/?msisdn=${msisdn}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          errorNotify("User must login through redbull");
        } else {
          setPlayerName(data.user.name + " " + data.user.surname);
        }
      })
      .catch((err) => errorNotify("User must login through redbull"));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const res = await fetch("/api/score", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ msisdn, score: +min * 60000 + +second * 1000 + +milSecond, playerName }),
    });
    const data = await res.json();
    if (data.err) {
      if (Object.keys(data.err.keyPattern)[0] === "playerName") {
      }
      console.log(Object.keys(data.err.keyPattern)[0]);
      //UserAlreadyExists();
    } else {
      addedScore();
      setMin("");
      setSecond("");
      setMilSecond("");
      setPlayerName("");
      setMsisdn("");
    }
  };
  return (
    <div>
      <form onSubmit={submitPhoneNumber}>
        <label htmlFor="phoneNumber">Phone number</label>
        <br />
        <input value={msisdn} type="tel" id="phoneNumber" onChange={(e) => setMsisdn(e.target.value)} />
        <br />
        <br />
        <input type="submit" value="Submit" />
        <p>{playerName}</p>
      </form>
      <hr />
      {!!playerName && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="min">min</label>
          <br />
          <input value={min} onChange={(e) => setMin(e.target.value)} type="number" id="min" />
          <br />
          <br />
          <label htmlFor="min">second</label>
          <br />
          <input value={second} onChange={(e) => setSecond(e.target.value)} type="number" id="second" />
          <br />
          <br />
          <label htmlFor="min">millisecond</label>
          <br />
          <input value={milSecond} onChange={(e) => setMilSecond(e.target.value)} type="number" id="millisecond" />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
      )}
      <Toaster />
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
