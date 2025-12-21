import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'th' ? 'en' : 'th';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="btn btn-ghost btn-circle"
            title={i18n.language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
            <div className="indicator">
                <Languages size={24} />
                <span className="badge badge-xs badge-primary indicator-item">
                    {i18n.language === 'th' ? 'TH' : 'EN'}
                </span>
            </div>
        </button>
    );
};

export default LanguageSwitcher;

