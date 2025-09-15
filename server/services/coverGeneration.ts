import { enhanceCoverPrompt, generateCoverImage } from '../lib/gemini';
import * as path from 'path';
import * as fs from 'fs';

interface TrackWithFeatures {
  id: number;
  title: string;
  artist?: { name: string };
  audioFeatures?: {
    bpm?: number;
    energy?: number;
    valence?: number;
  };
  tags?: string[];
}

export async function generateCover(track: TrackWithFeatures, style: string = "neon"): Promise<string> {
  // APIG = API Gemini - vérifier que GEMINI_API_KEY existe
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("APIG (API Gemini) credentials not configured - GEMINI_API_KEY required");
  }

  // Generate base prompt, then enhance with Gemini 2.5 Pro
  const basePrompt = generateCoverPrompt(track, style);
  
  let enhancedPrompt: string;
  try {
    // Use Gemini to enhance the prompt for better visual results
    enhancedPrompt = await enhanceCoverPrompt(track, basePrompt);
  } catch (error) {
    console.warn('Gemini prompt enhancement failed, using base prompt:', error);
    enhancedPrompt = basePrompt;
  }

  try {
    // Generate unique filename for this cover
    const timestamp = Date.now();
    const safeTitle = track.title.replace(/[^a-zA-Z0-9]/g, '_');
    const imagePath = path.join(process.cwd(), 'generated_covers', `${safeTitle}_${timestamp}.png`);
    
    // Ensure directory exists
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Use APIG (API Gemini) to generate the cover image
    await generateCoverImage(enhancedPrompt, imagePath);
    
    // Return the relative path to the generated image
    const relativePath = `/generated_covers/${path.basename(imagePath)}`;
    return relativePath;
    
  } catch (error) {
    console.error('APIG (API Gemini) cover generation error:', error);
    throw new Error(`Failed to generate cover artwork with APIG: ${(error as Error).message}`);
  }
}

function generateCoverPrompt(track: TrackWithFeatures, style: string): string {
  const title = track.title;
  const artist = track.artist?.name || "Unknown Artist";
  const energy = track.audioFeatures?.energy || 0.7;
  const valence = track.audioFeatures?.valence || 0.5;
  const bpm = track.audioFeatures?.bpm || 138;

  let basePrompt = "";
  let colorScheme = "";
  let elements: string[] = [];

  if (style === "neon") {
    colorScheme = "vibrant neon purple and electric blue gradient";
    elements = [
      "geometric patterns", 
      "digital grid overlay",
      "glowing edges",
      "cyberpunk aesthetic",
      "3D elements"
    ];
  } else if (style === "ethereal") {
    colorScheme = "soft aurora colors, heavenly light";
    elements = [
      "flowing light streams",
      "celestial atmosphere", 
      "gold accents",
      "divine radiance",
      "Jerusalem skyline silhouette"
    ];
  }

  // Adjust elements based on track energy and mood
  if (energy > 0.8) {
    elements.push("dynamic motion blur", "intense lighting");
  } else if (energy < 0.4) {
    elements.push("soft gradients", "peaceful atmosphere");
  }

  if (valence > 0.7) {
    elements.push("uplifting rays", "bright highlights");
  } else if (valence < 0.3) {
    elements.push("deep shadows", "moody lighting");
  }

  // BPM-based visual intensity
  if (bpm >= 150) {
    elements.push("high contrast", "sharp edges");
  } else if (bpm <= 128) {
    elements.push("smooth transitions", "organic shapes");
  }

  basePrompt = `Album cover for "${title}" by ${artist}, ${colorScheme}, ${elements.join(", ")}, 3000x3000 resolution, professional music artwork, high quality, square format, modern electronic music design`;

  return basePrompt;
}

export function getCoverStyles(): { id: string; name: string; description: string }[] {
  return [
    {
      id: "neon",
      name: "Neon",
      description: "Vibrant purple/blue geometric patterns with cyberpunk aesthetic"
    },
    {
      id: "ethereal", 
      name: "Ethereal",
      description: "Soft auroras, Jerusalem themes, celestial atmosphere with gold accents"
    },
  ];
}
