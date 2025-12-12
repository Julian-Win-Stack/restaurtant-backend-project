import { AsyncAuthStore } from 'pocketbase'
import pb from './pbClient.js'

async function invertOrder() {
    const newOrder = await pb.collection('Orders').create({
        customerName: "Charlie",
        itemName: "Beef Noddles",
        quantity: 3,
        orderDate: "2025-12-01 10:13:00"
    })

    console.log("New Order Created")
    console.log(newOrder)
}

async function insertInventory() {
    const newInventory = await pb.collection('Inventory').create({
        ingredient:"beef",
        amount:0
    })
    console.log("Pushed new inventory")
    console.log(newInventory)
}
insertInventory()
