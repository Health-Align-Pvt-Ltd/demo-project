# Migration Guide

This guide explains how to migrate apps from using the shared `@health-align/core` package to being self-contained.

## Steps to Migrate an App

1. Create the core directory structure:
   ```bash
   mkdir src/core src/core/firebase src/core/ui
   ```

2. Copy the core files:
   ```bash
   cp -r packages/core/firebase/* apps/[app-name]/src/core/firebase/
   cp -r packages/core/ui/* apps/[app-name]/src/core/ui/
   ```

3. Create index files:
   - `apps/[app-name]/src/core/firebase/index.js`
   - `apps/[app-name]/src/core/ui/index.js`
   - `apps/[app-name]/src/core/index.js`

4. Update imports in the app's components:
   - Change `@health-align/core/firebase` to `../core/firebase`
   - Change `@health-align/core/ui/*` to `../core/ui`

5. Update the app's package.json:
   - Remove `@health-align/core` dependency
   - Add `firebase` dependency if needed

6. Update the main package.json:
   - Remove the app from workspaces if using workspaces

## Example Migration Script

```bash
#!/bin/bash

# Migration script for moving an app to self-contained structure
APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./migrate-app.sh <app-name>"
  exit 1
fi

# Create core directory structure
mkdir -p apps/$APP_NAME/src/core/firebase
mkdir -p apps/$APP_NAME/src/core/ui

# Copy core files
cp -r packages/core/firebase/* apps/$APP_NAME/src/core/firebase/
cp -r packages/core/ui/* apps/$APP_NAME/src/core/ui/

# Create index files
echo "export * from './authService';
export * from './config';
export * from './firestoreService';" > apps/$APP_NAME/src/core/firebase/index.js

echo "export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Modal } from './Modal';" > apps/$APP_NAME/src/core/ui/index.js

echo "export * as firebase from './firebase';
export * as ui from './ui';" > apps/$APP_NAME/src/core/index.js

echo "Migration completed for $APP_NAME"
```