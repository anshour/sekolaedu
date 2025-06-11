import { insertSeedData } from "~/database/seed";

async function runSeed() {
  try {
    console.log("Starting seed process...");
    await insertSeedData();
    console.log("Seed process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed process failed:", error);
    process.exit(1);
  }
}

runSeed();
