import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Cross Module Validation - Meetings to Diary', () => {

  test.setTimeout(180000);

  test('TC-CROSS-001: Verify Created Meeting Is Displayed In Diary Day View',
    async ({ meetingsPage, diaryPage }) => {

      Logger.testStart(
        'TC-CROSS-001: Verify Created Meeting Is Displayed In Diary Day View'
      );

      /* ==================== CREATE MEETING ==================== */

      const unique = Date.now();

      const meetingTitle = `Automation Meeting ${unique}`;

      await meetingsPage.goto();

      await meetingsPage.createMeeting({
        title: meetingTitle,
        meetingType: 1,
        meetingThrough: 'Hybrid',
        priority: 'High',
        chairpersonIndex: 2,
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

      /* ==================== OPEN DIARY ==================== */

      await diaryPage.openDiaryDayView();

      /* ==================== FETCH ALL MEETING TITLES ==================== */

      const diaryMeetingTitles =
        await diaryPage.getDayViewMeetingTitles();

      Logger.info(
        `Total Meetings Found In Diary: ${diaryMeetingTitles.length}`
      );

      diaryMeetingTitles.forEach((title, index) => {
        Logger.info(
          `Meeting ${index + 1}: ${title}`
        );
      });

      /* ==================== STRICT VALIDATION ==================== */

        Assertions.verifyArrayContains(
        diaryMeetingTitles,
        meetingTitle,
        'Diary Meeting Titles'
        );

        Logger.success(
        `Verified Meeting '${meetingTitle}' is displayed in Diary Day View`
        );
    });
});