import { VerifyEmailTemplate } from "@/emails/verification-email";
import { render } from "jsx-email";
import { Resend } from "resend";
import { env } from "@/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

type BasicEmailProps = {
  email: string;
  title: string;
};

export async function SendVerifyEmail({
  email,
  title,
  link,
}: BasicEmailProps & { link: string }) {
  const template = <VerifyEmailTemplate link={link} />;
  const html = await render(template);

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    html,
    to: email,
    subject: title,
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
