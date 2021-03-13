import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import backImg from "./Static/image/header.png";
import { Buttons } from "./Components/Buttons";
import { Rotate } from "./Pages/Rotate";
import { Crop } from "./Pages/Crop";
import { Merge } from "./Pages/Merge";
import { Split } from "./Pages/Split";
import { Convert } from "./Pages/Convert";
import { Navbar } from "./Components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Switch>

          <Route path="/rotate">
            <Rotate />
          </Route>

          <Route path="/crop">
            <Crop />
          </Route>

          <Route path="/merge">
            <Merge />
          </Route>

          <Route path="/split">
            <Split />
          </Route>

          <Route path="/convert">
            <Convert />
          </Route>

          <Route path="/">
            {/* Home page */}

            <div className="backImg leading-normal text-indigo-400  bg-cover bg-fixed">
              <div className="h-full">
                <Navbar />

                <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                  <div className="flex-row">
                    <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start ">
                      <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                        Use
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                          PDFConverter
                </span>
                to play with PDF!
              </h1>
                      <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">
                        Upload or drop pdf and use PDFConverter features
              </p>
                    </div>
                    <div className="flex ">

                      <Buttons />

                    </div>
                  </div>
                  <div className="w-full pt-72 pb-72 text-sm text-center md:text-left fade-in">
                    <a
                      className="text-gray-500 no-underline hover:no-underline"
                      href="#"
                    >
                      &copy; App 2021
              </a>
              - Template by
              <a
                      className="text-gray-500 no-underline hover:no-underline"
                      href="#"
                    >
                      Bhavik@PDFTools
              </a>
                  </div>
                </div>
              </div>
            </div>
          </Route>

        </Switch>
      </Router >
    </>
  );
}

export default App;
