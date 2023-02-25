import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="fadeUp absolute bottom-0 flex justify-center w-full mb-3 ">
      <h3 className="text-white text-center text-lg">
        Don't have a team?{" "}
        <Link
          to="/teamfinder"
          className="font-bold cursor-pointer hover:underline"
        >
          Find one
        </Link>
      </h3>
    </div>
  );
}