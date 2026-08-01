/**
 * Base Test Data Factory
 * Provides shared utilities and tracking for all specific factories
 */

import fs from 'fs';

/* ==================== DATA TRACKER (Shared) ==================== */

export interface TrackedData {
  users: Array<{ email: string; password: string; role: string; createdAt: string }>;
  meetings: Array<{ id: string; title: string; scheduledFor: string; status?: string; createdAt: string }>;
}

/**
 * Centralized Data Tracker
 * Used by factories to track created test data for cleanup or reporting
 */
export class TestDataTracker {
  private static trackingFile = './.test-data-tracker.json';
  
  private static data: TrackedData = {
    users: [],
    meetings: []
  };

  /**
   * Load tracking data from file
   */
  static load(): TrackedData {
    if (fs.existsSync(this.trackingFile)) {
      const content = fs.readFileSync(this.trackingFile, 'utf-8');
      this.data = JSON.parse(content);
    }
    return this.data;
  }

  /**
   * Save tracking data to file
   */
  static save(): void {
    fs.writeFileSync(this.trackingFile, JSON.stringify(this.data, null, 2));
  }

  /**
   * Track user
   */
  static trackUser(email: string, password: string, role: string): void {
    this.load();
    const exists = this.data.users.find(u => u.email === email);
    if (!exists) {
      this.data.users.push({
        email,
        password,
        role,
        createdAt: new Date().toISOString()
      });
      this.save();
    }
  }

  /**
   * Track meeting
   */
  static trackMeeting(
    id: string,
    title: string,
    scheduledFor: string,
    status?: string
  ): void {
    this.load();
    const exists = this.data.meetings.find(m => m.id === id);
    if (!exists) {
      this.data.meetings.push({
        id,
        title,
        scheduledFor,
        status,
        createdAt: new Date().toISOString()
      });
      this.save();
    }
  }

  /**
   * Get tracked users
   */
  static getUsers(): Array<{ email: string; password: string; role: string; createdAt: string }> {
    this.load();
    return this.data.users;
  }

  /**
   * Get tracked meetings
   */
  static getMeetings(): Array<{ id: string; title: string; scheduledFor: string; status?: string; createdAt: string }> {
    this.load();
    return this.data.meetings;
  }

  /**
   * Get last registered user
   */
  static getLastUser(role?: string) {
    this.load();
    if (role) {
      const filtered = this.data.users.filter(u => u.role === role);
      return filtered.length > 0 ? filtered[filtered.length - 1] : null;
    }
    return this.data.users.length > 0 ? this.data.users[this.data.users.length - 1] : null;
  }

  /**
   * Get last tracked meeting
   */
  static getLastMeeting(status?: string) {
    this.load();
    if (status) {
      const filtered = this.data.meetings.filter(m => m.status === status);
      return filtered.length > 0 ? filtered[filtered.length - 1] : null;
    }
    return this.data.meetings.length > 0 ? this.data.meetings[this.data.meetings.length - 1] : null;
  }

  /**
   * Clear all tracking
   */
  static clearAll(): void {
    this.data = {
      users: [],
      meetings: []
    };
    this.save();
  }

  /**
   * Clear users
   */
  static clearUsers(): void {
    this.load();
    this.data.users = [];
    this.save();
  }

  /**
   * Clear meetings
   */
  static clearMeetings(): void {
    this.load();
    this.data.meetings = [];
    this.save();
  }
}

/* ==================== BASE FACTORY ==================== */

/**
 * Base Factory with shared utility methods
 * All specific factories extend this
 */
export class BaseTestDataFactory {
  
  /**
   * Generate timestamp for unique IDs
   */
  protected static generateTimestamp(): string {
    return Date.now().toString().slice(-8);
  }

  /**
   * Generate unique ID with prefix
   */
  protected static generateUniqueId(prefix: string): string {
    return `${prefix}${this.generateTimestamp()}`;
  }

  /**
   * Generate random number in range
   */
  protected static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random string
   */
  protected static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate future date
   */
  protected static generateFutureDate(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate past date
   */
  protected static generatePastDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate email
   */
  protected static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    return `${prefix}${timestamp}@automation.test`;
  }

  /**
   * Generate phone number
   */
  protected static generatePhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${prefix}-${lineNumber}`;
  }

  /**
   * Check if code exists in environment
   */
  protected static isCodeAvailable(code: string, envVariable: string): boolean {
    const existingCodes = process.env[envVariable]?.split(',') || [];
    return !existingCodes.includes(code);
  }

  /**
   * Format date to MM/DD/YYYY
   */
  protected static formatDateMMDDYYYY(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Format currency
   */
  protected static formatCurrency(amount: string | number): string {
    return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Initialize tracker on import
TestDataTracker.load();