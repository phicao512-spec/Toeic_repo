import { hashPassword, verifyPassword } from '../../utils/hash';

describe('hash utilities', () => {
  it('hashes and verifies password', async () => {
    const password = 'secure-password-123';
    const hash = await hashPassword(password);

    expect(hash).not.toEqual(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });
});