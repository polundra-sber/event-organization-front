export type UserProfile = {
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  requisites: string;
};

export type UserEditor = {
  firstName?: string;
  lastName?: string;
  email?: string;
  requisites?: string;
};