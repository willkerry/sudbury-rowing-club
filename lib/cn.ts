import { clsx, type ClassValue } from "clsx";

const cn = (...inputs: ClassValue[]) => clsx(inputs);

export default cn;
