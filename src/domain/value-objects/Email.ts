export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    if (!this.isValid(normalized)) {
      throw new Error('Invalid email format');
    }
    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    if (!email || email.trim().length === 0) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
