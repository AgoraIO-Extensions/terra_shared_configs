#!/bin/bash
set -e
set -x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/..)

# Check if url is provided
if [ "$#" -lt 1 ]; then
    exit 1
fi
url=$1

# Check if version is provided
if [ "$#" -lt 2 ]; then
    exit 1
fi
version=$2

# Check if product_type is provided
if [ "$#" -lt 3 ]; then
    exit 1
fi
product_type=$3

# Construct the target directory path
destination=${PROJECT_ROOT}"/headers/${product_type}_${version}"

if [ -d "$destination" ]; then
    rm -rf "$destination"/*
else
    mkdir "$destination"
fi

# Download the file with a temporary filename
temp_file="${destination}/temp_file.zip"
curl -L -o "$temp_file" "$url"

# Unzip the file
unzip -o "$temp_file" -d "$destination" > /dev/null

# Remove the temporary file
rm "$temp_file"

# Ensure the target directory exists
mkdir -p "$destination"

# Ensure the nativeSDK was successfully downloaded
nativeSDK="$destination/Agora_Native_SDK_for_Windows_FULL"
mkdir -p $nativeSDK

# Move the file to the target location
mv "$nativeSDK/sdk/high_level_api/include" "$destination"

# Remove the unzipped file
rm -rf "$nativeSDK"
