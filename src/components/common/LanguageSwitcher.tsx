import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectListbox } from './FormField';

const LANGUAGES = [
    { value: 'th', label: 'Thai' },
    { value: 'en', label: 'English' },
];

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const handleChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <div className="w-32">
            <SelectListbox
                label=""
                options={LANGUAGES}
                value={i18n.language}
                onChange={handleChange}
            />
        </div>
    );
};

export default LanguageSwitcher;
