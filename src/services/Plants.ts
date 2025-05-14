import { Plants } from "../types/ApiTypes";

async function getPlants(): Promise<Plants[]> {
  try {
    const response = await fetch("/data/api.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData: Plants[] = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default getPlants;

export async function addPlantToGarden(plantId: string): Promise<boolean> {
  
  console.log(`Añadiendo planta con ID: ${plantId}`);
  return true;
}

export async function removePlantFromGarden(plantId: string): Promise<boolean> {
  
  console.log(`Eliminando planta con ID: ${plantId}`);
  return true;
}

export async function updatePlant(plant: Plants): Promise<boolean> {
  
  console.log(`Actualizando planta: ${plant.common_name}`);
  return true;
}

export async function getUserGarden(): Promise<string[]> {
  
  return ["1", "2", "3"];
}




