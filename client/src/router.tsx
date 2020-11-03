import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { Room } from "./components/Room";
import { createBrowserHistory } from "history";

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/room/:room_id" exact component={Room} />
        <Route path="/" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
}

export const history = createBrowserHistory({
  forceRefresh: true,
});
