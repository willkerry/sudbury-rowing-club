import SafetyComponent from "@/components/safety/safety-component";
import React from "react";

export const revalidate = 300; // 5 minutes

const Safety = async () => <SafetyComponent />;

export default Safety;
