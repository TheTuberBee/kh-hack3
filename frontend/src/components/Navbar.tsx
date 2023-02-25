import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const loggedIn = useSelector((state: any) => state.loggedIn);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("uid");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="relative flex flex-wrap items-center bg-tansparent justify-between px-2 py-3 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white md:text-lg lg:text-xl"
              to={loggedIn ? "/" : "/login"}
              onClick={() => {
                document.documentElement.requestFullscreen();
              }}
            >
              EsportManager 2023 - ELO System
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col w-full lg:flex-row list-none lg:ml-auto lg:w-1/4">
              {!loggedIn ? (
                <>
                  <li className="w-full flex justify-center my-4 lg:my-0">
                    <Link to="/login">
                      <button className="p-2 px-5 bg-sky-800 text-white font-bold rounded-lg hover:bg-sky-700">
                        Login
                      </button>
                    </Link>
                  </li>
                  <li className="w-full flex justify-center">
                    <Link to="/register">
                      <button className="p-2 px-5 bg-sky-800 text-white font-bold rounded-lg hover:bg-sky-700">
                        Register
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="w-full flex justify-center items-center my-4 lg:my-0 lg:-mr-12">
                    <Link to="/profile" className="text-white text-2xl">
                      <span className="text-white text-lg mr-2 lg:hidden">
                        Account{" "}
                      </span>
                      <i className="fas fa-user"></i>
                    </Link>
                  </li>
                  <li className="w-full flex justify-center">
                    <button
                      className="p-2 px-5 bg-sky-800 text-white font-bold rounded-lg hover:bg-sky-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
