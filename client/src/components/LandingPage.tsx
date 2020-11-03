import React from "react";
import "../App.css";
import { history } from "../router";
const config = require("../config.dev.json");

export class LandingPage extends React.Component {
  state = {
    room_id: null,
  };

  createRoom = async () => {
    console.log("creating room..");
    let url = config.SERVER_ENDPOINT + "/create_room";
    let response = await fetch(url);
    let data = await response.json();
    this.setState({ room_id: data.room_id }, () => {
      history.push("/room/" + this.state.room_id);
    });
  };

  render() {
    return (
      <div className="landing">
        <div className="button-wrapper">
          <button className="button cta-button" onClick={this.createRoom}>
            Create Room
          </button>
        </div>
      </div>
    );
  }
}
