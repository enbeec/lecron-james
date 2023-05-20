#!/usr/bin/env bash

set -eu

if [ ! -f vercel.json ]; then
    >&2 echo -e "Cannot find vercel.json\nAre you in the project root directory?"
    exit 1
fi

if [[ $(git diff --stat) != '' ]]; then
    >&2 echo -e "Cannot deploy from dirty git tree\nPlease commit or stash and try again"
    exit 2
fi

env=($(cat .env))

# empty array for -e commands to expose secret keys
expose=()

# build exposed key array
for i in "${!env[@]}"; do
    key="${env[$i]%=*}"     # trim =* from end

    # if key ends in "KEY" it is a secret, otherwise a plain env var
    if [[ "$key" == *KEY ]]; then
        secret_key=${key,,}
        expose+=(-e "${key}=@${secret_key}")
    fi

    if [ "$key" == "LECRON_KEY" ]; then
        val="${env[$i]#*=}"     # trim *= from start
        sed -i.bak 's/lecron-james/&?key='"$val"'/' vercel.json
    fi
done

vercel --prod "${expose[@]}"
git restore .
rm vercel.json.bak
