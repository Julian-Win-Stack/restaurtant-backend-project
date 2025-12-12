import getOrders from "./getOrders.js";
import getInventory from "./getInventory.js"
import getRecipes from "./getRecipes.js";

async function buildRecipe(recipes) {
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


async function calculateNeededInventory() {
    const orders = await getOrders()
    const recipeRecords = await getRecipes()
    const recipeMap = await buildRecipe(recipeRecords)
    
    const totalIngredient = {}
    for (const order of orders){
        const recipe = recipeMap[order.itemName]

        if (!recipe){
            console.log(`Sorry. We don't offer ${order.menuItem} here`)
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

async function shortageAmt() {
    const neededInventory = await calculateNeededInventory()
    const inventories = await getInventory()
    const shortage = {}
    const storage = {}
    for (const inventory of inventories){
        storage[inventory.ingredient] = inventory.amount
    }

    for (const item in neededInventory){
        if (neededInventory[item] > storage[item]){
            const calculation = neededInventory[item] - storage[item]
            shortage[item] = calculation
        }
    }

    return shortage

}

export default shortageAmt