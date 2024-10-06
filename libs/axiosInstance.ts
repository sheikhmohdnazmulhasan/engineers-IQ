import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://engineers-iq.vercel.app/api'
});

export default axiosInstance