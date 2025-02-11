import axios from "axios";

export default async function getAccessToken() {
    try {
        const response = await axios.post("https://backend.csaposapp.hu/api/auth/refresh-token", { refreshToken : JSON.parse(localStorage.getItem("refreshToken")) });
        const data = response.data.accessToken;
        localStorage.setItem("accessToken", JSON.stringify(data));
        return true;
    } 
    catch (error) {
        console.log(error);
        return false;
    }
}