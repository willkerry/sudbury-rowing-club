import { config } from "./config";
import PicoSanity from "picosanity";

// Set up the client for fetching data in the getProps page functions
export const sanityClient = new PicoSanity(config);
