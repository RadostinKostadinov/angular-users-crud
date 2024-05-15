export class User {
  id?: string;
  firstName?: string;
  lastName?: string;
  profession?: string;
  gender?: string;
  birthDate?: string; // first 10 chars of ISO8601 date format => [2024-01-01]
  age?: number;
}
