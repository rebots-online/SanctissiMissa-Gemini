
import { GoogleGenAI, Type } from "@google/genai";
import { MassData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const translationSchema = {
    type: Type.OBJECT,
    properties: {
        latin: { type: Type.STRING },
        english: { type: Type.STRING },
    },
    required: ['latin', 'english'],
};

const verseSchema = {
    type: Type.OBJECT,
    properties: {
        latin: { type: Type.STRING },
        english: { type: Type.STRING },
        reference: { type: Type.STRING },
    },
    required: ['latin', 'english', 'reference'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    liturgicalDate: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
        dateLong: { type: Type.STRING, description: "Long form date, e.g., 'July 17, 2025'" },
        feastTitle: { type: Type.STRING },
        rank: { type: Type.STRING, description: "e.g., 'I Classis', 'III Classis', 'Commemoratio'" },
        liturgicalColor: { type: Type.STRING, enum: ['red', 'purple', 'green', 'white', 'rose', 'black'] },
        season: { type: Type.STRING, description: "e.g., 'Advent', 'Lent', 'Paschaltide', 'Tempus per Annum'" },
        commemorations: { type: Type.STRING, description: "Commemorated feasts, if any. Null if none." },
        omitGloria: { type: Type.BOOLEAN },
        omitCredo: { type: Type.BOOLEAN },
      },
      required: ['date', 'dateLong', 'feastTitle', 'rank', 'liturgicalColor', 'season', 'omitGloria', 'omitCredo']
    },
    propers: {
      type: Type.OBJECT,
      properties: {
        introit: {
          type: Type.OBJECT,
          properties: {
            antiphon: translationSchema,
            verse: verseSchema,
          },
          required: ['antiphon', 'verse'],
        },
        collect: translationSchema,
        epistle: verseSchema,
        gradual: {
          type: Type.OBJECT,
          properties: { verse1: translationSchema, verse2: translationSchema },
          required: ['verse1', 'verse2'],
          description: "Omitted during Paschaltide and replaced by Alleluia. Null if omitted."
        },
        tract: {
          type: Type.OBJECT,
          properties: { verses: { type: Type.ARRAY, items: translationSchema } },
          required: ['verses'],
          description: "Replaces Gradual/Alleluia during Lent and other penitential times. Null if omitted."
        },
        alleluia: {
          type: Type.OBJECT,
          properties: { verse: translationSchema },
          required: ['verse'],
          description: "Used during joyful seasons, especially Paschaltide. Null if omitted."
        },
        gospel: {
          type: Type.OBJECT,
          properties: {
            latin: { type: Type.STRING },
            english: { type: Type.STRING },
            reference: { type: Type.STRING },
            evangelist: { type: Type.STRING, description: "e.g., 'Matthew', 'Mark', 'Luke', 'John'" },
          },
          required: ['latin', 'english', 'reference', 'evangelist'],
        },
        offertory: translationSchema,
        secret: translationSchema,
        communion: translationSchema,
        postcommunion: translationSchema,
      },
      required: ['introit', 'collect', 'epistle', 'gospel', 'offertory', 'secret', 'communion', 'postcommunion'],
    },
  },
  required: ['liturgicalDate', 'propers'],
};


export async function fetchLiturgicalData(date: Date): Promise<MassData> {
    const dateString = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const prompt = `
You are a liturgical expert specializing in the Traditional Latin Mass (1960 Roman Missal and rubrics).
Your knowledge is equivalent to the data found in the Divinum Officium project.
You must accurately determine the feast, rank, color, and Propers for the given date, resolving any conflicts between moveable and fixed feasts according to the 1960 rules of precedence.

For the date: ${dateString}

Provide the complete liturgical data in JSON format.
The response must strictly adhere to the provided JSON schema.
- For the Latin text, include accents (e.g., á, é, í, ó, ú, ǽ, œ́).
- For gradual, tract, or alleluia, only include the one that is said on the given day. The others should be null. For example, during most of Lent, there is a Tract but no Gradual or Alleluia. During Paschaltide, there is an Alleluia but no Gradual or Tract.
- Ensure the 'evangelist' field is just the name (e.g., 'John'), not 'St. John'.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1,
            }
        });

        if (!response.text) {
          throw new Error("API returned an empty response. This may be due to content filtering or an internal error.");
        }
        
        // The response text is a JSON string, so we need to parse it.
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        // Basic validation
        if (!data.liturgicalDate || !data.propers) {
            throw new Error("Invalid data structure received from API.");
        }

        return data as MassData;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        let errorMessage = "Failed to fetch liturgical data. ";
        if (error instanceof Error) {
            errorMessage += `Details: ${error.message}`;
        }
        if (typeof error === 'object' && error !== null) {
            const errorDetails = JSON.stringify(error, null, 2);
            if (errorDetails.includes("SAFETY")) {
                 errorMessage += "The request was blocked due to safety settings. The prompt may have been flagged as harmful.";
            } else if (errorDetails.includes("400")) {
                 errorMessage += "The request was invalid. Please check the prompt and schema.";
            } else {
                 errorMessage += `Unexpected API error. See console for details.`;
            }
        }
        throw new Error(errorMessage);
    }
}
