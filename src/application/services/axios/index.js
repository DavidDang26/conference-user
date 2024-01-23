import axios from "axios";

export const ConferencePaymentAxios = () => {
    const instance = axios.create({
        baseURL: "http://localhost:5000",
    });

    instance.interceptors.response.use(
        (response) => {
            console.log(response.data, "Call to Conference payment result");
            return response;
        },
        (error) => {
            console.error(error, undefined, "Call to Conference payment failed");
            throw new Error("Conference payment failed");
        }
    );

    return instance;
};
