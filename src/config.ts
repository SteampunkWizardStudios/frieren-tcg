type Config = {
  debugMode?: boolean;
  logPrismaReqs?: boolean;
};

const config: Config = {
  debugMode: false,
  logPrismaReqs: false,
} satisfies Config;

export default config;
