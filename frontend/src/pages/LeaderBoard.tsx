import React, { useEffect, useState } from "react";
import { Modal, Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { DateRange } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Dayjs } from "dayjs";
import { getLeaderBoardData } from "../api/leaderboard";

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

export default function LeaderBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  const [gameName, setGameName] = useState<string>("League of Legends");

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const getLeaderBoard = async (
      gameName: string,
      convertedToUnixBegin: number,
      convertedToUnixEnd: number
    ) => {
      const response = await getLeaderBoardData(
        gameName,
        convertedToUnixBegin,
        convertedToUnixEnd
      );

      console.log(response);
    };

    if (value[0] && value[1]) {
      const convertedToUnixBegin = Math.floor(
        new Date(value[0]?.format("DD/MM/YYYY")).getTime() / 1000
      );
      const convertedToUnixEnd = Math.floor(
        new Date(value[1]?.format("DD/MM/YYYY")).getTime() / 1000
      );
      if (convertedToUnixBegin && convertedToUnixEnd) {
        getLeaderBoard(gameName, convertedToUnixBegin, convertedToUnixEnd);
      }
    }
  }, [gameName, value]);

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
          <h2 className="">
            Name: <span className="font-bold">Jone Doe</span>
          </h2>
          <h2 className="">
            Game: <span className="font-bold">Cs GO</span>
          </h2>
          <h2 className="">
            Win count: <span className="font-bold">12313</span>
          </h2>
          <h2 className="">
            Kill count: <span className="font-bold">123</span>
          </h2>
          <h2 className="">
            Assist: <span className="font-bold">123</span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full justify-center items-center p-3 px-4 text-white font-bold bg-blue-800 rounded-lg mt-7 uppercase hover:p-4 hover:px-5 hover:bg-blue-900"
          >
            Close
          </button>
        </Box>
      </Modal>
      <Modal
        open={isOpen2}
        onClose={() => setIsOpen2(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateRangePicker
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Box>
      </Modal>
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
      <div className="flex justify-center items-center flex-col mt-10">
        <h1 className="text-white text-center text-6xl font-bold mb-10">
          LeaderBoard
        </h1>

        <div className="flex flex-row items-center w-7/12 my-4">
          <h1 className="text-white text-center text-2xl font-bold mr-5">
            Game:
          </h1>
          <div className="flex justify-between w-full">
            <select
              className="w-full bg-transparent border-b-2 border-white text-white text-2xl font-bold mr-4"
              defaultValue={gameName}
              onChange={(e) => setGameName(e.target.value)}
            >
              <option value="lol">League of Legends</option>
              <option value="csgo">CS GO</option>
              <option value="valorant">Valorant</option>
              <option value="pubg">PlayerUnknown's Battlegrounds</option>
              <option value="teamfighttactics">Teamfight Tactics</option>
            </select>

            <input
              type="text"
              className="w-1/2 bg-transparent border-b-2 border-white text-white text-lg font-bold placeholder:text-white focus:outline-none"
              placeholder="Pick a date..."
              value={
                value[0] && value[1]
                  ? value[0]?.format("DD/MM/YYYY") +
                    " - " +
                    value[1]?.format("DD/MM/YYYY")
                  : ""
              }
              onClick={() => {
                setIsOpen2(true);

                const interval = setInterval(() => {
                  const element = document.querySelector(
                    ".MuiPickerStaticWrapper-content"
                  );
                  const child = element?.firstChild;
                  const secondChild = child?.firstChild;
                  const newDiv = document.createElement("div");
                  if (secondChild) {
                    secondChild?.replaceWith(newDiv);
                    clearInterval(interval);
                  }
                }, 5);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full mx-2 lg:w-3/4 lg:mx-0">
          <div className="overflow-x-auto">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-cyan-900 uppercase "
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-cyan-900 uppercase "
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-cyan-900 uppercase "
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-cyan-900 uppercase "
                      >
                        Kill count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-cyan-900 uppercase "
                      >
                        Full score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr
                      className="cursor-pointer hover:bg-sky-800"
                      onClick={handleOpenModal}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">
                        1
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        Jone Doe
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        jonne62@gmail.com
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        832
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        1232131
                      </td>
                    </tr>
                    <tr
                      className="cursor-pointer hover:bg-sky-800"
                      onClick={handleOpenModal}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">
                        2
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        Jone Doe
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        jonne62@gmail.com
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        334
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        4435324234
                      </td>
                    </tr>
                    <tr
                      className="cursor-pointer hover:bg-sky-800"
                      onClick={handleOpenModal}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">
                        3
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        Jone Doe
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        jonne62@gmail.com
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        324
                      </td>
                      <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                        42343242
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
