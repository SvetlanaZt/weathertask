import { Button, Col, Input, Row, Space } from "antd";
import { Card } from "antd";
import { ChangeEvent, useMemo, useState } from "react";
import { CityData } from "../../constants/types";
import { kelvinToCelsius } from "../../utils/temperatureConverter";
import styles from "./styles.module.css";

type CityCardProps = {
  data: CityData;
  isDisabled?: boolean;
  onCheckAnswer: (answer: number) => void;
};

function CityCard({ data, isDisabled = true, onCheckAnswer }: CityCardProps) {
  const [inputValue, setInputValue] = useState<number>();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^-?\d.]/g, "");
    setInputValue(Number(numericValue.slice(0, 3)));
  };

  const handleSubmit = () => {
    if (!inputValue) return;
    onCheckAnswer(inputValue);
  };

  const { realTemperature, answer } = useMemo(() => {
    const realTemperature = kelvinToCelsius(data.main.temp);

    return {
      realTemperature,
      answer: data.answer,
    };
  }, [data]);

  return (
    <Card title={data.name} className={styles.card}>
      {!isDisabled && (
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="this is placeholder"
            onChange={handleInputChange}
            value={inputValue}
          />
          <Button disabled={!inputValue} type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Space.Compact>
      )}

      {data.checked && (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p>Real temperature</p>
            <p>{realTemperature}</p>
          </Col>
          <Col span={12}>
            <p>Your Answer</p>
            <p>{answer}</p>
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default CityCard;
