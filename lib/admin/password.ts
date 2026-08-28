import bcrypt from "bcryptjs";

const rounds = 12;

export function validatePasswordStrength(password: string) {
  const normalized = password.trim();

  if (normalized.length < 10) {
    return "La nueva contraseña debe tener al menos 10 caracteres.";
  }

  return "";
}

export async function hashPassword(password: string) {
  const validation = validatePasswordStrength(password);

  if (validation) {
    throw new Error(validation);
  }

  return bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
