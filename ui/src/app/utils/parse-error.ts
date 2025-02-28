// eslint-disable-next-line
export function parseError(e: any): string {
  if (e.error.error) {
    return e.error.error;
  }
  if (e.message) {
    return e.message;
  }
  if (e.error.message) {
    return e.error.message;
  }
  return JSON.stringify(e);
}
