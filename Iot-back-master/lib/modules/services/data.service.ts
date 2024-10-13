import DataModel from '../schemas/data.schema';
import { IData, Query } from "../models/data.model";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({ deviceId: deviceID }, { __v: 0, _id: 0 });
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async get(deviceId: string, limit: number = 1) {
        try {
            const data = await DataModel.find({ deviceId: deviceId }, { __v: 0, _id: 0 }).limit(limit).sort({ $natural: -1 });
            return data.reverse();
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllNewest() {
        const latestData: any = [];

        await Promise.all(
            Array.from({ length: 17 }, async (_, i) => {
                try {
                    const latestEntry = await DataModel.find({ deviceId: i }, { __v: 0, _id: 0 }).limit(1).sort({ $natural: -1 });
                    if (latestEntry.length) {
                        latestData.push(latestEntry[0]);
                    } else {
                        latestData.push({ deviceId: i });
                    }
                } catch (error) {
                    console.error(`Błąd podczas pobierania danych dla urządzenia ${i + 1}: ${error.message}`);
                    latestData.push({});
                }
            })
        );

        return latestData.sort((a: IData, b: IData) => a.deviceId - b.deviceId);
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await DataModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteDataInRange(deviceId: string, startDate: Date, endDate: Date) {
        try {
            console.log(`Attempting to delete data between ${startDate} and ${endDate} for device ${deviceId}`);
            const result = await DataModel.deleteMany({
                deviceId: parseInt(deviceId, 10),
                readingDate: { $gte: startDate, $lte: endDate }
            });
            console.log(`Deleted ${result.deletedCount} documents`);
        } catch (error) {
            console.error('Error deleting data in time range:', error);
            throw new Error('Failed to delete data in time range');
        }
    }

    public async getDataInRangeForAllDevices(startTime: Date, endTime: Date): Promise<IData[]> {
        try {
            const data = await DataModel.find({
                timestamp: { $gte: startTime, $lte: endTime }
            }).exec();
            return data;
        } catch (error) {
            console.error('Error fetching data in range for all devices:', error);
            throw new Error('Error fetching data in range for all devices');
        }
    }
}
