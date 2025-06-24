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
