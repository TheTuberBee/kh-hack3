import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h1
          className={`${
            firstLoad.current && "fadeDown"
          } text-white font-bold uppercase text-5xl mt-36 md:text-8xl`}
          id="mainTitle"
        >
          Welcome
        </h1>
        <h2
          className={`${
            firstLoad.current && "fadeLeft"
          } text-white font-bold uppercase text-3xl mt-2 md:text-5xl`}
        >
          to ESPORT
        </h2>
        <Link
          to="/leaderboard"
          className={`${
            firstLoad.current && "fadeRight"
          } p-2 px-4 text-white font-bold rounded-lg mt-5 uppercase bg-blue-800 hover:p-3 hover:px-5 hover:bg-blue-900`}
        >
          Check out the board
        </Link>
      </div>
      <Footer firstLoad={firstLoad.current} />
    </>
  );
}
