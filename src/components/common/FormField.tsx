import type { ReactNode, ChangeEvent } from 'react';
import { Fragment } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

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

// --- Select (react-hook-form, native fallback) ---
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

// --- SelectListbox (Headless UI, controlled) ---
interface SelectListboxProps {
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export const SelectListbox = ({ label, options, value, onChange, placeholder, error }: SelectListboxProps) => {
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="form-control">
            <label className="label py-1">
                <span className="label-text font-bold text-xs uppercase opacity-50">{label}</span>
            </label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg border bg-base-100 py-3 pl-4 pr-10 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${error ? 'border-error' : 'border-base-300'}`}>
                        <span className={`block truncate ${selectedOption ? 'font-medium' : 'opacity-50'}`}>
                            {selectedOption?.label || placeholder || 'Select...'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDown size={16} className="opacity-40" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-base-100 py-1 shadow-xl ring-1 ring-base-300 focus:outline-none border border-base-200">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    value={option.value}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-base-content'}`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                {option.label}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                    <Check size={16} />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
            {error && <span className="label-text-alt text-error mt-1">{error}</span>}
        </div>
    );
};

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
