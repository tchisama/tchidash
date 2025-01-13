#!/bin/bash

# Number of commits to generate
NUM_COMMITS=50

# File to modify for dummy changes
FILE="random_commits.txt"

# Ensure the file exists
if [ ! -f "$FILE" ]; then
    touch "$FILE"
fi

# Target year for commits
TARGET_YEAR=2023



# Generate random commits
for ((i = 1; i <= NUM_COMMITS; i++)); do
    # Generate a random date in the year 2024
    RANDOM_DAY=$(shuf -i 1-366 -n 1) # 2024 is a leap year
    COMMIT_DATE=$(date -d "$TARGET_YEAR-01-01 +$RANDOM_DAY days" +"%Y-%m-%d %H:%M:%S")
    
    # Modify the file
    echo "Commit #$i on $COMMIT_DATE" >> $FILE

    # Stage the file
    git add $FILE

    # Commit with the random date
    GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" git commit -m "Random commit #$i"
done

# Push all commits
# git push

# echo "Successfully created and pushed $NUM_COMMITS random commits for the year $TARGET_YEAR."

