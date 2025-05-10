import { Plants } from "../types/ApiTypes";

async function  getPlants(): Promise<Plants[]> {
  try {
    const response = await fetch("http://192.168.131.101:8080/dca/api/plants", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData: Plants[] = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
    // acá podría hacer el return
  }
}

export default getPlants;

// export async function getPlants(): Promise<any> {
//     return [];
// }
