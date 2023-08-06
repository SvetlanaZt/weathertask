export type City = {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
};

export type CityData = City & {
  isCorrectAnswer: boolean | null;
  active: boolean;
  checked: boolean;
  answer: number | null;
};
