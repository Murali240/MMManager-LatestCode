import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { UserRole } from '@types';

/* ==================== TEST DATA ==================== */

const adminUser = {
  username: process.env.MMM_ADMIN_USERNAME!,
  password: process.env.MMM_ADMIN_PASSWORD!,
  role: 'Administrator' as UserRole
};

const ldapUser = {
  username: process.env.MMM_LDAP_USERNAME!,
  password: process.env.MMM_LDAP_PASSWORD!,
  role: 'LDAP' as UserRole
};

/* ==================== TEST SUITE ==================== */

test.describe('Logout Module - User Logout Validation', () => {

  test.beforeEach(async ({ loginPage }) => {
    Logger.info('Navigating to Login Page');
    await loginPage.goto();
  });

  /* ==================== ADMIN LOGOUT ==================== */

  test('TC-LOGOUT-001: Admin User Logout Validation', async ({ loginPage }) => {

    Logger.testStart('TC-LOGOUT-001: Admin User Logout Validation');

    test.info().annotations.push({
      type: 'role',
      description: adminUser.role
    });

    Logger.info(`Logging in as ${adminUser.role}`);

    await loginPage.doLogin(
      adminUser.username,
      adminUser.password,
      adminUser.role
    );

    await loginPage.page.waitForURL('**/dashboard', {
      timeout: 30000
    });

    await Assertions.verifyElementVisible(
      loginPage.dashboardHeader,
      'Dashboard Header'
    );

    Logger.success(`✅ ${adminUser.role} login successful`);

    // Logout
    await loginPage.logout();

    await Assertions.verifyElementVisible(
      loginPage.signinMMMHeading,
      'Login Heading'
    );

    Logger.success(`✅ ${adminUser.role} logout successful`);

    Logger.testEnd('TC-LOGOUT-001');
  });

  /* ==================== LDAP LOGOUT ==================== */

  test('TC-LOGOUT-002: LDAP User Logout Validation', async ({ loginPage }) => {

    Logger.testStart('TC-LOGOUT-002: LDAP User Logout Validation');

    test.info().annotations.push({
      type: 'role',
      description: ldapUser.role
    });

    Logger.info(`Logging in as ${ldapUser.role}`);

    await loginPage.doLogin(
      ldapUser.username,
      ldapUser.password,
      ldapUser.role
    );

    await loginPage.page.waitForURL('**/dashboard', {
      timeout: 30000
    });

    await Assertions.verifyElementVisible(
      loginPage.dashboardHeader,
      'Dashboard Header'
    );

    Logger.success(`✅ ${ldapUser.role} login successful`);

    // Logout
    await loginPage.logout();

    await Assertions.verifyElementVisible(
      loginPage.signinMMMHeading,
      'Login Heading'
    );

    Logger.success(`✅ ${ldapUser.role} logout successful`);

    Logger.testEnd('TC-LOGOUT-002');
  });

});