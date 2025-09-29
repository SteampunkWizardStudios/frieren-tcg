import prismaClient from "@prismaClient";

const BAN_CONFIG_ID = "ban-config";
const MAX_ALLOWED_BANS = 4;

export const getBanConfig = async () => {
  return prismaClient.banConfig.upsert({
    where: { id: BAN_CONFIG_ID },
    update: {},
    create: {},
  });
};

export const setBanMaxCount = async (maxCount: number) => {
  const clamped = Math.max(0, Math.min(MAX_ALLOWED_BANS, maxCount));
  await getBanConfig();
  return prismaClient.banConfig.update({
    where: { id: BAN_CONFIG_ID },
    data: { maxCount: clamped },
  });
};

export const setBanModes = async (modes: {
  enableRanked?: boolean;
  enableUnranked?: boolean;
}) => {
  await getBanConfig();
  return prismaClient.banConfig.update({
    where: { id: BAN_CONFIG_ID },
    data: {
      ...(modes.enableRanked !== undefined
        ? { enabledRanked: modes.enableRanked }
        : {}),
      ...(modes.enableUnranked !== undefined
        ? { enabledUnranked: modes.enableUnranked }
        : {}),
    },
  });
};

export const resolveBanCountForMatch = async (options: {
  isRanked: boolean;
  isCustom: boolean;
  requestedBanCount?: number;
}) => {
  if (options.isCustom) {
    return Math.max(
      0,
      Math.min(MAX_ALLOWED_BANS, options.requestedBanCount ?? 0)
    );
  }

  const banConfig = await getBanConfig();
  if (banConfig.maxCount <= 0) {
    return 0;
  }

  const enabled = options.isRanked
    ? banConfig.enabledRanked
    : banConfig.enabledUnranked;

  return enabled ? banConfig.maxCount : 0;
};
