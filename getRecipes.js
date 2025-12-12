import pb from './pbClient.js'

async function getRecipes() {
    const recipes = await pb.collection('recipes').getFullList()
    return recipes
}

export default getRecipes
