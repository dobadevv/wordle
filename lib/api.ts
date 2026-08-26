import axios from "axios";

export const api = axios.create({
    baseURL: "https://wordle.votee.dev:8000"
});
