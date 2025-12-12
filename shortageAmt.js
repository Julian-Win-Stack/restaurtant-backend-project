import getOrders from "./getOrders.js";
import getInventory from "./getInventory.js"

const recipes = {
    "Chicken Sandwich":{chicken:1,buns:1,lettuce:1},
    "Veggie Burger":{buns:1,beef:1},
    "Fries":{potatoes:2}
}

async function calculateNeededInventory() {
    const orders = await getOrders()

    const totalIngredient = {}

    for (const order of orders){
        const recipe = recipes[order.itemName]
        const qty = order.quantity
        for (const ingredient in recipe){
            const totalAmount = recipe[ingredient] * qty

            if (!totalIngredient[ingredient]){
                totalIngredient[ingredient] = 0

            totalIngredient[ingredient] += totalAmount
            }
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
const result = await shortageAmt()
console.log (result)
export default shortageAmt