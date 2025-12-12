import orderRecommendations from './orderRecommendations.js'
import shortageAmt from './shortageAmt.js'

async function main() {
    console.log("=== Running Inventory Calculator ===");
    const shortage = await shortageAmt()
    console.log('Shortages found: ',shortage)

    await orderRecommendations(shortage)

    console.log("Recommendations saved.");
}

main()