export interface RoomInterface {
  id: number;
  name: string;
  participant: number;
  theme: string;
}

export interface TopicInterface {
  id: string;
  title: string;
  options: string;
}

export interface ParticipantInterface {
  avatar_url: string;
  name: string;
}
