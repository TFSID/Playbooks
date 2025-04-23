#!/bin/bash

PROJECTS_DIR="/app"
VENV_DIR=".venv"
DEPS_FILE="requirements.txt"
DEPS="dirsearch"
SERVE_SCRIPT="node index.js"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install it and try again.";
    exit 1;
fi

# Check Virtual Environmentm (.venv) is exist or not
if [ ! -d "$VENV_DIR" ]; then
    echo "Virtual Environment Isn't Exsist,Creating The New One.....";
    python -m venv $VENV_DIR;
    echo ".venv Folder Created";
    # echo "`ls $VENV_DIR/ -la`";


    if [ $? -ne 0 ]; then
        echo "Failed To Create Virtual Environment";
        exit 1;
    fi
fi

# Active The Virtual Environment
echo "Activating Virtual Environment";
# echo "`pwd`"
# echo "`ls $VENV_DIR/bin/ -la`";
source "$VENV_DIR/bin/activate";

pip install wheel
pip install --upgrade pip wheel

pip install libsass
pip install --upgrade libsass

# pip install -r $DEPS_FILE;
pip install $DEPS;


# Check Virtual Environmentm (.venv) is exist or not
if [ ! -d "$VENV_DIR" ]; then
    echo "Virtual Environment Isn't Exsist,Creating The New One.....";
    python -m venv $VENV_DIR;
    echo ".venv Folder Created";
    # echo "`ls $VENV_DIR/ -la`";


    if [ $? -ne 0 ]; then
        echo "Failed To Create Virtual Environment";
        exit 1;
    fi
fi

# Move To Projects Directory
if [ -d "$PROJECTS_DIR" ]; then
    echo "Moving Into Projects Directory";
    cd $PROJECTS_DIR;
else
    echo "Projects Directories Not Found";
fi


# Run Server Initialization
echo "Running Server Initialization";
echo "`$SERVE_SCRIPT`";

