import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const RequiredFieldLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-1">
    <span>{text}</span>
    <span className="text-red-500 font-bold">*</span>
  </div>
);
export const FormInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
}: FormInputProps) => {
  return (
    <div className={`bg-my-light-green p-4 rounded-xl space-y-1 ${className}`}>
      <label className="text-sm text-gray-500">
        {required ? <RequiredFieldLabel text={label} /> : label}
      </label>
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "bg-white dark:bg-white", // Принудительно белый фон в любой теме
          "text-black dark:text-black", // Принудительно черный текст
          className
        )}
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
};
