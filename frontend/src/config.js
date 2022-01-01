import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://hopin-api.vercel.app/api"
});