#!/bin/bash
set -e
set -x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/..)

# 检查是否提供了三个参数
if [ "$#" -ne 3 ]; then
    echo "usage: \$0<type> <version> <url>"
    exit 1
fi

# 将参数分配给变量
type=$1
version=$2
url=$3

# 构造目标目录路径
destination=${PROJECT_ROOT}"/headers/${type}_${version}"

# 删除目标目录
rm -rf "$destination/include"


# 如果目标目录不存在，则复制最后一个文件夹并重命名
if [ ! -d "$destination" ]; then
    # 找到最后一个文件夹
    last_folder=$(ls -d ${PROJECT_ROOT}/headers/${type}_* | sort | tail -n 1)
    # 复制最后一个文件夹并重命名
    echo "Copying $last_folder to $destination"
    cp -r "$last_folder" "$destination"
fi

# 使用临时文件名下载文件
temp_file="${destination}/temp_file.zip"
curl -L -o "$temp_file" "$url"

# # 解压文件
unzip -o "$temp_file" -d "$destination" > /dev/null

# # 删除临时文件
rm "$temp_file"

# # 确保目标目录存在
mkdir -p "$destination"

# # 确保成功下载了nativeSDK
nativeSDK="$destination/Agora_Native_SDK_for_Windows_FULL"
mkdir -p $nativeSDK

# # 将文件移动到目标位置
mv "$nativeSDK/sdk/high_level_api/include" "$destination/include"

# # 删除解压后的文件
rm -rf "$nativeSDK"

git add "$destination"