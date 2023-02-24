import React, { useState } from "react";
import { Modal, Box } from "@mui/material";

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

  const handleOpenModal = () => {
    setIsOpen(true);
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
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-white text-center text-6xl font-bold mb-10">
          LeaderBoard
        </h1>
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
