# NEXTJS-STARTER

![nextjs-starter-example](https://github.com/monsterooo/nextjs-starter/assets/18432680/2acb7118-ea99-41e5-a6e9-9f8b5994f441)

An open source application built using the new router, server components and everything new in Next.js 13.

Thanks to the Taxonomy template for providing a lot of basic code work

## Features

- New /app dir,
- Routing, Layouts, Nested Layouts and Layout Groups
- Data Fetching, Caching and Mutation
- Loading UI
- Route handlers
- Metadata files
- Server and Client Components
- API Routes and Middlewares
- Authentication using NextAuth.js
- Local login / Oauth login
- ORM using Prisma
- UI Components built using Radix UI
- Documentation and blog using MDX and Contentlayer
- Subscriptions using Stripe
- Styled using Tailwind CSS
- Validations using Zod
- Written in TypeScript

# Running Locally

- Install dependencies using pnpm:

```shell
pnpm install
```

- Copy `.env.example` to `.env` and update the variables.

```shell
cp .env.example .env.local
```

- Init database

```shell
pnpm db:push
```

- Start the development server:

```shell
pnpm dev
```
