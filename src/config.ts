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
    logInteractions: true,
    logCommandOptions: true,
  },

  logPrismaReqs: true,
} satisfies Config;

export default config;
