
export interface Translation {
  latin: string;
  english: string;
}

export interface Verse extends Translation {
  reference: string;
}

export interface Introit {
  antiphon: Translation;
  verse: Verse;
}

export interface Gradual {
  verse1: Translation;
  verse2: Translation;
}

export interface Tract {
  verses: Translation[];
}

export interface Alleluia {
  verse: Translation;
}

export interface Gospel extends Translation {
  reference: string;
  evangelist: string;
}

export interface Propers {
  introit: Introit;
  collect: Translation;
  epistle: Verse;
  gradual?: Gradual;
  tract?: Tract;
  alleluia?: Alleluia;
  gospel: Gospel;
  offertory: Translation;
  secret: Translation;
  communion: Translation;
  postcommunion: Translation;
}

export enum LiturgicalColor {
    RED = 'red',
    PURPLE = 'purple',
    GREEN = 'green',
    WHITE = 'white',
    ROSE = 'rose',
    BLACK = 'black',
}

export interface LiturgicalDate {
  date: string; // YYYY-MM-DD
  dateLong: string; // e.g., July 17, 2025
  feastTitle: string;
  rank: string; // e.g., "I Classis"
  liturgicalColor: LiturgicalColor;
  season: string; // e.g., "Tempus per Annum", "Advent", "Lent"
  commemorations?: string;
  omitGloria: boolean;
  omitCredo: boolean;
}

export interface MassData {
  liturgicalDate: LiturgicalDate;
  propers: Propers;
}

export enum DisplayMode {
    SIDE_BY_SIDE = 'side-by-side',
    INTERLINEAR = 'interlinear',
}
