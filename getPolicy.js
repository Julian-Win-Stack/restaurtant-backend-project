import pb from './pbClient.js'

async function getPolicy() {
  const rows = await pb.collection("inventory_policy").getFullList()
  const policyMap = {}
  for (const row of rows){
    policyMap[row.ingredient] = {
      reorderPoint: row.reorderPoint,
      targetLevel: row.targetLevel
    }
  }
  return policyMap
}

export default getPolicy