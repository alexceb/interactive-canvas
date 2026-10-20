import type { ModelCardProps } from "../model-card/model-card.types";
export const MODEL_CARDS = {
  volume: {
    ordinal: "01",
    name: "Volume study",
    caption: "VOLUME STUDY",
    description: "Soft geometry.",
    shape: "cube",
    tone: "lavender",
    bounds: { x: 0, y: 0, width: 360, height: 280 },
  },
  continuity: {
    ordinal: "04",
    name: "Continuity study",
    caption: "CONTINUITY STUDY",
    description: "Round, by nature.",
    shape: "torus",
    tone: "sage",
    bounds: { x: 420, y: 350, width: 340, height: 280 },
  },
} satisfies Record<string, ModelCardProps>;

export const PALETTE_COLORS = ["#b7a8cf", "#c7cfac", "#e9dfcf", "#414b46"];
