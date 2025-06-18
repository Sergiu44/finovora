import { NODE_ENV, EMAIL_SENDER } from "../constants/env";
import resend from "../../src/config/resend";

const getFromEmail = () => (NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER);
const getToEmail = (to: string) => (NODE_ENV === "development" && to ? to : "");

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async ({ to, subject, text, html }: Params) => {
  return await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
};
