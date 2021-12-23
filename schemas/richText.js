import { IoImageOutline, IoChatboxOutline, IoInformationCircleOutline } from "react-icons/io5";

export default {
  name: "richText",
  type: "array",
  of: [
    { type: "block" },
    { type: "figure", icon: IoImageOutline },
    { type: "quote", icon: IoChatboxOutline },
    { type: "note", icon: IoInformationCircleOutline },
  ],
};
