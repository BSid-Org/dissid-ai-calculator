#!/bin/bash
set -e

echo "=== DISSID Calculator Deploy ==="
echo ""

echo "Running tests..."
bun run test:run

echo ""
echo "Building..."
bun run build

echo ""
echo "Deploying to Firebase..."
npx -y firebase-tools@latest deploy --only hosting:calculator --project dis-sid

echo ""
echo "Deployed to https://dissid-ai-calculator.web.app"
