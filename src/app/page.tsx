'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddToWallet } from '@/components/AddToWallet';
import { FaucetForm } from '@/components/FaucetForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  ETHERSCAN_CONTRACT_URL,
  ETHERSCAN_TOKEN_URL,
  FAUCET_CONTRACT_ADDRESS,
  TOKEN_ADDRESS,
  TOKEN_SYMBOL,
} from '@/lib/constants';

type StatusResponse = {
  success: boolean;
  health: 'ok' | 'degraded';
  message?: string;
  faucetAddress?: string;
  faucetContractAddress?: string;
  faucetBalance?: string;
  tokenAddress: string;
  onChainDripAmount?: string;
  cooldownSeconds?: number;
  checks: {
    redisConfigured: boolean;
    turnstileConfigured: boolean;
  };
};

export default function HomePage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/status', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as StatusResponse;
      setStatus(payload);
    } catch {
      setStatus({
        success: false,
        health: 'degraded',
        message: 'Failed to reach faucet status endpoint.',
        tokenAddress: TOKEN_ADDRESS,
        checks: {
          redisConfigured: false,
          turnstileConfigured: false,
        },
      });
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
    const interval = window.setInterval(() => {
      void fetchStatus();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [fetchStatus]);

  const balanceLabel = useMemo(() => {
    if (!status || !status.success || !status.faucetBalance) {
      return '--';
    }

    const numericBalance = Number(status.faucetBalance);
    if (!Number.isFinite(numericBalance)) {
      return status.faucetBalance;
    }

    return numericBalance.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [status]);

  const cooldownLabel = useMemo(() => {
    if (!status?.cooldownSeconds) return '24h';
    const hours = Math.floor(status.cooldownSeconds / 3600);
    const minutes = Math.floor((status.cooldownSeconds % 3600) / 60);
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  }, [status]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[12%] top-[8%] h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-[8%] right-[12%] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Card className="animate-fade-in-up border-primary/25">
          <CardHeader className="space-y-4 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Image
                  src="/logo-light.png"
                  alt="Yellow"
                  width={160}
                  height={48}
                  className="h-10 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.png"
                  alt="Yellow"
                  width={160}
                  height={48}
                  className="hidden h-10 w-auto dark:block"
                  priority
                />
                <Badge variant="outline" className="w-fit">
                  Sepolia Testnet
                </Badge>
              </div>
              <ThemeToggle />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{TOKEN_SYMBOL} Faucet</h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Request {TOKEN_SYMBOL} test tokens on Sepolia. Protected by Turnstile CAPTCHA,
                per-IP throttling, device fingerprinting, and on-chain cooldown ({cooldownLabel}).
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <FaucetForm onRequestComplete={fetchStatus} />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3 border-t border-border/60 pt-4 text-sm">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  Contract balance:{' '}
                  <span className="font-mono">
                    {statusLoading ? 'Loading...' : `${balanceLabel} ${TOKEN_SYMBOL}`}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Drip:{' '}
                  <span className="font-mono">
                    {status?.onChainDripAmount
                      ? `${Number(status.onChainDripAmount).toLocaleString()} ${TOKEN_SYMBOL}`
                      : `1,000 ${TOKEN_SYMBOL}`}
                  </span>
                  {' / '}
                  {cooldownLabel} cooldown
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={status?.health === 'ok' ? 'success' : 'danger'}>
                  {status?.health === 'ok' ? 'Healthy' : 'Degraded'}
                </Badge>
                <Badge variant={status?.checks?.redisConfigured ? 'secondary' : 'warning'}>
                  Redis {status?.checks?.redisConfigured ? 'ok' : 'off'}
                </Badge>
                <Badge variant={status?.checks?.turnstileConfigured ? 'secondary' : 'warning'}>
                  Turnstile {status?.checks?.turnstileConfigured ? 'ok' : 'off'}
                </Badge>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  Token:{' '}
                  <a
                    href={ETHERSCAN_TOKEN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    {TOKEN_ADDRESS.slice(0, 6)}...{TOKEN_ADDRESS.slice(-4)}
                  </a>
                </p>
                <p>
                  Faucet:{' '}
                  <a
                    href={ETHERSCAN_CONTRACT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-dotted underline-offset-4"
                  >
                    {FAUCET_CONTRACT_ADDRESS.slice(0, 6)}...{FAUCET_CONTRACT_ADDRESS.slice(-4)}
                  </a>
                </p>
              </div>
              <AddToWallet />
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
