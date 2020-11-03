import app from "./App";
const config = require("../../config.dev.json");

app.listen(config.SERVER_PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`server is listening on ${config.SERVER_PORT}`);
});
