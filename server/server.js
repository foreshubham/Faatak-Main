// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors()); // Allow frontend requests
app.use("/stream", express.static(path.join(__dirname, "stream"))); // HLS output folder

app.listen(8000, () => {
  console.log("🚀 HLS server running: http://localhost:8000/stream/stream.m3u8");
});
