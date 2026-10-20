import { ArrowUpRight, Sparkles } from 'lucide-react';
import { memo } from 'react';
import shared from '../../shared.module.css';
import { ModelCard } from '../model-card/model-card';
import { MODEL_CARDS, PALETTE_COLORS } from './board-items.constants';
import styles from './board-items.module.css';

// Displays the four fixed design artifacts without rerendering them during navigation.
export const BoardItems = memo(function BoardItems() {
  return (
    <div>
      <ModelCard {...MODEL_CARDS.volume} />

      <article
        className={`${shared.boardItem} ${styles.conceptCard}`}
        style={{ left: 420, top: 0, width: 340, height: 280 }}
        aria-label="02 — Creative direction"
      >
        <div className={`${shared.itemCaption} ${styles.itemCaption}`}>
          <span>FORM / EXPLORATIONS</span>
          <Sparkles size={15} />
        </div>
        <p className={styles.conceptTitle}>
          A little less.
          <br />
          <em>A little better.</em>
        </p>
        <div className={styles.conceptBottom}>
          <span>
            Objects with intention.
            <br />A study in everyday form.
          </span>
          <ArrowUpRight size={27} strokeWidth={1} />
        </div>
        <div className={shared.itemLabel}>
          Creative direction <span>· 340 × 280</span>
        </div>
      </article>

      <article
        className={`${shared.boardItem} ${styles.paletteCard}`}
        style={{ left: 0, top: 350, width: 360, height: 280 }}
        aria-label="03 — Material palette"
      >
        <div className={`${shared.itemCaption} ${styles.itemCaption}`}>
          <span>03 / MATERIAL PALETTE</span>
          <span>SS—26</span>
        </div>
        <div className={styles.swatches}>
          {PALETTE_COLORS.map((color) => (
            <div key={color} style={{ background: color }} />
          ))}
        </div>
        <div className={styles.paletteNotes}>
          <strong>Quietly expressive.</strong>
          <span>Soft tones. Honest materials.</span>
        </div>
        <div className={shared.itemLabel}>
          Material palette <span>· 360 × 280</span>
        </div>
      </article>

      <ModelCard {...MODEL_CARDS.continuity} />
    </div>
  );
});
