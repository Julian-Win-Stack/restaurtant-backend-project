import getOrders from "./getOrders.js";
import getInventory from "./getInventory.js"
import getRecipes from "./getRecipes.js";
import inventoryPolicy from "./inventoryPolicy.js";

// Convert recipe rows into a lookup map:
// { "Chicken Sandwich": { buns: 1, chicken: 1, lettuce: 1 }, ... }
// This lets us expand orders -> ingredient demand quickly (O(1) lookup per item).
function buildRecipe(recipes) {
    const map = {}
    for (const row of recipes){
        const itemName = row.itemName
        const ingredient = row.ingredient
        const amount = row.amountPerUnit

        if (!map[itemName]){
            map[itemName] = {}
        }

        map[itemName][ingredient] = amount

    }
    return map
    
    
}

// Reads all orders, looks up each menu item's recipe, and returns total ingredient demand:
// { ingredientName: totalUnitsNeeded }
async function calculateNeededInventory() {
    const orders = await getOrders()
    const recipeRecords = await getRecipes()
    const recipeMap = buildRecipe(recipeRecords)
    
    const totalIngredient = {}
    for (const order of orders){
        const recipe = recipeMap[order.itemName]

        // If an order references a menu item with no recipe, skip it (prevents crash / bad math).
        if (!recipe){
            console.log(`Sorry. We don't offer ${order.itemName} here`)
            continue
        }

        const qty = order.quantity

        for (const ingredient in recipe){
            const amountPerUnit = recipe[ingredient]
            const totalAmount = amountPerUnit * qty

            if (!totalIngredient[ingredient]){
                totalIngredient[ingredient] = 0
            }

            totalIngredient[ingredient] += totalAmount
        }
    }
    return totalIngredient

}

// Builds a reorder plan per ingredient by combining:
// demand (orders+recipes), current stock (inventory), and purchasing rules (inventoryPolicy).
// Returns: { ingredientName: { needed, available, shortageAmount, shouldReorder, recommendedOrderAmount, ... } }
async function reOrderPlan() {
    const neededInventory = await calculateNeededInventory()
    const inventories = await getInventory()


    // Convert inventory records array into a lookup map for fast access:
    // storage["buns"] -> available amount
    const storage = {}
    for (const inventory of inventories){
        storage[inventory.ingredient] = inventory.amount
    }

    const plan = {}

    // Union of ingredient names from three sources so we don't miss anything:
    // - neededInventory: ingredients demanded by orders
    // - storage: ingredients currently tracked in inventory
    // - inventoryPolicy: ingredients with reorder rules
    const allIngredients = new Set([
        ...Object.keys(storage),
        ...Object.keys(neededInventory),
        ...Object.keys(inventoryPolicy)
    ])

    for (const ingredient of allIngredients){
        const needed = neededInventory[ingredient] ?? 0
        const available = storage[ingredient] ?? 0
  

        const hasPolicy = inventoryPolicy[ingredient] !== undefined && inventoryPolicy[ingredient] !== null

        const policy = inventoryPolicy[ingredient] ?? {reorderPoint: 0, targetLevel: 0}
        const reorderPoint = policy.reorderPoint ?? 0
        const targetLevel = policy.targetLevel ?? 0

        let policyError = null
        let policyWarning = null

        if(!hasPolicy){
            policyWarning = "missing policy!"
        }

        // Policy sanity check: after reordering, targetLevel should be >= reorderPoint.
        // If not, config is inconsistent and could lead to negative recommended orders.
        if (targetLevel < reorderPoint){
            policyError = `Error detected! -> targetLevel (amount - ${targetLevel}) < reorderPoint (amount - ${reorderPoint})`
        }

        // shortageAmount: immediate inability to fulfill demand (needed - available)
        // recommendedOrderAmount: purchasing decision when stock is low (refill to targetLevel)
        const shortageAmount = Math.max(0, needed - available)
        const shouldReorder = available <= reorderPoint

        // If policy is misconfigured, targetLevel - available can go negative.
        // We still clamp to 0 to avoid impossible order quantities.
        const recommendedOrderAmount = shouldReorder
        ? Math.max(0, targetLevel - available)
        : 0

        // Output if anything is actionable OR misconfigured
        if (shortageAmount > 0 || recommendedOrderAmount > 0 || policyError || policyWarning){
            plan[ingredient] = {
                needed,
                available,
                shortageAmount,
                reorderPoint,
                targetLevel,
                shouldReorder,
                recommendedOrderAmount,
                policyWarning,
                policyError,
            }
        }

    }
    return plan
}



export default reOrderPlan