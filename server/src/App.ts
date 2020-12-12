import * as express from "express";
import axios from "axios";
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const config = require("../../config.dev.json");
const fs = require("fs");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");

class App {
  public express;
  public upload;
  UNIQUE_ID_API = "https://helloacm.com/api/random/?n=16";
  corsOptions = {
    origin: config.CLIENT_ENDPOINT,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  constructor() {
    this.express = express();
    this.mountRoutes();
    this.express.use(bodyParser.json()); // to support JSON-encoded bodies
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    // let upload = multer({ dest: config.MEDIA_DIR_BASE + "/" });
    // this.express.use(multer());
    // var storage = multer.diskStorage({
    //   destination: function (req, file, cb) {
    //     cb(null, config.MEDIA_DIR_BASE + req.headers.room_id);
    //   },
    //   filename: function (req, file, cb) {
    //     cb(null, file.originalname);
    //   },
    // });

    // this.upload = multer({ storage: storage });
    // var upload = multer({ storage: storage });
    // console.log(this.upload);
    console.log("App initiated");
  }

  private mountRoutes(): void {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(config.MEDIA_DIR_BASE, req.headers.room_id));
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    // this.upload = multer({ storage: storage });
    var upload = multer({ storage: storage });

    const router = express.Router();
    router.get("/", (req, res) => {
      res.send("Server running..");
    });

    router.get("/create_room", (req, res) => {
      axios
        .get(this.UNIQUE_ID_API)
        .then((response) => {
          res.send(JSON.stringify({ room_id: response.data }));
          let room_id = response.data;
          let dir_name = path.join(config.MEDIA_DIR_BASE, room_id);

          console.log(dir_name + " created..");

          if (!fs.existsSync(dir_name)) {
            fs.mkdirSync(dir_name);
          }
        })
        .catch((err) => {
          console.log("failed with err: " + err);
        });
    });
    router.post("/upload", upload.single("file"), (req, res) => {
      console.log("room_id -> " + req.headers.room_id);
      console.log(req.file);
      console.log("got it..");
      let output_filename = convert_to_hls(req.file.destination, req.file.path);
      res.send("got it...");
    });

    function convert_to_hls(filepath, filename) {
      let output_filename = path.join(filepath, "out.m3u8");
      const command = ffmpeg(filename)
        .videoBitrate(1024)
        .videoCodec("libx264")
        .audioBitrate("128k")
        .audioChannels(2)
        .addOption("-hls_time", 10)
        .addOption("-hls_list_size", 0)
        .on("end", function () {
          console.log("file has been converted succesfully");
        })
        .on("error", function (err) {
          console.log("an error happened: " + err.message);
        })
        .save(output_filename);

      console.log("converted and written to -> " + output_filename);
      return output_filename;
    }

    this.express.use(cors());
    this.express.use("/", router);
  }
}

export default new App().express;
