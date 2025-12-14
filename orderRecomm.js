import pb from "./pbClient.js";

async function deleteRecord() {
  const existing = await pb.collection("purchase_recommendations").getFullList();
  for (const rec of existing) {
    await pb.collection("purchase_recommendations").delete(rec.id);
  }
}

async function orderRecommendations(plan) {
  await deleteRecord(); 

  for (const ingredient in plan) {
    const row = plan[ingredient];

    await pb.collection("purchase_recommendations").create({
      ingredient,
      needed: row.needed,
      available: row.available,
      shortageAmount: row.shortageAmount,
      reorderPoint: row.reorderPoint,
      targetLevel: row.targetLevel,
      shouldReorder: row.shouldReorder,
      recommendedOrderAmount: row.recommendedOrderAmount,
      policyWarning: row.policyWarning ?? null,
      policyError: row.policyError ?? null,
    });
  }
}

export default orderRecommendations;
