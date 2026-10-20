import type { AuthorId, Message, Thread, Workspace } from "./comments.types";

export function createSeedWorkspace(now = Date.now()): Workspace {
  const message = (id: string, authorId: AuthorId, text: string, minutes: number): Message => ({
    id,
    authorId,
    text,
    createdAt: new Date(now - minutes * 60000).toISOString(),
  });
  const threads: Thread[] = [
    {
      id: "volume",
      anchor: { x: 315, y: 105 },
      resolved: false,
      messages: [
        message(
          "v1",
          "maya",
          "Love this softer direction. Could we try a slightly warmer lavender for the volume study?",
          28,
        ),
        message("v2", "alex", "Agreed. I added a warmer option to the material palette below.", 21),
        message("v3", "sam", "The matte finish feels right. Let’s keep that as we explore the color.", 16),
      ],
    },
    {
      id: "direction",
      anchor: { x: 690, y: 152 },
      resolved: false,
      messages: [
        message(
          "d1",
          "alex",
          "The headline is working well. Should we give the supporting copy a little more breathing room?",
          18,
        ),
        message("d2", "maya", "Yes! A little extra space would help the whole composition feel calmer.", 12),
      ],
    },
    {
      id: "continuity",
      anchor: { x: 686, y: 477 },
      resolved: false,
      messages: [
        message("c1", "sam", "This shape has a nice sense of balance. Curious how it feels alongside the cube.", 8),
      ],
    },
    {
      id: "palette",
      anchor: { x: 145, y: 488 },
      resolved: true,
      messages: [
        message("p1", "maya", "Can we bring the sage into this palette? It would tie the two studies together.", 65),
        message("p2", "alex", "Done — the second swatch now matches the continuity study.", 44),
      ],
    },
  ];
  return { version: 1, threads: Object.fromEntries(threads.map((thread) => [thread.id, thread])) };
}
