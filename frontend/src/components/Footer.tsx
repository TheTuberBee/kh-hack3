import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  firstLoad: boolean;
}

export default function Footer({ firstLoad }: FooterProps) {
  return (
    <div
      className={`${
        firstLoad && "fadeUp"
      } absolute bottom-0 flex justify-center w-full mb-6`}
    >
      <h3 className="text-white text-center text-xl">
        Don't have a team?{" "}
        <Link
          to="/teamfinder"
          className="font-bold text-2xl cursor-pointer hover:underline"
        >
          Find one
        </Link>
      </h3>
    </div>
  );
}
