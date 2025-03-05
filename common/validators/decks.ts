import * as yup from 'yup';
import { ValidationError } from '../enums/api-errors';
import { LANGUAGE_CODE_REGEX } from '../utils/regex';
import { DeckRequest } from '../types/decks';
import { MAX_DECK_NAME_LENGTH, MIN_DECK_NAME_LENGTH } from '../utils/constants';

export const deckSchema = yup.object<DeckRequest>({
  name: yup
    .string()
    .strict()
    .min(MIN_DECK_NAME_LENGTH, ValidationError.MIN_LENGTH)
    .max(MAX_DECK_NAME_LENGTH, ValidationError.MAX_LENGTH)
    .required(ValidationError.STRING_REQUIRED),
  sourceLang: yup
    .string()
    .matches(LANGUAGE_CODE_REGEX, ValidationError.INVALID_FORMAT)
    .required(ValidationError.STRING_REQUIRED),
  targetLang: yup
    .string()
    .matches(LANGUAGE_CODE_REGEX, ValidationError.INVALID_FORMAT)
    .required(ValidationError.STRING_REQUIRED),
  hasTargetAlt: yup.boolean().strict().required(ValidationError.BOOLEAN_REQUIRED),
});
