'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 200, damping: 24 },
  },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[15%] h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="grid-pattern absolute inset-0 opacity-50 dark:opacity-30" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <Badge variant="outline" className="mb-6 border-primary/30 px-4 py-1.5 text-xs font-medium tracking-wide">
            Community Portal
          </Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="gradient-text mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Your gateway to the Yellow ecosystem
        </motion.h1>

        <motion.p
          variants={item}
          className="mb-10 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Faucet. TVL. Governance. Leaderboard.
          <br className="hidden sm:block" />
          Built by the community, for the community.
        </motion.p>

        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link href="/faucet">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="shimmer-btn inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Get Test Tokens
              <ArrowRight size={16} />
            </motion.button>
          </Link>

          <a
            href="https://github.com/yellow-scout"
            target="_blank"
            rel="noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-foreground"
            >
              <Github size={16} />
              View on GitHub
            </motion.button>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
