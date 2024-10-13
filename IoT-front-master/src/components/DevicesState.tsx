import './DeviceState.css';
import Tile from "./shared/Tile";
import { useParams } from 'react-router-dom';
import { EntryModel } from '../models/entry.model';

interface DeviceStateProps {
    data: EntryModel[];
}

function DevicesState({ data }: DeviceStateProps) {
    let { id } = useParams();
    const checkMeasurementDifference = (currentValue: number, baseValue: number): boolean => {
        if (baseValue === 0) return false;
        const difference = (currentValue - baseValue) / baseValue;
        return difference >= 0.2;
    };

    const isSignificantDifference = (currentData: EntryModel, baseData: EntryModel): boolean => {
        return (
            checkMeasurementDifference(currentData.temperature ?? 0, baseData.temperature ?? 0) ||
            checkMeasurementDifference(currentData.pressure ?? 0, baseData.pressure ?? 0) ||
            checkMeasurementDifference(currentData.humidity ?? 0, baseData.humidity ?? 0)
        );
    };

    const baseDevice = data[0];

    return (
        <>
            {data && baseDevice && <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'center' }}>
                {data.map((tile) => {

                    const isActive = id !== undefined && tile.deviceId === +id;
                    let isMeasurementDifferent = isSignificantDifference(tile, baseDevice);

                    return (
                        <div key={tile.deviceId} className="tile-device">
                            <Tile
                                id={tile.deviceId}
                                active={isActive}
                                hasData={Boolean(tile.readingDate)}
                                data={tile}
                                isMeasurementDifferent={isMeasurementDifferent}
                            />
                        </div>
                    );
                })}
            </div>}
        </>
    )
}

export default DevicesState;
