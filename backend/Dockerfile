FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    libpcap-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install nuclei
RUN wget https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_2.9.17_linux_amd64.zip && \
    unzip nuclei_2.9.17_linux_amd64.zip && \
    mv nuclei /usr/local/bin/nuclei && \
    rm nuclei_2.9.17_linux_amd64.zip

# Install httpx
RUN wget https://github.com/projectdiscovery/httpx/releases/latest/download/httpx_1.6.3_linux_amd64.zip && \
    unzip httpx_1.6.3_linux_amd64.zip && \
    mv httpx /usr/local/bin/httpx && \
    rm httpx_1.6.3_linux_amd64.zip

# Install dirsearch
# RUN git clone https://github.com/maurosoria/dirsearch.git /opt/dirsearch
RUN git clone https://github.com/maurosoria/dirsearch.git --depth 1

# Set up working directory
WORKDIR /app

# Copy Application
COPY . .

# Optionally install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt || true

# Make dirsearch available globally
ENV PATH="/opt/dirsearch:$PATH"

# Expose a default port
EXPOSE 8990

# Default command to run a shell
CMD ["/bin/bash"]
