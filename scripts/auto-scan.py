import sys
import os
import subprocess
from module import dirsearch


output_dir = "auto-scan-result"
os.makedirs(output_dir, exist_ok=True)

def sanitize_name(target)
    return re.sub(r'[^a-zA-Z0-9]', '_', target)

def run_scan(target, output_file)