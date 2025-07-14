export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) return { valid: false, message: "Имя обязательно" };
  if (name.length > 50)
    return { valid: false, message: "Максимум 50 символов" };
  return { valid: true };
};

export const validateSurname = (surname: string): ValidationResult => {
  if (!surname.trim()) return { valid: false, message: "Фамилия обязательна" };
  if (surname.length > 50)
    return { valid: false, message: "Максимум 50 символов" };
  return { valid: true };
};

export const validateLogin = (login: string): ValidationResult => {
  if (!login.trim()) return { valid: false, message: "Логин обязателен" };
  if (login.length < 3) return { valid: false, message: "Минимум 3 символа" };
  if (login.length > 20)
    return { valid: false, message: "Максимум 20 символов" };
  if (!/^[a-zA-Z0-9_]+$/.test(login)) {
    return { valid: false, message: "Только буквы, цифры и _" };
  }
  return { valid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) return { valid: false, message: "Email обязателен" };
  if (email.length > 254)
    return { valid: false, message: "Максимум 254 символа" };

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { valid: false, message: "Неверный формат email" };
  }
  return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) return { valid: false, message: "Пароль обязателен" };
  if (password.length < 8)
    return { valid: false, message: "Минимум 8 символов" };
  if (password.length > 20)
    return { valid: false, message: "Максимум 20 символов" };

  // Проверка на сложность пароля
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Добавьте заглавную букву" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Добавьте цифру" };
  }
  return { valid: true };
};

export const validateMoneyTransfer = (text: string): ValidationResult => {
  if (text.length > 1000)
    return { valid: false, message: "Максимум 1000 символа" };
  return { valid: true };
};
