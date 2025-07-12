import pino from "pino";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import config from "~/config";

const inServerless = config.inServerless;

const logger = pino({
  level: config.loggerLevel,
  ...(inServerless
    ? {} // Use default JSON logging for production
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
          },
        },
      }),
});

export default logger;
