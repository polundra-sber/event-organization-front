export type UserProfile = { 
  name: string;
  surname: string;
  login: string;
  email: string;
  comment_money_transfer?: string | null;
};

export type UserAlreadyExistResponse = {
  error: string;
};
