export const getSignatureDoc = async (page: number): Promise<any> => {
  const url = page ? `http://localhost:5173/mocks/Insureance${page}.json` : `http://localhost:5173/mocks/Insureance.json`
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(`error => `, error)
  }
}