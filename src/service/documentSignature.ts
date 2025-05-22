export const getSignatureDoc = async (): Promise<any> => {
  try {
    const response = await fetch('http://localhost:5173/mocks/Insureance.json')
    const data = await response.json()
    return data
  } catch (error) {
    console.log(`error => `, error)
  }
}