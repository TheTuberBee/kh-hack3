import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.color = "#ffffff";
ChartJS.defaults.borderColor = "#ffffff";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
};

const labels = [
  "Monday",
  "Thuesday",
  "Thirsday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const data = {
  labels,
  datasets: [
    {
      label: "PLayed hours",
      data: [65, 59, 80, 81, 56, 55, 40, 12],
      borderColor: "#bfdbfe",
      backgroundColor: "#bfdbfe",
    },
  ],
};

export const data2 = {
  labels,
  datasets: [
    {
      label: "Kills per game",
      data: [15, 29, 40, 55, 56, 55, 60, 92],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function Profile() {
  return (
    <main className="profile-page">
      <section className="relative block" style={{ height: "300px" }}>
        <div className="absolute top-0 w-full h-full bg-center bg-cover">
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-transparent"
          ></span>
        </div>
      </section>
      <section className="relative py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-l from-cyan-700 to-blue-700 w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={
                        "https://wallpapers.com/images/featured/4co57dtwk64fb7lv.jpg"
                      }
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      className="bg-blue-800 active:bg-bink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-200">
                        22
                      </span>
                      <span className="text-sm text-gray-200">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-200">
                        10
                      </span>
                      <span className="text-sm text-gray-200">Kills</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-200">
                        89
                      </span>
                      <span className="text-sm text-gray-200">Deaths</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-5">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-white mb-2">
                  Zsombiiii
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-gray-200 font-bold uppercase">
                  #CSGO #League of Legends
                </div>
                <div className="mb-2 text-gray-400 mt-10">
                  Rusher | Gamer | Streamer
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-gray-200 text-center">
                <h1 className="text-center text-white font-bold text-2xl mb-3">
                  Statistics
                </h1>
                <div className="flex justify-center w-full flex-col lg:flex-row">
                  <div className="w-full lg:w-1/2">
                    <Line options={options} data={data} />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <Line options={options} data={data2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
