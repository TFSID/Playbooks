import subprocess
import re
import os
import argparse
from concurrent.futures import ThreadPoolExecutor

output_dir = "vapt_results"
os.makedirs(output_dir, exist_ok=True)

def sanitize_name(target):
    return re.sub(r'[^a-zA-Z0-9]', '_', target)

def run_dirsearch(target, output_file):
    """Execute dirsearch with controlled threading using Python's executor"""
    cmd = [
        "dirsearch",
        "-u", target,
        "-e", "*",
        "-r",
        "--recursion-status", "200-302,500,403",
        "-x", "400-600",
        "-t", "50",
        "--format=plain",
        "-o", output_file
    ]
    
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        
        # Real-time output processing
        while True:
            line = process.stdout.readline()
            if not line and process.poll() is not None:
                break
            print(line.strip())
            
        return process.returncode
    except Exception as e:
        print(f"Dirsearch error: {str(e)}")
        return -1

def endpoint_enum(target):
    sanitized = sanitize_name(target)
    output_file = f"{output_dir}/EndpointList-{sanitized}-dirsearch_results.txt"
    
    # Thread-controlled execution
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(run_dirsearch, target, output_file)
        return future.result()
    
def parse_args():
    parser = argparse.ArgumentParser(description=' Dirsearch MultiThreads')
    
    # Positional Arguments
    parser.add_argument('target', help='target/url to be scan')
    
    args = parser.parse_args()
    return args
    
# Example usage
if __name__ == "__main__":
    args = parse_args()
    print(f'Target= {args.target}')
    target_url = args.target
    endpoint_enum(target_url)