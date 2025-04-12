type Config = {
  debugMode?: boolean;
  maintenance?: boolean;

  logInteractions?: {
    logInteractions: boolean;
    logCommandOptions: boolean;
  };

  logPrismaReqs?: boolean;
};

const config: Config = {
  debugMode: false,
  maintenance: false,

  logInteractions: {
    logInteractions: false,
    logCommandOptions: false,
  },

  logPrismaReqs: false,
} satisfies Config;

export default config;
