import React, { DetailedHTMLProps, useRef, VideoHTMLAttributes } from "react";
import "../App.css";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import { appendScript } from "../utils";

import { RouteComponentProps } from "react-router";

// interface Props extends RouteComponentProps<any> {}
// interface Props {
//   videoJsOptions: videojs.PlayerOptions;
// }
interface Props extends RouteComponentProps<any | VideoJsPlayerOptions> {
  src: any;
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

    // instantiate Video.js
    this.player = videojs(this.videoNode, this.options).ready(() => {
      console.log("onPlayerReady", this);
    });
    appendScript("videojs.hls.min.js");
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
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js"
          ></video>
          <p>the video player is loaded..</p>
        </div>
      </div>
    );
  }
}
