import React from "react";
import { Switch, Route } from "react-router-dom";

import DashBoard from "../pages/Dashboard";
import Repository from "../pages/Repository/index";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={DashBoard} />
      <Route path="/Repository/:repository+"  component={Repository} />
    </Switch>
  );
};

export default Routes;
