import axios, { AxiosInstance } from "axios";

export default class ApiClient {
    axiosInstance: AxiosInstance;
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://66dff3132fb67ac16f27acda.mockapi.io/",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}