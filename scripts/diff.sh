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

    # GitHub step summary has a 1024KB limit
    MAX_SIZE=$((1000 * 1024))  # 1000KB to leave some margin
    SUMMARY_SIZE=${#SUMMARY}
    
    if [ $SUMMARY_SIZE -gt $MAX_SIZE ]; then
        # Save full diff to file for artifact upload
        DIFF_FILE="diff_${BASE}_${TARGET}.txt"
        echo "${RESULT}" > "${DIFF_FILE}"
        echo "DIFF_FILE=${DIFF_FILE}" >> $GITHUB_OUTPUT
        echo "DIFF_TOO_LARGE=true" >> $GITHUB_OUTPUT
        
        SUMMARY="## Diff between ${BASE} and ${TARGET}"$'\n'$'\n'"⚠️ **Diff output is too large (${SUMMARY_SIZE} bytes > 1024KB limit)**"$'\n'$'\n'"The full diff has been uploaded as an artifact. Please download it from the Artifacts section at the bottom of this page."
    fi

    # Output the github action summary.
    echo "${SUMMARY}" >> $GITHUB_STEP_SUMMARY
    exit 0;
fi

echo "No diff found between ${BASE} and ${TARGET} headers." >> $GITHUB_STEP_SUMMARY
