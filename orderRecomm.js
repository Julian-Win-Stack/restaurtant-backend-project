import pb from './pbClient.js'
import shortageAmt from './shortageAmt.js'
const shortageRecord = await shortageAmt()

async function deleteRecord() {
    const existing = await pb.collection('purchase_recommendations').getFullList()
    for(const rec of existing){
        await pb.collection('purchase_recommendations').delete(rec.id)
    }
}

async function orderRecommendations(shortage) {
    for (const item in shortage){
        await pb.collection('purchase_recommendations').create({
            ingredient:item,
            shortageAmount:shortage[item]

        })
    }
}

deleteRecord()
orderRecommendations(shortageRecord)