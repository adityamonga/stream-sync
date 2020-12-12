import React, { DetailedHTMLProps, useRef, VideoHTMLAttributes } from "react";
import "../App.css";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import { appendScript } from "../utils";

import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps<any | VideoJsPlayerOptions> {
  sources: any;
  autoplay: boolean;
  controls: boolean;
}

export default class VideoPlayer extends React.Component {
  private player?: VideoJsPlayer;
  private videoNode?: any | HTMLVideoElement;
  private options?: Props;

  constructor(props: Props) {
    super(props);
    this.options = props;
    this.player = undefined;
    this.videoNode = undefined;
    this.state = {};
  }

  componentDidMount() {
    console.log("these are props");
    console.log(this.options);

    let optionsCopy;
    if (this.options) {
      optionsCopy = { ...this.options };
      delete optionsCopy.sources;
      console.log(optionsCopy);
    } else {
    }
    // instantiate Video.js
    this.player = videojs(this.videoNode, optionsCopy).ready(() => {
      console.log("onPlayerReady", this);
    });
    // appendScript("videojs-http-streaming.min.js");
    // appendScript("videojs.hls.min.js");
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>
        <div data-vjs-player>
          <video ref={(node) => (this.videoNode = node)} className="video-js">
            <source src={this.options?.sources[0].src}></source>
          </video>
        </div>
        <script src="videojs-http-streaming.min.js"></script>
        <script src="videojs.hls.min.js"></script>
        <p>source is {this.options?.sources[0].src}</p>
      </div>
    );
  }
}
