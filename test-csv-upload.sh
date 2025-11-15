#!/bin/bash

# Test script for CSV upload API

BASE_URL="http://localhost:3333"

echo "========================================="
echo "Testing Fees Data CSV Upload API"
echo "========================================="
echo ""

# Test 1: Upload CSV file
echo "Test 1: Uploading CSV file..."
echo "-----------------------------------------"
curl -X POST "${BASE_URL}/api/fees-data/upload" \
  -F "csv_file=@sample_fees_data.csv" \
  -H "Accept: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

# Test 2: Get all records (paginated)
echo "Test 2: Fetching all records (first page)..."
echo "-----------------------------------------"
curl -X GET "${BASE_URL}/api/fees-data?page=1&limit=5" \
  -H "Accept: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

# Test 3: Get statistics
echo "Test 3: Fetching statistics..."
echo "-----------------------------------------"
curl -X GET "${BASE_URL}/api/fees-data/stats" \
  -H "Accept: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

# Test 4: Get single record
echo "Test 4: Fetching single record (ID: 1)..."
echo "-----------------------------------------"
curl -X GET "${BASE_URL}/api/fees-data/1" \
  -H "Accept: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

echo "========================================="
echo "All tests completed!"
echo "========================================="
