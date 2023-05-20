# Le`cron` James

## What it does

- fetch data periodically using serverless cron
- publish fetched data to object storage
- used to cache LeBron James's bio 
  - from [https://free-nba.p.rapidapi.com/players/237](https://rapidapi.com/theapiguy/api/free-nba/)
  - to [linode object storage](https://sb-mirror.us-southeast-1.linodeobjects.com/lebron.json)
- runs every day at 7:45am Central (12:45 UTC)

## Tools

I used `pnpm` because it's fast and I like it. Installing it with `npm` and
using it on one project is easy to do.

You also need the `vercel` CLI installed globally.

## Why Typescript?

I thought it would be funny and informative to make LeBron James into an interface.

## Configuration

First, configure `.env` with everything in the `Env` interface from `api/_env.ts`. Run `vercel dev` and [invoke the function locally](localhost:3000/api/lecron-james) to make sure the values are correct.

Finally, run the `scripts/bootstrap.sh` to set up your production environment variables and secrets. This step should only be done once and if something goes wrong you will need to run `scripts/bootstrap.sh --undo` to revert everything.

## Deployment

I wrote a deploy script that uses a similar array/loop to inject secrets as environment variables at deploy time.
