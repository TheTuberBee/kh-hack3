import React from "react";
import { Link } from "react-router-dom";

export default function AICircle() {
  return (
    <div className="bounce absolute flex w-full justify-end bottom-0 mb-8 cursor-pointer">
      <Link
        to="/aipage"
        className="p-8 mr-8 w-9 h-9 rounded-full flex justify-center items-center bg-blue-800 text-white font-bold text-lg"
      >
        <p>AI</p>
      </Link>
    </div>
  );
}
