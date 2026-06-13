// Simulates delivery outcomes for messages
// Returns a realistic random status progression for each message

const OUTCOMES = [
  { status: 'Delivered', weight: 55 },
  { status: 'Failed', weight: 15 },
  { status: 'Opened', weight: 20 },
  { status: 'Clicked', weight: 10 },
];

// Weighted random pick
export const randomOutcome = () => {
  const total = OUTCOMES.reduce((sum, o) => sum + o.weight, 0);
  let rand = Math.random() * total;
  for (const outcome of OUTCOMES) {
    rand -= outcome.weight;
    if (rand <= 0) return outcome.status;
  }
  return 'Delivered';
};

// Random delay between 2-12 seconds to simulate async delivery
export const randomDelay = () => Math.floor(Math.random() * 10000) + 2000;
