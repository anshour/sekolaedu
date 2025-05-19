import pino from "pino";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const getLogFileName = () =>
  path.join(logDir, `${dayjs().format("YYYY-MM-DD")}.log`);

const logger = pino({ level: "info" }, pino.destination(getLogFileName()));

export default logger;
