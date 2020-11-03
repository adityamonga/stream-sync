import * as express from "express";
import axios from "axios";
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const config = require("../../config.dev.json");
const fs = require("fs");
const bodyParser = require("body-parser");

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
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, config.MEDIA_DIR_BASE + req.headers.room_id);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    this.upload = multer({ storage: storage });
    console.log(this.upload);
  }

  private mountRoutes(): void {
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
    router.post("/upload", this.upload.single(""), (req, res) => {
      // router.post("/upload", this.upload.single("file"), (req, res) => {
      console.log(req.headers.room_id);
      console.log(req.body);
      console.log(req.file);

      res.send("got it..");
    });

    this.express.use(cors());
    this.express.use("/", router);
  }
}

export default new App().express;
