import env from "react-dotenv";
import cityData from "../city.list.json";
import { BASE_URL, DEFAULT_LIST_LENGTH } from "../constants";
import { City } from "../constants/types";

const CITIES: City[] = cityData as City[];

const cityIds: number[] = CITIES.map((city) => city.id);

function shuffleArray() {
  return cityIds.sort(() => Math.random() - 0.5);
}

async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getCitiesData() {
  const shuffledCities = shuffleArray();
  const selectedCities = shuffledCities.slice(0, DEFAULT_LIST_LENGTH).join(",");

  const url = `${BASE_URL}/data/2.5/group?id=${selectedCities}&appid=${env.WEATHER_API_KEY}`;

  try {
    const jsonData = await fetchData(url);
    return jsonData;
  } catch (error) {
    throw error;
  }
}
