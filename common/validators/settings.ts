import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { Settings } from '../types/settings';
import { LANGUAGE_CODE_REGEX } from '../utils/regex';

export const settingsSchema = yup.object<Settings>({
  name: yup.string().strict().nullable().defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  profilePicUrl: yup
    .string()
    .url(ValidationError.INVALID_URL)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
  language: yup
    .string()
    .matches(LANGUAGE_CODE_REGEX, ValidationError.INVALID_FORMAT)
    .required(ValidationError.STRING_REQUIRED),
});
