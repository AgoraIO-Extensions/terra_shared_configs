#!/usr/bin/env bash
set -e
set -x

BASE=$1
TARGET=$2

BASE_PATH=headers/${BASE}/include
TARGET_PATH=headers/${TARGET}/include

RESULT=$(diff -u -b -r ${BASE_PATH} ${TARGET_PATH})

# SUMMARY="\`\`\`diff""\n""${RESULT}""\n""\`\`\`"

# # Output the github action summary.
# echo '${SUMMARY}' >> $GITHUB_STEP_SUMMARY