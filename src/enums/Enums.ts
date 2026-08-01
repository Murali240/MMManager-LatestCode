/**
 * Enums for the MM Manager test framework
 * Helps avoid typo errors and provides type safety
 */

export enum ExcelOutputType {
  JSON = 'json',
  CSV = 'csv'
}

export enum MainMenu {
  DASHBOARD = 'Dashboard',
  DIARY = 'Diary',
  MEETINGS = 'Meetings'
}

export enum SubMenu {
  SCHEDULED_MEETINGS = 'Scheduled Meetings'
}

export enum PageHeaders {
  DASHBOARD = 'Dashboard',
  DIARY = 'Diary',
  SCHEDULE_MEETING = 'Schedule Meeting',
  EDIT_SCHEDULED_MEETING = 'Edit Scheduled Meeting',
  CREATE_FOLLOW_UP_MEETING = 'Create Follow-up Meeting',
  RESCHEDULE_MEETING = 'Reschedule Meeting'
}

export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit'
}

export enum TestEnvironment {
  DEV = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}
