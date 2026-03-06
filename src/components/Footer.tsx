'use client';

import Image from 'next/image';
import {
  ETHERSCAN_CONTRACT_URL,
  ETHERSCAN_TOKEN_URL,
} from '@/lib/constants';

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/yellow-scout' },
  { label: 'Yellow.com', href: 'https://yellow.com' },
  { label: 'Token', href: ETHERSCAN_TOKEN_URL },
  { label: 'Faucet Contract', href: ETHERSCAN_CONTRACT_URL },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-light.png"
            alt="YellowScout"
            width={96}
            height={28}
            className="h-5 w-auto dark:hidden"
          />
          <Image
            src="/logo-dark.png"
            alt="YellowScout"
            width={96}
            height={28}
            className="hidden h-5 w-auto dark:block"
          />
          <span className="text-xs text-muted-foreground">YellowScout</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
