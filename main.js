import orderRecommendations from "./orderRecomm.js";
import reOrderPlan from "./reOrderPlan.js";

async function main() {
  try {
    console.log("=== Running Inventory Calculator ===");

    const plan = await reOrderPlan();
    console.log("Reorder plan:", plan);

    if (Object.keys(plan).length === 0) {
      console.log("No recommendations to save.");
      return;
    }

    await orderRecommendations(plan);

    console.log("Recommendations saved.");
  } catch (err) {
    console.error("Pipeline failed:", err);
    process.exit(1);
  }
}

main();
