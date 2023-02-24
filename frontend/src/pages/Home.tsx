import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <h1
          className="fadeDown text-white font-bold uppercase text-5xl mt-36 md:text-7xl"
          id="mainTitle"
        >
          Welcome
        </h1>
        <h2 className="fadeLeft text-white font-bold uppercase text-3xl mt-2 md:text-5xl">
          in ESPORT
        </h2>
        <Link
          to="/leaderboard"
          className="fadeRight p-2 px-4 text-white font-bold rounded-lg mt-5 uppercase bg-blue-800 hover:p-3 hover:px-5 hover:bg-blue-900"
        >
          Check out the board
        </Link>
      </div>
      <Footer />
    </>
  );
}
