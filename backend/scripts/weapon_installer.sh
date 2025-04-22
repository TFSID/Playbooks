#!/bin/bash

# Constants for default directory and download links
DEFAULT_DIR=/opt
LOCAL_BIN_DIR=/usr/bin

# Tool specifics
SUBFINDER_ZIP="subfinder_2.6.7_linux_amd64.zip"
DOWNLOAD_SUBFINDER="https://github.com/projectdiscovery/subfinder/releases/download/v2.6.7/$SUBFINDER_ZIP"
SUBFINDER_BINARY_NAME="subfinder"
SUBFINDER_DIR="$DEFAULT_DIR/subfinder"
SUBFINDER_BINARY="$SUBFINDER_DIR/$SUBFINDER_BINARY_NAME"

KATANA_ZIP="katana_1.1.2_linux_amd64.zip"
DOWNLOAD_KATANA="https://github.com/projectdiscovery/katana/releases/download/v1.1.2/$KATANA_ZIP"
KATANA_BINARY_NAME="katana"
KATANA_DIR="$DEFAULT_DIR/katana"
KATANA_BINARY="$KATANA_DIR/$KATANA_BINARY_NAME"

DOWNLOAD_NMAP="https://github.com/andrew-d/static-binaries/raw/refs/heads/master/binaries/linux/x86_64/nmap"
NMAP_BINARY_NAME="nmap"
NMAP_DIR="$DEFAULT_DIR/nmap"
NMAP_BINARY="$NMAP_DIR/$NMAP_BINARY_NAME"


HTTPX_ZIP="httpx_1.6.9_linux_amd64.zip"
DOWNLOAD_HTTPX="https://github.com/projectdiscovery/httpx/releases/download/v1.6.9/$HTTPX_ZIP"
HTTPX_BINARY_NAME="httpx"
HTTPX_DIR="$DEFAULT_DIR/httpx"
HTTPX_BINARY="$HTTPX_DIR/$HTTPX_BINARY_NAME"

NUCLEI_ZIP="nuclei_3.3.7_linux_amd64.zip"
DOWNLOAD_NUCLEI="https://github.com/projectdiscovery/nuclei/releases/download/v3.3.7/$NUCLEI_ZIP"
NUCLEI_BINARY_NAME="nuclei"
NUCLEI_DIR="$DEFAULT_DIR/nuclei"
NUCLEI_BINARY="$NUCLEI_DIR/$NUCLEI_BINARY_NAME"

PROXYCHAINS_ZIP="proxychains-ng-4.17.tar.xz"
DOWNLOAD_PROXYCHAINS="https://github.com/rofl0r/proxychains-ng/releases/download/v4.17/$PROXYCHAINS_ZIP"
PROXYCHAINS_BINARY_NAME="proxychains"
PROXYCHAINS_DIR="$DEFAULT_DIR/proxychains"
PROXYCHAINS_BINARY="$PROXYCHAINS_DIR/$PROXYCHAINS_BINARY_NAME"

URLFINDER_VERSION="0.0.2"
URLFINDER_BINARY_NAME="urlfinder"
URLFINDER_ZIP="urlfinder_${URLFINDER_VERSION}_linux_amd64.zip"
DOWNLOAD_URLFINDER="https://github.com/projectdiscovery/urlfinder/releases/download/v${URLFINDER_VERSION}/${URLFINDER_ZIP}"
URLFINDER_DIR="$DEFAULT_DIR/urlfinder"
URLFINDER_BINARY="$URLFINDER_DIR/$URLFINDER_BINARY_NAME"

# Function to check command success
check_success() {
    if [ $? -ne 0 ]; then
        echo "[ERROR] $1 failed. Exiting."
        exit 1
    fi
}

# Function to verify tool installation
verify_tool() {
    TOOL_PATH=$1
    TOOL_CMD=$2
    TOOL_NAME=$3

    echo "[INFO] Verifying $TOOL_NAME installation..."
    $TOOL_PATH $TOOL_CMD
    check_success "Verification of $TOOL_NAME"
}

# Function to extract and install tar.xz files
extract_and_install_tar_xz() {
    TOOL_NAME=$1
    TOOL_DOWNLOAD=$2
    TOOL_TAR=$3
    TOOL_DIR=$4
    
    echo "[INFO] Downloading $TOOL_NAME..."
    curl -L "$TOOL_DOWNLOAD" -o "$DEFAULT_DIR/$TOOL_TAR"
    check_success "Downloading $TOOL_NAME"

    echo "[INFO] Extracting $TOOL_NAME..."
    mkdir -p "$TOOL_DIR"
    tar -xf "$DEFAULT_DIR/$TOOL_TAR" -C "$TOOL_DIR"
    check_success "Extracting $TOOL_NAME"

    echo "[INFO] Cleaning up $TOOL_NAME tar files..."
    rm -f "$DEFAULT_DIR/$TOOL_TAR"
}

# Function to install tools
install_tool() {
    TOOL_NAME=$1
    TOOL_DOWNLOAD=$2
    TOOL_ZIP=$3
    TOOL_DIR=$4
    TOOL_BINARY=$5
    TOOL_DIR_BIN=$6

    echo "[INFO] Downloading $TOOL_NAME..."
    curl -L "$TOOL_DOWNLOAD" -o "$DEFAULT_DIR/$TOOL_ZIP"
    check_success "Downloading $TOOL_NAME"

    echo "[INFO] Unzipping $TOOL_NAME..."
    unzip -o "$DEFAULT_DIR/$TOOL_ZIP" -d "$TOOL_DIR"
    check_success "Unzipping $TOOL_NAME"

    echo "[MOVING] Setting permissions for $TOOL_NAME..."
    mv "$TOOL_DIR_BIN" "$TOOL_BINARY"
    chmod +x "$TOOL_BINARY"
    check_success "Setting permissions for $TOOL_NAME"

    echo "[INFO] Cleaning up $TOOL_NAME zip files..."
    rm -f "$DEFAULT_DIR/$TOOL_ZIP"
    rm -rf "$TOOL_DIR"
}

# Parse arguments for selective installation
INSTALL_SUBFINDER=false
INSTALL_KATANA=false
INSTALL_NMAP=false
INSTALL_HTTPX=false
INSTALL_NUCLEI=false
INSTALL_URLFINDER=false
INSTALL_PROXYCHAINS=false

while [ "$#" -gt 0 ]; do
    case $1 in
        --subfinder)
            INSTALL_SUBFINDER=true
            ;;
        --katana)
            INSTALL_KATANA=true
            ;;
        --nmap)
            INSTALL_NMAP=true
            ;;
        --httpx)
            INSTALL_HTTPX=true
            ;;
        --nuclei)
            INSTALL_NUCLEI=true
            ;;
        --proxychains)
            INSTALL_PROXYCHAINS=true
            ;;
        --urlfinder)
            INSTALL_URLFINDER=true
            ;;
        --all)
            INSTALL_SUBFINDER=true
            INSTALL_KATANA=true
            INSTALL_NMAP=true
            INSTALL_HTTPX=true
            INSTALL_NUCLEI=true
            INSTALL_URLFINDER=true
            INSTALL_PROXYCHAINS=true
            ;;
        *)
            echo "[ERROR] Unknown option: $1"
            exit 1
            ;;
    esac
    shift
done

# install_tool() {

#     TOOL_NAME=$1
#     TOOL_DOWNLOAD=$2
#     TOOL_ZIP=$3
#     TOOL_DIR=$4
#     TOOL_BINARY=$5
#     TOOL_DIR_BIN=$6


# install_tool(TOOL_NAME, TOOL_DOWNLOAD, TOOL_ZIP, TOOL_DIR, TOOL_BINARY, TOOL_DIR_BIN/FULLPATH(DIR+BINARY_NAME))

# Start installation process

add_to_path() {
    TOOL_DIR=$1
    if ! echo "$PATH" | grep -q "/opt/tmp/nuclei_dir"; then
        echo "export PATH=\"$TOOL_DIR:\$PATH\"" >> ~/.bashrc
        check_success "Adding Nuclei to PATH"
        source ~/.bashrc
    else
        echo "[INFO] Nuclei already in PATH."
    fi
}

# if $INSTALL_NMAP; then
#     # install_tool "Nmap" "$DOWNLOAD_NMAP" "nmap.zip" "/opt/tmp/nmap_dir" "$DEFAULT_DIR/tmp/nmap" "/opt/tmp/nmap_dir/nmap"
#     install_tool "Nmap" "$DOWNLOAD_NMAP" "nmap.zip" "$NMAP_DIR" "$LOCAL_BIN_DIR/$NMAP_BINARY_NAME" "$NMAP_BINARY"
# fi

if $INSTALL_SUBFINDER; then
    # install_tool "Subfinder" "$DOWNLOAD_SUBFINDER" "$SUBFINDER_ZIP" "/opt/tmp/subfinder_dir" "$DEFAULT_DIR/tmp/subfinder" "/opt/tmp/subfinder_dir/subfinder"
    install_tool "Subfinder" "$DOWNLOAD_SUBFINDER" "$SUBFINDER_ZIP" "$SUBFINDER_DIR" "$LOCAL_BIN_DIR/$SUBFINDER_BINARY_NAME" "$SUBFINDER_BINARY"
fi

if $INSTALL_KATANA; then
    # install_tool "Katana" "$DOWNLOAD_KATANA" "$KATANA_ZIP" "/opt/tmp/katana_dir" "$DEFAULT_DIR/tmp/katana" "/opt/tmp/katana_dir/katana"
    install_tool "Katana" "$DOWNLOAD_KATANA" "$KATANA_ZIP" "$KATANA_DIR" "$LOCAL_BIN_DIR/$KATANA_BINARY_NAME" "$KATANA_BINARY"
fi

if $INSTALL_HTTPX; then
    # install_tool "HTTPX" "$DOWNLOAD_HTTPX" "$HTTPX_ZIP" "/opt/tmp/httpx_dir" "$DEFAULT_DIR/tmp/httpx" "/opt/tmp/httpx_dir/httpx"
    install_tool "HTTPX" "$DOWNLOAD_HTTPX" "$HTTPX_ZIP" "$HTTPX_DIR" "$LOCAL_BIN_DIR/$HTTPX_BINARY_NAME" "$HTTPX_BINARY"
fi

if $INSTALL_NUCLEI; then
    # install_tool "Nuclei" "$DOWNLOAD_NUCLEI" "$NUCLEI_ZIP" "/opt/tmp/nuclei_dir" "$DEFAULT_DIR/tmp/nuclei" "/opt/tmp/nuclei_dir/nuclei"
    # extract_and_install_tar_xz "nuclei" "$DOWNLOAD_NUCLEI" "$PROXYCHAINS_TAR" "$DEFAULT_DIR/proxychains"
    install_tool "Nuclei" "$DOWNLOAD_NUCLEI" "$NUCLEI_ZIP" "$NUCLEI_DIR" "$LOCAL_BIN_DIR/$NUCLEI_BINARY_NAME" "$NUCLEI_BINARY"
    # echo "[INFO] Adding Nuclei to PATH..."
    # if ! echo "$PATH" | grep -q "/opt/tmp/nuclei_dir"; then
    #     echo "export PATH=\"$NUCLEI_DIR:\$PATH\"" >> ~/.bashrc
    #     check_success "Adding Nuclei to PATH"
    #     source ~/.bashrc
    # else
    #     echo "[INFO] Nuclei already in PATH."
    # fi
fi

# if $INSTALL_PROXYCHAINS; then
#     install_tool "Nuclei" "$DOWNLOAD_PROXYCHAINS" "$PROXYCHAINS_ZIP" "/opt/tmp/proxychains_dir" "$DEFAULT_DIR/tmp/proxychains" "/opt/tmp/proxychains_dir/"
# fi

## Failure Writing Output To Destinations

# if $INSTALL_PROXYCHAINS; then
#     extract_and_install_tar_xz "Proxychains" "$DOWNLOAD_PROXYCHAINS" "$PROXYCHAINS_TAR" "$DEFAULT_DIR/proxychains"
#     cd "$DEFAULT_DIR/proxychains" || exit 1
#     ./configure
#     make && make install
#     check_success "Installing Proxychains"
#     echo "[INFO] Proxychains installed successfully."
# fi

if $INSTALL_URLFINDER; then
    echo "[INFO] Downloading URLFinder..."
    curl -L "$DOWNLOAD_URLFINDER" -o "$DEFAULT_DIR/$URLFINDER_ZIP"
    check_success "Downloading URLFinder"

    echo "[INFO] Unzipping URLFinder..."
    unzip -o "$DEFAULT_DIR/$URLFINDER_ZIP" -d "$URLFINDER_DIR"
    check_success "Unzipping URLFinder"

    echo "[INFO] Setting permissions for URLFinder..."
    chmod +x "$URLFINDER_BINARY"
    check_success "Setting permissions for URLFinder"

    echo "[INFO] Adding URLFinder to PATH..."
    if ! echo "$PATH" | grep -q "$URLFINDER_DIR"; then
        echo "export PATH=\"$URLFINDER_DIR:\$PATH\"" >> ~/.bashrc
        check_success "Adding URLFinder to PATH"
        source ~/.bashrc
    else
        echo "[INFO] URLFinder already in PATH."
    fi

    echo "[INFO] Cleaning up URLFinder zip files..."
    rm -f "$DEFAULT_DIR/$URLFINDER_ZIP"
fi

# Final message
echo "[INFO] Tool installation completed successfully."

# Ensure LIST_NAME and SCAN_ID are provided
# if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
#     echo "Error: Specify The Right Tools"
#     echo "Usage: $0 --subfinder --katana --nmap --nuclei --urlfinder --all "
#     exit 1
# fi

# Execute the function
# perform_scan "$1" "$2" "$3" "$4"
