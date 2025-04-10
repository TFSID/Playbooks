#!/bin/sh

# Function to display usage and exit
usage() {
  echo "Usage: $0 [-t DOMAIN] or [-l DOMAIN_FILE]"
  exit 1
}

# Initialize variables
DOMAIN=""
DOMAIN_FILE=""

# Parse command-line options (-t for a single domain, -l for a file with domain list)
while getopts ":t:l:" opt; do
  case ${opt} in
    t )
      DOMAIN="$OPTARG"
      ;;
    l )
      DOMAIN_FILE="$OPTARG"
      ;;
    * )
      usage
      ;;
  esac
done
shift $((OPTIND - 1))

# Ensure that either -t or -l is provided, but not both
if [ -n "$DOMAIN" ] && [ -n "$DOMAIN_FILE" ]; then
    echo "Error: Specify either -t or -l, not both."
    usage
fi

if [ -z "$DOMAIN" ] && [ -z "$DOMAIN_FILE" ]; then
    echo "Error: You must provide a domain (-t) or a domain file (-l)."
    usage
fi

# Helper function to perform the curl request for a given domain
check_domain() {
    local domain="$1"
    curl -s -X GET "https://web-check.xyz/api/get-ip?url=https%3A%2F%2F${domain}" -H "accept: application/json"
    echo ""  # Newline for clarity between responses
}

# Process the provided domain(s)
if [ -n "$DOMAIN_FILE" ]; then
    if [ ! -f "$DOMAIN_FILE" ]; then
        echo "Error: File '$DOMAIN_FILE' not found."
        exit 1
    fi
    # Read domains from the file, ignoring empty lines and lines starting with #
    while IFS= read -r line || [ -n "$line" ]; do
        # Trim whitespace and skip empty or commented lines
        domain=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        if [ -n "$domain" ] && [ "${domain#\#}" = "$domain" ]; then
            check_domain "$domain"
        fi
    done < "$DOMAIN_FILE"
elif [ -n "$DOMAIN" ]; then
    check_domain "$DOMAIN"
fi
