import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiPlay, FiRotateCcw, FiZap } from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';

const pads = [
  { name: 'Violet', color: 'from-violet-500 to-indigo-500', glow: 'rgba(124,58,237,0.72)' },
  { name: 'Cyan', color: 'from-cyan-400 to-sky-500', glow: 'rgba(34,211,238,0.72)' },
  { name: 'Pink', color: 'from-fuchsia-500 to-pink-500', glow: 'rgba(236,72,153,0.72)' },
  { name: 'Blue', color: 'from-blue-500 to-indigo-600', glow: 'rgba(37,99,235,0.72)' },
  { name: 'Pulse', color: 'from-white to-indigo-200', glow: 'rgba(255,255,255,0.82)' },
  { name: 'Aurora', color: 'from-teal-300 to-violet-500', glow: 'rgba(45,212,191,0.72)' },
  { name: 'Nova', color: 'from-purple-500 to-cyan-400', glow: 'rgba(168,85,247,0.72)' },
  { name: 'Laser', color: 'from-sky-400 to-fuchsia-500', glow: 'rgba(56,189,248,0.72)' },
  { name: 'Star', color: 'from-indigo-300 to-purple-700', glow: 'rgba(129,140,248,0.72)' },
];

function makeStep() {
  return Math.floor(Math.random() * pads.length);
}

export default function Play() {
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activePad, setActivePad] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('class_3e_best_score') || 0));
  const [message, setMessage] = useState('Press start and copy the neon pattern.');
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((timer) => window.clearTimeout(timer));
    timeoutsRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const saveBestScore = (nextScore) => {
    if (nextScore <= bestScore) return;
    localStorage.setItem('class_3e_best_score', String(nextScore));
    setBestScore(nextScore);
  };

  const playSequence = (nextSequence) => {
    clearTimers();
    setPhase('showing');
    setPlayerStep(0);
    setMessage('Watch the pulse...');

    nextSequence.forEach((padIndex, index) => {
      const onTimer = window.setTimeout(() => setActivePad(padIndex), 520 + index * 620);
      const offTimer = window.setTimeout(() => setActivePad(null), 850 + index * 620);
      timeoutsRef.current.push(onTimer, offTimer);
    });

    const readyTimer = window.setTimeout(() => {
      setPhase('input');
      setMessage('Your turn. Repeat it.');
    }, 620 + nextSequence.length * 620);
    timeoutsRef.current.push(readyTimer);
  };

  const startGame = () => {
    const firstSequence = [makeStep(), makeStep()];
    clearTimers();
    setSequence(firstSequence);
    setPlayerStep(0);
    setLevel(1);
    setScore(0);
    setStreak(0);
    setLives(3);
    playSequence(firstSequence);
  };

  const failRound = () => {
    const nextLives = lives - 1;
    setLives(nextLives);
    setStreak(0);
    setActivePad(null);

    if (nextLives <= 0) {
      setPhase('over');
      setMessage('System crashed. Run it back.');
      saveBestScore(score);
      return;
    }

    setPhase('showing');
    setMessage('Glitch. Same pattern again.');
    const retryTimer = window.setTimeout(() => playSequence(sequence), 900);
    timeoutsRef.current.push(retryTimer);
  };

  const completeRound = () => {
    const roundBonus = level * 25 + streak * 10;
    const nextScore = score + roundBonus;
    const nextSequence = [...sequence, makeStep()];

    setScore(nextScore);
    setStreak((current) => current + 1);
    setLevel((current) => current + 1);
    setSequence(nextSequence);
    setPhase('showing');
    setMessage(`Level ${level + 1}. Pattern upgraded.`);

    const nextTimer = window.setTimeout(() => playSequence(nextSequence), 900);
    timeoutsRef.current.push(nextTimer);
  };

  const hitPad = (padIndex) => {
    if (phase !== 'input') return;

    setActivePad(padIndex);
    const fadeTimer = window.setTimeout(() => setActivePad(null), 220);
    timeoutsRef.current.push(fadeTimer);

    if (sequence[playerStep] !== padIndex) {
      failRound();
      return;
    }

    const tapScore = 12 + streak * 2;
    setScore((current) => current + tapScore);

    if (playerStep === sequence.length - 1) {
      completeRound();
      return;
    }

    setPlayerStep((current) => current + 1);
    setMessage(`${sequence.length - playerStep - 1} pulses left.`);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="hero-shell overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-card backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-sm font-bold text-amber-deep shadow-card">
                <FiZap className="h-4 w-4" />
                Neon pulse lab
              </div>
              <h1 className="neon-text text-4xl font-black text-memory-text sm:text-6xl">Hack the rhythm grid.</h1>
              <p className="mt-3 max-w-2xl text-memory-muted">
                Watch the glowing pattern, repeat it perfectly, and push the grid into higher levels before your lives burn out.
              </p>
            </div>

            <button onClick={startGame} className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl py-3">
              {phase === 'idle' ? <FiPlay /> : <FiRotateCcw />}
              {phase === 'idle' ? 'Boot game' : 'Restart'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="cosmic-panel relative overflow-hidden rounded-[2rem] border border-white/20 p-4 shadow-[0_26px_90px_rgba(37,99,235,0.22)] sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_18%_20%,rgba(236,72,153,0.18),transparent_24%)]" />
            <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-soft">Pattern status</p>
                <p className="mt-1 text-2xl font-black text-white">{message}</p>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-4 w-4 rounded-full ${index < lives ? 'bg-fuchsia-400 shadow-[0_0_18px_rgba(236,72,153,0.8)]' : 'bg-white/16'}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 grid aspect-square max-h-[620px] grid-cols-3 gap-3 sm:gap-4">
              {pads.map((pad, index) => {
                const isActive = activePad === index;

                return (
                  <motion.button
                    key={pad.name}
                    type="button"
                    onClick={() => hitPad(index)}
                    whileTap={{ scale: 0.94 }}
                    animate={{
                      scale: isActive ? 1.08 : 1,
                      rotate: isActive ? [0, -1.5, 1.5, 0] : 0,
                      boxShadow: isActive
                        ? `0 0 0 1px rgba(255,255,255,0.9) inset, 0 0 42px ${pad.glow}, 0 0 90px ${pad.glow}`
                        : '0 0 0 1px rgba(255,255,255,0.18) inset, 0 18px 50px rgba(0,0,0,0.18)',
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className={`relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${pad.color} p-4 text-left text-white`}
                    aria-label={`Press ${pad.name}`}
                  >
                    <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_42%,rgba(255,255,255,0.12))]" />
                    <span className="relative text-xs font-black uppercase tracking-[0.24em] text-white/72">{String(index + 1).padStart(2, '0')}</span>
                    <span className="relative mt-2 block text-lg font-black sm:text-2xl">{pad.name}</span>
                    <span className="absolute bottom-3 right-3 h-8 w-8 rounded-full border border-white/40 bg-white/20" />
                  </motion.button>
                );
              })}
            </div>

            {phase === 'idle' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#101632]/62 p-6 text-center backdrop-blur-sm">
                <div>
                  <FiActivity className="mx-auto h-10 w-10 text-sky-soft" />
                  <p className="mt-3 text-4xl font-black text-white">Ready to boot?</p>
                  <p className="mt-2 text-indigo-100/76">A new pattern appears each level. Your job is to mirror it.</p>
                </div>
              </div>
            )}

            {phase === 'over' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#101632]/72 p-6 text-center backdrop-blur-sm">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-fuchsia-300">Game over</p>
                  <p className="mt-3 text-5xl font-black text-white">{score}</p>
                  <button onClick={startGame} className="btn-primary mt-5 inline-flex items-center gap-2 rounded-2xl">
                    <FiRotateCcw />
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {[
              ['Score', score],
              ['Level', level],
              ['Streak', streak],
              ['Best', Math.max(bestScore, score)],
            ].map(([label, value]) => (
              <div key={label} className="holo-card rounded-[1.5rem] border border-white/70 bg-white/76 p-5 shadow-card backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-wide text-memory-muted">{label}</p>
                <p className="mt-2 text-4xl font-black text-memory-text">{value}</p>
              </div>
            ))}

            <div className="rounded-[1.5rem] border border-white/20 cosmic-panel p-5 text-white shadow-card">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-soft">How it works</p>
              <p className="mt-2 text-sm leading-6 text-indigo-100/76">
                The grid plays a sequence. Repeat it by tapping the pads. Every level adds one more pulse.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
