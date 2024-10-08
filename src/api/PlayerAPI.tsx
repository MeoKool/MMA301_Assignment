import { Products } from "../models/Products";
import ApiClient from "./APIClient";


export class PlayerAPI extends ApiClient {
    //Get all pefumes
    async getAllPlayer(): Promise<Products[]> {
        const response = await this.axiosInstance.get<Products[]>('/Assignment');
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch player");
        }
    }

    // get a single pefume by ID
    async PlayerById(id: string): Promise<Products[]> {
        const response = await this.axiosInstance.get<Products[]>(`/Assignment/${id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch player by id");
        }
    }

}