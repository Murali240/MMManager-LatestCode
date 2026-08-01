import { Locator, Page } from '@playwright/test';
import { SharedComponents } from '@pages/base/SharedComponents';
import { Logger } from '@utils/logger';

export class DashboardPage extends SharedComponents {

  readonly dashboardHeader: Locator;
  readonly dashboardMenu: Locator;
  readonly meetingsDashboardLink: Locator;
  readonly scheduleNewMeetingLink: Locator;
  readonly backToDashboardLink: Locator;
  readonly scheduleMeetingHeading: Locator;
  readonly allMeetingDashboardTitles: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    super(page);

    this.dashboardHeader = this.page.locator(
      `//span[normalize-space()='Dashboard']`
    );

    this.dashboardMenu = this.page.locator(
      `//span[normalize-space()='Dashboard']`
    );

    this.meetingsDashboardLink = this.page.locator(
      `//span[normalize-space()='Meetings Dashboard']`
    );

    this.scheduleNewMeetingLink = this.page.locator(
      `a[href="/schedulemeeting/?from=dashboard"]`
    );

    this.backToDashboardLink = this.page.getByRole(
      'link',
      {
        name: 'Back to Dashboard'
      }
    );

    this.scheduleMeetingHeading = this.page.getByRole(
      'heading',
      {
        name: 'Schedule Meeting'
      }
    );

    this.allMeetingDashboardTitles = this.page.locator(
      '.meeting-card-top'
    );

    this.nextButton = this.page.locator(
      `//button[normalize-space()='Next »']`
    );
  }

  /* ==================== ACTIONS ==================== */

  async clickScheduleNewMeeting(): Promise<void> {

    Logger.info(
      'Clicking Schedule New Meeting link'
    );

    await this.clickElement(
      this.scheduleNewMeetingLink,
      'Schedule New Meeting link'
    );

    await this.waitForPageLoad();
  }

  /* ==================== VERIFICATIONS ==================== */

  async verifyDashboardLoaded(): Promise<void> {

    Logger.info(
      'Verifying Dashboard loaded'
    );

    await this.verifyElementVisible(
      this.dashboardHeader,
      'Dashboard Header'
    );
  }

  async verifyScheduleMeetingPage(): Promise<void> {

    Logger.info(
      'Waiting for Schedule Meeting page to load'
    );

    await this.page.waitForLoadState(
      'networkidle'
    );

    await this.waitForElement(
      this.scheduleMeetingHeading,
      30000
    );

    await this.verifyElementVisible(
      this.scheduleMeetingHeading,
      'Schedule Meeting Heading'
    );

    await this.verifyElementVisible(
      this.backToDashboardLink,
      'Back To Dashboard Link'
    );

    Logger.success(
      'Schedule Meeting page loaded successfully'
    );
  }

  /* ==================== NAVIGATION ==================== */

  async openMeetingsDashboard(): Promise<void> {

    Logger.info(
      'Opening Dashboard Menu'
    );

    await this.clickElement(
      this.dashboardMenu,
      'Dashboard Menu'
    );

    await this.waitForLoadingToComplete();

    Logger.info(
      'Opening Meetings Dashboard'
    );

    await this.clickElement(
      this.meetingsDashboardLink,
      'Meetings Dashboard'
    );

    await this.waitForLoadingToComplete();

    await this.page.waitForLoadState(
      'networkidle'
    );

    Logger.info(
      'Refreshing Meetings Dashboard'
    );

    await this.page.reload({
      waitUntil: 'networkidle'
    });

    await this.waitForLoadingToComplete();

    await this.waitForElement(
      this.allMeetingDashboardTitles.first(),
      30000
    );

    Logger.success(
      'Meetings Dashboard opened successfully'
    );
  }

  /* ==================== CROSS MODULE VALIDATION ==================== */

  async isMeetingPresentInDashboard(
    expectedMeetingTitle: string
  ): Promise<boolean> {

    Logger.info(
      `Searching for meeting: ${expectedMeetingTitle}`
    );

    let pageNumber = 1;

    while (true) {

      Logger.info(
        `Checking Dashboard Page ${pageNumber}`
      );

      await this.waitForElement(
        this.allMeetingDashboardTitles.first(),
        30000
      );

      const titles =
        await this.allMeetingDashboardTitles.allTextContents();

      const cleanedTitles = titles
        .map(title =>
          title
            .replace('Scheduled', '')
            .replace('Completed', '')
            .replace('Postponed', '')
            .replace('Cancelled', '')
            .replace('In-progress', '')
            .replace('In Progress', '')
            .trim()
        )
        .filter(title => title.length > 0);

      Logger.info(
        `Found ${cleanedTitles.length} meetings on page ${pageNumber}`
      );

      cleanedTitles.forEach(
        (title, index) => {

          Logger.info(
            `Meeting ${index + 1}: ${title}`
          );
        }
      );

      const meetingFound =
        cleanedTitles.some(
          title => title === expectedMeetingTitle
        );

      if (meetingFound) {

        Logger.success(
          `Meeting found on Dashboard Page ${pageNumber}`
        );

        return true;
      }

      const isDisabled =
        await this.nextButton.isDisabled();

      const ariaDisabled =
        await this.nextButton.getAttribute(
          'aria-disabled'
        );

      if (
        isDisabled ||
        ariaDisabled === 'true'
      ) {

        Logger.info(
          'Reached last Dashboard page'
        );

        break;
      }

      Logger.info(
        `Meeting not found on Page ${pageNumber}. Navigating to next page`
      );

      await this.nextButton.click();

      await this.waitForLoadingToComplete();

      await this.page.waitForLoadState(
        'networkidle'
      );

      await this.waitForElement(
        this.allMeetingDashboardTitles.first(),
        30000
      );

      pageNumber++;
    }

    Logger.error(
      `Meeting '${expectedMeetingTitle}' not found in any Dashboard page`
    );

    return false;
  }
}