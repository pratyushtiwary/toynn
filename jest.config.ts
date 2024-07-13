import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "../$1",
  },
};

export default config;
