import { WorldCupEdition, Team } from '../types';

export const GLOBAL_TEAMS: { [id: string]: Team } = {
  // South America (CONMEBOL)
  ar: { id: "ar", nameEn: "Argentina", nameAr: "الأرجنتين", flagCode: "ar", emoji: "🇦🇷" },
  br: { id: "br", nameEn: "Brazil", nameAr: "البرازيل", flagCode: "br", emoji: "🇧🇷" },
  uy: { id: "uy", nameEn: "Uruguay", nameAr: "الأوروغواي", flagCode: "uy", emoji: "🇺🇾" },
  co: { id: "co", nameEn: "Colombia", nameAr: "كولومبيا", flagCode: "co", emoji: "🇨🇴" },
  pe: { id: "pe", nameEn: "Peru", nameAr: "بيرو", flagCode: "pe", emoji: "🇵🇪" },
  cl: { id: "cl", nameEn: "Chile", nameAr: "تشيلي", flagCode: "cl", emoji: "🇨🇱" },
  ec: { id: "ec", nameEn: "Ecuador", nameAr: "الإكوادور", flagCode: "ec", emoji: "🇪🇨" },
  py: { id: "py", nameEn: "Paraguay", nameAr: "باراغواي", flagCode: "py", emoji: "🇵🇾" },
  ve: { id: "ve", nameEn: "Venezuela", nameAr: "فنزويلا", flagCode: "ve", emoji: "🇻🇪" },
  bo: { id: "bo", nameEn: "Bolivia", nameAr: "بوليفيا", flagCode: "bo", emoji: "🇧🇴" },

  // Europe (UEFA)
  fr: { id: "fr", nameEn: "France", nameAr: "فرنسا", flagCode: "fr", emoji: "🇫🇷" },
  gb: { id: "gb", nameEn: "England", nameAr: "إنجلترا", flagCode: "gb", emoji: "🏴" },
  en: { id: "en", nameEn: "England", nameAr: "إنجلترا", flagCode: "gb", emoji: "🏴" },
  es: { id: "es", nameEn: "Spain", nameAr: "إسبانيا", flagCode: "es", emoji: "🇪🇸" },
  de: { id: "de", nameEn: "Germany", nameAr: "ألمانيا", flagCode: "de", emoji: "🇩🇪" },
  it: { id: "it", nameEn: "Italy", nameAr: "إيطاليا", flagCode: "it", emoji: "🇮🇹" },
  pt: { id: "pt", nameEn: "Portugal", nameAr: "البرتغال", flagCode: "pt", emoji: "🇵🇹" },
  hr: { id: "hr", nameEn: "Croatia", nameAr: "كرواتيا", flagCode: "hr", emoji: "🇭🇷" },
  nl: { id: "nl", nameEn: "Netherlands", nameAr: "هولندا", flagCode: "nl", emoji: "🇳🇱" },
  be: { id: "be", nameEn: "Belgium", nameAr: "بلجيكا", flagCode: "be", emoji: "🇧🇪" },
  ch: { id: "ch", nameEn: "Switzerland", nameAr: "سويسرا", flagCode: "ch", emoji: "🇨🇭" },
  dk: { id: "dk", nameEn: "Denmark", nameAr: "الدانمارك", flagCode: "dk", emoji: "🇩🇰" },
  pl: { id: "pl", nameEn: "Poland", nameAr: "بولندا", flagCode: "pl", emoji: "🇵🇱" },
  se: { id: "se", nameEn: "Sweden", nameAr: "السويد", flagCode: "se", emoji: "🇸🇪" },
  ua: { id: "ua", nameEn: "Ukraine", nameAr: "أوكرانيا", flagCode: "ua", emoji: "🇺🇦" },
  tr: { id: "tr", nameEn: "Turkey", nameAr: "تركيا", flagCode: "tr", emoji: "🇹🇷" },
  gr: { id: "gr", nameEn: "Greece", nameAr: "اليونان", flagCode: "gr", emoji: "🇬🇷" },
  ru: { id: "ru", nameEn: "Russia", nameAr: "روسيا", flagCode: "ru", emoji: "🇷🇺" },
  cz: { id: "cz", nameEn: "Czechia", nameAr: "التشيك", flagCode: "cz", emoji: "🇨🇿" },
  scotland: { id: "scotland", nameEn: "Scotland", nameAr: "اسكتلندا", flagCode: "gb", emoji: "🏴" },
  wales: { id: "wales", nameEn: "Wales", nameAr: "ويلز", flagCode: "gb", emoji: "🏴" },
  ie: { id: "ie", nameEn: "Ireland", nameAr: "أيرلندا", flagCode: "ie", emoji: "🇮🇪" },
  at: { id: "at", nameEn: "Austria", nameAr: "النمسا", flagCode: "at", emoji: "🇦🇹" },
  hu: { id: "hu", nameEn: "Hungary", nameAr: "المجر", flagCode: "hu", emoji: "🇭🇺" },
  ro: { id: "ro", nameEn: "Romania", nameAr: "رومانيا", flagCode: "ro", emoji: "🇷🇴" },
  bg: { id: "bg", nameEn: "Bulgaria", nameAr: "بلغاريا", flagCode: "bg", emoji: "🇧🇬" },
  no: { id: "no", nameEn: "Norway", nameAr: "النرويج", flagCode: "no", emoji: "🇳🇴" },
  rs: { id: "rs", nameEn: "Serbia", nameAr: "صربيا", flagCode: "rs", emoji: "🇷🇸" },
  is: { id: "is", nameEn: "Iceland", nameAr: "آيسلندا", flagCode: "is", emoji: "🇮🇸" },
  ba: { id: "ba", nameEn: "Bosnia & Herz.", nameAr: "البوسنة والهرسك", flagCode: "ba", emoji: "🇧🇦" },
  si: { id: "si", nameEn: "Slovenia", nameAr: "سلوفينيّا", flagCode: "si", emoji: "🇸🇮" },
  sk: { id: "sk", nameEn: "Slovakia", nameAr: "سلوفاكيا", flagCode: "sk", emoji: "🇸🇰" },

  // Africa (CAF)
  ma: { id: "ma", nameEn: "Morocco", nameAr: "المغرب", flagCode: "ma", emoji: "🇲🇦" },
  sn: { id: "sn", nameEn: "Senegal", nameAr: "السنغال", flagCode: "sn", emoji: "🇸🇳" },
  cm: { id: "cm", nameEn: "Cameroon", nameAr: "الكاميرون", flagCode: "cm", emoji: "🇨🇲" },
  gh: { id: "gh", nameEn: "Ghana", nameAr: "غانا", flagCode: "gh", emoji: "🇬🇭" },
  tn: { id: "tn", nameEn: "Tunisia", nameAr: "تونس", flagCode: "tn", emoji: "🇹🇳" },
  dz: { id: "dz", nameEn: "Algeria", nameAr: "الجزائر", flagCode: "dz", emoji: "🇩🇿" },
  eg: { id: "eg", nameEn: "Egypt", nameAr: "مصر", flagCode: "eg", emoji: "🇪🇬" },
  ng: { id: "ng", nameEn: "Nigeria", nameAr: "نيجيريا", flagCode: "ng", emoji: "🇳🇬" },
  ci: { id: "ci", nameEn: "Ivory Coast", nameAr: "ساحل العاج", flagCode: "ci", emoji: "🇨🇮" },
  za: { id: "za", nameEn: "South Africa", nameAr: "جنوب أفريقيا", flagCode: "za", emoji: "🇿🇦" },
  ao: { id: "ao", nameEn: "Angola", nameAr: "أنجولا", flagCode: "ao", emoji: "🇦🇴" },
  tg: { id: "tg", nameEn: "Togo", nameAr: "توغو", flagCode: "tg", emoji: "🇹🇬" },
  cv: { id: "cv", nameEn: "Cape Verde", nameAr: "الرأس الأخضر", flagCode: "cv", emoji: "🇨🇻" },

  // Asia (AFC)
  sa: { id: "sa", nameEn: "Saudi Arabia", nameAr: "السعودية", flagCode: "sa", emoji: "🇸🇦" },
  jp: { id: "jp", nameEn: "Japan", nameAr: "اليابان", flagCode: "jp", emoji: "🇯🇵" },
  kr: { id: "kr", nameEn: "South Korea", nameAr: "كوريا الجنوبية", flagCode: "kr", emoji: "🇰🇷" },
  ir: { id: "ir", nameEn: "Iran", nameAr: "إيران", flagCode: "ir", emoji: "🇮🇷" },
  au: { id: "au", nameEn: "Australia", nameAr: "أستراليا", flagCode: "au", emoji: "🇦🇺" },
  qa: { id: "qa", nameEn: "Qatar", nameAr: "قطر", flagCode: "qa", emoji: "🇶🇦" },
  iq: { id: "iq", nameEn: "Iraq", nameAr: "العراق", flagCode: "iq", emoji: "🇮🇶" },
  uz: { id: "uz", nameEn: "Uzbekistan", nameAr: "أوزبكستان", flagCode: "uz", emoji: "🇺🇿" },
  ae: { id: "ae", nameEn: "United Arab Emirates", nameAr: "الإمارات", flagCode: "ae", emoji: "🇦🇪" },
  kp: { id: "kp", nameEn: "North Korea", nameAr: "كوريا الشمالية", flagCode: "kp", emoji: "🇰🇵" },
  kw: { id: "kw", nameEn: "Kuwait", nameAr: "الكويت", flagCode: "kw", emoji: "🇰🇼" },
  cn: { id: "cn", nameEn: "China", nameAr: "الصين", flagCode: "cn", emoji: "🇨🇳" },

  // North America (CONCACAF)
  us: { id: "us", nameEn: "United States", nameAr: "الولايات المتحدة", flagCode: "us", emoji: "🇺🇸" },
  mx: { id: "mx", nameEn: "Mexico", nameAr: "المكسيك", flagCode: "mx", emoji: "🇲🇽" },
  ca: { id: "ca", nameEn: "Canada", nameAr: "كندا", flagCode: "ca", emoji: "🇨🇦" },
  cr: { id: "cr", nameEn: "Costa Rica", nameAr: "كوستاريكا", flagCode: "cr", emoji: "🇨🇷" },
  jm: { id: "jm", nameEn: "Jamaica", nameAr: "جامايكا", flagCode: "jm", emoji: "🇯🇲" },
  hn: { id: "hn", nameEn: "Honduras", nameAr: "هندوراس", flagCode: "hn", emoji: "🇭🇳" },
  pa: { id: "pa", nameEn: "Panama", nameAr: "بنما", flagCode: "pa", emoji: "🇵🇦" },
  sv: { id: "sv", nameEn: "El Salvador", nameAr: "السلفادور", flagCode: "sv", emoji: "🇸🇻" },
  ht: { id: "ht", nameEn: "Haiti", nameAr: "هايتي", flagCode: "ht", emoji: "🇭🇹" },
  tt: { id: "tt", nameEn: "Trinidad & Tobago", nameAr: "ترينيداد وتوباغو", flagCode: "tt", emoji: "🇹🇹" },
  cw: { id: "cw", nameEn: "Curaçao", nameAr: "كوراساو", flagCode: "cw", emoji: "🇨🇼" },

  // Oceania (OFC)
  nz: { id: "nz", nameEn: "New Zealand", nameAr: "نيوزيلندا", flagCode: "nz", emoji: "🇳🇿" },

  // Legacy / Historic Teams
  ussr: { id: "ussr", nameEn: "Soviet Union", nameAr: "الاتحاد السوفيتي", flagCode: "ru", emoji: "🚩" },
  fgr: { id: "fgr", nameEn: "West Germany", nameAr: "ألمانيا الغربية", flagCode: "de", emoji: "🇩🇪" },
  yugoslavia: { id: "yugoslavia", nameEn: "Yugoslavia", nameAr: "يوغوسلافيا", flagCode: "rs", emoji: "🇷🇸" },
  czechoslovakia: { id: "czechoslovakia", nameEn: "Czechoslovakia", nameAr: "تشيكوسلوفاكيا", flagCode: "cz", emoji: "🇨🇿" },
  gdr: { id: "gdr", nameEn: "East Germany", nameAr: "ألمانيا الشرقية", flagCode: "de", emoji: "🇩🇪" },
  cu: { id: "cu", nameEn: "Cuba", nameAr: "كوبا", flagCode: "cu", emoji: "🇨🇺" },
  il: { id: "il", nameEn: "Israel", nameAr: "إسرائيل", flagCode: "il", emoji: "🇮🇱" },
  nir: { id: "nir", nameEn: "Northern Ireland", nameAr: "أيرلندا الشمالية", flagCode: "gb", emoji: "🏴" },
  indonesia: { id: "indonesia", nameEn: "Indonesia", nameAr: "إندونيسيا", flagCode: "id", emoji: "🇮🇩" },
  zr: { id: "zr", nameEn: "Zaire", nameAr: "زائير", flagCode: "cd", emoji: "🇨🇩" }
};

interface RawEdition {
  year: string;
  hostEn: string;
  hostAr: string;
  winnerId: string;
  runnerUpId: string;
  teamsCount: number;
  systemType: '48-teams' | '32-teams' | '24-teams' | '16-teams' | '13-teams';
  historicalWinnerEn: string;
  historicalWinnerAr: string;
  historicalStandings: { [groupId: string]: string[] };
  historicalKnockouts: {
    matchId: string;
    stage: 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';
    team1Id: string;
    team2Id: string;
    score1: number;
    score2: number;
    winnerId: string;
    penalties?: string;
    labelEn: string;
    labelAr: string;
  }[];
}

const WORLD_CUP_EDITIONS_RAW: RawEdition[] = [
  {
    year: "2026",
    hostEn: "Canada, Mexico & USA",
    hostAr: "كندا، المكسيك والولايات المتحدة",
    winnerId: "unknown",
    runnerUpId: "unknown",
    teamsCount: 48,
    systemType: "48-teams",
    historicalWinnerEn: "Yet to be played",
    historicalWinnerAr: "لم تلعب بعد",
    historicalStandings: {
      A: ["mx", "kr", "cz", "za"],
      B: ["ca", "ch", "ba", "qa"],
      C: ["br", "ma", "scotland", "ht"],
      D: ["us", "au", "py", "tr"],
      E: ["de", "ci", "ec", "cw"],
      F: ["nl", "jp", "se", "tn"],
      G: ["eg", "ir", "be", "nz"],
      H: ["es", "uy", "cv", "sa"],
      I: ["fr", "no", "pt", "ng"],
      J: ["ar", "at", "dz", "it"],
      K: ["co", "sn", "ua", "jm"],
      L: ["gb", "gh", "hr", "pa"]
    },
    historicalKnockouts: []
  },
  {
    year: "2022",
    hostEn: "Qatar",
    hostAr: "قطر",
    winnerId: "ar",
    runnerUpId: "fr",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "Argentina",
    historicalWinnerAr: "الأرجنتين",
    historicalStandings: {
      A: ["nl", "sn", "ec", "qa"], B: ["gb", "us", "ir", "wales"],
      C: ["ar", "pl", "mx", "sa"], D: ["fr", "au", "tn", "dk"],
      E: ["jp", "es", "de", "cr"], F: ["ma", "hr", "be", "ca"],
      G: ["br", "ch", "cm", "rs"], H: ["pt", "kr", "uy", "gh"]
    },
    historicalKnockouts: [
      { matchId: "R16_1", stage: "r16", team1Id: "nl", team2Id: "us", score1: 3, score2: 1, winnerId: "nl", labelEn: "Netherlands vs USA", labelAr: "هولندا ضد أمريكا" },
      { matchId: "R16_2", stage: "r16", team1Id: "ar", team2Id: "au", score1: 2, score2: 1, winnerId: "ar", labelEn: "Argentina vs Australia", labelAr: "الأرجنتين ضد أستراليا" },
      { matchId: "R16_3", stage: "r16", team1Id: "jp", team2Id: "hr", score1: 1, score2: 1, winnerId: "hr", penalties: "1-3", labelEn: "Japan vs Croatia", labelAr: "اليابان ضد كرواتيا" },
      { matchId: "R16_4", stage: "r16", team1Id: "br", team2Id: "kr", score1: 4, score2: 1, winnerId: "br", labelEn: "Brazil vs South Korea", labelAr: "البرازيل ضد كوريا الجنوبية" },
      { matchId: "R16_5", stage: "r16", team1Id: "gb", team2Id: "sn", score1: 3, score2: 0, winnerId: "gb", labelEn: "England vs Senegal", labelAr: "إنجلترا ضد السنغال" },
      { matchId: "R16_6", stage: "r16", team1Id: "fr", team2Id: "pl", score1: 3, score2: 1, winnerId: "fr", labelEn: "France vs Poland", labelAr: "فرنسا ضد بولندا" },
      { matchId: "R16_7", stage: "r16", team1Id: "ma", team2Id: "es", score1: 0, score2: 0, winnerId: "ma", penalties: "3-0", labelEn: "Morocco vs Spain", labelAr: "المغرب ضد إسبانيا" },
      { matchId: "R16_8", stage: "r16", team1Id: "pt", team2Id: "ch", score1: 6, score2: 1, winnerId: "pt", labelEn: "Portugal vs Switzerland", labelAr: "البرتغال ضد سويسرا" },
      { matchId: "QF_1", stage: "qf", team1Id: "nl", team2Id: "ar", score1: 2, score2: 2, winnerId: "ar", penalties: "3-4", labelEn: "Netherlands vs Argentina", labelAr: "هولندا ضد الأرجنتين" },
      { matchId: "QF_2", stage: "qf", team1Id: "hr", team2Id: "br", score1: 1, score2: 1, winnerId: "hr", penalties: "4-2", labelEn: "Croatia vs Brazil", labelAr: "كرواتيا ضد البرازيل" },
      { matchId: "QF_3", stage: "qf", team1Id: "gb", team2Id: "fr", score1: 1, score2: 2, winnerId: "fr", labelEn: "England vs France", labelAr: "إنجلترا ضد فرنسا" },
      { matchId: "QF_4", stage: "qf", team1Id: "ma", team2Id: "pt", score1: 1, score2: 0, winnerId: "ma", labelEn: "Morocco vs Portugal", labelAr: "المغرب ضد البرتغال" },
      { matchId: "SF_1", stage: "sf", team1Id: "ar", team2Id: "hr", score1: 3, score2: 0, winnerId: "ar", labelEn: "Argentina vs Croatia", labelAr: "الأرجنتين ضد كرواتيا" },
      { matchId: "SF_2", stage: "sf", team1Id: "fr", team2Id: "ma", score1: 2, score2: 0, winnerId: "fr", labelEn: "France vs Morocco", labelAr: "فرنسا ضد المغرب" },
      { matchId: "THIRD", stage: "third", team1Id: "hr", team2Id: "ma", score1: 2, score2: 1, winnerId: "hr", labelEn: "Croatia vs Morocco", labelAr: "كرواتيا ضد المغرب" },
      { matchId: "FINAL", stage: "final", team1Id: "ar", team2Id: "fr", score1: 3, score2: 3, winnerId: "ar", penalties: "4-2", labelEn: "Argentina vs France", labelAr: "الأرجنتين ضد فرنسا" }
    ]
  },
  {
    year: "2018",
    hostEn: "Russia",
    hostAr: "روسيا",
    winnerId: "fr",
    runnerUpId: "hr",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "France",
    historicalWinnerAr: "فرنسا",
    historicalStandings: {
      A: ["uy", "ru", "sa", "eg"], B: ["es", "pt", "ir", "ma"],
      C: ["fr", "dk", "pe", "au"], D: ["hr", "ar", "ng", "is"],
      E: ["br", "ch", "rs", "cr"], F: ["se", "mx", "kr", "de"],
      G: ["be", "gb", "tn", "pa"], H: ["co", "jp", "sn", "pl"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "fr", team2Id: "hr", score1: 4, score2: 2, winnerId: "fr", labelEn: "France vs Croatia", labelAr: "فرنسا ضد كرواتيا" },
      { matchId: "THIRD", stage: "third", team1Id: "be", team2Id: "gb", score1: 2, score2: 0, winnerId: "be", labelEn: "Belgium vs England", labelAr: "بلجيكا ضد إنجلترا" }
    ]
  },
  {
    year: "2014",
    hostEn: "Brazil",
    hostAr: "البرازيل",
    winnerId: "de",
    runnerUpId: "ar",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "Germany",
    historicalWinnerAr: "ألمانيا",
    historicalStandings: {
      A: ["br", "mx", "hr", "cm"], B: ["nl", "cl", "es", "au"],
      C: ["co", "gr", "ci", "jp"], D: ["cr", "uy", "it", "gb"],
      E: ["fr", "ch", "ec", "hn"], F: ["ar", "ng", "ba", "ir"],
      G: ["de", "us", "pt", "gh"], H: ["be", "dz", "ru", "kr"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "de", team2Id: "ar", score1: 1, score2: 0, winnerId: "de", labelEn: "Germany vs Argentina", labelAr: "ألمانيا ضد الأرجنتين" },
      { matchId: "THIRD", stage: "third", team1Id: "br", team2Id: "nl", score1: 0, score2: 3, winnerId: "nl", labelEn: "Brazil vs Netherlands", labelAr: "البرازيل ضد هولندا" }
    ]
  },
  {
    year: "2010",
    hostEn: "South Africa",
    hostAr: "جنوب أفريقيا",
    winnerId: "es",
    runnerUpId: "nl",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "Spain",
    historicalWinnerAr: "إسبانيا",
    historicalStandings: {
      A: ["uy", "mx", "za", "fr"], B: ["ar", "kr", "gr", "ng"],
      C: ["us", "gb", "si", "dz"], D: ["de", "gh", "au", "rs"],
      E: ["nl", "jp", "dk", "cm"], F: ["py", "sk", "nz", "it"],
      G: ["br", "pt", "ci", "kp"], H: ["es", "cl", "ch", "hn"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "nl", team2Id: "es", score1: 0, score2: 1, winnerId: "es", labelEn: "Netherlands vs Spain", labelAr: "هولندا ضد إسبانيا" },
      { matchId: "THIRD", stage: "third", team1Id: "uy", team2Id: "de", score1: 2, score2: 3, winnerId: "de", labelEn: "Uruguay vs Germany", labelAr: "الأوروغواي ضد ألمانيا" }
    ]
  },
  {
    year: "2006",
    hostEn: "Germany",
    hostAr: "ألمانيا",
    winnerId: "it",
    runnerUpId: "fr",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "Italy",
    historicalWinnerAr: "إيطاليا",
    historicalStandings: {
      A: ["de", "ec", "pl", "cr"], B: ["en", "se", "py", "tt"],
      C: ["ar", "nl", "ci", "rs"], D: ["pt", "mx", "ao", "ir"],
      E: ["it", "gh", "cz", "us"], F: ["br", "au", "hr", "jp"],
      G: ["ch", "fr", "kr", "tg"], H: ["es", "ua", "tn", "sa"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "it", team2Id: "fr", score1: 1, score2: 1, winnerId: "it", penalties: "5-3", labelEn: "Italy vs France", labelAr: "إيطاليا ضد فرنسا" },
      { matchId: "THIRD", stage: "third", team1Id: "de", team2Id: "pt", score1: 3, score2: 1, winnerId: "de", labelEn: "Germany vs Portugal", labelAr: "ألمانيا ضد البرتغال" }
    ]
  },
  {
    year: "2002",
    hostEn: "South Korea & Japan",
    hostAr: "كوريا الجنوبية واليابان",
    winnerId: "br",
    runnerUpId: "de",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "Brazil",
    historicalWinnerAr: "البرازيل",
    historicalStandings: {
      A: ["dk", "sn", "uy", "fr"], B: ["es", "py", "za", "si"],
      C: ["br", "tr", "cr", "cn"], D: ["kr", "us", "pt", "pl"],
      E: ["de", "ie", "cm", "sa"], F: ["se", "en", "ar", "ng"],
      G: ["mx", "it", "hr", "ec"], H: ["jp", "be", "ru", "tn"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "de", team2Id: "br", score1: 0, score2: 2, winnerId: "br", labelEn: "Germany vs Brazil", labelAr: "ألمانيا ضد البرازيل" },
      { matchId: "THIRD", stage: "third", team1Id: "kr", team2Id: "tr", score1: 2, score2: 3, winnerId: "tr", labelEn: "South Korea vs Turkey", labelAr: "كوريا ج ضد تركيا" }
    ]
  },
  {
    year: "1998",
    hostEn: "France",
    hostAr: "فرنسا",
    winnerId: "fr",
    runnerUpId: "br",
    teamsCount: 32,
    systemType: "32-teams",
    historicalWinnerEn: "France",
    historicalWinnerAr: "فرنسا",
    historicalStandings: {
      A: ["br", "no", "ma", "scotland"], B: ["it", "cl", "at", "cm"],
      C: ["fr", "dk", "za", "sa"], D: ["ng", "py", "es", "bg"],
      E: ["nl", "mx", "be", "kr"], F: ["de", "rs", "ir", "us"],
      G: ["ro", "gb", "co", "tn"], H: ["ar", "hr", "jm", "jp"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "br", team2Id: "fr", score1: 0, score2: 3, winnerId: "fr", labelEn: "Brazil vs France", labelAr: "البرازيل ضد فرنسا" },
      { matchId: "THIRD", stage: "third", team1Id: "nl", team2Id: "hr", score1: 1, score2: 2, winnerId: "hr", labelEn: "Netherlands vs Croatia", labelAr: "هولندا ضد كرواتيا" }
    ]
  },
  {
    year: "1994",
    hostEn: "United States",
    hostAr: "الولايات المتحدة",
    winnerId: "br",
    runnerUpId: "it",
    teamsCount: 24,
    systemType: "24-teams",
    historicalWinnerEn: "Brazil",
    historicalWinnerAr: "البرازيل",
    historicalStandings: {
      A: ["ro", "ch", "us", "co"], B: ["br", "se", "ru", "cm"],
      C: ["de", "es", "kr", "bo"], D: ["ng", "bg", "ar", "gr"],
      E: ["mx", "ie", "it", "no"], F: ["nl", "sa", "be", "ma"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "br", team2Id: "it", score1: 0, score2: 0, winnerId: "br", penalties: "3-2", labelEn: "Brazil vs Italy", labelAr: "البرازيل ضد إيطاليا" },
      { matchId: "THIRD", stage: "third", team1Id: "se", team2Id: "bg", score1: 4, score2: 0, winnerId: "se", labelEn: "Sweden vs Bulgaria", labelAr: "السويد ضد بلغاريا" }
    ]
  },
  {
    year: "1990",
    hostEn: "Italy",
    hostAr: "إيطاليا",
    winnerId: "fgr",
    runnerUpId: "ar",
    teamsCount: 24,
    systemType: "24-teams",
    historicalWinnerEn: "West Germany",
    historicalWinnerAr: "ألمانيا الغربية",
    historicalStandings: {
      A: ["it", "czechoslovakia", "at", "us"], B: ["cm", "ro", "ar", "ussr"],
      C: ["br", "cr", "scotland", "se"], D: ["fgr", "yugoslavia", "co", "ae"],
      E: ["es", "be", "uy", "kr"], F: ["en", "ie", "nl", "eg"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "fgr", team2Id: "ar", score1: 1, score2: 0, winnerId: "fgr", labelEn: "West Germany vs Argentina", labelAr: "ألمانيا أ ضد الأرجنتين" },
      { matchId: "THIRD", stage: "third", team1Id: "it", team2Id: "en", score1: 2, score2: 1, winnerId: "it", labelEn: "Italy vs England", labelAr: "إيطاليا ضد إنجلترا" }
    ]
  },
  {
    year: "1986",
    hostEn: "Mexico",
    hostAr: "المكسيك",
    winnerId: "ar",
    runnerUpId: "fgr",
    teamsCount: 24,
    systemType: "24-teams",
    historicalWinnerEn: "Argentina",
    historicalWinnerAr: "الأرجنتين",
    historicalStandings: {
      A: ["ar", "it", "bg", "kr"], B: ["mx", "py", "be", "iq"],
      C: ["ussr", "fr", "hu", "ca"], D: ["br", "es", "nir", "dz"],
      E: ["dk", "fgr", "uy", "scotland"], F: ["ma", "en", "pl", "pt"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "ar", team2Id: "fgr", score1: 3, score2: 2, winnerId: "ar", labelEn: "Argentina vs West Germany", labelAr: "الأرجنتين ضد ألمانيا الغربية" },
      { matchId: "THIRD", stage: "third", team1Id: "fr", team2Id: "be", score1: 4, score2: 2, winnerId: "fr", labelEn: "France vs Belgium", labelAr: "فرنسا ضد بلجيكا" }
    ]
  },
  {
    year: "1982",
    hostEn: "Spain",
    hostAr: "إسبانيا",
    winnerId: "it",
    runnerUpId: "fgr",
    teamsCount: 24,
    systemType: "24-teams",
    historicalWinnerEn: "Italy",
    historicalWinnerAr: "إيطاليا",
    historicalStandings: {
      A: ["pl", "it", "cm", "pe"], B: ["fgr", "at", "dz", "cl"],
      C: ["be", "ar", "hu", "sv"], D: ["en", "fr", "cz", "kw"],
      E: ["nir", "es", "yugoslavia", "hn"], F: ["br", "ussr", "scotland", "nz"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "it", team2Id: "fgr", score1: 3, score2: 1, winnerId: "it", labelEn: "Italy vs West Germany", labelAr: "إيطاليا ضد ألمانيا الغربية" },
      { matchId: "THIRD", stage: "third", team1Id: "pl", team2Id: "fr", score1: 3, score2: 2, winnerId: "pl", labelEn: "Poland vs France", labelAr: "بولندا ضد فرنسا" }
    ]
  },
  {
    year: "1978",
    hostEn: "Argentina",
    hostAr: "الأرجنتين",
    winnerId: "ar",
    runnerUpId: "nl",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "Argentina",
    historicalWinnerAr: "الأرجنتين",
    historicalStandings: {
      A: ["it", "ar", "fr", "hu"], B: ["pl", "fgr", "tn", "mx"],
      C: ["at", "br", "es", "se"], D: ["pe", "nl", "scotland", "ir"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "ar", team2Id: "nl", score1: 3, score2: 1, winnerId: "ar", labelEn: "Argentina vs Netherlands", labelAr: "الأرجنتين ضد هولندا" },
      { matchId: "THIRD", stage: "third", team1Id: "br", team2Id: "it", score1: 2, score2: 1, winnerId: "br", labelEn: "Brazil vs Italy", labelAr: "البرازيل ضد إيطاليا" }
    ]
  },
  {
    year: "1974",
    hostEn: "West Germany",
    hostAr: "ألمانيا الغربية",
    winnerId: "fgr",
    runnerUpId: "nl",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "West Germany",
    historicalWinnerAr: "ألمانيا الغربية",
    historicalStandings: {
      A: ["gdr", "fgr", "cl", "au"], B: ["yugoslavia", "br", "scotland", "zr"],
      C: ["nl", "se", "bg", "uy"], D: ["pl", "ar", "it", "ht"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "nl", team2Id: "fgr", score1: 1, score2: 2, winnerId: "fgr", labelEn: "Netherlands vs West Germany", labelAr: "هولندا ضد ألمانيا الغربية" },
      { matchId: "THIRD", stage: "third", team1Id: "br", team2Id: "pl", score1: 0, score2: 1, winnerId: "pl", labelEn: "Brazil vs Poland", labelAr: "البرازيل ضد بولندا" }
    ]
  },
  {
    year: "1970",
    hostEn: "Mexico",
    hostAr: "المكسيك",
    winnerId: "br",
    runnerUpId: "it",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "Brazil",
    historicalWinnerAr: "البرازيل",
    historicalStandings: {
      A: ["ussr", "mx", "be", "sv"], B: ["it", "uy", "se", "il"],
      C: ["br", "gb", "ro", "cz"], D: ["de", "pe", "bg", "ma"]
    },
    historicalKnockouts: [
      { matchId: "QF_1", stage: "qf", team1Id: "ussr", team2Id: "uy", score1: 0, score2: 1, winnerId: "uy", labelEn: "Soviet Union vs Uruguay", labelAr: "الاتحاد السوفيتي ضد الأوروغواي" },
      { matchId: "QF_2", stage: "qf", team1Id: "br", team2Id: "pe", score1: 4, score2: 2, winnerId: "br", labelEn: "Brazil vs Peru", labelAr: "البرازيل ضد بيرو" },
      { matchId: "QF_3", stage: "qf", team1Id: "it", team2Id: "mx", score1: 4, score2: 1, winnerId: "it", labelEn: "Italy vs Mexico", labelAr: "إيطاليا ضد المكسيك" },
      { matchId: "QF_4", stage: "qf", team1Id: "de", team2Id: "gb", score1: 3, score2: 2, winnerId: "de", labelEn: "West Germany vs England", labelAr: "ألمانيا الكبرى ضد إنجلترا" },
      { matchId: "SF_1", stage: "sf", team1Id: "uy", team2Id: "br", score1: 1, score2: 3, winnerId: "br", labelEn: "Uruguay vs Brazil", labelAr: "الأوروغواي ضد البرازيل" },
      { matchId: "SF_2", stage: "sf", team1Id: "it", team2Id: "de", score1: 4, score2: 3, winnerId: "it", labelEn: "Italy vs West Germany", labelAr: "إيطاليا ضد ألمانيا" },
      { matchId: "THIRD", stage: "third", team1Id: "uy", team2Id: "de", score1: 0, score2: 1, winnerId: "de", labelEn: "Uruguay vs West Germany", labelAr: "الأوروغواي ضد ألمانيا" },
      { matchId: "FINAL", stage: "final", team1Id: "br", team2Id: "it", score1: 4, score2: 1, winnerId: "br", labelEn: "Brazil vs Italy", labelAr: "البرازيل ضد إيطاليا" }
    ]
  },
  {
    year: "1966",
    hostEn: "England",
    hostAr: "إنجلترا",
    winnerId: "en",
    runnerUpId: "fgr",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "England",
    historicalWinnerAr: "إنجلترا",
    historicalStandings: {
      A: ["en", "uy", "mx", "fr"], B: ["fgr", "ar", "es", "ch"],
      C: ["pt", "hu", "br", "bg"], D: ["ussr", "kp", "it", "cl"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "en", team2Id: "fgr", score1: 4, score2: 2, winnerId: "en", labelEn: "England vs West Germany", labelAr: "إنجلترا ضد ألمانيا الغربية" },
      { matchId: "THIRD", stage: "third", team1Id: "pt", team2Id: "ussr", score1: 2, score2: 1, winnerId: "pt", labelEn: "Portugal vs Soviet Union", labelAr: "البرتغال ضد الاتحاد السوفيتي" }
    ]
  },
  {
    year: "1962",
    hostEn: "Chile",
    hostAr: "تشيلي",
    winnerId: "br",
    runnerUpId: "cz",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "Brazil",
    historicalWinnerAr: "البرازيل",
    historicalStandings: {
      A: ["ussr", "yugoslavia", "uy", "co"], B: ["fgr", "cl", "it", "ch"],
      C: ["br", "cz", "mx", "es"], D: ["hu", "en", "ar", "bg"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "br", team2Id: "cz", score1: 3, score2: 1, winnerId: "br", labelEn: "Brazil vs Czechoslovakia", labelAr: "البرازيل ضد تشيكوسلوفاكيا" },
      { matchId: "THIRD", stage: "third", team1Id: "cl", team2Id: "yugoslavia", score1: 1, score2: 0, winnerId: "cl", labelEn: "Chile vs Yugoslavia", labelAr: "تشيلي ضد يوغوسلافيا" }
    ]
  },
  {
    year: "1958",
    hostEn: "Sweden",
    hostAr: "السويد",
    winnerId: "br",
    runnerUpId: "se",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "Brazil",
    historicalWinnerAr: "البرازيل",
    historicalStandings: {
      A: ["fgr", "nir", "czechoslovakia", "ar"], B: ["fr", "yugoslavia", "py", "scotland"],
      C: ["se", "wales", "hu", "mx"], D: ["br", "ussr", "en", "at"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "br", team2Id: "se", score1: 5, score2: 2, winnerId: "br", labelEn: "Brazil vs Sweden", labelAr: "البرازيل ضد السويد" },
      { matchId: "THIRD", stage: "third", team1Id: "fr", team2Id: "fgr", score1: 6, score2: 3, winnerId: "fr", labelEn: "France vs West Germany", labelAr: "فرنسا ضد ألمانيا الغربية" }
    ]
  },
  {
    year: "1954",
    hostEn: "Switzerland",
    hostAr: "سويسرا",
    winnerId: "fgr",
    runnerUpId: "hu",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "West Germany",
    historicalWinnerAr: "ألمانيا الغربية",
    historicalStandings: {
      A: ["br", "yugoslavia", "fr", "mx"], B: ["hu", "fgr", "tr", "kr"],
      C: ["uy", "at", "czechoslovakia", "scotland"], D: ["en", "ch", "it", "be"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "fgr", team2Id: "hu", score1: 3, score2: 2, winnerId: "fgr", labelEn: "West Germany vs Hungary", labelAr: "ألمانيا الغربية ضد المجر" },
      { matchId: "THIRD", stage: "third", team1Id: "at", team2Id: "uy", score1: 3, score2: 1, winnerId: "at", labelEn: "Austria vs Uruguay", labelAr: "النمسا ضد الأوروغواي" }
    ]
  },
  {
    year: "1950",
    hostEn: "Brazil",
    hostAr: "البرازيل",
    winnerId: "uy",
    runnerUpId: "br",
    teamsCount: 13,
    systemType: "13-teams",
    historicalWinnerEn: "Uruguay",
    historicalWinnerAr: "الأوروغواي",
    historicalStandings: {
      A: ["br", "yugoslavia", "ch", "mx"], B: ["es", "en", "cl", "us"],
      C: ["se", "it", "py"], D: ["uy", "bo"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "uy", team2Id: "br", score1: 2, score2: 1, winnerId: "uy", labelEn: "Uruguay vs Brazil", labelAr: "الأوروغواي ضد البرازيل" }
    ]
  },
  {
    year: "1938",
    hostEn: "France",
    hostAr: "فرنسا",
    winnerId: "it",
    runnerUpId: "hu",
    teamsCount: 13,
    systemType: "13-teams",
    historicalWinnerEn: "Italy",
    historicalWinnerAr: "إيطاليا",
    historicalStandings: {
      A: ["it", "fr", "be", "no"], B: ["hu", "ch", "de", "pl"],
      C: ["br", "cz", "ro", "se"], D: ["cu", "indonesia"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "it", team2Id: "hu", score1: 4, score2: 2, winnerId: "it", labelEn: "Italy vs Hungary", labelAr: "إيطاليا ضد المجر" },
      { matchId: "THIRD", stage: "third", team1Id: "br", team2Id: "se", score1: 4, score2: 2, winnerId: "br", labelEn: "Brazil vs Sweden", labelAr: "البرازيل ضد السويد" }
    ]
  },
  {
    year: "1934",
    hostEn: "Italy",
    hostAr: "إيطاليا",
    winnerId: "it",
    runnerUpId: "cz",
    teamsCount: 16,
    systemType: "16-teams",
    historicalWinnerEn: "Italy",
    historicalWinnerAr: "إيطاليا",
    historicalStandings: {
      A: ["it", "us", "es", "br"], B: ["cz", "ro", "ch", "nl"],
      C: ["at", "fr", "hu", "eg"], D: ["de", "be", "se", "ar"]
    },
    historicalKnockouts: [
      { matchId: "FINAL", stage: "final", team1Id: "it", team2Id: "cz", score1: 2, score2: 1, winnerId: "it", labelEn: "Italy vs Czechoslovakia", labelAr: "إيطاليا ضد تشيكوسلوفاكيا" },
      { matchId: "THIRD", stage: "third", team1Id: "de", team2Id: "at", score1: 3, score2: 2, winnerId: "de", labelEn: "Germany vs Austria", labelAr: "ألمانيا ضد النمسا" }
    ]
  },
  {
    year: "1930",
    hostEn: "Uruguay",
    hostAr: "الأوروغواي",
    winnerId: "uy",
    runnerUpId: "ar",
    teamsCount: 13,
    systemType: "13-teams",
    historicalWinnerEn: "Uruguay",
    historicalWinnerAr: "الأوروغواي",
    historicalStandings: {
      A: ["ar", "cl", "fr", "mx"], B: ["yugoslavia", "br", "bo"],
      C: ["uy", "ro", "pe"], D: ["us", "py", "be"]
    },
    historicalKnockouts: [
      { matchId: "SF_1", stage: "sf", team1Id: "ar", team2Id: "us", score1: 6, score2: 1, winnerId: "ar", labelEn: "Argentina vs United States", labelAr: "الأرجنتين ضد أمريكا" },
      { matchId: "SF_2", stage: "sf", team1Id: "uy", team2Id: "rs", score1: 6, score2: 1, winnerId: "uy", labelEn: "Uruguay vs Yugoslavia", labelAr: "الأوروغواي ضد يوغوسلافيا" },
      { matchId: "FINAL", stage: "final", team1Id: "uy", team2Id: "ar", score1: 4, score2: 2, winnerId: "uy", labelEn: "Uruguay vs Argentina", labelAr: "الأوروغواي ضد الأرجنتين" }
    ]
  }
];

const translateGroupId = (id: string): string => {
  const mapping: { [key: string]: string } = {
    A: "أ", B: "ب", C: "ج", D: "د", E: "هـ", F: "و", G: "ز", H: "ح", I: "ط", J: "ي", K: "ك", L: "ل"
  };
  return mapping[id] || id;
};

export const WORLD_CUP_EDITIONS: WorldCupEdition[] = WORLD_CUP_EDITIONS_RAW.map(edition => ({
  year: edition.year,
  hostEn: edition.hostEn,
  hostAr: edition.hostAr,
  winnerId: edition.winnerId,
  runnerUpId: edition.runnerUpId,
  teamsCount: edition.teamsCount,
  systemType: edition.systemType,
  historicalWinnerEn: edition.historicalWinnerEn,
  historicalWinnerAr: edition.historicalWinnerAr,
  historicalStandings: edition.historicalStandings,
  historicalKnockouts: edition.historicalKnockouts,
  groups: Object.keys(edition.historicalStandings).map(groupId => ({
    id: groupId,
    nameEn: `Group ${groupId}`,
    nameAr: `المجموعة ${translateGroupId(groupId)}`,
    teams: edition.historicalStandings[groupId].map(teamId => {
      const team = GLOBAL_TEAMS[teamId];
      if (!team) {
        return {
          id: teamId,
          nameEn: teamId.toUpperCase(),
          nameAr: teamId.toUpperCase(),
          flagCode: teamId,
          emoji: "🏳️"
        };
      }
      return team;
    })
  }))
}));
