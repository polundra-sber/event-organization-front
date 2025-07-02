// Валидация даты
export const validateEventDate = (
  date: string
): { isValid: boolean; error?: string } => {
  if (!date.trim())
    return { isValid: false, error: "Введите дату мероприятия" };

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date))
    return { isValid: false, error: "Формат даты: ДД/ММ/ГГГГ" };

  const [day, month, year] = date.split("/").map(Number);
  const dateObj = new Date(year, month - 1, day);

  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return { isValid: false, error: "Некорректная дата" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    return { isValid: false, error: "Дата не может быть в прошлом" };
  }

  return { isValid: true };
};

// Валидация времени
export const validateEventTime = (
  time: string
): { isValid: boolean; error?: string } => {
  if (!time.trim())
    return { isValid: false, error: "Введите время мероприятия" };

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time))
    return { isValid: false, error: "Формат времени: ЧЧ:ММ" };

  return { isValid: true };
};
