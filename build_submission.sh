#!/usr/bin/env bash
OUTPUT=collaboard.zip

if [ -f "$OUTPUT" ]; then
    rm "$OUTPUT"
fi
zip -r "${OUTPUT%%.zip}" * \
    --exclude 'node_modules/*' \
    --exclude '.git/*' \
    --exclude '.idea/*' \
    --exclude '.tmp/*' \
    --exclude collaboard.db \
    --exclude 'experiments/*' \
