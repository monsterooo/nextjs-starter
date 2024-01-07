import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "jsx-email";

interface VercelInviteUserEmailProps {
  link?: string;
}

const baseUrl = "https://jsx.email/assets/demo/";

export const VerifyEmailTemplate = ({ link }: VercelInviteUserEmailProps) => {
  const previewText = "Verify your email.";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] border-separate rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}plaid-logo.png`}
                width="212"
                height="88"
                alt="nextjs-starter"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              VERIFY YOUR EAMIL
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Click the link below to complete the email verification.
            </Text>
            <Section className="my-[32px] text-center">
              <Button
                className="cursor-pointer rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Verification email
              </Button>
            </Section>
            <Text className="!text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="!text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerifyEmailTemplate.PreviewProps = {
  link: "https://localhost:3000/verify/email",
} as VercelInviteUserEmailProps;

export default VerifyEmailTemplate;
