import axios from "../config/axios";
import React, { useState } from "react";

export default function ImageRecognizer() {
  const [fileName, setFileName] = useState<string>("No file selected");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [team1, setTeam1] = useState<string | null>(null);
  const [team2, setTeam2] = useState<string | null>(null);
  const [score1, setScore1] = useState<string | null>(null);
  const [score2, setScore2] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setSearched(true);
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const request = await axios({
        method: "post",
        url: "/fifa_match_upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      let toParseData = request.data;
      if (toParseData.startsWith("ANSWER:")) {
        toParseData = toParseData.substring(7);
      }
      if (toParseData.startsWith("END")) {
        toParseData = toParseData.substring(3);
      }

      const obj = JSON.parse(request.data);

      setTeam1(obj.team1);
      setTeam2(obj.team2);
      setScore1(obj.score1);
      setScore2(obj.score2);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const selectedImage = (e: any) => {
    setFileName(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-center text-white font-bold mt-6 text-3xl">
        Upload a photo of your FIFA score
      </h1>
      <h2 className="text-center text-white font-bold text-lg">
        Simply take a photo of your score on your device (e.g. PS4, XBOX) and
        upload it here.
      </h2>
      <div className="absolute top-0 flex justify-left w-full mt-16 lg:mt-24 lg:pl-16">
        <div
          className="flex items-center"
          onClick={() => window.history.back()}
        >
          <i className="fas fa-arrow-left text-white text-2xl cursor-pointer mr-2 ml-4 lg:ml-0"></i>
          <h1 className="text-white font-bold cursor-pointer invisible lg:visible">
            Back
          </h1>
        </div>
      </div>
      <div
        id="sampledownloadbutton"
        className="flex justify-center items-center flex-col mt-2 mb-6 w-full lg:w-1/2"
      >
        <a
          href="https://i.ibb.co/d6WGvBF/Screenshot-2023-02-26-074512.png"
          download="sample_fifa_score.jpg"
          className="p-2 px-4 text-white font-bold rounded-lg mt-5 uppercase bg-blue-800 hover:bg-blue-900"
          target="_blank"
          rel="noreferrer"
        >
          Download sample image
        </a>
      </div>

      <form
        className="flex justify-center items-center flex-col mt-10"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          id="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => selectedImage(e)}
        />
        <label
          htmlFor="file"
          className={`cursor-pointer p-4 px-6 text-white font-bold rounded-lg mt-5 uppercase mr-3 border-4 border-blue-800 ${
            fileName !== "No file selected" && "bg-blue-800"
          } hover:bg-blue-900`}
        >
          {fileName}
        </label>
        <button
          type="submit"
          className="p-4 px-6 text-white font-bold rounded-lg mt-5 uppercase bg-blue-800 hover:bg-blue-900"
          {...(fileName === "No file selected" && { disabled: true })}
        >
          Analyze
        </button>
      </form>
      {loading && (
        <div className="flex justify-center items-center flex-col mt-12 w-full lg:w-1/2">
          <p className="text-white text-center text-lg">Generating...</p>
        </div>
      )}

      {team1 != null && team2 != null && score1 != null && score2 != null ? (
        <div className="flex justify-center items-center border-2 border-white rounded-lg p-2 flex-col mt-12 w-full lg:w-1/3">
          <h1 className="text-white font-bold text-center text-2xl mb-2">
            Your results are here and approved{" "}
            <span className="text-xl">&#127881;</span>{" "}
          </h1>
          <p className="text-white text-center text-lg">
            <span className="font-bold">Team 1:</span> {team1}
          </p>
          <p className="text-white text-center text-lg">
            <span className="font-bold">Team 2:</span> {team2}
          </p>
          <p className="text-white text-center text-lg">
            <span className="font-bold">Score 1:</span> {score1}
          </p>
          <p className="text-white text-center text-lg">
            <span className="font-bold">Score 2:</span> {score2}
          </p>
        </div>
      ) : (
        searched &&
        !loading && (
          <div className="flex justify-center items-center border-2 border-white rounded-lg p-2 flex-col mt-12 w-full lg:w-1/3">
            <h1 className="text-white font-bold text-center text-2xl mb-2">
              Please take a more clear photo of your score
            </h1>
          </div>
        )
      )}
    </div>
  );
}
