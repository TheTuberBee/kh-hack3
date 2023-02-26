import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AICircle from "../components/AICircle";
import Footer from "../components/Footer";

export default function Home() {
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      // firstLoad.current = false;
      return;
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h1
          className={`${
            firstLoad.current && "fadeDown"
          } text-white font-bold uppercase text-5xl mt-40 md:text-8xl`}
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
        <div className="flex items-center flex-col lg:flex-row">
          <Link
            to="/leaderboard"
            className={`${
              firstLoad.current && "fadeRight"
            } p-4 px-6 text-white font-bold rounded-lg mt-5 uppercase mr-3 bg-blue-800 hover:p-5 hover:px-7 hover:bg-blue-900`}
          >
            Check out the board
          </Link>
          <Link
            to="/imagerecognizer"
            className={`${
              firstLoad.current && "fadeLeft"
            } p-4 px-6 text-white font-bold rounded-lg mt-5 uppercase bg-blue-800 hover:p-5 hover:px-7 hover:bg-blue-900`}
          >
            Scan your score with AI
          </Link>
        </div>
      </div>
      <Footer firstLoad={firstLoad.current} />
      <AICircle />
    </>
  );
}
