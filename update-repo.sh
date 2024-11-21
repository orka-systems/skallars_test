#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Starting update, release, and deployment process for Skallars Website...${NC}"

# First, check if there are changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to commit${NC}"
    exit 0
fi

# Show changed files
echo -e "${GREEN}Changed files:${NC}"
git status -s

# Generate detailed changelog from changes
CHANGED_FILES=$(git diff --name-only)
DETAILED_CHANGELOG=""

for file in $CHANGED_FILES; do
    if [ -f "$file" ]; then
        DIFF=$(git diff --unified=0 "$file" | grep '^[+-]' | grep -v '^[+-]\{3\}' | grep -v '^[-+]$' || true)
        if [ ! -z "$DIFF" ]; then
            DETAILED_CHANGELOG+="📁 $file:\n"
            while IFS= read -r line; do
                if [[ $line == +* && $line != +++ ]]; then
                    DETAILED_CHANGELOG+="  ✨ ${line:1}\n"
                fi
            done <<< "$DIFF"
        fi
    fi
done

# Show generated detailed changelog
echo -e "\n${GREEN}Generated Changelog:${NC}"
echo -e "$DETAILED_CHANGELOG"

# Ask for version bump type
echo -e "\n${BLUE}Select version bump type:${NC}"
echo "1) Major (x.0.0)"
echo "2) Minor (0.x.0)"
echo "3) Patch (0.0.x)"
read -p "Enter choice (1-3): " VERSION_CHOICE

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case $VERSION_CHOICE in
    1)
        NEW_VERSION="$((MAJOR + 1)).0.0"
        VERSION_TYPE="major"
        ;;
    2)
        NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
        VERSION_TYPE="minor"
        ;;
    3)
        NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
        VERSION_TYPE="patch"
        ;;
    *)
        echo "Invalid choice. Using patch version."
        NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
        VERSION_TYPE="patch"
        ;;
esac

# Update version in package.json
npm version $VERSION_TYPE --no-git-tag-version

# Stage all changes
echo -e "\n${BLUE}Staging changes...${NC}"
git add .

# Create commit message with detailed changelog
COMMIT_MESSAGE="Release v$NEW_VERSION\n\n$DETAILED_CHANGELOG"

# Commit changes
echo -e "\n${BLUE}Committing changes...${NC}"
echo -e "$COMMIT_MESSAGE" | git commit -F -

# Create tag
echo -e "\n${BLUE}Creating tag v$NEW_VERSION...${NC}"
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"

# Push changes and tags
echo -e "\n${BLUE}Pushing changes to GitHub...${NC}"
git push origin main
git push origin "v$NEW_VERSION"

# Create release notes file with more detailed information
cat > release_notes.md << EOF
# Release v$NEW_VERSION

## 🚀 What's New
$DETAILED_CHANGELOG

## 📝 Commit History
$(git log $(git describe --tags --abbrev=0 2>/dev/null)..HEAD --pretty=format:"- %s")

## 🔍 Technical Details
- Version: v$NEW_VERSION
- Release Type: $VERSION_TYPE
- Release Date: $(date +"%Y-%m-%d")
EOF

# Create the GitHub release
echo -e "\n${BLUE}Creating GitHub Release...${NC}"
gh release create "v$NEW_VERSION" \
    --title "Release v$NEW_VERSION" \
    --notes-file release_notes.md

# Clean up release notes file
rm release_notes.md

echo -e "${GREEN}✅ Release v$NEW_VERSION created successfully${NC}"

# Build the project
echo -e "\n${BLUE}Building project...${NC}"
rm -rf .next
npm install --legacy-peer-deps
npm run build

# Deploy to Netlify
echo -e "\n${BLUE}Deploying to Netlify...${NC}"
netlify deploy --prod --dir=.next

echo -e "\n${GREEN}✅ Process Complete!${NC}"
echo -e "✓ Version updated to v$NEW_VERSION"
echo -e "✓ Changes committed and pushed"
echo -e "✓ GitHub release created"
echo -e "✓ Deployed to Netlify"

# Optional: Open relevant URLs
echo -e "\n${BLUE}Opening relevant URLs...${NC}"
echo -e "Opening GitHub releases page..."
gh browse

echo -e "\n${YELLOW}Don't forget to check:${NC}"
echo -e "1. GitHub releases page for the new release"
echo -e "2. Netlify dashboard for deployment status"
echo -e "3. Your live site for the changes"
