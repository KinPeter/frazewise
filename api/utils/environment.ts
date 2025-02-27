type EnvVariable =
  | 'MONGO_DB_URI'
  | 'MONGO_DB_NAME'
  | 'SERVER_ROUTE'
  | 'MAILER_URL'
  | 'MAILER_API_KEY'
  | 'JWT_SECRET'
  | 'LOGIN_CODE_EXPIRY'
  | 'TOKEN_EXPIRY'
  | 'NOTIFICATION_EMAIL'
  | 'GEMINI_API_KEY'
  | 'PK_ENV';

export function getEnv(...variables: EnvVariable[]): string[] {
  return variables.map(variable => {
    const value = process.env[variable];
    if (process.env.PK_ENV === 'dev' && variable === 'SERVER_ROUTE') {
      return value ?? '';
    }
    if (!value) {
      console.warn(
        `[Environment] Attempted to read ${variable} from the environment but there was no value.`
      );
    }
    return value ?? '';
  });
}
