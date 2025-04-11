type Config = {
  debugMode?: boolean;
  logPrismaReqs?: boolean;
  maintenance?: boolean;
};

const config: Config = {
  debugMode: false,
  logPrismaReqs: false,
  maintenance: false,
} satisfies Config;

export default config;
