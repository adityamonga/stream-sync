import React from "react";
import "../App.css";
import VideoPlayer from "./VideoPlayer";
import { RouteComponentProps } from "react-router";
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
        // src: "http://localhost:8080/stream/out.m3u8",
        src: null,
        type: "application/x-mpegURL",
      },
    ],
  };
  upload_element: any;

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

    // let upload_element = document.getElementById('single_upload')
    this.upload_element = React.createRef();
    var formData = new FormData(this.upload_element);
    // formData.append("file", this.state.selectedFile);
    formData.append("room_id", this.state.room_id);
    console.log(formData.get("room_id"));
    console.log(formData.get("selectedFile"));

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        room_id: this.state.room_id,
      },
      body: formData,
    });
  };

  render() {
    return (
      <div>
        {/* {this.state.fileUploaded ? (
          <VideoPlayer {...this.videoJsOptions} />
        ) : ( */}
        <div>
          {/* <form name="single_upload" id="single_upload"> */}
          <input
            type="file"
            onChange={this.handleFileChange}
            name="file"
            ref={this.upload_element}
          ></input>
          <button type="submit" onClick={this.handleUpload}>
            Upload
          </button>
          {/* </form> */}
        </div>
        {/* )} */}
      </div>
    );
  }
}
