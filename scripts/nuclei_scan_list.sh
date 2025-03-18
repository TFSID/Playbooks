#!/bin/bash

DOMAIN_LIST=$1
INDEX_DOMAIN=$2
OUTPUT="${INDEX_DOMAIN}.${DOMAIN_LIST}_nuclei_result.log"
JSONL_OUTPUT="${INDEX_DOMAIN}.${DOMAIN_LIST}_nuclei_result.jsonl"

if [ -z "$DOMAIN_LIST" ];then
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

nuclei -l "$DOMAIN_LIST" -t /home/tfs/nuclei-templates -fr -o "$OUTPUT" -j "$JSONL_OUTPUT" -severity info,low,medium,high,critical -bulk-size 5 -c 5 -rate-limit 2000 -retries 3 -timeout 120