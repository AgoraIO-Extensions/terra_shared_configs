#!/usr/bin/env bash
set -x

BASE=$1
TARGET=$2

BASE_PATH=headers/${BASE}/include
TARGET_PATH=headers/${TARGET}/include

# Get list of changed files
CHANGED_FILES=$(diff -rq -b ${BASE_PATH} ${TARGET_PATH} | grep -E "^Files|^Only" || true)

if [ -z "$CHANGED_FILES" ]; then
    echo "No diff found between ${BASE} and ${TARGET} headers." >> $GITHUB_STEP_SUMMARY
    exit 0
fi

# Header
echo "## Diff between ${BASE} and ${TARGET}" >> $GITHUB_STEP_SUMMARY
echo "" >> $GITHUB_STEP_SUMMARY

# Process each file that differs
MAX_CHUNK_SIZE=$((200 * 1024))  # 200KB per file chunk to stay safe
CURRENT_SIZE=0

# Find files that exist in both but differ
diff -rq -b ${BASE_PATH} ${TARGET_PATH} 2>/dev/null | while read -r line; do
    if [[ "$line" == Files* ]]; then
        # Extract file paths: "Files path1 and path2 differ"
        FILE1=$(echo "$line" | awk '{print $2}')
        FILE2=$(echo "$line" | awk '{print $4}')
        FILENAME=$(basename "$FILE1")
        
        FILE_DIFF=$(diff -u -b "$FILE1" "$FILE2" 2>/dev/null || true)
        FILE_DIFF_SIZE=${#FILE_DIFF}
        
        # Check if adding this would exceed limit
        NEW_SIZE=$((CURRENT_SIZE + FILE_DIFF_SIZE + 100))
        
        if [ $NEW_SIZE -gt $MAX_CHUNK_SIZE ]; then
            # Start a new summary section
            echo "" >> $GITHUB_STEP_SUMMARY
            echo "---" >> $GITHUB_STEP_SUMMARY
            echo "" >> $GITHUB_STEP_SUMMARY
            CURRENT_SIZE=0
        fi
        
        echo "<details>" >> $GITHUB_STEP_SUMMARY
        echo "<summary>📄 ${FILENAME}</summary>" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo '```diff' >> $GITHUB_STEP_SUMMARY
        echo "$FILE_DIFF" >> $GITHUB_STEP_SUMMARY
        echo '```' >> $GITHUB_STEP_SUMMARY
        echo "</details>" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        
        CURRENT_SIZE=$((CURRENT_SIZE + FILE_DIFF_SIZE + 100))
        
    elif [[ "$line" == Only* ]]; then
        # Handle files only in one directory
        echo "<details>" >> $GITHUB_STEP_SUMMARY
        echo "<summary>🆕 ${line}</summary>" >> $GITHUB_STEP_SUMMARY
        echo "</details>" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
    fi
done

echo "" >> $GITHUB_STEP_SUMMARY
echo "---" >> $GITHUB_STEP_SUMMARY
echo "✅ Diff complete" >> $GITHUB_STEP_SUMMARY
