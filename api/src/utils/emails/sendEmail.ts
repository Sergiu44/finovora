import { z } from "zod";
import resend from "../../config/resend";
import { emailConfig } from "./config";

type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const emailParamsSchema = z.object({
  to: z.string().email(),
  html: z.string(),
  subject: z.string(),
  text: z.string(),
})

const getFromEmail = () => emailConfig.sender
const getToEmail = (to: string) => to;

const validateEmailParams = (params: EmailParams) => {
  emailParamsSchema.parse(params);
}

export const sendEmail = async ({ to, subject, text, html }: EmailParams) => {
  validateEmailParams({ to, subject, text, html });

  return await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
};
