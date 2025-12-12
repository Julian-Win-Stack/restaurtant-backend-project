import pb from './pbClient.js'

async function getInventory() {
    const inventory = await pb.collection('Inventory').getFullList()
    return inventory
    
}


export default getInventory