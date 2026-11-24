import type { EpisodeData } from "./types";

export const sampleShortsEpisode: EpisodeData = {
  id: "shorts-kopi-luwak",
  slug: "kopi-luwak-enzim",
  title: "Rahasia Ilmiah Kopi Luwak!",
  facts: [
    {
      claim: "Enzim proteolitik dalam saluran pencernaan luwak memecah protein kopi sehingga mengurangi rasa pahit secara signifikan.",
      source: "https://nature.com/articles/food-science-civet-coffee",
      confidence: "verified",
    },
    {
      claim: "Fermentasi alami luwak menghasilkan senyawa volatil unik yang tidak dapat direplikasi sempurna oleh mesin laboratorium.",
      source: "https://sciencedirect.com/science/article/pii/S096399691100342X",
      confidence: "verified",
    },
  ],
  scenes: [
    {
      kind: "HOOK",
      durationInFrames: 120, // 4 detik
      beats: [
        {
          headline: "Kopi dari kotoran hewan?",
          dialogue: "Kenapa kopi termahal di dunia berasal dari kotoran luwak?",
          expression: "curious",
          pose: "thinking",
          sfx: "whoosh",
          activeWord: "termahal",
          prop: "question-mark",
        },
      ],
    },
    {
      kind: "FAKTA",
      durationInFrames: 180, // 6 detik
      beats: [
        {
          headline: "Enzim pencernaan luwak",
          dialogue: "Ternyata, lambung luwak menyerap protein pahit pada biji kopi!",
          expression: "storytelling",
          pose: "pointing",
          sfx: "ding",
          activeWord: "protein",
          prop: "flask",
        },
      ],
    },
    {
      kind: "TWIST",
      durationInFrames: 180, // 6 detik
      beats: [
        {
          headline: "Bukan kotorannya yang diminum",
          dialogue: "Tapi yang diseduh bukan kotorannya, melainkan biji utuh yang tercuci bersih!",
          expression: "shocked",
          pose: "talking",
          sfx: "boing",
          activeWord: "biji",
          prop: "magnifier",
        },
      ],
    },
    {
      kind: "FAKTA",
      durationInFrames: 180, // 6 detik
      beats: [
        {
          headline: "Fermentasi asam laktat",
          dialogue: "Fermentasi alami 24 jam mengubah aroma menjadi sangat lembut.",
          expression: "amused",
          pose: "talking",
          sfx: "pop",
          activeWord: "lembut",
          prop: "star",
        },
      ],
    },
    {
      kind: "PUNCHLINE",
      durationInFrames: 120, // 4 detik
      beats: [
        {
          headline: "Reaksi lucu Jokowo",
          dialogue: "Jadi yang mahal itu ongkos sewa lambung luwaknya!",
          expression: "laughing",
          pose: "celebrating",
          sfx: "giggle",
          activeWord: "lambung",
          speechBubble: "Beneran lho!",
        },
      ],
    },
    {
      kind: "OUTRO",
      durationInFrames: 120, // 4 detik
      beats: [
        {
          headline: "Penutup edukatif",
          dialogue: "Kira-kira kamu berani coba gak? Tulis di komentar ya!",
          expression: "neutral",
          pose: "idle",
          sfx: "yeay",
          activeWord: "komentar",
        },
      ],
    },
  ],
};
