import React, {useState} from "react";
import WeatherPrediction from "../Prediction/WeatherPrediction";
import WaterLevel from "../Devices/WaterLevel";
import WaterLevelPrediction from "../Prediction/WaterLevelPrediction";

function WaterLevelApp()
{

        const [waterData, setWaterData] = useState([]);

        // Get the last entry's road temperature, if available
        const actualWaterLevel = waterData.length > 0 ? waterData[waterData.length - 1].WaterLevel : 0;

        return (
            <div>
                <WaterLevel setWaterData={setWaterData} />
                <WaterLevelPrediction waterData={waterData} actualWaterLevel={actualWaterLevel} />
            </div>
        );

}
export default WaterLevelApp;
