'use client';
import styles from './HallOfFameSection.module.css';
import content from '@/data/content.json';

const { hallOfFame } = content;

// Pre-defined static confetti data to avoid Math.random() hydration mismatch
const CONFETTI = [
  { left: '5%',   delay: '0s',    dur: '4.2s', bg: 'var(--coral)',    w: 8,  h: 8,  round: true  },
  { left: '12%',  delay: '0.8s',  dur: '5.1s', bg: 'var(--yellow)',   w: 7,  h: 10, round: false },
  { left: '22%',  delay: '1.6s',  dur: '3.8s', bg: 'var(--sage)',     w: 9,  h: 7,  round: true  },
  { left: '31%',  delay: '0.3s',  dur: '6.0s', bg: 'var(--sky)',      w: 7,  h: 9,  round: false },
  { left: '40%',  delay: '2.1s',  dur: '4.5s', bg: 'var(--rose)',     w: 10, h: 8,  round: true  },
  { left: '50%',  delay: '1.2s',  dur: '5.4s', bg: 'var(--lavender)', w: 8,  h: 11, round: false },
  { left: '60%',  delay: '0.6s',  dur: '3.5s', bg: 'var(--coral)',    w: 9,  h: 7,  round: true  },
  { left: '68%',  delay: '2.8s',  dur: '4.8s', bg: 'var(--yellow)',   w: 7,  h: 9,  round: false },
  { left: '75%',  delay: '0.1s',  dur: '6.2s', bg: 'var(--sage)',     w: 8,  h: 8,  round: true  },
  { left: '82%',  delay: '1.9s',  dur: '3.9s', bg: 'var(--sky)',      w: 10, h: 7,  round: false },
  { left: '88%',  delay: '0.4s',  dur: '5.7s', bg: 'var(--rose)',     w: 7,  h: 10, round: true  },
  { left: '93%',  delay: '3.2s',  dur: '4.1s', bg: 'var(--lavender)', w: 9,  h: 8,  round: false },
  { left: '8%',   delay: '1.5s',  dur: '5.0s', bg: 'var(--coral)',    w: 8,  h: 9,  round: true  },
  { left: '18%',  delay: '2.4s',  dur: '3.6s', bg: 'var(--yellow)',   w: 10, h: 7,  round: false },
  { left: '28%',  delay: '0.9s',  dur: '6.5s', bg: 'var(--sage)',     w: 7,  h: 8,  round: true  },
  { left: '37%',  delay: '1.7s',  dur: '4.3s', bg: 'var(--sky)',      w: 9,  h: 10, round: false },
  { left: '47%',  delay: '3.0s',  dur: '5.8s', bg: 'var(--rose)',     w: 8,  h: 7,  round: true  },
  { left: '57%',  delay: '0.5s',  dur: '3.7s', bg: 'var(--lavender)', w: 10, h: 9,  round: false },
  { left: '72%',  delay: '2.2s',  dur: '4.9s', bg: 'var(--coral)',    w: 7,  h: 8,  round: true  },
  { left: '85%',  delay: '1.0s',  dur: '6.1s', bg: 'var(--yellow)',   w: 9,  h: 10, round: false },
];

export default function HallOfFameSection() {
  return (
    <section id="halloffame" className={`section ${styles.section}`}>
      {/* Confetti decoration */}
      <div className={styles.confettiWrap} aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <div
            key={i}
            className={styles.confetti}
            style={{
              left: c.left,
              animationDelay: c.delay,
              animationDuration: c.dur,
              background: c.bg,
              width: `${c.w}px`,
              height: `${c.h}px`,
              borderRadius: c.round ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      <div className={styles.header}>
        <span className="tag" style={{ background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)' }}>{hallOfFame.sectionTag}</span>
        <h2 className={styles.title}>{hallOfFame.title}<br /><em>{hallOfFame.titleEm}</em></h2>
        <p className={styles.subtitle}>{hallOfFame.subtitle}</p>
      </div>

      <div className={styles.grid}>
        {hallOfFame.winners.map((w, i) => (
          <div key={w.id} className={styles.card} style={{ '--accent': w.ribbonColor, animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
            {/* Ribbon banner */}
            <div className={styles.ribbon} style={{ background: w.ribbonColor }}>
              <span>#{i + 1}</span>
            </div>

            {/* Crown / trophy */}
            <div className={styles.trophy}>
              {i === 0 ? '👑' : i === 1 ? '🥇' : i === 2 ? '🥈' : '🏅'}
            </div>

            {/* Polaroid photo */}
            <div className={styles.polFrame} style={{ background: w.color }}>
              <span className={styles.polEmoji}>{w.emoji}</span>
            </div>

            <div className={styles.info}>
              <p className={styles.category}>{w.category}</p>
              <h3 className={styles.name}>{w.name}</h3>
              <span className={styles.jurusan}>{w.jurusan}</span>
            </div>

            <blockquote className={styles.quote}>{w.note}</blockquote>

            {/* Tape */}
            <div className={styles.tape} />
          </div>
        ))}
      </div>
    </section>
  );
}
