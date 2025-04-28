FROM node:lts-slim

# Install system dependencies
# nodejs \
RUN apt-get update && apt-get install -y \
    python3 \
    python3-dev \
    python3-venv \
    python3-pip \
    git \
    curl \
    wget \
    unzip \
    libpcap-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install nuclei
# RUN wget https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_2.9.17_linux_amd64.zip && \
#     unzip nuclei_2.9.17_linux_amd64.zip && \
#     mv nuclei /usr/local/bin/nuclei && \
#     rm nuclei_2.9.17_linux_amd64.zip

# Install httpx
# RUN wget https://github.com/projectdiscovery/httpx/releases/latest/download/httpx_1.6.3_linux_amd64.zip && \
#     unzip httpx_1.6.3_linux_amd64.zip && \
#     mv httpx /usr/local/bin/httpx && \
#     rm httpx_1.6.3_linux_amd64.zip

# Install dirsearch
# RUN git clone https://github.com/maurosoria/dirsearch.git /opt/dirsearch

RUN git clone https://github.com/maurosoria/dirsearch.git --depth 1 \
    && cd dirsearch \
    && python3 setup.py install

# Set up working directory
WORKDIR /app


# Copy Application
COPY . /app

RUN bash scripts/weapon_installer.sh --all

# RUN pip install --no-cache-dir virtualenv
# Create and activate a virtual environment
# RUN virtualenv /app/.venv
# ENV PATH="/app/.venv/bin:$PATH"
# RUN pip install dirsearch

# Optionally install Python dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt || true

#  Dirsearch Extension

# Make dirsearch available globally
# ENV PATH="/opt/dirsearch:$PATH"

# Expose a default port
EXPOSE 5000

# Default command to run a shell
# CMD ["/bin/bash"]

RUN npm install
RUN npm run prisma:generate
RUN npm run prisma:migrate-dev
RUN npm run prisma:push

CMD node index.js
# CMD ["/bin/bash", "/app/run_venv.sh"]
