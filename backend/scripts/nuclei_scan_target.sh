#!/bin/bash

DOMAIN=$1
# INDEX_DOMAIN=$2
# OUTPUT="${INDEX_DOMAIN}.${DOMAIN}_nuclei_result.log"
# OUTPUT="${DOMAIN}_nuclei_result.log"
OUTPUT=$2
JSONL_OUTPUT="${INDEX_DOMAIN}.${DOMAIN_LIST}_nuclei_result.jsonl"

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

# nuclei -u "$DOMAIN"  -t /home/tfs/nuclei-templates -fr -o "$OUTPUT" -j "$JSONL_OUTPUT" -severity info,low,medium,high,critical -bulk-size 2 -c 3 -rate-limit 100 -retries 3 -timeout 120
echo "scanning $DOMAIN"

nuclei -u "$DOMAIN"  -t /root/nuclei-templates -fr -o "$OUTPUT" -severity info,low,medium,high,critical -bulk-size 2 -c 3 -rate-limit 100 -retries 3 -timeout 120

