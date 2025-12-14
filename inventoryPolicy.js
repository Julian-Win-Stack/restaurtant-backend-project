import pb from './pbClient.js'

const inventoryPolicy = {
  buns: { reorderPoint: 8, targetLevel: 30 },
  beef: { reorderPoint: 5, targetLevel: 15 },
  potatoes: { reorderPoint: 10, targetLevel: 30 },
  chicken: { reorderPoint: 5, targetLevel: 20 },
  lettuce: { reorderPoint: 10, targetLevel: 30 },
};

export default inventoryPolicy