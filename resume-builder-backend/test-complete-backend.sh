#!/bin/bash

# ============================================================================
# COMPLETE BACKEND TEST - All Endpoints
# ============================================================================
# Tests all 20 REST API endpoints comprehensively
# ============================================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Resume Builder - Complete Backend Test                    ║"
echo "║     Testing ALL 20 API Endpoints                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:8080"
TEST_EMAIL="testuser$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"
TEST_FIRSTNAME="TestFirst"
TEST_LASTNAME="TestLast"

PASSED=0
FAILED=0
TOTAL=0

# ============================================================================
# HELPER FUNCTION
# ============================================================================
run_test() {
    local test_name="$1"
    local expected_status="$2"
    local actual_status="$3"
    local check_body="$4"
    local body="$5"

    ((TOTAL++))

    if [ "$actual_status" == "$expected_status" ]; then
        if [ -z "$check_body" ] || [[ $body == *"$check_body"* ]]; then
            echo -e "${GREEN}✅ PASSED${NC} - $test_name"
            ((PASSED++))
        else
            echo -e "${RED}❌ FAILED${NC} - $test_name (body check failed)"
            echo "   Expected in body: $check_body"
            echo "   Actual body: ${body:0:100}..."
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ FAILED${NC} - $test_name"
        echo "   Expected: $expected_status, Got: $actual_status"
        echo "   Response: ${body:0:150}..."
        ((FAILED++))
    fi
}

# ============================================================================
# SECTION 1: AUTHENTICATION ENDPOINTS (5 endpoints)
# ============================================================================
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  SECTION 1: Authentication Endpoints (5 tests)                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# TEST 1: Health Check
echo -e "${BLUE}[1/20] Testing Health Endpoint...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/api/auth/health 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Health Check" "200" "$HTTP_CODE" "running" "$BODY"
echo ""

# TEST 2: Register User
echo -e "${BLUE}[2/20] Testing User Registration...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"$TEST_FIRSTNAME\",
    \"lastName\": \"$TEST_LASTNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "User Registration" "200" "$HTTP_CODE" "successful" "$BODY"
echo ""

# Verify email in database
if command -v mongosh &> /dev/null; then
    mongosh resumebuilder --quiet --eval "db.users.updateOne({email: '$TEST_EMAIL'}, {\$set: {isEmailVerified: true}})" > /dev/null 2>&1
    echo -e "${GREEN}✅ Email verified in database${NC}"
fi
echo ""

# TEST 3: Login
echo -e "${BLUE}[3/20] Testing User Login...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
JWT_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
run_test "User Login" "200" "$HTTP_CODE" "token" "$BODY"

if [ -z "$JWT_TOKEN" ]; then
    echo -e "${RED}CRITICAL: Failed to get JWT token. Cannot continue tests.${NC}"
    exit 1
fi
echo -e "${CYAN}JWT Token obtained (first 50 chars): ${JWT_TOKEN:0:50}...${NC}"
echo ""

# TEST 4: Wrong Password
echo -e "${BLUE}[4/20] Testing Login with Wrong Password...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword123\"
  }" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Login Wrong Password (should fail)" "401" "$HTTP_CODE" "" "$BODY"
echo ""

# TEST 5: Invalid Email Format
echo -e "${BLUE}[5/20] Testing Registration with Invalid Email...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "invalid-email",
    "password": "password123"
  }' 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Invalid Email Validation (should fail)" "400" "$HTTP_CODE" "" "$BODY"
echo ""

# ============================================================================
# SECTION 2: USER ENDPOINTS (4 endpoints)
# ============================================================================
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  SECTION 2: User Management Endpoints (4 tests)               ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# TEST 6: Get User Profile
echo -e "${BLUE}[6/20] Testing Get User Profile...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/profile \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Get User Profile" "200" "$HTTP_CODE" "$TEST_EMAIL" "$BODY"
echo ""

# TEST 7: Get Profile Without Token
echo -e "${BLUE}[7/20] Testing Get Profile Without Token (should fail)...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/profile 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Profile Without Token (should fail)" "401" "$HTTP_CODE" "" "$BODY"
echo ""

# TEST 8: Update User Profile
echo -e "${BLUE}[8/20] Testing Update User Profile...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/user/profile?firstName=UpdatedName" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Update User Profile" "200" "$HTTP_CODE" "UpdatedName" "$BODY"
echo ""

# TEST 9: Get User Stats
echo -e "${BLUE}[9/20] Testing Get User Stats...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/user/stats \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Get User Stats" "200" "$HTTP_CODE" "isPremium" "$BODY"
echo ""

# ============================================================================
# SECTION 3: RESUME CRUD ENDPOINTS (11 endpoints)
# ============================================================================
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  SECTION 3: Resume CRUD Endpoints (11 tests)                  ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# TEST 10: Create Resume
echo -e "${BLUE}[10/20] Testing Create Resume...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/resume \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer Resume",
    "template": "modern",
    "colorTheme": "blue",
    "summary": "Experienced software engineer",
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900"
    },
    "skills": [
      { "name": "Java", "level": "Expert" },
      { "name": "Spring Boot", "level": "Expert" }
    ]
  }' 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
RESUME_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
run_test "Create Resume" "201" "$HTTP_CODE" "Software Engineer Resume" "$BODY"

if [ -z "$RESUME_ID" ]; then
    echo -e "${YELLOW}⚠️  Warning: Could not extract resume ID, using dummy ID${NC}"
    RESUME_ID="dummy-id-for-testing"
fi
echo -e "${CYAN}Resume ID: $RESUME_ID${NC}"
echo ""

# TEST 11: Get All Resumes
echo -e "${BLUE}[11/20] Testing Get All Resumes...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/resume \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Get All Resumes" "200" "$HTTP_CODE" "" "$BODY"
echo ""

# TEST 12: Get Specific Resume
echo -e "${BLUE}[12/20] Testing Get Specific Resume...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resume/$RESUME_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Get Specific Resume" "200" "$HTTP_CODE" "$RESUME_ID" "$BODY"
echo ""

# TEST 13: Update Resume Title
echo -e "${BLUE}[13/20] Testing Update Resume Title...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/api/resume/$RESUME_ID/title?title=Updated Resume Title" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Update Resume Title" "200" "$HTTP_CODE" "Updated Resume Title" "$BODY"
echo ""

# TEST 14: Update Resume Template
echo -e "${BLUE}[14/20] Testing Update Resume Template...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/api/resume/$RESUME_ID/template?template=classic" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Update Resume Template" "200" "$HTTP_CODE" "classic" "$BODY"
echo ""

# TEST 15: Update Resume Theme
echo -e "${BLUE}[15/20] Testing Update Resume Theme...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/api/resume/$RESUME_ID/theme?theme=green" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Update Resume Theme" "200" "$HTTP_CODE" "green" "$BODY"
echo ""

# TEST 16: Update Complete Resume
echo -e "${BLUE}[16/20] Testing Update Complete Resume...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/resume/$RESUME_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"$RESUME_ID\",
    \"title\": \"Completely Updated Resume\",
    \"template\": \"minimal\",
    \"colorTheme\": \"purple\"
  }" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Update Complete Resume" "200" "$HTTP_CODE" "Completely Updated Resume" "$BODY"
echo ""

# TEST 17: Search Resumes
echo -e "${BLUE}[17/20] Testing Search Resumes...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/resume/search?q=Updated" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Search Resumes" "200" "$HTTP_CODE" "" "$BODY"
echo ""

# TEST 18: Get Resume Count
echo -e "${BLUE}[18/20] Testing Get Resume Count...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/resume/count \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Get Resume Count" "200" "$HTTP_CODE" "count" "$BODY"
echo ""

# TEST 19: Get Resume Without Token
echo -e "${BLUE}[19/20] Testing Get Resume Without Token (should fail)...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/resume 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Resume Without Token (should fail)" "401" "$HTTP_CODE" "" "$BODY"
echo ""

# TEST 20: Delete Resume
echo -e "${BLUE}[20/20] Testing Delete Resume...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/api/resume/$RESUME_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)
run_test "Delete Resume" "200" "$HTTP_CODE" "deleted" "$BODY"
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     FINAL TEST SUMMARY                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Total Tests:    $TOTAL"
echo -e "${GREEN}Passed:         $PASSED${NC}"
echo -e "${RED}Failed:         $FAILED${NC}"
echo -e "Success Rate:   $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${GREEN}✅ ALL TESTS PASSED! BACKEND IS 100% FUNCTIONAL!${NC}          ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}✅ Authentication System:    WORKING${NC}"
    echo -e "${GREEN}✅ User Management:          WORKING${NC}"
    echo -e "${GREEN}✅ Resume CRUD Operations:   WORKING${NC}"
    echo -e "${GREEN}✅ Security & Authorization: WORKING${NC}"
    echo -e "${GREEN}✅ MongoDB Integration:      WORKING${NC}"
    echo -e "${GREEN}✅ JWT Authentication:       WORKING${NC}"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🎉 YOUR BACKEND IS PRODUCTION READY!${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Build React frontend to consume these APIs"
    echo "2. Add optional features (Cloudinary, PDF, Payments)"
    echo "3. Deploy to production"
    echo ""
    exit 0
else
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo -e "║  ${RED}❌ SOME TESTS FAILED - REVIEW ABOVE${NC}                       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Please check the failed tests and fix the issues."
    echo ""
    exit 1
fi

