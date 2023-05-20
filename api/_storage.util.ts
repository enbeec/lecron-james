import { S3Client, S3ClientConfig, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { LeBron } from './_types';

/** Fake class -- just call `Storage()` rather than `new Storage()`. */
export function Storage({
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    Bucket,
}: {
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    Bucket: string;
}) {
    const client = new S3Client({
        endpoint,
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
    });

    // whatever you return here...
    return {
        /** Returns the URL you can get him from. */
        async uploadLeBron(lebron: LeBron) {
            const objName = 'lebron.json';

            return client.send(new PutObjectCommand({
                Bucket,
                Body: JSON.stringify(lebron),
                Key: objName,
                ContentType: 'application/json',
                ACL: 'public-read'
            })).then(() => {
                const [proto, location] = endpoint.split('://');
                return `${proto}://${Bucket}.${location}/${objName}`;
            });
        }
    };
}

// will be the type exported here!
export type Storage = ReturnType<typeof Storage>;
