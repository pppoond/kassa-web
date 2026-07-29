import type { ReactNode, ChangeEvent } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

// ============================================================
// Shared Form Field Components
// ============================================================

interface BaseProps {
    label: string;
    error?: string;
}

// --- Input (react-hook-form) ---
interface InputProps extends BaseProps {
    type?: 'text' | 'number' | 'email' | 'password' | 'url';
    placeholder?: string;
    step?: string;
    registration: UseFormRegisterReturn;
}

export const Input = ({ label, type = 'text', placeholder, step, error, registration }: InputProps) => (
    <div className="form-control">
        <label className="label py-1">
            <span className="label-text font-bold text-xs uppercase opacity-50">{label}</span>
        </label>
        <input
            type={type}
            placeholder={placeholder}
            step={step}
            className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            {...registration}
        />
        {error && <span className="label-text-alt text-error mt-1">{error}</span>}
    </div>
);

// --- InputWithIcon (controlled, for auth pages) ---
interface InputWithIconProps extends BaseProps {
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    icon: ReactNode;
    required?: boolean;
    size?: 'md' | 'lg';
}

export const InputWithIcon = ({ label, type = 'text', placeholder, value, onChange, icon, required, size = 'lg', error }: InputWithIconProps) => (
    <div className="form-control">
        <label className="label py-1">
            <span className="label-text font-bold text-xs uppercase opacity-50">{label}</span>
        </label>
        <label className={`input input-${size} input-bordered flex items-center gap-3 bg-base-200/50 border-base-300 focus-within:border-primary transition-all ${error ? 'input-error' : ''}`}>
            <span className="opacity-40">{icon}</span>
            <input
                type={type}
                className="grow font-medium"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </label>
        {error && <span className="label-text-alt text-error mt-1">{error}</span>}
    </div>
);

// --- Textarea (react-hook-form) ---
interface TextareaProps extends BaseProps {
    placeholder?: string;
    rows?: number;
    registration: UseFormRegisterReturn;
}

export const Textarea = ({ label, placeholder, rows = 3, error, registration }: TextareaProps) => (
    <div className="form-control">
        <label className="label py-1">
            <span className="label-text font-bold text-xs uppercase opacity-50">{label}</span>
        </label>
        <textarea
            className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`}
            placeholder={placeholder}
            rows={rows}
            {...registration}
        ></textarea>
        {error && <span className="label-text-alt text-error mt-1">{error}</span>}
    </div>
);

// --- Select (react-hook-form) ---
interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends BaseProps {
    options: SelectOption[];
    placeholder?: string;
    registration: UseFormRegisterReturn;
}

export const Select = ({ label, options, placeholder, error, registration }: SelectProps) => (
    <div className="form-control">
        <label className="label py-1">
            <span className="label-text font-bold text-xs uppercase opacity-50">{label}</span>
        </label>
        <select
            className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
            {...registration}
        >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && <span className="label-text-alt text-error mt-1">{error}</span>}
    </div>
);

// --- Toggle (react-hook-form) ---
interface ToggleProps {
    label: string;
    color?: 'primary' | 'success' | 'warning' | 'error';
    registration: UseFormRegisterReturn;
}

export const Toggle = ({ label, color = 'primary', registration }: ToggleProps) => (
    <label className="label cursor-pointer gap-3">
        <span className="label-text font-medium">{label}</span>
        <input
            type="checkbox"
            className={`toggle toggle-${color}`}
            {...registration}
        />
    </label>
);
