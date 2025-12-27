#!/bin/bash

# ============================================================================
# Resume Builder - Quick API Test Script
# ============================================================================
# This script tests all authentication endpoints quickly
# Run: chmod +x test-api.sh && ./test-api.sh
# ============================================================================

echo "🚀 Testing Resume Builder API..."
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

# ============================================================================
# Test 1: Health Check
# ============================================================================
echo "📋 Test 1: Health Check"
echo "GET $BASE_URL/api/auth/health"
RESPONSE=$(curl -s $BASE_URL/api/auth/health)
if [ "$RESPONSE" == "Auth service is running!" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Server is running"
else
    echo -e "${RED}❌ FAILED${NC} - Server not responding"
    exit 1
fi
echo ""

# ============================================================================
# Test 2: Register User
# ============================================================================
echo "📋 Test 2: Register User"
echo "POST $BASE_URL/api/auth/register"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

if [[ $RESPONSE == *"successful"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - User registered successfully"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}❌ FAILED${NC} - Registration failed"
    echo "Response: $RESPONSE"
fi
echo ""

# ============================================================================
# Test 3: Login (will fail - email not verified)
# ============================================================================
echo "📋 Test 3: Login without email verification"
echo "POST $BASE_URL/api/auth/login"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "401" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly rejected unverified email (401)"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Expected 401, got $HTTP_CODE"
fi
echo ""

# ============================================================================
# Test 4: Invalid Email Format
# ============================================================================
echo "📋 Test 4: Invalid email format validation"
echo "POST $BASE_URL/api/auth/register"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "pass123"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation works correctly (400)"
else
    echo -e "${RED}❌ FAILED${NC} - Expected 400, got $HTTP_CODE"
fi
echo ""

# ============================================================================
# Summary
# ============================================================================
echo "================================"
echo "✅ API Testing Complete!"
echo ""
echo "Next Steps:"
echo "1. Test with Postman for detailed testing"
echo "2. Check MongoDB: mongosh → use resumebuilder → db.users.find()"
echo "3. Complete the full task in PHASE_10_11_TASK.md"
echo ""
echo "To stop the application:"
echo "  lsof -ti:8080 | xargs kill -9"
echo ""

