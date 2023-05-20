import { Storage } from './_storage.util';

export interface Env {
    FREENBA_APIKEY: string;
    STORAGE_ACCESSKEY: string;
    STORAGE_SECRETKEY: string;
    STORAGE_ENDPOINT: string;
    STORAGE_REGION: string;
    STORAGE_BUCKET: string;
}

/* Example .env
 *    FREENBA_APIKEY=[...]
 *    STORAGE_ACCESSKEY=[...]
 *    STORAGE_SECRETKEY=[...]
 *    STORAGE_ENDPOINT=https://us-southeast-1.linodeobjects.com
 *    STORAGE_REGION=us-southeast-1
 *    STORAGE_BUCKET=sb-mirror
 */

export const checkEnv = () => {
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
        throw new Error(
            `Missing environment variables: ${missing.join(', ')}`
        );
}

export const useEnv = (): [Storage, string] => [
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