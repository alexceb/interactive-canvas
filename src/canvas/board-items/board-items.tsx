import { ArrowUpRight, Sparkles } from 'lucide-react';
import { memo } from 'react';
import { ModelCard } from '../model-card/model-card';
import { MODEL_CARDS, PALETTE_COLORS } from './board-items.constants';

// Displays the four fixed design artifacts without rerendering them during navigation.
export const BoardItems = memo(function BoardItems() {
  return (
    <div className="board-items">
      <ModelCard {...MODEL_CARDS.volume} />

      <article
        className="board-item concept-card"
        style={{ left: 420, top: 0, width: 340, height: 280 }}
        aria-label="02 — Creative direction"
      >
        <div className="item-caption">
          <span>FORM / EXPLORATIONS</span>
          <Sparkles size={15} />
        </div>
        <p className="concept-title">
          A little less.
          <br />
          <em>A little better.</em>
        </p>
        <div className="concept-bottom">
          <span>
            Objects with intention.
            <br />A study in everyday form.
          </span>
          <ArrowUpRight size={27} strokeWidth={1} />
        </div>
        <div className="item-label">
          Creative direction <span>· 340 × 280</span>
        </div>
      </article>

      <article
        className="board-item palette-card"
        style={{ left: 0, top: 350, width: 360, height: 280 }}
        aria-label="03 — Material palette"
      >
        <div className="item-caption">
          <span>03 / MATERIAL PALETTE</span>
          <span>SS—26</span>
        </div>
        <div className="swatches">
          {PALETTE_COLORS.map((color) => (
            <div key={color} style={{ background: color }} />
          ))}
        </div>
        <div className="palette-notes">
          <strong>Quietly expressive.</strong>
          <span>Soft tones. Honest materials.</span>
        </div>
        <div className="item-label">
          Material palette <span>· 360 × 280</span>
        </div>
      </article>

      <ModelCard {...MODEL_CARDS.continuity} />
    </div>
  );
});
