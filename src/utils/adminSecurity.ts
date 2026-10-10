/**
 * Platform Admin Security Passkey & Authentication Utilities
 * Configured Admin Passkeys: "Carla" and "joash"
 */

export const ADMIN_PASSKEYS = ['Carla', 'joash'] as const;

/**
 * Validates whether an entered string matches the designated Platform Admin passkeys.
 * Accepts "Carla", "joash", or combinations like "Carla and joash" (case-insensitive).
 */
export const isValidAdminPasskey = (input: string | undefined | null): boolean => {
  if (!input) return false;
  const normalized = input.trim().toLowerCase();

  return (
    normalized === 'carla' ||
    normalized === 'joash' ||
    normalized === 'carla and joash' ||
    normalized === 'carla & joash' ||
    normalized === 'joash and carla' ||
    normalized === 'joash & carla' ||
    normalized === 'carla, joash' ||
    normalized === 'joash, carla'
  );
};

export const ADMIN_PASSKEY_HINT = 'Passkey: Carla or joash';
