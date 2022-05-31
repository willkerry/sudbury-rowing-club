import axios from "axios";

const onSubmit = async (values: any) => {
    await axios
        .post("/api/send", values)
        .then((res) => res)
        .catch((err) => {
            console.log(err.response);
            console.log(err.response.data.message);
            throw new Error(err.response.data.message);
        });
    return {
        success: true,
    };
}

export default onSubmit;