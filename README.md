# Le`cron` James

**Currently down:** while I migrate my hosting. It is not high priority at the moment. My apologies.

Here's a screenshot of what you might see were it deployed.

![Screenshot 2023-08-15 at 02-04-09 https __sb-mirror us-southeast-1 linodeobjects com](https://github.com/enbeec/lecron-james/assets/23690586/c672f201-a948-46d8-8092-0c6da8d90f86)

## What it does

- fetch data periodically using serverless cron
- publish fetched data to object storage
- used to cache LeBron James's bio 
  - from
    [https://free-nba.p.rapidapi.com/players/237](https://rapidapi.com/theapiguy/api/free-nba/)
  - to 
    [linode object storage](https://sb-mirror.us-southeast-1.linodeobjects.com/lebron.json)
- runs every day at 7:45am Central (12:45 UTC)

## Tools

I used `pnpm` because it's fast and I like it. Installing it with `npm` and
using it on one project is easy to do.

You also need the `vercel` CLI installed globally.

## Why Typescript?

I thought it would be funny and informative to make LeBron James into an
interface.

## Configuration

First, configure `.env` with everything in the `Env` interface from `api/_env.ts`. 
Run `vercel dev` and 
[invoke the function locally](localhost:3000/api/lecron-james) 
to make sure the values are correct.

Finally, run the `scripts/bootstrap.sh` to set up your production environment
variables and secrets. This step should only be done once and if something goes
wrong you will need to run `scripts/bootstrap.sh --undo` to revert everything.

## Deployment

I wrote a deploy script that uses a similar array/loop to inject secrets as
environment variables at deploy time.

### *IMPORTANT* 

Because I'm using a custom deploy script I had to do an extra configuration step after linking the git repo to my Vercel project.

In `Project Settings` -> `Git` -> `Ignored Build Step` set the command to `exit 0` to disable automatic deployments.

For a more serious project there is certainly a way to make automatic and preview builds work. I just didn't want to fuss with it for a toy.

## Cron-Only Guard

I think it's cool to be able to ping the endpoint freely... but I also don't
think that's a good idea!

I've added a very early step to bail out if a 
[shared key](https://vercel.com/docs/cron-jobs#how-to-secure-cron-jobs) 
is not present.
The deploy script will take care of injecting it into the cron definition before
deployment. It then restores your cron configuration so you can't commit the
shared key.
