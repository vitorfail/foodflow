import type { ReactNode } from 'react';

interface BorderBoxProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "underline";
}

const BorderBox: React.FC<BorderBoxProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const baseStyles =
    "overflow-y-hidden relative rounded-md p-4 w-full w-full h-[400px] flex justify-center transition-colors duration-200 " +
    "border-dashed  border-gray-200  dark:border-slate-600 " +
    "hover:border-slate-400 dark:hover:border-slate-500";

  const variantStyles =
    variant === "underline"
      ? "border-b"
      : "border-2";

  return (
    <div className={`${variantStyles} ${baseStyles} ${className}`}>
      {children}
    </div>
  );
};

export default BorderBox;
