import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

import { LeBron, isLeBron } from './_types';
import { checkEnv, useEnv } from './_env';

export default function handler(
    request: VercelRequest,
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

    const [{ uploadLeBron }, apikey, lecronkey] = useEnv();

    const querykey = request.query.key;
    if (querykey !== lecronkey) {
        // do not log if someone pinged the endpoint without a key at all
        if (querykey) console.error(`Key mismatch: got ${querykey}`);

        response.status(404).end();
    }

    // you can do this without nested callbacks with an async handler, try/catch and await
    axios
        .request({
            method: 'GET',
            url: 'https://free-nba.p.rapidapi.com/players/237',
            headers: {
                'X-RapidAPI-Key': apikey,
                'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
            }
        })
        .then(getRes => {
            const { data: lebron } = getRes;
            console.log('Got:');
            console.log(lebron);

            // simply saying "if it's not lebron return"
            //      typescript will infer that it is indeed LeBron James
            if (!isLeBron(lebron)) {
                response.status(418);
                response.send(
                    `That's not LeBron! Might as well be a teapot: ${JSON.stringify(lebron, null, 4)}`
                );
                return;
            }

            uploadLeBron(lebron).then(url => {
                response.status(200);
                response.send(`Uploaded LeBron to <a href="${url}">object storage</a>.`);
            });
        })
        .catch(error => {
            console.error(error);
            response.status(400);
            response.send(error);
        });
}
