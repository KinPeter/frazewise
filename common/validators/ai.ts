import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { GenerateCardsRequest } from '../types/ai';
import { supportedLanguages } from '../constants/languages';

export const generateCardsSchema = yup.object<GenerateCardsRequest>({
  sourceLang: yup
    .string()
    .strict()
    .oneOf(supportedLanguages.keys().toArray(), ValidationError.LANGUAGE_NOT_SUPPORTED)
    .required(ValidationError.STRING_REQUIRED),
  targetLang: yup
    .string()
    .strict()
    .oneOf(supportedLanguages.keys().toArray(), ValidationError.LANGUAGE_NOT_SUPPORTED)
    .required(ValidationError.STRING_REQUIRED),
  topic: yup
    .string()
    .strict()
    .min(5, ValidationError.MIN_LENGTH)
    .max(50, ValidationError.MAX_LENGTH)
    .required(ValidationError.STRING_REQUIRED),
  cardCount: yup
    .number()
    .strict()
    .min(10, ValidationError.MIN_VALUE)
    .max(100, ValidationError.MAX_VALUE)
    .required(ValidationError.NUMBER_REQUIRED),
  level: yup
    .string()
    .strict()
    .oneOf(['basic', 'intermediate', 'advanced'], ValidationError.NOT_SUPPORTED_VALUE)
    .required(ValidationError.STRING_REQUIRED),
});
