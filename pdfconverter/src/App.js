import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import backImg from "./Static/image/header.png";
function App() {
  return (
    <>
      <Router>
        <Switch>

          <Route path="/rotate">
            {/* <Rotate /> */}
          </Route>

          <Route path="/crop">
            {/* <Crop /> */}
          </Route>

          <Route path="/merge">
            {/* <Merge /> */}
          </Route>

          <Route path="/split">
            {/* <Split /> */}
          </Route>

          <Route path="/convert">
            {/* <Convert /> */}
          </Route>

          <Route path="/">
            {/* Home page */}
          </Route>

        </Switch>
      </Router >
    </>
  );
}

export default App;
