import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import { getPossibleFriends } from "../api/leaderboard";
import { eventNames } from "process";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const convert = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export default function TeamFinder() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [name, setName] = useState("");
  const [people, setPeople] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const [modalData, setModalData] = useState<any>();

  const handleOpenModal = (id: number) => {
    setModalData(people[id]);
    setIsOpen(true);
  };

  const handleSearch = async () => {
    setSearched(true);
    const response: any = await getPossibleFriends();

    if (!enabled) {
      setPeople(response.data);
    } else {
      setPeople(convert(response.data));
    }

    if (name.length > 0) {
      const found = people.filter((person: any) =>
        person.name.toLowerCase().includes(name)
      );
      setPeople(found.length > 0 ? found : []);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1
            id="modal-modal-title"
            className="text-center font-bold text-2xl my-3 mb-6"
          >
            Details
          </h1>
          {modalData && (
            <>
              <h2 className="">
                Name: <span className="font-bold">{modalData.name}</span>
              </h2>
              <h2 className="">
                Email: <span className="font-bold">{modalData.email}</span>
              </h2>
              <h2 className="">
                Kill count:{" "}
                <span className="font-bold">{modalData.killcount}</span>
              </h2>
              <h2 className="">
                Assist:{" "}
                <span className="font-bold">{modalData.assistcount}</span>
              </h2>
              <h2 className="">
                Deah: <span className="font-bold">{modalData.deathcount}</span>
              </h2>
              <h2 className="">
                Overall ELO Score:{" "}
                <span className="font-bold">{modalData.elo}</span>
              </h2>
            </>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full justify-center items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg mt-7 uppercase hover:p-4 hover:px-5 hover:bg-blue-900"
          >
            Close
          </button>
        </Box>
      </Modal>
      <div className="absolute top-0 flex justify-left w-full mt-16 pl-6 lg:mt-24 lg:pl-16">
        <div
          className="flex items-center"
          onClick={() => window.history.back()}
        >
          <i className="fas fa-arrow-left text-white text-2xl cursor-pointer mr-2"></i>
          <h1 className="text-white font-bold cursor-pointer invisible lg:visible">
            Back
          </h1>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-10">
        <h1 className="text-white text-center text-6xl font-bold mb-10">
          TeamFinder
        </h1>

        <div className="flex items-center justify-center w-full">
          <div className="border border-white border-3 rounded-lg w-full mx-3 lg:w-1/2 lg:mx-0">
            <h1 className="text-center text-lg text-white my-3 mb-10">
              Choose you preferences
            </h1>
            <div className="flex justify-center items-center">
              <p className="text-white font-bold text-lg">Team mate</p>
              <div className="flex justify-end items-center w-1/2">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enabled}
                    readOnly
                  />
                  <div
                    onClick={() => {
                      setEnabled(!enabled);
                    }}
                    className="w-11 h-6 bg-red-500 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                  ></div>
                  <span className="ml-2 text-sm font-medium text-white">
                    {enabled ? "Enemy" : "Teammate"}
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-white font-bold text-lg">Name (optional)</p>
              <div className="flex justify-end items-center w-1/2 mt-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-1/2 h-10 border border-white rounded-lg ml-5 ,"
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="flex w-1/2  justify-center mb-5 mt-16 items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg mt-7 uppercase hover:p-4 hover:px-5 hover:bg-blue-900 lg:w-1/3"
                onClick={handleSearch}
              >
                Find people
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col mt-12 w-full lg:w-1/2 ">
          {people.length > 0
            ? people.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border border-white border-2 rounded-lg w-11/12 p-5 mb-5"
                >
                  <div className="flex w-full lg:w-1/3 lg:justify-between">
                    <p className="text-white font-bold mr-3 lg:mr-0">
                      {person.name}
                    </p>
                    <p className="text-white font-bold">{person.elo}</p>
                  </div>
                  <button
                    className="flex justify-center items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg uppercase hover:bg-blue-900"
                    onClick={() => handleOpenModal(index)}
                  >
                    Detail
                  </button>
                </div>
              ))
            : searched && (
                <p className="text-center text-white font-bold">
                  No teammate was found
                </p>
              )}
        </div>
      </div>
    </>
  );
}
