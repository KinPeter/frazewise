import { Settings, SettingsRequest } from '../../common/types/settings';
import { Deck, DeckRequest } from '../../common/types/decks';
import { Card, BaseCardRequest, UpdateCardRequest } from '../../common/types/cards';

export function toSettingsRequest(body: Partial<Settings>): SettingsRequest {
  return {
    name: body.name ?? null,
    language: body.language!,
    profilePicUrl: body.profilePicUrl ?? null,
  };
}

export function toDeckRequest(body: Partial<Deck>): DeckRequest {
  return {
    name: body.name!,
    sourceLang: body.sourceLang!,
    targetLang: body.targetLang!,
    hasTargetAlt: body.hasTargetAlt!,
  };
}

export function toBaseCardRequest(body: Partial<Card>): BaseCardRequest {
  return {
    sourceLang: body.sourceLang!,
    source: body.source!,
    targetLang: body.targetLang!,
    target: body.target!,
    targetAlt: body.targetAlt ?? null,
  };
}

export function toUpdateCardRequest(body: Partial<Card>): UpdateCardRequest {
  return {
    ...toBaseCardRequest(body),
    deckId: body.deckId!,
  };
}
