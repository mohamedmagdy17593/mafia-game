import { nanoid } from 'nanoid';

export class Player {
  id: string;
  name: string;
  avatarIndex: number;

  constructor(name: string, avatarIndex: number) {
    this.id = nanoid();
    this.name = name;
    this.avatarIndex = avatarIndex;
  }
}
