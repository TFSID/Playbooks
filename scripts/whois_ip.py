import argparse
import subprocess
import re

def run_whois(ip):
    try:
        result = subprocess.check_output(["whois", ip], universal_newlines=True, stderr=subprocess.DEVNULL)
        return result
    except subprocess.CalledProcessError:
        return ""

def extract_fields(whois_output, fields):
    extracted = {}
    # Untuk tiap field, cari dengan regex (case-insensitive)
    for field in fields:
        pattern = rf"^{field}\s*:\s*(.+)$"
        match = re.search(pattern, whois_output, re.IGNORECASE | re.MULTILINE)
        if match:
            extracted[field] = match.group(1).strip()
        else:
            extracted[field] = "Not Found"
    return extracted

def main():
    parser = argparse.ArgumentParser(
        description="Menjalankan whois untuk setiap IP di file dan mengekstrak field tertentu."
    )
    parser.add_argument(
        "ip_file",
        type=str,
        help="Nama file yang berisi daftar IP (satu IP per baris)."
    )
    parser.add_argument(
        "--fields",
        nargs="+",
        default=["Organization", "NetName"],
        help="List field yang akan diekstrak dari hasil whois (default: Organization NetName)."
    )
    parser.add_argument(
        "--output",
        type=str,
        default="whois_output.txt",
        help="Nama file output untuk menyimpan hasil ekstraksi."
    )
    args = parser.parse_args()

    results = []
    with open(args.ip_file, "r") as f:
        ip_list = [line.strip() for line in f if line.strip()]

    for ip in ip_list:
        print(f"Processing {ip}...")
        whois_output = run_whois(ip)
        if not whois_output:
            result = {field: "Error or no data" for field in args.fields}
        else:
            result = extract_fields(whois_output, args.fields)
        # Simpan hasil beserta IP-nya
        results.append((ip, result))

    # Tulis hasil ke file output
    with open(args.output, "w") as fout:
        for ip, fields_dict in results:
            fout.write(f"IP: {ip}\n")
            for field, value in fields_dict.items():
                fout.write(f"  {field}: {value}\n")
            fout.write("\n")

    print(f"Output telah disimpan di {args.output}")

if __name__ == "__main__":
    main()
