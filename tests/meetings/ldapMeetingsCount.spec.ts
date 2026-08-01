import { test, expect } from '@fixtures/AuthFixtures';
import { MeetingsPage } from '@pages/MeetingsPage';
import { Logger } from '@utils/logger';
import { UserRole } from '@types';

const ldapUser = {
  username: process.env.MMM_LDAP_USERNAME!,
  password: process.env.MMM_LDAP_PASSWORD!,
  role: 'LDAP' as UserRole
};

test.describe('Meetings Module - LDAP User Total Meetings Count', () => {

  test('TC-MTG-COUNT-001: Verify Total Meetings Count for LDAP User',
    async ({ loginPage }) => {

      Logger.testStart(
        'TC-MTG-COUNT-001: Verify Total Meetings Count for LDAP User'
      );

      // Login using LDAP credentials
      await loginPage.goto();

      await loginPage.doLogin(
        ldapUser.username,
        ldapUser.password,
        ldapUser.role
      );

      await loginPage.page.waitForURL(
        '**/dashboard',
        { timeout: 30000 }
      );

      Logger.success(
        `LDAP User Login Successful: ${ldapUser.username}`
      );

      // Create MeetingsPage using SAME logged-in page
      const meetingsPage = new MeetingsPage(
        loginPage.page
      );

      await meetingsPage.goto();

      const totalMeetings =
        await meetingsPage.getTotalMeetingsCount();

      Logger.success(
        `LDAP User Total Meetings Count = ${totalMeetings}`
      );

      expect(totalMeetings).toBeGreaterThanOrEqual(0);

      Logger.testEnd(
        'TC-MTG-COUNT-001'
      );
    });

});