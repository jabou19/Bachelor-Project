import React, {useState} from "react";
import WaterLevel from "../Devices/WaterLevel";
import WaterLevelPrediction from "../Prediction/WaterLevelPrediction";
import PersonCounter from "../Devices/PersonCounter";
import PersonCounteprediction from "../Prediction/PersonCounteprediction";

function PersonCounterAPP(){
    const [personCounterData, setPersonCounterData] = useState([]);

    // Get the last entry's road temperature, if available
    const actualPersonCounter = personCounterData.length > 0 ? personCounterData[personCounterData.length - 1].PersonCount : 0;

    return (
        <div>
            < PersonCounter setPersonCounterData={setPersonCounterData} />
            < PersonCounteprediction PersonCounterData={personCounterData} actualPersonCounter={actualPersonCounter} />
        </div>
    );
}
export default PersonCounterAPP;
