import React, { useState } from "react";
import { getAIResponse } from "../api/leaderboard";

export default function AIPage() {
  const [generatedText, setGeneratedText] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(30);
  const [name, setName] = useState("");

  const handleGeneration = async () => {
    setButtonClicked(true);

    const interval = window.setInterval(() => {
      if (countDown > 0) {
        setCountDown((prev) => prev - 1);
      }
    }, 1000);

    const response: any = getAIResponse(123, name);

    setGeneratedText(response.data);
    setButtonClicked(false);
    return () => window.clearInterval(interval);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-center text-white font-bold text-4xl my-12 uppercase">
        AI generated summary
      </h1>
      <div className="flex justify-center items-center flex-col lg:flex-row">
        <input
          type="text"
          className="mr-4 text-center text-white text-lg w-96 h-10 mt-12 bg-transparent rounded-lg pl-4 border-b-4 border-white focus:outline-none placeholder:text-white mx-3 lg:mx-0 lg:mr-5"
          placeholder="Enter your RIOT ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className=" flex justify-center items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg mt-10 uppercase  hover:bg-blue-900 lg:w-1/3"
          onClick={handleGeneration}
        >
          Generate
        </button>
      </div>
      {buttonClicked && (
        <div className="flex justify-center items-center flex-col mt-12 w-full lg:w-1/2">
          <p className="text-white text-lg">Generating...</p>
          <p className="text-white text-lg">Time left: {countDown}</p>
        </div>
      )}
      {generatedText.length > 0 && (
        <div
          id="longtextcontainer"
          className="flex items-center mt-12 w-full lg:w-1/2 border border-white border-2 rounded-lg p-5"
        >
          <p className="text-white text-lg">{generatedText}</p>
        </div>
      )}
    </div>
  );
}
