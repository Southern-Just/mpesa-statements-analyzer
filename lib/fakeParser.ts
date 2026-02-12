import { Transaction } from "@/types";

const NAMES = [
  "John Mwangi",
  "Jane Wanjiru",
  "Safaricom Ltd",
  "Peter Otieno",
  "Naivas Supermarket",
];

const DESCRIPTIONS = [
  "Send Money",
  "Paybill Payment",
  "Till Purchase",
  "Airtime Purchase",
  "Withdrawal",
  "Deposit",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate() {
  const start = new Date(2024, 0, 1).getTime();
  const end = new Date().getTime();
  return new Date(randomBetween(start, end)).toISOString().split("T")[0];
}

export function generateFakeTransactions(filter?: string): Transaction[] {
  const count = randomBetween(6, 18);

  return Array.from({ length: count }).map(() => {
    const name =
      filter && filter !== "name"
        ? NAMES[randomBetween(0, NAMES.length - 1)]
        : NAMES[randomBetween(0, NAMES.length - 1)];

    return {
      date: randomDate(),
      amount: randomBetween(200, 25000),
      name,
      description: DESCRIPTIONS[randomBetween(0, DESCRIPTIONS.length - 1)],
    };
  });
}
