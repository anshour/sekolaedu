import pino from "pino";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

//!BUG : LOG TO FILE DOESNWORK IN GOOGLE CLOUD RUN (MUST BE TO /TMP FOLDER)
// const logDir = path.join(process.cwd(), "logs");
// if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
// const getLogFileName = () =>
//   path.join(logDir, `${dayjs().format("YYYY-MM-DD")}.log`);

// const logger = pino({ level: "info" }, pino.destination(getLogFileName()));

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "yyyy-mm-dd HH:MM:ss",
    },
  },
});

export default logger;
