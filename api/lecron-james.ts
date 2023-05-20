import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

import { LeBron, isLeBron } from './_types';
import { Storage } from './_storage.util';

interface Env {
    FREENBA_APIKEY: string;
    STORAGE_ACCESSKEY: string;
    STORAGE_SECRETKEY: string;
    STORAGE_ENDPOINT: string;
    STORAGE_REGION: string;
    STORAGE_BUCKET: string;
}

declare namespace NodeJS {
    interface ProcessEnv extends Env {}
}

/* Example .env
 *    FREENBA_APIKEY=[...]
 *    STORAGE_ACCESSKEY=[...]
 *    STORAGE_SECRETKEY=[...]
 *    STORAGE_ENDPOINT=https://us-southeast-1.linodeobjects.com
 *    STORAGE_REGION=us-southeast-1
 *    STORAGE_BUCKET=sb-mirror
 */

// TODO: throw if any of the env keys are missing
const checkEnv = () => {
    const envKeys = [
        'FREENBA_APIKEY',
        'STORAGE_ACCESSKEY',
        'STORAGE_SECRETKEY',
        'STORAGE_ENDPOINT',
        'STORAGE_REGION',
        'STORAGE_BUCKET',
    ];

    const missing = envKeys
        .map(k => process.env[k] ? null : k)
        .filter(Boolean);

    if (missing.length)
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const useEnv = (): [Storage, string] => [
    // the pattern I like is to "justify" all ! assertions (see checkEnv)
    Storage({
        endpoint: process.env.STORAGE_ENDPOINT!,
        region: process.env.STORAGE_REGION!,
        accessKeyId: process.env.STORAGE_ACCESSKEY!,
        secretAccessKey: process.env.STORAGE_SECRETKEY!,
        Bucket: process.env.STORAGE_BUCKET!,
    }),
    process.env.FREENBA_APIKEY!,
];

const options = (apikey: string) => ({
  method: 'GET',
  url: 'https://free-nba.p.rapidapi.com/players/237',
  headers: {
    'X-RapidAPI-Key': apikey,
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
  }
});

export default function handler(
    _: VercelRequest,
    response: VercelResponse
) {
    try {
        checkEnv();
    } catch (e) {
        if (e instanceof Error)
            console.error(e.message);
        else
            console.error(e);

        response.status(500);
        response.send('Server Error');
        return;
    }

    const [storage, apikey] = useEnv();

    // you can do this without nested callbacks with an async handler, try/catch and await
    axios
        .request(options(apikey))
        .then(getRes => {
            const { data: lebron } = getRes;
            console.log('Got:');
            console.log(lebron);

            // simply saying "if it's not lebron return" typescript will infer that it is, indeed LeBron James
            if (!isLeBron(lebron)) {
                response.status(418);
                response.send(`That's not LeBron! Might as well be a teapot: ${JSON.stringify(lebron, null, 4)}`);
                return;
            }

            storage.uploadLeBron(lebron).then(url => {
                response.status(200);
                response.send(`Uploaded LeBron to ${url}`);
            });
        })
        .catch(error => {
            console.error(error);
            response.status(400);
            response.send(error);
        });
}
