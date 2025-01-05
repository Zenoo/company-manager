#!/bin/bash

# Don't build outside production
if [[ "$VERCEL_ENV" != "production" ]] ; then
  echo "🛑 - Build cancelled outside production"
  exit 0;
fi

echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE"

if [[ "$VERCEL_GIT_COMMIT_MESSAGE" == chore\(main\):\ release* ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi