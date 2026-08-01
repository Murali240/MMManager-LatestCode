import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Create', () => {

  test.setTimeout(120000);  // Set timeout to 2 minutes for this test

  // ==================== POSITIVE TEST ==================== //
  test('TC-MTG-001: Create Schedule New Meeting', async ({ meetingsPage }) => {

    Logger.testStart('TC-MTG-001: Create Schedule New Meeting');

    const unique = Date.now();

    await meetingsPage.goto();

    await meetingsPage.createMeeting({
      title: `Automation Meeting ${unique}`,
      meetingType: 1,
      meetingThrough: 'Hybrid',
      priority: 'High',
      chairpersonIndex: 1,
      participantIndex: 2,
      agenda: `Agenda ${unique}`
    });

    await Assertions.verifyElementVisible(
      meetingsPage.getSuccessMessage(),
      'Meeting Created Successfully Popup'
    );

    Logger.success('✅ Meeting created successfully');
    Logger.testEnd('TC-MTG-001');
  });


  // ==================== NEGATIVE TEST ==================== //
  test('NEG-TC-MTG-002: Chairperson Busy Validation', async ({ meetingsPage }) => {

    Logger.testStart('NEG-TC-MTG-002');

    const unique = Date.now();

    await meetingsPage.goto();

    // 🔴 IMPORTANT: pass false (no success expected)
    await meetingsPage.createMeeting({
      title: `Automation Meeting ${unique}`,
      meetingType: 1,
      meetingThrough: 'Hybrid',
      priority: 'High',
      chairpersonIndex: 1,
      participantIndex: 2,
      agenda: `Agenda ${unique}`
    }, false);

    const busyMessage = meetingsPage.getChairpersonBusyMessage();

    await Assertions.verifyElementVisible(
      busyMessage,
      'Chairperson Busy Validation Message',
      30000
    );

    await Assertions.verifyElementContainsText(
      busyMessage,
      'already has a meeting scheduled',
      'Chairperson Busy Validation Message'
    );

    Logger.success('✅ Chairperson busy validation displayed correctly');
    Logger.testEnd('NEG-TC-MTG-002');
  });

});