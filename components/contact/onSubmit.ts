import axios from "axios";

/**
 * The `onSubmit` handler function for the contact form. Sends the form data to
 * the API endpoint. 
 * 
 * This *could* be handled by the native `form` element, but:
 * 1. an non-JS user is unlikely to get this far
 * 2. this approach allows us much better error handling
 */
const onSubmit = async (values: any) => {
    await axios
      .post("/api/send", values)
      .then((res) => res)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
    return {
        success: true,
    };
}

export default onSubmit;