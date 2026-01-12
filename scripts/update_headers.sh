#!/bin/bash
set -e
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
nativeSDK=$(find "$destination" -type d -name "*_Native_SDK_for_Windows*" -print -quit)
mkdir -p $nativeSDK

if [ -z "$nativeSDK" ]; then
    echo "Native SDK directory not found."
    exit 1
fi

echo "Native SDK directory found at $nativeSDK"

# Move the file to the target location
mv "$nativeSDK/sdk/high_level_api/include" "$destination"

# Remove the unzipped file
rm -rf "$nativeSDK"

directory="headers"
target_folder="$3_$2"

if [ ! -d "$directory" ]; then
    echo "directory '$directory' not exist!"
    exit 1
fi

folders=($(find "$directory" -maxdepth 1 -type d | sort -V | xargs -n 1 basename))
index=0
found=0

for folder in "${folders[@]}"; do
    index=$((index + 1))
    if [[ "$folder" == "$target_folder" ]]; then
        found=1
        break
    fi
done

if [ "$found" -eq 1 ]; then
    if [ "$index" -gt 1 ]; then
        if [ -d "$destination/custom_headers" ]; then
            echo "custom_headers already exists in '$target_folder', skipping inheritance."
        else
            echo "the last folder: '${folders[index-2]}'"
            cp -r "${directory}/${folders[index-2]}/custom_headers" "$destination/custom_headers"
            echo "copied custom_headers from '${folders[index-2]}' to '$target_folder'."
        fi
    else
        echo "this is first folder."
    fi
else
    echo "folder '$target_folder' is not in '$directory'!"
fi
