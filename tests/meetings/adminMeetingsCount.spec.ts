import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Meetings Module - Total Meetings Count', () => {

  test('TC-MTG-COUNT-001: Verify Total Meetings Count for Admin User',
    async ({ meetingsPage }) => {

      Logger.testStart(
        'TC-MTG-COUNT-001: Verify Total Meetings Count for Admin User'
      );

      await meetingsPage.goto();

      const totalMeetings =
        await meetingsPage.getTotalMeetingsCount();

      Logger.success(
        `Administrator Total Meetings Count = ${totalMeetings}`
      );

      expect(totalMeetings).toBeGreaterThanOrEqual(0);

      Logger.testEnd(
        'TC-MTG-COUNT-001'
      );
    });

});