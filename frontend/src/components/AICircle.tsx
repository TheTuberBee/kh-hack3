import React from "react";
import { Link } from "react-router-dom";

export default function AICircle() {
  return (
    <div className="bounce absolute right-0 bottom-0 mb-8">
      <Link
        to="/aipage"
        className="cursor-pointer p-8 mr-8 w-9 h-9 rounded-full flex justify-center items-center bg-blue-800 text-white font-bold text-lg"
      >
        <p>AI</p>
      </Link>
    </div>
  );
}
