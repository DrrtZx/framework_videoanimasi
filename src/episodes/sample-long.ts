import type { LongEpisodeData } from "./long-types";

export const sampleLongEpisode: LongEpisodeData = {
  id: "long-misteri-oksigen-bumi",
  slug: "misteri-oksigen-bumi",
  title: "Dari Mana Asal Oksigen Bumi Sebenarnya?",
  facts: [
    {
      claim: "Lebih dari 50% oksigen di atmosfer bumi diproduksi oleh fitoplankton di samudra, bukan hutan hujan Amazon.",
      source: "https://oceanservice.noaa.gov/facts/ocean-oxygen.html",
      confidence: "verified",
    },
    {
      claim: "Peristiwa Oksigenasi Hebat (Great Oxidation Event) sekitar 2,4 miliar tahun lalu hampir memusnahkan seluruh kehidupan purba karena oksigen beracun bagi mikroba anaerob.",
      source: "https://nature.com/articles/nature13442",
      confidence: "verified",
    },
    {
      claim: "Hutan hujan Amazon menggunakan hampir seluruh oksigen yang diproduksinya untuk proses respirasi pohon dan dekomposisi biomassa di malam hari.",
      source: "https://nationalgeographic.com/environment/article/why-amazon-doesnt-produce-20-percent-worlds-oxygen",
      confidence: "verified",
    },
  ],
  chapters: [
    {
      kind: "INTRO",
      title: "Mitos Paru-Paru Dunia",
      durationInFrames: 1500, // 50 detik
      beats: [
        {
          headline: "Misteri pembuka",
          narration: "Selama ini kita diajarkan bahwa hutan Amazon adalah penghasil oksigen terbesar di bumi. Tapi tahukah kamu kalau sains modern membuktikan itu keliru?",
          expression: "curious",
          pose: "thinking",
          sfx: "whoosh",
          activeWord: "keliru",
          prop: "magnifier",
        },
      ],
    },
    {
      kind: "CHAPTER",
      title: "Pahlawan Mikro Samudra",
      durationInFrames: 1800, // 60 detik
      beats: [
        {
          headline: "Data fitoplankton",
          narration: "Penyumbang oksigen terbanyak sebenarnya adalah mikroorganisme bersel satu bernama fitoplankton di laut lepas.",
          expression: "storytelling",
          pose: "pointing",
          sfx: "ding",
          activeWord: "fitoplankton",
          diagram: {
            type: "pie",
            title: "Sumber Oksigen Bumi",
            labels: ["Fitoplankton Samudra", "Hutan Tropis", "Tumbuhan Darat Lain"],
            values: [55, 25, 20],
          },
        },
      ],
    },
    {
      kind: "CHAPTER",
      title: "Ironi Hutan Amazon",
      durationInFrames: 2100, // 70 detik
      beats: [
        {
          headline: "Keseimbangan respirasi",
          narration: "Pohon di hutan memang memproduksi oksigen di siang hari, tapi mikroba tanah dan pembusukan daun di malam hari mengonsumsi kembali hampir 99 persen oksigen tersebut.",
          expression: "amused",
          pose: "talking",
          sfx: "radar",
          activeWord: "mengonsumsi",
          prop: "book",
        },
      ],
    },
    {
      kind: "CLIMAX",
      title: "Peristiwa Oksigenasi Hebat",
      durationInFrames: 1800, // 60 detik
      beats: [
        {
          headline: "Sejarah radikal bumi",
          narration: "Dua koma empat miliar tahun lalu, kemunculan oksigen pertama justru menjadi bencana pemusnahan massal terbesar bagi mikroba purba bumi.",
          expression: "shocked",
          pose: "talking",
          sfx: "stinger",
          activeWord: "pemusnahan",
          diagram: {
            type: "bar",
            title: "Lonjakan Oksigen Purba",
            labels: ["3.0 Miliar Thn", "2.4 Miliar Thn", "1.0 Miliar Thn", "Sekarang"],
            values: [1, 20, 60, 100],
          },
        },
      ],
    },
    {
      kind: "OUTRO",
      title: "Refleksi & Masa Depan Samudra",
      durationInFrames: 1200, // 40 detik
      beats: [
        {
          headline: "Penutup bijak",
          narration: "Menjaga bumi bukan hanya menanam pohon di darat, tapi juga melindungi ekosistem samudra kita. Sampai jumpa di fakta berikutnya bersama Jokowo!",
          expression: "neutral",
          pose: "celebrating",
          sfx: "yeay",
          activeWord: "ekosistem",
        },
      ],
    },
  ],
};
