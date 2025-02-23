'use client';

import { Fragment, useState, useCallback } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Menu,
  Transition,
  MenuItem,
  MenuItems,
  MenuButton
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Import icons (only Facebook is square)
import {
  FaFacebookSquare,
  FaYoutube,
  FaTwitter,
  FaEnvelope
} from 'react-icons/fa';

import { JournalIssueNode } from '../../types/Article';
import LanguageSwitcher from './LanguageSwitcher'; // Used only in the mobile menu

const SOCIAL_LINKS = [
  { name: 'Facebook', Icon: FaFacebookSquare, href: 'https://www.facebook.com/Bolsheviks' },
  { name: 'YouTube', Icon: FaYoutube, href: 'https://www.youtube.com/user/ibt1917' },
  { name: 'Twitter', Icon: FaTwitter, href: 'https://www.twitter.com/IBT1917' },
  { name: 'Email', Icon: FaEnvelope, href: 'mailto:ibt@bolshevik.org' },
] as const;

const MENU_TRANSLATIONS = {
  JOURNAL: {
    EN: '1917 Journal',
    FR: '1917 édition française',
  },
  JOURNAL_HOME: {
    EN: 'journal home',
    FR: 'accueil du journal',
  },
} as const;

const fetcher = async ([url, lang]: [string, string]) => {
  const apiUrl = `${url}?lang=${lang.toUpperCase()}`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Failed to fetch journal issues');
  const data = await response.json();
  return Array.isArray(data)
    ? data.sort((a, b) => b.slug.localeCompare(a.slug))
    : [];
};

interface NavigationMenuProps {
  lang: string;
}

export default function NavigationMenu({ lang }: NavigationMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  const { data: journalIssues = [], error, isLoading } = useSWR<JournalIssueNode[]>(
    ['/api/journal-issues', lang],
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
      dedupingInterval: 60000,
    }
  );

  if (error) {
    console.error('Failed to load journal issues:', error);
  }

  const getTranslation = useCallback(
    (key: keyof typeof MENU_TRANSLATIONS) => {
      return (
        MENU_TRANSLATIONS[key][lang.toUpperCase() as 'EN' | 'FR'] ||
        MENU_TRANSLATIONS[key]['EN']
      );
    },
    [lang]
  );

  return (
    <nav className="bg-custom-bg font-cambay font-semibold text-2xl leading-none antialiased">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-0">
        {/* Change nav row height to 48px (h-12) */}
        <div className="flex h-12 items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-communist-red hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center">
            {/* Each link fills the 48px height and is centered */}
            <Link
              href={`/${lang}`}
              className="flex items-center h-full px-2 text-communist-red hover:bg-gray-300 hover:underline"
            >
              home
            </Link>
            <span className="mx-2 text-communist-red">|</span>

            <Menu as="div" className="relative">
              <MenuButton
                as="button"
                className="flex items-center h-full px-1 text-2xl text-communist-red font-cambay font-semibold bg-transparent border-none focus:outline-none hover:text-communist-red"
              >
                {getTranslation('JOURNAL')}
                <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <MenuItems className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-custom-bg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <MenuItem>
                      <Link
                        href={`/${lang}/journal`}
                        className="block px-4 py-2 text-sm text-communist-red hover:bg-gray-100"
                      >
                        {getTranslation('JOURNAL_HOME')}
                      </Link>
                    </MenuItem>
                    {isLoading && (
                      <div className="block px-4 py-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    )}
                    {!isLoading &&
                      journalIssues.map((issue) => (
                        <MenuItem key={issue.slug}>
                          <Link
                            href={`/${lang}/journal/${issue.slug}`}
                            className="block px-4 py-2 text-sm text-communist-red hover:bg-gray-100"
                          >
                            {issue.title}
                          </Link>
                        </MenuItem>
                      ))}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            <span className="mx-2 text-communist-red">|</span>
            <Link
              href={`/${lang}/book`}
              className="flex items-center h-full px-1 text-communist-red hover:text-communist-red"
            >
              books
            </Link>
            <span className="mx-2 text-communist-red">|</span>
            <Link
              href={`/${lang}/page/marxist-archive`}
              className="flex items-center h-full px-1 text-communist-red hover:text-communist-red"
            >
              marxist archive
            </Link>
            <span className="mx-2 text-communist-red">|</span>
            <Link
              href={`/${lang}/page/about`}
              className="flex items-center h-full px-1 text-communist-red hover:text-communist-red"
            >
              about
            </Link>
            <span className="mx-2 text-communist-red">|</span>
            <Link
              href={`/${lang}/page/donate`}
              className="flex items-center h-full px-1 text-communist-red hover:text-communist-red"
            >
              donate
            </Link>
          </div>

          {/* Desktop Social Icons */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map(({ name, Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-custom-bg p-2 rounded-full"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="h-8 w-8 text-communist-red" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu remains unchanged */}
      <div className={`md:hidden ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pt-2 pb-3">
          <LanguageSwitcher currentLang={lang} isMobile={true} />
          <Link
            href={`/${lang}`}
            className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            home
          </Link>
          <button
            onClick={() => setJournalOpen(!journalOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
          >
            {getTranslation('JOURNAL')}
            {journalOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {journalOpen && (
            <div className="mt-1 space-y-1 pl-6">
              <Link
                href={`/${lang}/journal`}
                className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
                onClick={() => setMobileOpen(false)}
              >
                {getTranslation('JOURNAL_HOME')}
              </Link>
              {isLoading && (
                <div className="block px-3 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
              {!isLoading &&
                journalIssues.map((issue) => (
                  <Link
                    key={issue.slug}
                    href={`/${lang}/journal/${issue.slug}`}
                    className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {issue.title}
                  </Link>
                ))}
            </div>
          )}
          <Link
            href={`/${lang}/book`}
            className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            books
          </Link>
          <Link
            href={`/${lang}/page/marxist-archive`}
            className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            marxist archive
          </Link>
          <Link
            href={`/${lang}/page/about`}
            className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            about
          </Link>
          <Link
            href={`/${lang}/page/donate`}
            className="block rounded-md px-3 py-2 text-communist-red hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            donate
          </Link>
        </div>
      </div>
    </nav>

  );
}
