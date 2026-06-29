
# workout AI
[![My Skills](https://skillicons.dev/icons?i=react,tailwind,typescript,&perline=4)](https://skillicons.dev)

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,postgres,prisma&perline=4)](https://skillicons.dev)


Create Personalised training plan tailored to you by AI based on your goals, experience and schedule prefernces
checkout dashboard for detailed view of the current workout plan and also keep track of the version of the plan that is currently foolowed by you
All of this with simple UI that is easy to understand and use along with good looks


## Authors

- [@varshith-jureddi](https://github.com/varshith-jureddi)


## Features

- Simple interface for onboarding
- Get personalized plans
- Easy to view and keep track of plan


## Tech Stack


**Client:** React, TailwindCSS

**Server:** Node, Express, PostgreSQL


## Run Locally

Clone the project

```bash
  git clone https://github.com/varshith-jureddi/workout-ai
```

Go to the project directory

```bash
  cd workout-ai
```

Install dependencies

```bash
  npm install
```

Start the Frontend

```bash
  npm run dev
```
Start Backend Server
```bash
  cd server
  npm run dev:server
```

For Database

Create a database in the postgres server

Initialise Prisma

```
  npx prisma init
```

Provide schema.prisma or Create directly in postgres

Add Your postgres link to the .env file

```ex
postgres://postgres:{password}@localhost:5432/name-db?schema=public
```
Prisma Generate

```
  npx prisma generate
```
  or
Prisma Pull(if added tables via postgres)
```
  npx prisma db pull
```

Add API key to the .env file to use AI
