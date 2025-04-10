import sys
import os
import re
import subprocess
from mod.dirsearch import run_dirsearch as dirsearch

output_dir = "auto-scan-result"
os.makedirs(output_dir, exist_ok=True)

def sanitize_name(target):
    return re.sub(r'[^a-zA-Z0-9]', '_', target)

def run_scan(target, output_file):
    # print(f"Scanning {target}")
    dirsearch(target, output_file)


# Example usage
if __name__ == "__main__":
    run_scan("http://example.com", "auto-scan-result/scan-results.txt")