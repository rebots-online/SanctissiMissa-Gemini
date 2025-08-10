# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based digital missal application for the Traditional Latin Mass. The app fetches liturgical data from the Gemini API to display Mass propers and ordinaries with Latin/English translations in either side-by-side or interlinear format.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Environment Setup

The application requires a `GEMINI_API_KEY` environment variable. Create a `.env.local` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

The Vite config maps this to `process.env.API_KEY` for the Gemini service.

## Architecture

### Core Components Structure
- `App.tsx` - Main application component handling state, date selection, and layout
- `components/Mass.tsx` - Renders the complete Mass structure with propers and ordinaries  
- `components/InteractiveText.tsx` - Handles Latin/English text display with interactive features
- `components/AccordionSection.tsx` - Collapsible sections for organizing Mass parts
- `components/SettingsPanel.tsx` - User preferences for display mode and font size

### Data Flow
1. User selects date → `App.tsx` calls `fetchLiturgicalData()`
2. `services/geminiService.ts` makes structured API call to Gemini
3. Response validated against complex JSON schema defining Mass structure
4. `MassData` object containing liturgical date info and propers passed to `Mass.tsx`
5. Mass component renders ordinaries from `constants.ts` + fetched propers

### Key Type Definitions (`types.ts`)
- `MassData` - Complete Mass data structure
- `Propers` - Variable parts of Mass (Introit, Collect, Gospel, etc.)
- `LiturgicalDate` - Date info, feast title, rank, liturgical color, season
- `DisplayMode` - Side-by-side vs interlinear text layout

### State Management
- Local component state in `App.tsx` for Mass data, loading, date selection
- `hooks/useSettings.ts` manages user preferences with localStorage persistence
- Settings include display mode (side-by-side/interlinear) and font size

### Gemini API Integration
The `geminiService.ts` contains a sophisticated schema-driven approach:
- Complex nested JSON schema defining exact structure expected
- Handles seasonal variations (Gradual vs Alleluia vs Tract)
- Includes comprehensive error handling for API failures and safety filtering
- Validates evangelist names, liturgical colors, and seasonal rules

### Styling Approach
- Uses Tailwind CSS classes throughout
- Dynamic liturgical color classes applied to root element
- Responsive grid layouts for side-by-side text display
- Font size controlled globally via document.body.style.fontSize

## Key Files to Understand

- `constants.ts` - Contains all ordinary texts for Mass (unchanging parts)
- `metadata.json` - Application metadata
- `components/icons.tsx` - SVG icon components

## Development Notes

- Application uses React 19 with TypeScript and Vite
- No testing framework currently configured
- Uses @google/genai for Gemini API integration
- All text content includes proper Latin accents and liturgical formatting
- Handles complex liturgical rules for seasonal variations automatically