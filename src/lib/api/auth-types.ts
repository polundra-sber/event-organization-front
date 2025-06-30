export type ApiError = {
  status: number;
  data: {
    error: string;
    details?: {
      field: string;
      message: string;
    };
  };
};

export type RegisterRequest = {
  loginInput: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type RegisterResponse = {
  token: string;
};


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
