/**
 * Shared type definitions for the MM Manager test suite.
 */

export interface UserCredentials {
  username: string;
  password: string;
}

export type UserRole = 'Administrator' | 'LDAP';

export interface EnvironmentVariables {
  MMM_BASE_URL?: string;
  MMM_ADMIN_USERNAME?: string;
  MMM_ADMIN_PASSWORD?: string;
  MMM_LDAP_USERNAME?: string;
  MMM_LDAP_PASSWORD?: string;
  DEBUG?: string;
  HEADLESS?: string;
  CI?: string;
}
