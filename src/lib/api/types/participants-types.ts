export type User = {
  login: string;
  role_name: string;
  email: string;
  name: string;
  surname: string;
  password?: string | null;
  comment_money_transfer?: string | null;
};

export type UserDemo = {
  login: string;
  email: string;
  name: string;
  surname: string;
};

export type AddParticipantsRequest = string[];
