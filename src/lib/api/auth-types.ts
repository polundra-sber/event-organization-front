export type User = {
  login: string;
  password?: string;
  email: string;
  name: string;
  surname: string;
  comment_money_transfer?: string;
};

export type LoginRequest = {
  login: string;
  password: string;
};
