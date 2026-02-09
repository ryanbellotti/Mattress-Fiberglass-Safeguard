export interface MattressDbEntry {
  brand: string;
  risk: string;
  fg: boolean;
}

export const MATTRESS_DB: MattressDbEntry[] = [
  { brand: "Tulo", risk: "high", fg: true },
  { brand: "Zinus", risk: "medium", fg: false }, // Post-2024
  { brand: "Linenspa", risk: "high", fg: true },
  { brand: "Purple", risk: "none", fg: false },
  { brand: "Tempur-Pedic", risk: "medium", fg: true },
  { brand: "Casper", risk: "low", fg: false }
];
