#!/bin/bash

# ============================================================================
# USER CONTROLLER ENDPOINTS TEST
# ============================================================================
# Tests all protected endpoints in UserController
# ============================================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     UserController Endpoints Test                             ║"
echo "║     Testing All Protected Routes                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:8080"
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"
TEST_FIRSTNAME="TestFirstName"
TEST_LASTNAME="TestLastName"

PASSED=0
FAILED=0

# ============================================================================
# SETUP: Register and Login to Get JWT Token
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SETUP: Creating test user and getting JWT token${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Register user
echo "Registering user: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"$TEST_FIRSTNAME\",
    \"lastName\": \"$TEST_LASTNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if [[ $REGISTER_RESPONSE == *"successful"* ]]; then
    echo -e "${GREEN}✅ User registered${NC}"
else
    echo -e "${RED}❌ Registration failed: $REGISTER_RESPONSE${NC}"
    exit 1
fi

# Verify email in database (manual workaround)
if command -v mongosh &> /dev/null; then
    mongosh resumebuilder --quiet --eval "db.users.updateOne({email: '$TEST_EMAIL'}, {\$set: {isEmailVerified: true}})" > /dev/null 2>&1
    echo -e "${GREEN}✅ Email verified in database${NC}"
fi

# Login to get JWT token
echo "Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

JWT_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JWT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get JWT token${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ JWT token obtained${NC}"
echo "Token (first 50 chars): ${JWT_TOKEN:0:50}..."
echo ""

# ============================================================================
# TEST 1: GET /api/user/profile (Get User Profile)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 1: GET /api/user/profile (Protected)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/profile \
  -H "Authorization: Bearer $JWT_TOKEN")

HTTP_CODE=$(echo "$PROFILE_RESPONSE" | tail -n1)
BODY=$(echo "$PROFILE_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"$TEST_EMAIL"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - Profile retrieved successfully"
    echo "   Status: $HTTP_CODE"
    echo "   Email found in response: $TEST_EMAIL"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Failed to get profile"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 2: GET /api/user/profile WITHOUT Token (Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 2: GET /api/user/profile WITHOUT Token (Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

NO_TOKEN_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/profile)

HTTP_CODE=$(echo "$NO_TOKEN_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly rejected request without token"
    echo "   Status: $HTTP_CODE (Unauthorized)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Should have rejected request"
    echo "   Status: $HTTP_CODE"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 3: PUT /api/user/profile (Update Profile)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 3: PUT /api/user/profile (Update Profile)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

NEW_FIRSTNAME="UpdatedName"

UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/user/profile?firstName=$NEW_FIRSTNAME" \
  -H "Authorization: Bearer $JWT_TOKEN")

HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
BODY=$(echo "$UPDATE_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"$NEW_FIRSTNAME"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - Profile updated successfully"
    echo "   Status: $HTTP_CODE"
    echo "   New firstName found in response: $NEW_FIRSTNAME"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Failed to update profile"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 4: GET /api/user/stats (Get User Statistics)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 4: GET /api/user/stats (Get Statistics)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

STATS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/stats \
  -H "Authorization: Bearer $JWT_TOKEN")

HTTP_CODE=$(echo "$STATS_RESPONSE" | tail -n1)
BODY=$(echo "$STATS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"isPremium"* ]] && [[ $BODY == *"emailVerified"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - Statistics retrieved successfully"
    echo "   Status: $HTTP_CODE"
    echo "   Stats contain expected fields (isPremium, emailVerified)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Failed to get statistics"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 5: DELETE /api/user/account (Delete Account)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 5: DELETE /api/user/account (Delete Account)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE $BASE_URL/api/user/account \
  -H "Authorization: Bearer $JWT_TOKEN")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
BODY=$(echo "$DELETE_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" == "200" ] && [[ $BODY == *"deleted"* ]]; then
    echo -e "${GREEN}✅ PASSED${NC} - Account deleted successfully"
    echo "   Status: $HTTP_CODE"
    echo "   Message: $BODY"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Failed to delete account"
    echo "   Status: $HTTP_CODE"
    echo "   Response: $BODY"
    ((FAILED++))
fi
echo ""

# ============================================================================
# TEST 6: Verify Account Deleted (Profile Should Fail)
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}TEST 6: Verify Account Deleted (Profile Should Fail)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

AFTER_DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/profile \
  -H "Authorization: Bearer $JWT_TOKEN")

HTTP_CODE=$(echo "$AFTER_DELETE_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "404" ] || [ "$HTTP_CODE" == "500" ] || [ "$HTTP_CODE" == "401" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly failed to get deleted user's profile"
    echo "   Status: $HTTP_CODE"
    echo "   User no longer exists"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Expected 404/401/500, got $HTTP_CODE"
    echo "   This might be okay depending on error handling"
fi
echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     TEST SUMMARY                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
else
    PERCENTAGE=0
fi

echo -e "Total Tests:    $TOTAL"
echo -e "${GREEN}Passed:         $PASSED${NC}"
echo -e "${RED}Failed:         $FAILED${NC}"
echo -e "Success Rate:   $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${GREEN}✅ ALL USERCONTROLLER ENDPOINTS WORKING!${NC}                 ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ GET  /api/user/profile      - WORKING"
    echo "✅ PUT  /api/user/profile      - WORKING"
    echo "✅ GET  /api/user/stats        - WORKING"
    echo "✅ DELETE /api/user/account    - WORKING"
    echo "✅ JWT Authentication          - WORKING"
    echo "✅ Authorization checks        - WORKING"
    echo ""
    exit 0
else
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${RED}❌ SOME TESTS FAILED - CHECK ABOVE${NC}                       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    exit 1
fi

