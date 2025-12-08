import React from "react";
import clsx from "clsx";
import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx("flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center shadow-sm", className)}>
      {icon && <div className="text-4xl text-purple-600">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      {(actionLabel || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {actionLabel && (
            <Button size="md" onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
