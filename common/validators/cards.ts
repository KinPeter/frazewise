import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { LANGUAGE_CODE_REGEX } from '../utils/regex';
import { BulkCardsRequest, BaseCardRequest } from '../types/cards';
import {
  MAX_CARD_CONTENT_LENGTH,
  MAX_CARD_COUNT,
  MIN_CARD_CONTENT_LENGTH,
} from '../utils/constants';

export const baseCardSchema = yup.object<BaseCardRequest>({
  sourceLang: yup
    .string()
    .matches(LANGUAGE_CODE_REGEX, ValidationError.INVALID_FORMAT)
    .required(ValidationError.STRING_REQUIRED),
  source: yup
    .string()
    .strict()
    .min(MIN_CARD_CONTENT_LENGTH, ValidationError.MIN_LENGTH)
    .max(MAX_CARD_CONTENT_LENGTH, ValidationError.MAX_LENGTH)
    .required(ValidationError.STRING_REQUIRED),
  targetLang: yup
    .string()
    .matches(LANGUAGE_CODE_REGEX, ValidationError.INVALID_FORMAT)
    .required(ValidationError.STRING_REQUIRED),
  target: yup
    .string()
    .strict()
    .min(MIN_CARD_CONTENT_LENGTH, ValidationError.MIN_LENGTH)
    .max(MAX_CARD_CONTENT_LENGTH, ValidationError.MAX_LENGTH)
    .required(ValidationError.STRING_REQUIRED),
  targetAlt: yup
    .string()
    .strict()
    .min(MIN_CARD_CONTENT_LENGTH, ValidationError.MIN_LENGTH)
    .max(MAX_CARD_CONTENT_LENGTH, ValidationError.MAX_LENGTH)
    .nullable()
    .defined(ValidationError.NULLABLE_FIELD_REQUIRED),
});

export const cardSchema = baseCardSchema.shape({
  deckId: yup.string().uuid(ValidationError.INVALID_UUID).required(ValidationError.STRING_REQUIRED),
});

export const bulkCardsSchema = yup.object<BulkCardsRequest>({
  deckId: yup.string().uuid(ValidationError.INVALID_UUID).required(ValidationError.STRING_REQUIRED),
  cards: yup
    .array(baseCardSchema)
    .min(1, ValidationError.MIN_LENGTH)
    .max(MAX_CARD_COUNT, ValidationError.MAX_ITEM_COUNT)
    .required(ValidationError.ARRAY_REQUIRED),
});
