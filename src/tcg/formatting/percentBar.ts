const filledChar = "█";
const middleChar = "▓";
const emptyChar = "░";

const totalBars = 22;

export default function percentBar(current: number, max: number): string {
  const percent = (current / max) * 100;

  const filledBars = Math.round((percent / 100) * totalBars);
  const emptyBars = totalBars - filledBars;

  let bar = "";

  for (let i = 0; i < filledBars; i++) {
    bar += filledChar;
  }

  if (filledBars < totalBars) {
    bar += middleChar;
  }

  for (let i = 0; i < emptyBars - 1; i++) {
    bar += emptyChar;
  }

  return bar;
}
