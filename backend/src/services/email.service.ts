export const emailService = {
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
  },
};