import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export default function Alert({ type = 'info', children, className = '', onClose }: AlertProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-success',
      text: 'text-green-800',
      icon: <FiCheckCircle className="h-5 w-5 text-success" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-error',
      text: 'text-red-800',
      icon: <FiXCircle className="h-5 w-5 text-error" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-warning',
      text: 'text-yellow-800',
      icon: <FiAlertCircle className="h-5 w-5 text-warning" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: <FiInfo className="h-5 w-5 text-blue-500" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border-l-4 p-4 rounded ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiXCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
