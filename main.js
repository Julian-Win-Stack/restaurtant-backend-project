import orderRecommendations from "./orderRecomm.js";
import reOrderPlan from "./reOrderPlan.js";

async function main() {
  try {
    const plan = await reOrderPlan();
    await orderRecommendations(plan);

    if (Object.keys(plan).length === 0) {
      console.log("No recommendations to save.");
      return;
    }

    console.log("=== Running Inventory Calculator ===");
    console.log("Reorder plan:", plan);
    console.log("Recommendations saved.");
    
  } catch (err) {
    console.error("Pipeline failed:", err);
    process.exit(1);
  }
}

main();
