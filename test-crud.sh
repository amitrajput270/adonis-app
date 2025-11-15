#!/bin/bash

# CRUD API Testing Script
API_BASE="http://localhost:3333/api/posts"

echo "=== Testing Posts CRUD API ==="
echo

echo "1. GET /api/posts - List all posts"
curl -s -X GET "$API_BASE" | jq '.' || echo "jq not available, raw response:"
echo
echo

echo "2. GET /api/posts/1 - Get specific post"
curl -s -X GET "$API_BASE/1" | jq '.' || echo "jq not available, raw response:"
echo
echo

echo "3. POST /api/posts - Create new post"
curl -s -X POST "$API_BASE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Test Post",
    "content": "This is a test post created via API",
    "isPublished": true,
    "userId": 1
  }' | jq '.' || echo "jq not available, raw response:"
echo
echo

echo "4. PUT /api/posts/1 - Update existing post"
curl -s -X PUT "$API_BASE/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "This post has been updated via API"
  }' | jq '.' || echo "jq not available, raw response:"
echo
echo

echo "5. GET /api/posts/1 - Verify update"
curl -s -X GET "$API_BASE/1" | jq '.' || echo "jq not available, raw response:"
echo
echo

echo "=== Testing completed ==="