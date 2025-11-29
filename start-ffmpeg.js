// start-ffmpeg.js
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Ensure HLS output folder exists
const outDir = path.join(__dirname, "stream");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// YOUR CAMERA RTSP URL (Based on your screenshot)
const rtspUrl = "rtsp://192.168.0.115:554/avstream/channel=1/stream=1.sdp";
// If username+password:
// const rtspUrl = "rtsp://admin:pass@192.168.0.115:554/avstream/channel=1/stream=0.sdp";

console.log("Starting LIVE FFmpeg...");

const args = [
  "-rtsp_transport", "tcp",
  "-i", rtspUrl,

  // ↓↓↓ REAL LIVE SETTINGS ↓↓↓
  "-fflags", "nobuffer",
  "-flags", "low_delay",
  "-analyzeduration", "0",
  "-probesize", "32",
  "-rw_timeout", "5000000",
  "-use_wallclock_as_timestamps", "1",
  "-max_delay", "0",

  // ↓↓↓ Encode for web ↓↓↓
  "-vf", "fps=20",
  "-c:v", "libx264",
  "-preset", "veryfast",
  "-tune", "zerolatency",

  // ↓↓↓ HLS Output ↓↓↓
  "-hls_time", "1",
  "-hls_list_size", "3",
  "-hls_flags", "delete_segments+append_list",
  "-f", "hls",
  path.join(outDir, "stream.m3u8")
];

const ffmpeg = spawn("ffmpeg", args);

ffmpeg.stdout.on("data", (data) => console.log("FFmpeg:", data.toString()));
ffmpeg.stderr.on("data", (data) => console.log("FFmpeg ERROR:", data.toString()));
ffmpeg.on("close", () => console.log("FFmpeg stopped"));
