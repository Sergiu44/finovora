import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

export const emailConfig = {
    sender: EMAIL_SENDER,
    isDev: NODE_ENV === "development",
}