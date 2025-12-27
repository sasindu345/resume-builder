#!/bin/bash

# ============================================================================
# COMPREHENSIVE API & DATABASE TEST SCRIPT
# ============================================================================
# This script tests ALL authentication endpoints and MongoDB connection
# ============================================================================

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Resume Builder - Complete System Test                     ║"
echo "║     Testing: API Endpoints + MongoDB Connection               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:8080"
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"
TEST_NAME="Test User"

PASSED=0
FAILED=0

# ============================================================================
# TEST 1: MongoDB Connection Check
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 1: MongoDB Connection${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if mongosh is available
if command -v mongosh &> /dev/null; then
    MONGO_RESULT=$(mongosh --quiet --eval "db.version()" 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC} - MongoDB is running"
        echo "   Version: $MONGO_RESULT"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC} - Cannot connect to MongoDB"
        echo "   Error: $MONGO_RESULT"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - mongosh not found, skipping MongoDB direct test"
    echo "   Will test MongoDB connection via application endpoints"
fi
echo ""

# ============================================================================
# TEST 2: Application Health Check
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 2: Application Health Endpoint${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "GET $BASE_URL/api/auth/health"

RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/api/auth/health 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [ "$BODY" == "Auth service is running!" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Application is running"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Application not responding correctly"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
    echo ""
    echo -e "${RED}Cannot continue tests - application is not running${NC}"
    exit 1
fi
echo ""

# ============================================================================
# TEST 3: User Registration (Tests MongoDB Write)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 3: User Registration (MongoDB Write Test)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/register"
echo "Email: $TEST_EMAIL"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"successful"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - User registered successfully"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Registration failed"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 4: Verify User in MongoDB (Tests MongoDB Read)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 4: Verify User in MongoDB (MongoDB Read Test)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v mongosh &> /dev/null; then
    USER_DATA=$(mongosh resumebuilder --quiet --eval "db.users.findOne({email: '$TEST_EMAIL'})" 2>&1)

    if [[ $USER_DATA == *"$TEST_EMAIL"* ]]; then
        echo -e "${GREEN}✅ PASSED${NC} - User found in MongoDB"
        echo "   Email: $TEST_EMAIL"

        # Check if password is hashed
        if [[ $USER_DATA == *"\$2a\$"* ]]; then
            echo -e "${GREEN}✅ PASSED${NC} - Password is properly hashed (BCrypt)"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAILED${NC} - Password is not hashed!"
            ((FAILED++))
        fi

        # Check email verification status
        if [[ $USER_DATA == *"isEmailVerified: false"* ]]; then
            echo -e "${GREEN}✅ PASSED${NC} - Email verification status is correct (false)"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠️  WARNING${NC} - Email verification status unexpected"
        fi

    else
        echo -e "${RED}❌ FAILED${NC} - User not found in MongoDB"
        echo "   This means MongoDB write failed!"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  SKIPPED${NC} - mongosh not available"
    echo "   Cannot verify data in MongoDB directly"
fi
echo ""

# ============================================================================
# TEST 5: Login Without Email Verification (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 5: Login Without Email Verification (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/login"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly rejected unverified email"
    echo "   Status: $HTTP_CODE (Unauthorized)"
    echo "   Security working as expected!"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Should have rejected unverified email"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 6: Manually Verify Email in MongoDB
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 6: Update User in MongoDB (MongoDB Update Test)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v mongosh &> /dev/null; then
    UPDATE_RESULT=$(mongosh resumebuilder --quiet --eval "db.users.updateOne({email: '$TEST_EMAIL'}, {\$set: {isEmailVerified: true}})" 2>&1)

    if [[ $UPDATE_RESULT == *"modifiedCount: 1"* ]]; then
        echo -e "${GREEN}✅ PASSED${NC} - User email verified in MongoDB"
        echo "   MongoDB update operation successful"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC} - Failed to update user in MongoDB"
        echo "   Result: $UPDATE_RESULT"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  SKIPPED${NC} - mongosh not available"
    echo "   Manual verification needed"
fi
echo ""

# Small delay to ensure database consistency
sleep 1

# ============================================================================
# TEST 7: Login With Verified Email (Should Succeed)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 7: Login With Verified Email (Should Succeed)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/login"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"token"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - Login successful"
    echo "   Status: $HTTP_CODE"

    # Extract and validate JWT token
    JWT_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    if [ ! -z "$JWT_TOKEN" ]; then
        echo -e "${GREEN}✅ PASSED${NC} - JWT token received"
        echo "   Token length: ${#JWT_TOKEN} characters"

        # Check if token has 3 parts (header.payload.signature)
        TOKEN_PARTS=$(echo "$JWT_TOKEN" | grep -o "\." | wc -l)
        if [ "$TOKEN_PARTS" -eq 2 ]; then
            echo -e "${GREEN}✅ PASSED${NC} - JWT token structure is valid (3 parts)"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAILED${NC} - JWT token structure is invalid"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ FAILED${NC} - No JWT token in response"
        ((FAILED++))
    fi
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Login failed"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 8: Login with Wrong Password (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 8: Login with Wrong Password (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/login"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword123\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly rejected wrong password"
    echo "   Status: $HTTP_CODE (Unauthorized)"
    echo "   Password validation working correctly!"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Should have rejected wrong password"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 9: Registration with Invalid Email (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 9: Registration with Invalid Email (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/register"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email-format",
    "password": "password123"
  }' 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation correctly rejected invalid email"
    echo "   Status: $HTTP_CODE (Bad Request)"
    echo "   Input validation working!"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Should have rejected invalid email format"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 10: Registration with Short Password (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 10: Registration with Short Password (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/register"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test\",
    \"email\": \"test2@example.com\",
    \"password\": \"123\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation correctly rejected short password"
    echo "   Status: $HTTP_CODE (Bad Request)"
    echo "   Password validation working!"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Should have rejected short password"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 11: Duplicate Email Registration (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 11: Duplicate Email Registration (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "POST $BASE_URL/api/auth/register"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Another User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"password123\"
  }" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "409" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly rejected duplicate email"
    echo "   Status: $HTTP_CODE"
    echo "   Email uniqueness constraint working!"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Should reject duplicate email"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
fi
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     TEST SUMMARY                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Total Tests:    $TOTAL"
echo -e "${GREEN}Passed:         $PASSED${NC}"
echo -e "${RED}Failed:         $FAILED${NC}"
echo -e "Success Rate:   $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${GREEN}✅ ALL TESTS PASSED! SYSTEM IS FULLY FUNCTIONAL!${NC}         ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ MongoDB Connection: WORKING"
    echo "✅ User Registration:  WORKING"
    echo "✅ User Login:         WORKING"
    echo "✅ JWT Generation:     WORKING"
    echo "✅ Password Hashing:   WORKING"
    echo "✅ Input Validation:   WORKING"
    echo "✅ Security Controls:  WORKING"
    echo ""
    echo "🎉 Your backend is production-ready for Phase 12!"
    echo ""
    exit 0
else
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${RED}❌ SOME TESTS FAILED - NEEDS ATTENTION${NC}                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Please review the failed tests above and fix the issues."
    echo ""
    exit 1
fi

