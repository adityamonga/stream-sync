import React from "react";
import "../App.css";
import VideoPlayer from "./VideoPlayer";
import { RouteComponentProps } from "react-router";
import { on } from "process";
import { VideoJsPlayerOptions } from "video.js";
const config = require("../config.dev.json");
const path = require("path");
const axios = require("axios");

interface Props extends RouteComponentProps<any> {}

export class Room extends React.Component {
  state: any = {
    room_id: "",
    fileUploaded: false,
    selectedFile: null,
  };
  videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: "",
        type: "application/x-mpegURL",
      },
    ],
  };

  constructor(props: Props) {
    super(props);

    if (props.match) {
      this.state.room_id = props.match.params.room_id;
      this.videoJsOptions.sources[0].src = path.join(
        config.NGINX_ENDPOINT,
        props.match.params.room_id,
        "out.m3u8"
      );
      console.log("props matched");
    }
  }

  handleFileChange = (event: any) => {
    this.setState({ selectedFile: event.target.files[0] }, () => {
      console.log("filechange::", this.state);
    });
  };

  handleUpload = async () => {
    let url = config.SERVER_ENDPOINT + "/upload";
    console.log("fileupload::", this.state);

    var formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("room_id", this.state.room_id);
    console.log(formData.get("room_id"));

    console.log("we do reach here");
    console.log(this.state);
    await fetch(url, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        room_id: this.state.room_id,
      },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        console.log("media loaded");
        this.setState({ fileUploaded: true });
      } else {
        throw new Error(response.statusText);
      }
    });
  };

  render() {
    return (
      <div>
        <div>
          {/* <form onSubmit={this.handleUpload}> */}
          <input
            type="file"
            onChange={this.handleFileChange}
            name="file"
          ></input>
          <button type="submit" onClick={this.handleUpload}>
            {/* <button type="submit" value="submit"> */}
            Upload
          </button>
          {/* </form> */}
        </div>
        <p> this is the state:: {this.state.fileUploaded ? "True" : "False"}</p>
        {this.state.fileUploaded ? (
          <VideoPlayer {...this.videoJsOptions} />
        ) : (
          <p>Nothing found</p>
        )}
      </div>
    );
  }
}
