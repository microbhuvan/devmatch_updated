export const sendRequestFields = ["interested", "ignored"];

export function validateFields(status: string): boolean {
  return sendRequestFields.includes(status);
}
