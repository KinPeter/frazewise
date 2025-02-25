import { BaseEntity, UUID } from './misc';

export interface Settings extends BaseEntity {
  userId: UUID;
  language: string;
  name: string | null;
  profilePicUrl: string | null;
}

export type SettingsRequest = Omit<Settings, 'createdAt' | 'id' | 'userId'>;
