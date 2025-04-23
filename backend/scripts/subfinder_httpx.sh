#!/bin/bash

DOMAIN=$1
OUTPUT=$2
# INDEX_DOMAIN=$2
#MATCH_CODE=$3

if [ -z "$DOMAIN" ];then
echo "DOMAIN Required!"
exit 1
fi 

# if [ -z "$INDEX_DOMAIN" ];then
# $INDEX_DOMAIN=1
# fi 

# OUTPUT_SUB="${INDEX_DOMAIN}.${DOMAIN}_sub.log"
# OUTPUT_HTTPX="${INDEX_DOMAIN}.${DOMAIN}_httpx.log"


OUTPUT_SUB="${OUTPUT}/${DOMAIN}_sub.log"
OUTPUT_HTTPX="${OUTPUT}/${DOMAIN}_httpx.log"


if [ -f "$OUTPUT_SUB" ];then
echo "file $OUTPUT_SUB already exist"
exit 1 
fi

if [ -f "$OUTPUT_HTTPX" ];then
echo "file $OUTPUT_HTTPX already exist"
exit 1 
fi

subfinder -d "$DOMAIN" -recursive -o "$OUTPUT_SUB" | httpx -o "$OUTPUT_HTTPX" -title -status-code -mc 200,301,302 -follow-redirects -td -ip
