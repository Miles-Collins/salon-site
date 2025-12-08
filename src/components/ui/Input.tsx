"use client";

import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

const baseStyles = "block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100";

export function Input({ label, hint, error, className, ...rest }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label && <span className="font-semibold text-gray-800">{label}</span>}
      <input className={clsx(baseStyles, error && "border-red-400", className)} {...rest} />
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        hint && <span className="text-xs text-gray-500">{hint}</span>
      )}
    </label>
  );
}

export default Input;
