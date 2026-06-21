import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SectionCard({
  title,
  icon,
  extra,
  children,
  onClick,
  className = '',
}: SectionCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card overflow-hidden ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary-500">{icon}</span>}
          <h3 className="font-semibold text-surface-800">{title}</h3>
        </div>
        {extra && <div className="text-sm text-surface-500">{extra}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
