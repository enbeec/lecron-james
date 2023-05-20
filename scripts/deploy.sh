#!/usr/bin/env bash

env=($(cat .env))

# empty array for -e commands to expose secret keys
expose=()

# build exposed key array
for i in "${!env[@]}"; do
    for i in "${!env[@]}"; do
        key="${env[$i]%=*}"     # trim =* from end

        # if key ends in "KEY" it is a secret, otherwise a plain env var
        if [[ "$key" == *KEY ]]; then
            secret_key=${key,,}
            expose+=(-e "${key}=@${secret_key}")
        fi
    done
done

vercel --prod "${expose[@]}"
