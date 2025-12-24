
export interface DateIdea {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  location?: string;
  reservedAt?: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  SWIPING = 'SWIPING',
  RESERVATIONS = 'RESERVATIONS'
}
