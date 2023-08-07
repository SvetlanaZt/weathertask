import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getCitiesData } from "../../api";
import {
  DEFAULT_LIST_LENGTH,
  HOME_URL,
  MINIMUM_POINTS,
  USER_RESPONSE_RANGE,
} from "../../constants";
import { CityData } from "../../constants/types";
import { mapCities } from "../../utils/cities";
import { kelvinToCelsius } from "../../utils/temperatureConverter";
import CityCard from "../CityCard";
import styles from "./styles.module.css";

function CityList() {
  const [cities, setCities] = useState<CityData[]>([]);

  const handleGetCitiesData = () =>
    getCitiesData().then((response) => {
      setCities(mapCities(response.list));
    });

  useLayoutEffect(() => {
    handleGetCitiesData();
  }, []);

  function checkWithinRange(
    originalValue: number,
    intendedValue: number
  ): boolean {
    const originalValueInCelsius = kelvinToCelsius(originalValue);

    const lowerBound = originalValueInCelsius - USER_RESPONSE_RANGE;
    const upperBound = originalValueInCelsius + USER_RESPONSE_RANGE;

    return intendedValue >= lowerBound && intendedValue <= upperBound;
  }

  const handleWrongAnswer = useCallback(() => {
    if (window.confirm("Assumption is wrong, want to make sure?")) {
      window.open(HOME_URL);
    }
  }, []);

  const handleCheckAnswer = useCallback(
    (cardIndex: number, answer: number) => {
      const currentCity = cities[cardIndex];
      const isCorrectAnswer = !checkWithinRange(currentCity.main.temp, answer);

      if (isCorrectAnswer) {
        handleWrongAnswer();
      }

      const updatedItems = cities.map((item, index) => {
        if (index === cardIndex) {
          return {
            ...item,
            isCorrectAnswer,
            answer,
            checked: true,
            active: false,
          };
        }

        if (index === cardIndex + 1) {
          return { ...item, active: true };
        }

        return item;
      });

      setCities(updatedItems);
    },
    [cities, handleWrongAnswer]
  );

  useEffect(() => {
    if (cities[DEFAULT_LIST_LENGTH - 1]?.checked) {
      const totalScore = cities.reduce(
        (total, city) => (city.isCorrectAnswer ? total + 1 : total),
        0
      );

      if (totalScore >= MINIMUM_POINTS) {
        window.confirm("You lose");
      } else {
        window.confirm("You win");
      }

      handleGetCitiesData();
    }
  }, [cities]);

  return (
    <div className={styles.grid}>
      {cities.map((item, index) => (
        <CityCard
          key={item.id}
          data={item}
          isDisabled={!item.active}
          onCheckAnswer={(answer: number) => handleCheckAnswer(index, answer)}
        />
      ))}
    </div>
  );
}

export default CityList;
