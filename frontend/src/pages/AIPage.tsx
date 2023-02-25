import React, { useState } from "react";
import { getAIResponse } from "../api/leaderboard";

export default function AIPage() {
  const [generatedText, setGeneratedText] = useState<string>("");

  const handleGeneration = async () => {
    const response: any = getAIResponse(123, generatedText);

    setGeneratedText(response.data);
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
        />
        <button
          className=" flex justify-center items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg mt-10 uppercase  hover:bg-blue-900 lg:w-1/3"
          onClick={handleGeneration}
        >
          Generate
        </button>
      </div>
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
