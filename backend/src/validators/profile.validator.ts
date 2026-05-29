export const profileAllowedFields = [
  "skills",
  "age",
  "gender",
  "about",
  "github",
  "linkedin",
  "photoURL",
];

export function validateProfile(updates: string[]): boolean {
  return updates.every((field) => profileAllowedFields.includes(field));
}
