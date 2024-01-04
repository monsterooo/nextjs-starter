import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { Client } from "postmark";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { db } from "./db";
import { loginSchema } from "./validations/auth";

const postmarkClient = new Client(env.POSTMARK_API_TOKEN);

export const authOptions: NextAuthConfig = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    // EmailProvider({
    //   from: env.SMTP_FROM,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await db.user.findUnique({
    //       where: {
    //         email: identifier,
    //       },
    //       select: {
    //         emailVerified: true,
    //       },
    //     });

    //     const templateId = user?.emailVerified
    //       ? env.POSTMARK_SIGN_IN_TEMPLATE
    //       : env.POSTMARK_ACTIVATION_TEMPLATE;
    //     if (!templateId) {
    //       throw new Error("Missing template id");
    //     }

    //     const result = await postmarkClient.sendEmailWithTemplate({
    //       TemplateId: parseInt(templateId),
    //       To: identifier,
    //       From: provider.from as string,
    //       TemplateModel: {
    //         action_url: url,
    //         product_name: siteConfig.name,
    //       },
    //       Headers: [
    //         {
    //           // Set this to prevent Gmail from threading emails.
    //           // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
    //           Name: "X-Entity-Ref-ID",
    //           Value: new Date().getTime() + "",
    //         },
    //       ],
    //     });

    //     if (result.ErrorCode) {
    //       throw new Error(result.Message);
    //     }
    //   },
    // }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await db.user.findUnique({
            where: {
              email,
            },
          });
          if (!user?.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
};
