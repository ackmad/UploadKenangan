'use client';
import styles from './TimelineSection.module.css';
import content from '@/data/content.json';

const { timeline } = content;

export default function TimelineSection() {
  return (
    <section id="timeline" className={`section ${styles.timelineSection}`}>
      {/* Section header */}
      <div className={styles.header}>
        <span className={`tag ${styles.headerTag}`} style={{ background: 'var(--yellow)' }}>{timeline.sectionTag}</span>
        <h2 className={styles.title}>{timeline.title}<br /><em>{timeline.titleEm}</em></h2>
        <p className={styles.subtitle}>{timeline.subtitle}</p>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {/* Center line */}
        <div className={styles.centerLine} aria-hidden="true" />

        {timeline.events.map((ev, i) => (
          <div
            key={ev.id}
            className={`${styles.item} ${i % 2 === 0 ? styles.itemLeft : styles.itemRight} ${'special' in ev && ev.special ? styles.itemSpecial : ''}`}
          >
            {/* Connector dot */}
            <div className={styles.dot} style={{ background: ev.color }} />

            {/* Card */}
            <div
              className={styles.card}
              style={{
                background: ev.color,
                transform: `rotate(${ev.rot})`,
              }}
            >
              {/* Pin */}
              <div className={styles.pin} />

              <div className={styles.cardDate}>
                <span>{ev.date}</span>
              </div>

              <div className={styles.cardEmoji}>{ev.emoji}</div>
              <h3 className={styles.cardTitle}>{ev.title}</h3>
              <p className={styles.cardDesc}>{ev.desc}</p>

              {'special' in ev && ev.special && (
                <div className={styles.specialBadge}>{timeline.specialBadge}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
