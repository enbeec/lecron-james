# Le`cron` James

## What it does

- fetch data periodically using serverless cron
- publish fetched data to object storage
- used to cache LeBron James's bio from [https://free-nba.p.rapidapi.com/players/237](https://rapidapi.com/theapiguy/api/free-nba/)
- runs every day at 7:45am Central (12:45 UTC)

## Tools

I used `pnpm` because it's fast and I like it. Installing it with `npm` and
using it on one project is easy to do.

## Why Typescript?

I thought it would be funny and informative to make LeBron James into an interface.

## Running Locally

Use `.env` and provide everything in the `Env` interface (see `api/_env.ts`).

<!-- TODO 
## Deployment

The deploy script will make sure you have the proper secrets and environment variables configured before attempting deployment.
-->
