'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { TOKEN_ADDRESS, TOKEN_SYMBOL } from '@/lib/constants';

type StatusData = {
  success: boolean;
  faucetBalance?: string;
  onChainDripAmount?: string;
  cooldownSeconds?: number;
  health?: 'ok' | 'degraded';
};

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 25 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function LiveStats() {
  const [status, setStatus] = useState<StatusData | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const data = (await res.json()) as StatusData;
      setStatus(data);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
    const id = window.setInterval(() => void fetchStatus(), 30_000);
    return () => window.clearInterval(id);
  }, [fetchStatus]);

  const balance = status?.faucetBalance ? Number(status.faucetBalance) : 0;
  const drip = status?.onChainDripAmount ? Number(status.onChainDripAmount) : 1000;
  const cooldownHours = status?.cooldownSeconds
    ? Math.floor(status.cooldownSeconds / 3600)
    : 24;
  const isHealthy = status?.health === 'ok';

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.2 }}
      className="mx-auto max-w-4xl px-4"
    >
      <div className="glass flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-4 shadow-glass-light dark:shadow-glass sm:flex-row">
        <Stat label="Contract Balance">
          {status ? (
            <span className="font-mono text-sm font-semibold">
              <AnimatedNumber value={balance} /> {TOKEN_SYMBOL}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </Stat>

        <Divider />

        <Stat label="Drip Amount">
          <span className="font-mono text-sm font-semibold">
            {drip.toLocaleString()} {TOKEN_SYMBOL}
          </span>
        </Stat>

        <Divider />

        <Stat label="Cooldown">
          <span className="font-mono text-sm font-semibold">{cooldownHours}h</span>
        </Stat>

        <Divider />

        <Stat label="Status">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isHealthy ? 'bg-emerald-500' : 'bg-red-400'
              }`}
            />
            {isHealthy ? 'Healthy' : status ? 'Degraded' : '...'}
          </span>
        </Stat>
      </div>
    </motion.section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:items-start">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="hidden h-8 w-px bg-border/50 sm:block" />;
}
