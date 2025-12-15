import getOrders from "./getOrders.js";
import getInventory from "./getInventory.js";
import getRecipes from "./getRecipes.js";
import inventoryPolicy from "./inventoryPolicy.js";

function buildRecipe(recipes) {
    const recipeMap = {}
    for (const recipe of recipes){
        const itemName = recipe.itemName
        const ingredient = recipe.ingredient
        const amountPerUnit = recipe.amountPerUnit

        if (!recipeMap[itemName]){
            recipeMap[itemName] = {}
        }

        recipeMap[itemName][ingredient] = amountPerUnit
    }

    return recipeMap
}

async function calculateNeededInventory() {
    const orders = await getOrders()
    const recipes = await getRecipes()
    const recipeMap = await buildRecipe(recipes)

    const neededInventory = {}

    for(const order of orders){
        const ingredients = recipeMap[order.itemName]
        const qty = order.quantity

        for (const ingredient in ingredients){
            const ingredientEachOrder = ingredients[ingredient]

            const totalUnitsNeeded = ingredientEachOrder * qty

            if(!neededInventory[ingredient]){
                neededInventory[ingredient] = 0
            }
            neededInventory[ingredient] += totalUnitsNeeded

        }
    }
    return neededInventory
}




async function reOrderPlan() {
   const inventories = await getInventory()
    const neededInventory = await calculateNeededInventory()
    
    const storage = {}
    const plan = {}

   for (const inventory of inventories){

    if (!storage[inventory.ingredient]){
        storage[inventory.ingredient] = inventory.amount
    }

    
}
    const allIngredients = new Set([
        ...Object.keys(storage),
        ...Object.keys(neededInventory),
        ...Object.keys(inventoryPolicy)
    ])


    for(const ingredient of allIngredients){
        const needed = neededInventory[ingredient] ?? 0
        const available = storage[ingredient] ?? 0

        const shortageAmount = Math.max(0, needed - available)

        const policy = inventoryPolicy[ingredient] ?? {reorderPoint: 0 , targetLevel: 0}
        const reorderPoint = policy.reorderPoint ?? 0
        const targetLevel = policy.targetLevel ?? 0

        const shouldReorder = available <= reorderPoint

        const recommendedOrderAmount = shouldReorder ? Math.max(0, targetLevel - available)
        :0

        let policyWarning = null
        let policyError = null
        const hasPolicy = inventoryPolicy[ingredient] !== undefined && inventoryPolicy[ingredient] !== null
        if (!hasPolicy){
            policyWarning = `Policy rules are missing for ${ingredient}`
        }
        if (reorderPoint > targetLevel){
            policyError = `There is an error in the policy rule of ${ingredient}. "Re-order point" is being larger than "Target Level"!`
        }

        if (shortageAmount > 0 || recommendedOrderAmount > 0 || shouldReorder || policyError || policyWarning){
            plan[ingredient] = {
                needed,
                available,
                shortageAmount,
                reorderPoint,
                targetLevel,
                shouldReorder,
                recommendedOrderAmount,
                policyError,
                policyWarning

            }
        }
    }

    return plan
}
const result = await reOrderPlan()
console.log(result)





