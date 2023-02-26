import axios from "../config/axios";
import React, { useState } from "react";

export default function ImageRecognizer() {
  const [fileName, setFileName] = useState<string>("No file selected");
  const [selectedFile, setSelectedFile] = useState<any>();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    try {
      await axios({
        method: "post",
        url: "/fifa_match_upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const selectedImage = (e: any) => {
    setFileName(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-center text-white font-bold text-3xl">
        Upload a photo of your score
      </h1>
      <h2 className="text-center text-white font-bold text-lg">
        Simply take a photo of your score on your device (e.g. PS4, XBOX) and
        upload it here.
      </h2>
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
    </div>
  );
}
