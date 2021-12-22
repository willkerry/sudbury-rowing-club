import PicoSanity from "picosanity";
import { config } from "./config";

// Set up the client for fetching data in the getProps page functions
const sanityClient = new PicoSanity(config);

export default sanityClient;
