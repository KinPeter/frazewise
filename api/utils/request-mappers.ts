import { Settings, SettingsRequest } from '../../common/types/settings';

export function toSettingsRequest(body: Partial<Settings>): SettingsRequest {
  return {
    name: body.name ?? null,
    language: body.language!,
    profilePicUrl: body.profilePicUrl ?? null,
  };
}
