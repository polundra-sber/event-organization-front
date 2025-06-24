import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <LoginForm />

        {/* Дополнительная ссылка на регистрацию */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <a href="#" className="text-blue-500">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}
