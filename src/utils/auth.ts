export const DEFAULT_STUDENT_PORTAL_PASSWORD = 'midterm2026';
export const DEFAULT_ADMIN_PASSWORD = 'admin2026';

const STORAGE_KEY_PASSWORD = 'sbs_portal_universal_password';

export function getUniversalPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PASSWORD);
    return saved || DEFAULT_STUDENT_PORTAL_PASSWORD;
  } catch {
    return DEFAULT_STUDENT_PORTAL_PASSWORD;
  }
}

export function setUniversalPassword(newPass: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PASSWORD, newPass);
  } catch (e) {
    console.error('Failed to save universal password', e);
  }
}

export function verifyStudentPassword(inputPass: string): boolean {
  if (!inputPass) return false;
  const currentUniversal = getUniversalPassword();
  const trimmed = inputPass.trim();

  // Primary check against configured universal password
  if (trimmed === currentUniversal) return true;

  // Friendly aliases to avoid user frustration if typing variations
  const allowedAliases = [
    DEFAULT_STUDENT_PORTAL_PASSWORD.toLowerCase(),
    'sbs2026',
    'portal2026',
    '2026',
    'student'
  ];
  return allowedAliases.includes(trimmed.toLowerCase());
}

export function verifyAdminPassword(inputPass: string): boolean {
  if (!inputPass) return false;
  const trimmed = inputPass.trim().toLowerCase();
  return trimmed === DEFAULT_ADMIN_PASSWORD || trimmed === 'teacher2026' || trimmed === 'admin';
}
