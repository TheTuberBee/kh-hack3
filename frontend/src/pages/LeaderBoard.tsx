import React, { useEffect, useState } from "react";
import { Modal, Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { DateRange } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Dayjs } from "dayjs";
import { getLeaderBoardData } from "../api/leaderboard";
import { getAllGames } from "../api/game";

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
  const [gameName, setGameName] = useState<string>();
  const [games, setGames] = useState<any[]>([]);

  const [allPlayers, setAllPlayers] = useState<any>([]);
  const [modalData, setModalData] = useState<string[]>();
  const [tags, setTags] = useState<string[]>();
  const [isTournament, setIsTournament] = useState(false);

  const handleOpenModal = (index: number) => {
    setModalData(Object.values(allPlayers[index].factors));
    setIsOpen(true);
  };

  useEffect(() => {
    const getGames = async () => {
      const response: any = await getAllGames();
      setGameName(response.data[0].name);
      setGames(response.data);
    };

    getGames();
  }, []);

  useEffect(() => {
    const getLeaderBoard = async (
      gameId: number,
      convertedToUnixBegin: number,
      convertedToUnixEnd: number
    ) => {
      const response: any = await getLeaderBoardData(
        gameId,
        convertedToUnixBegin,
        convertedToUnixEnd,
        isTournament
      );

      setTags(response.data.game.factor_names);
      setAllPlayers(response.data.players);
    };

    if (!isTournament) {
      if (value[0] && value[1]) {
        const convertedToUnixBegin = Math.floor(
          new Date(value[0].toDate()).getTime() / 1000
        );
        const convertedToUnixEnd = Math.floor(
          new Date(value[1].toDate()).getTime() / 1000
        );

        console.log(games.find((game) => game.name === gameName).id);
        if (convertedToUnixBegin && convertedToUnixEnd && gameName) {
          getLeaderBoard(
            games.find((game) => game.name === gameName).id,
            convertedToUnixBegin,
            convertedToUnixEnd
          );
        }
      }
    } else {
      if (gameName) {
        const unixBeginOneMonthEarlier = Math.floor(
          new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime() /
            1000
        );
        const unixEndNow = Math.floor(new Date().getTime() / 1000);

        getLeaderBoard(
          games.find((game) => game.name === gameName).id,
          unixBeginOneMonthEarlier,
          unixEndNow
        );
      }
    }
  }, [gameName, games, isTournament, value]);

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
              {modalData.map((data: string, index: number) => {
                return (
                  <h2 className="" key={index}>
                    {tags && tags[index]}:{" "}
                    <span className="font-bold">{data}</span>
                  </h2>
                );
              })}
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
          {isTournament ? "Tournament" : "Leaderboard"}
        </h1>
        <div className="flex justify-center items-center w-10/12 lg:mx-0 lg:w-1/4 border border-4 border-white rounded-lg p-3 mb-3">
          <p className="text-white font-bold text-lg w-full mr-4">
            Tournament mode
          </p>
          <div className="flex justify-end items-center w-1/2">
            <label className="inline-flex relative items-center mr-5 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isTournament}
                readOnly
              />
              <div
                onClick={() => {
                  setAllPlayers([]);
                  setIsTournament(!isTournament);
                }}
                className="w-11 h-6 bg-red-500 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
              ></div>
            </label>
          </div>
        </div>
        <div className="flex flex-row items-center w-7/12 my-4">
          <h1 className="text-white text-center text-2xl font-bold mr-5">
            Game:
          </h1>
          <div className="flex justify-between w-full">
            <select
              className="w-full bg-transparent border-b-2 border-white text-white text-2xl font-bold mr-4"
              onChange={(e) => {
                setGameName(e.target.value);
              }}
            >
              {games.map((game, index) => (
                <option key={index} value={game.name}>
                  {game.name}
                </option>
              ))}
            </select>

            {!isTournament && (
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
            )}
          </div>
        </div>
        <div className="flex flex-col w-full mx-2 lg:w-3/4 lg:mx-0  mb-8">
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
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allPlayers && allPlayers.length > 0 ? (
                      allPlayers.map((player: any, index: number) => (
                        <tr
                          className="cursor-pointer hover:bg-sky-800"
                          onClick={() => handleOpenModal(index)}
                          key={index}
                        >
                          <td className="px-6 py-4 text-sm font-bold text-white whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                            {player.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                            {player.rating}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <h1 className="text-white font-bold mt-3">No data</h1>
                    )}
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
