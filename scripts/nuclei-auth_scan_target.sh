#!/bin/bash

DOMAIN=$1
INDEX_DOMAIN=$2
OUTPUT="${INDEX_DOMAIN}.auth.${DOMAIN}_nuclei_result.log"

if [ -z "$DOMAIN" ];then
echo "DOMAIN Required!"
exit 1
fi 

if [ -z "$INDEX_DOMAIN" ];then
$INDEX_DOMAIN=1
fi 

if [ -f "$OUTPUT" ];then
echo "file $OUTPUT already exist"
exit 1 
fi

nuclei -u "$DOMAIN" -dashboard -t /home/tfs/Documents/nuclei-templates -fr -o "$OUTPUT" -severity info,low,medium,high,critical -bulk-size 2 -c 3 -rate-limit 100 -retries 3 -timeout 120