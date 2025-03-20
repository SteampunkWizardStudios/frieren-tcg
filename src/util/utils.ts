export const createCountdownTimestamp = (timeLimit: number): string => {
  const timeLimitSeconds = Math.floor(Date.now() / 1000) + timeLimit;
  return `<t:${timeLimitSeconds}:R>`;
};
