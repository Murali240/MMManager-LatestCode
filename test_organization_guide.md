# Test Organization & Tagging Guide

## 📁 **File Structure - Answer: YES, Separate Files!**

```
tests/
├── dashboard/
│   ├── dashboard-load.spec.ts        ← TC-DB-001 to TC-DB-010
│   └── scheduleFromDashboard.spec.ts ← TC-DB-011 to TC-DB-020
├── meetings/
│   ├── meetings-create.spec.ts       ← TC-MT-001 to TC-MT-010
│   ├── meetings-reschedule.spec.ts   ← TC-MT-011 to TC-MT-020
│   └── meetings-e2e.spec.ts          ← End-to-end workflows
├── diary/
│   └── diaryDayViewMeetings.spec.ts  ← TC-DI-001 to TC-DI-010
└── data-driven/
  ├── csv-login.spec.ts
  ├── json-login.spec.ts
  └── excel-login.spec.ts
```

**Why separate files?**
- ✅ Each file is ~300-500 lines (manageable)
- ✅ Easy to find tests
- ✅ Can run specific features
- ✅ Team can work on different files
- ✅ CI/CD can run in parallel

---

## 🏷️ **Tagging Strategy**

### **Tag Levels:**

```typescript
test.describe('Meetings List Page @meetings @list', () => {
  //                              ^^^^^^^^  ^^^^^
  //                              Module    Feature
  
  test('TC-MT-001: View Page @smoke @regression', async () => {
    //                        ^^^^^^  ^^^^^^^^^^
    //                        Priority  Suite
  });
});
```

### **Module Tags (MM Manager)**:
```typescript
@dashboard      // Dashboard module tests
@meetings       // Meetings module tests
@diary          // Diary / calendar tests
@data-driven    // CSV/Excel/JSON data-driven tests
@users          // User/registration tests
```

### **Feature Tags:**
```typescript
@list           // List/view tests
@add            // Create/add tests
@edit           // Edit/update tests
@delete         // Delete tests
@search         // Search tests
@filter         // Filter tests
```

### **Priority Tags (usage guidance)**:
```typescript
@smoke          // Critical, fast tests that verify core flows (short, must-pass)
@regression     // Comprehensive suite; includes smoke + full coverage
@negative       // Error/validation tests
@edge           // Edge case tests
@e2e            // Full end-to-end workflows (long-running)
```

### **Custom Tags:**
```typescript
@wip            // Work in progress
@skip           // Skip this test
@slow           // Tests that take >30 seconds
@e2e            // End-to-end workflows
```

---

## 🚀 **How to Run Tests with Tags**

### **Run by File:**
```bash
# Run dashboard tests
npx playwright test tests/dashboard/

# Run meetings tests
npx playwright test tests/meetings/

# Run data-driven tests
npx playwright test tests/data-driven/
```

### **Run by Tag:**
```bash
# Run ONLY smoke tests (all files)
npx playwright test --grep @smoke

# Run ONLY regression tests
npx playwright test --grep @regression

# Run ONLY negative tests
npx playwright test --grep @negative

# Run all meetings module tests
npx playwright test --grep @meetings

# Run only meetings list tests
npx playwright test --grep "@meetings.*@list"
```

### **Combine Tags (AND):**
```bash
# Run smoke tests for meetings module
npx playwright test --grep "@meetings.*@smoke"

# Run regression tests for add feature
npx playwright test --grep "@add.*@regression"
```

### **Exclude Tags:**
```bash
# Run all tests EXCEPT work in progress
npx playwright test --grep-invert @wip

# Run all tests EXCEPT slow tests
npx playwright test --grep-invert @slow
```

### **Run Specific Test:**
```bash
# By test ID
npx playwright test -g "TC-MT-001"

# By test name
npx playwright test -g "Create Meeting (Basic)"
```

### **Run with UI Mode:**
```bash
# Best for development
npx playwright test --ui

# Filter by tag in UI
npx playwright test --grep @smoke --ui
```

### **Run in Headed Mode (See Browser):**
```bash
npx playwright test tests/meetings/meetings-create.spec.ts --headed
```

---

## 📊 **Tag Usage Matrix**

### **Typical Test Tags:**

| Test Type | Tags | Run Command |
|-----------|------|-------------|
| Critical path | `@smoke @regression` | `--grep @smoke` |
| Happy path | `@regression` | `--grep @regression` |
| Validations | `@negative @regression` | `--grep @negative` |
| Edge cases | `@edge @regression` | `--grep @edge` |
| Full workflow | `@e2e @regression` | `--grep @e2e` |

---

## 🎯 **Your Test Scenarios - Organized:**

### **File 1: meetings-create.spec.ts**
```typescript
test.describe('Create Meeting Flow @meetings @create', () => {

  // Critical flow - include in @smoke and @regression
  test('TC-MT-001: Create Meeting (Basic) @smoke @regression', async () => {
    // - User logged in as scheduler
    // - User navigates to schedule meeting
    // - Meeting created successfully and visible on diary
  });

  // Important but not always smoke
  test('TC-MT-002: Create Meeting with Attendees @regression', async () => { });

  test('TC-MT-003: Create Meeting with Recurrence @regression', async () => { });

  // Negative tests
  test('TC-MT-NEG-001: Create Meeting Without Required Fields @negative @regression', async () => { });
});
```

### **File 2: meetings-reschedule.spec.ts**
```typescript
test.describe('Reschedule / Update Meeting @meetings @reschedule', () => {
  test('TC-MT-011: Reschedule Meeting (Happy Path) @regression', async () => { });
  test('TC-MT-012: Update Meeting Details @regression', async () => { });
  test('TC-MT-013: Change Attendees @regression', async () => { });
});
```

### **File 3: diaryDayViewMeetings.spec.ts**
```typescript
test.describe('Diary / Day View @diary', () => {
  test('TC-DI-001: Diary Day View shows scheduled meetings @smoke @regression', async () => { });
  test('TC-DI-002: Navigate between days @regression', async () => { });
});
```

---

## 📝 **Test Naming Convention**

```typescript
// Format:
test('TC-[MODULE]-[NUMBER]: [Description] @tags', async () => { });

// Examples:
test('TC-MT-001: Create Meeting (Basic) @smoke @regression', async () => { });
test('TC-MT-011: Reschedule Meeting @smoke @regression', async () => { });
test('TC-DI-001: Edit Diary Entry @smoke @regression', async () => { });
test('TC-MT-NEG-001: Submit Without Fields @negative @regression', async () => { });
test('TC-MT-EDGE-001: Max Length Field @edge @regression', async () => { });

// Module Codes:
// DB = Dashboard
// MT = Meetings
// DI = Diary
// DD = Data-Driven
// UP = Users/Registration
```

---

## 🎯 **CI/CD Integration**

### **package.json scripts:**
```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:regression": "playwright test --grep @regression",
    "test:meetings": "playwright test --grep @meetings",
    "test:negative": "playwright test --grep @negative",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  }
}
```

### **GitHub Actions workflow:**
```yaml
# .github/workflows/tests.yml
jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:smoke
  
  regression-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:regression
```

---

## ✅ **Best Practices**

### **1. Tag Every Test:**
```typescript
// ❌ BAD - No tags
test('View page', async () => { });

// ✅ GOOD - Has tags
test('TC-MT-001: View page @smoke @regression', async () => { });
```

### **2. Use Multiple Tags:**
```typescript
// Every test should have at least 2 tags:
// 1. Module/Feature tag (@meetings @list)
// 2. Priority tag (@smoke or @regression or @negative)

test('TC-MT-001: View page @meetings @list @smoke @regression', async () => { });
```

### **3. Group Related Tests:**
```typescript
test.describe('Filter Tests @filter', () => {
  test('TC-MT-003: Active filter @regression', async () => { });
  test('TC-MT-004: Inactive filter @regression', async () => { });
  test('TC-MT-005: All filter @regression', async () => { });
});
```

### **4. Use Consistent Test IDs:**
```typescript
// File: meetings-create.spec.ts
TC-MT-001, TC-MT-002, TC-MT-003...  ✅

// File: meetings-reschedule.spec.ts
TC-MT-011, TC-MT-012, TC-MT-013...  ✅

// Don't mix:
TC-MT-001, TC-MT-012, TC-MT-003...  ❌
```

---

## 🚀 **Your Action Plan:**

### **Step 1: Create test files** (This week)
```bash
tests/meetings/
├── meetings-create.spec.ts    ← Start here (5-10 tests)
├── meetings-reschedule.spec.ts← Week 2 (10-15 tests)
└── meetings-e2e.spec.ts       ← Week 3 (10-15 tests)
```

### **Step 2: Tag appropriately**
- All tests get module tags: `@meetings @list`
- Critical tests get: `@smoke`
- All tests get: `@regression`
- Error tests get: `@negative`

### **Step 3: Run incrementally**
```bash
# Run what you've written so far
npx playwright test tests/meetings/ --ui

# Run smoke tests
npx playwright test --grep @smoke
```

---

## 📊 **Summary - Your Questions Answered:**

| Question | Answer |
|----------|--------|
| **Separate spec files?** | ✅ YES - One file per page/feature |
| **Use tags?** | ✅ YES - Multiple tags per test |
| **How to run tags?** | `npx playwright test --grep @smoke` |
| **Your TC-MT-001 scenario?** | ✅ Perfect! Already implemented |
| **Your TC-MT-002 scenario?** | ✅ Perfect! Already implemented |

**You have everything you need to start writing tests!** 🎉