import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { PracticeRequest } from '../types/practice';

export const practiceSchema = yup.object<PracticeRequest>({
  cardId: yup.string().uuid(ValidationError.INVALID_UUID).required(ValidationError.STRING_REQUIRED),
  isSuccess: yup.boolean().strict().required(ValidationError.BOOLEAN_REQUIRED),
});
