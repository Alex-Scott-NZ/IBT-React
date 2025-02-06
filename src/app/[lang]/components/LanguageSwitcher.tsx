// /app/[lang]/components/LanguageSwitcher.tsx
// No need for 'use client' anymore
import Link from 'next/link';

interface LanguageSwitcherProps {
  currentLang: string;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }
] as const;

const LanguageSwitcher = ({ currentLang }: LanguageSwitcherProps) => {
  return (
    <div className="flex gap-2 mt-4">
      {LANGUAGES.map((language) => (
        <Link
          key={language.code}
          href={`/${language.code}`}
          className={`px-3 py-1 rounded ${
            currentLang === language.code
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          {language.label}
        </Link>
      ))}
    </div>
  );
};

export default LanguageSwitcher;