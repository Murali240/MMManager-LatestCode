import { test } from '@fixtures/AuthFixtures';
import { expect } from '@playwright/test';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Cross Module Validation - Meetings To Dashboard',
  () => {

    test.setTimeout(120000);

    test(
      'TC-CROSS-002: Verify Created Meeting Is Displayed In Meetings Dashboard',

      async ({ meetingsPage, dashboardPage }) => {

        Logger.testStart(
          'TC-CROSS-002: Verify Created Meeting Is Displayed In Meetings Dashboard'
        );

        /* ==================== CREATE MEETING ==================== */

        const unique = Date.now();

        const meetingTitle =
          `Automation Meeting ${unique}`;

        await meetingsPage.goto();

        await meetingsPage.createMeeting({
          title: meetingTitle,
          meetingType: 1,
          meetingThrough: 'Hybrid',
          priority: 'High',
          chairpersonIndex: 3,
          participantIndex: 5,
          agenda: `Agenda ${unique}`
        });

        await Assertions.verifyElementVisible(
          meetingsPage.getSuccessMessage(),
          'Meeting Created Successfully Popup'
        );

        Logger.success(
          `Meeting Created Successfully : ${meetingTitle}`
        );

        /* ==================== OPEN MEETINGS DASHBOARD ==================== */

        await dashboardPage.openMeetingsDashboard();

        /* ==================== VERIFY MEETING EXISTS ==================== */

        const isMeetingFound =
          await dashboardPage.isMeetingPresentInDashboard(
            meetingTitle
          );

        expect(isMeetingFound).toBeTruthy();

        Logger.success(
          `Verified Meeting '${meetingTitle}' is displayed in Meetings Dashboard`
        );

        Logger.testEnd(
          'TC-CROSS-002'
        );
      }
    );
  }
);