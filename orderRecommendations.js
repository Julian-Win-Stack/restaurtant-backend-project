import pb from './pbClient.js'


async function orderRecommendations(shortage) {
    for (const item in shortage){
        await pb.collection('purchase_recommendations').create({
            ingredient:item,
            amount:shortage[item]

        })
    }
}

export default orderRecommendations