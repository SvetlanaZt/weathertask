import { City, CityData } from "../constants/types";


export const mapCities = (data: City[]): CityData[] => data.map((city, index) => ({
    ...city,
   active: index === 0 ? true: false,
   checked: false,
   answer:  null,
   isCorrectAnswer: null,
 }))