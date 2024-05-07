#!/bin/bash
set -e
set -x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/..)

# Check if url is provided
if [ "$#" -lt 1 ]; then
    echo "usage: \$0<url>"
    exit 1
fi

# Assign arguments to variables
url=$1
if [[ $url == *"Preview_"* ]]; then
    type=${url#*Preview_}; type=${type%%_*}
    version=${url#*${type}_}; version=${version%_*headers.zip}
elif [[ $url == *"Agora_Native_SDK_"* ]]; then
    type="rtc"
    version=${url#*Windows_rel.v}; version=${version%%_*}
fi

# Check if second argument is provided, if so, use it as version
if [ "$#" -ge 2 ]; then
    version=$2
fi
latest_version="${version%.*}"

# Construct the target directory path
destination=${PROJECT_ROOT}"/headers/${type}_${version}"

# If the target directory does not exist, copy the most similar folder and rename it
if [ ! -d "$destination" ]; then
    # Find the last folder
    last_folder=$(ls -d ${PROJECT_ROOT}/headers/${type}_${latest_version}* | sort -V | tail -n 1)
    # Copy the last folder and rename it
    echo "Copying $last_folder to $destination"
    cp -r "$last_folder" "$destination"
else
    # If the target directory already exists, output a message
    echo "The directory $destination already exists. no need to copy."
fi

# Remove the include directory
rm -rf "$destination/include"

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
