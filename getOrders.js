import pb from './pbClient.js'

async function getOrders() {
    const orders = await pb.collection('Orders').getFullList();
    return orders
}

export default getOrders