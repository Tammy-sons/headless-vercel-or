'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { createUrl } from 'lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchActive) inputRef.current?.focus();
  }, [isSearchActive]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = e.currentTarget.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (val.value) {
      const searchTerm = val.value.trim();
      newParams.set('q', searchTerm.endsWith('*') ? searchTerm : `${searchTerm}*`);
    } else {
      newParams.delete('q');
    }

    setIsSearchActive(false);
    router.push(createUrl('/search', newParams));
  }

  return (
    <div className="flex w-full items-center lg:justify-end">
      {/* --- 1. MOBILE SEARCH (Always Visible/Inline as before) --- */}
      <form onSubmit={onSubmit} className="relative flex w-full items-center lg:hidden">
        <input
          type="text"
          name="search"
          placeholder="Search plants..."
          defaultValue={searchParams?.get('q') || ''}
          className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-4 pr-10 text-base outline-none focus:border-[#285e2c] dark:border-neutral-800 dark:bg-transparent"
        />
        <button type="submit" className="absolute right-3">
          <MagnifyingGlassIcon className="h-4 w-4 text-neutral-500" />
        </button>
      </form>

      {/* --- 2. DESKTOP DROPDOWN (Absolute positioned) --- */}
      <div
        className={clsx(
          "absolute left-0 right-0 top-full z-50 hidden border-b border-neutral-200 bg-white p-4 shadow-xl transition-all duration-300 ease-in-out lg:block",
          isSearchActive
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto max-w-screen-2xl px-6">
          <form onSubmit={onSubmit} className="relative flex w-full items-center">
            <input
              ref={inputRef}
              type="text"
              name="search"
              placeholder="Search for plants, trees, or gardening supplies..."
              defaultValue={searchParams?.get('q') || ''}
              className="w-full rounded-full border-2 border-[#285e2c]/20 bg-neutral-50 py-4 pl-8 pr-16 text-lg font-medium text-[#285e2c] outline-none focus:border-[#285e2c] focus:ring-4 focus:ring-[#285e2c]/5"
            />
            <button
              type="submit"
              className="absolute right-4 rounded-full bg-[#285e2c] p-3 text-white transition-transform hover:scale-105"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>

      {/* --- 3. DESKTOP TOGGLE BUTTON --- */}
      <button
        type="button"
        onClick={() => setIsSearchActive(!isSearchActive)}
        className="hidden h-11 w-11 flex-none items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-[#285e2c] hover:text-[#285e2c] lg:flex lg:ml-4"
      >
        {isSearchActive ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}