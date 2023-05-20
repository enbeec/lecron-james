#!/usr/bin/env bash
set -eu

# Create environment variables required to deploy lecron-james

# This script only works on the production environment
environment=production

make_secret() {
    # ,, converts to lowercase (secret keys must be lowercase)
    key="${1,,}"
    val="${2}"

    # create secret
    vercel secrets add "$key" "$val"
}

make_envvar() {
    key="${1}"
    val="${2}"

    # create env var
    echo "$val" | vercel env add "$key" "$environment"
}

do_bootstrap() {
    for i in "${!env[@]}"; do
        key="${env[$i]%=*}"     # trim =* from end
        val="${env[$i]#*=}"     # trim *= from beginning

        # if key ends in "KEY" it is a secret, otherwise a plain env var
        if [[ "$key" == *KEY ]]; then
            make_secret "$key" "$val"
        else
            make_envvar "$key" "$val"
        fi
    done
}

undo_bootstrap() {
    for i in "${!env[@]}"; do
        key="${env[$i]%=*}"     # trim =* from end
        val="${env[$i]#*=}"     # trim *= from beginning

        # if key ends in "KEY" it is a secret, otherwise a plain env var
        if [[ "$key" == *KEY ]]; then
            # ,, converts to lowercase (secret keys must be lowercase)
            vercel secrets rm --yes "${key,,}"
        else
            vercel env rm --yes "$key"
        fi
    done
}

# === Execution ==============================================================

if [ ! -f .env ]; then
    >&2 echo 'Could not find .env'
    exit 1
fi

env=($(cat .env))

arg="${1:-_}"
if [ "$arg" == '--undo' ]; then
    undo_bootstrap
else
    do_bootstrap
fi

vercel env ls
