#!/bin/bash

URL=""
URL_LIST=""
INDEX_DOMAIN=$2

if [ -z "$INDEX_DOMAIN" ];then
  $INDEX_DOMAIN=1
fi 

OUTPUT="${INDEX_DOMAIN}.httpx_tech_detect-result.log"

# Args Parser
# Parse command-line options (-t for a single domain, -l for a file with domain list)
while getopts ":t:l:" opt; do
  case ${opt} in
    t )
      URL="$OPTARG"
      ;;
    l )
      URL_LIST="$OPTARG"
      ;;
    * )
      usage
      ;;
  esac
done
shift $((OPTIND - 1))

# Ensure that either -t or -l is provided, but not both
if [ -n "$URL" ] && [ -n "$URL_LIST" ]; then
    echo "Error: Specify either -t or -l, not both."
    usage
fi

if [ -z "$URL" ] && [ -z "$URL_LIST" ]; then
    echo "Error: You must provide a URI (-t) or a URI file list (-l)."
    usage
fi

if [ -n "$URL_LIST" ]; then
    # Read URI from the file, ignoring empty lines and lines starting with #
    while IFS= read -r line || [ -n "$line" ]; do
        uri=$line
        if [ -n "$uri" ]; then
            echo testing "$uri"
            echo "$uri" | httpx -title -status-code -mc 200,301,302 -follow-redirects -td -ip >> "$OUTPUT"
        fi
    done < "$URL_LIST"
# elif [ -n "$URL_LIST" ]; then
#     if [ ! -f "$URL_LIST" ]; then
#         echo "Error: File '$URL_LIST' not found."
#         exit 1
#     fi
#     httpx -l "$URL_LIST" -o "$OUTPUT" -title -status-code -mc 200,301,302 -follow-redirects -td -ip
fi

# httpx -l iplist.txt -o httpx_tech_detect-result.log -title -status-code -mc 200,301,302 -follow-redirects -td -ip
# bash httpx_tech_detect.sh -l iplist.txt
# bash httpx_tech_detect.sh -l subdomainlist.txt
