import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden animate-slide-up"
      >
        <div className="sticky top-0 bg-white border-b border-surface-100 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>
        <div className="px-4 py-4 overflow-y-auto max-h-[calc(90vh-56px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
