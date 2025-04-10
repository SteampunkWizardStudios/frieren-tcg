type Config = {
  debugMode?: boolean;
  logPrismaReqs?: boolean;
  maintainance?: boolean;
};

const config: Config = {
  debugMode: false,
  logPrismaReqs: false,
  maintainance: false,
} satisfies Config;

export default config;
