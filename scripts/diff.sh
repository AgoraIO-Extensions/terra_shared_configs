#!/usr/bin/env bash
set -x

BASE=$1
TARGET=$2

BASE_PATH=headers/${BASE}/include
TARGET_PATH=headers/${TARGET}/include

RESULT=$(diff -u -b -r ${BASE_PATH} ${TARGET_PATH})

retVal=$?
if [ $retVal -eq 1 ]; then
    SUMMARY="\`\`\`diff"$'\n'$'\n'"${RESULT}"$'\n'"\`\`\`"

    # Output the github action summary.
    echo "${SUMMARY}" >> $GITHUB_STEP_SUMMARY
    exit 0;
fi

echo "No diff found between ${BASE} and ${TARGET} headers." >> $GITHUB_STEP_SUMMARY
