import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI Scene generation will run with aesthetic default fallback mapping.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Simulation Scenario Generator Endpoint
app.post("/api/simulation/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A prompt string is required." });
  }

  const ai = getAiClient();
  if (!ai) {
    // Elegant fallback simulation configurations if API key is missing
    const lowPrompt = prompt.toLowerCase();
    let mockResult = {
      effectType: "snowfall",
      intensity: 60,
      windSpeed: 2.5,
      gravity: 0.8,
      particleSize: 4,
      particleCount: 250,
      colorTheme: "ice_blue",
      recommendation: `[DEMO MODE] Interpreted prompt: "${prompt}". Designed a graceful arctic configuration with frozen pale-blue dimensions.`
    };

    if (lowPrompt.includes("birthday") || lowPrompt.includes("celebrat") || lowPrompt.includes("party")) {
      mockResult = {
        effectType: "confetti",
        intensity: 80,
        windSpeed: 1.0,
        gravity: 1.2,
        particleSize: 8,
        particleCount: 400,
        colorTheme: "neon_rainbow",
        recommendation: `[DEMO MODE] Celebration themes selected! Cascading rainbow confetti fragments floating across dynamic wind fields.`
      };
    } else if (lowPrompt.includes("galaxy") || lowPrompt.includes("space") || lowPrompt.includes("star") || lowPrompt.includes("cosmos")) {
      mockResult = {
        effectType: "stars",
        intensity: 90,
        windSpeed: 0.2,
        gravity: 0,
        particleSize: 2.5,
        particleCount: 600,
        colorTheme: "cosmic_gold",
        recommendation: `[DEMO MODE] Deep space orbit sequence activated. Deep golden stars drifting endlessly in a zero-gravity vacuum.`
      };
    } else if (lowPrompt.includes("meteor") || lowPrompt.includes("shower") || lowPrompt.includes("shooting")) {
      mockResult = {
        effectType: "meteor_shower",
        intensity: 50,
        windSpeed: -6.0,
        gravity: 3.5,
        particleSize: 3.5,
        particleCount: 200,
        colorTheme: "luxury_gold",
        recommendation: `[DEMO MODE] High-velocity atmospheric entry. Shooting meteors descending at extreme vectors with trails.`
      };
    } else if (lowPrompt.includes("firework") || lowPrompt.includes("explode") || lowPrompt.includes("spark")) {
      mockResult = {
        effectType: "fireworks",
        intensity: 70,
        windSpeed: 0.5,
        gravity: 1.0,
        particleSize: 3,
        particleCount: 400,
        colorTheme: "ruby_red",
        recommendation: `[DEMO MODE] Pyroclastic burst arrays. Concentrated red and gold charges igniting and dispersing with radial speed.`
      };
    } else if (lowPrompt.includes("aurora") || lowPrompt.includes("borealis") || lowPrompt.includes("lights")) {
      mockResult = {
        effectType: "aurora",
        intensity: 40,
        windSpeed: 0.5,
        gravity: 0.1,
        particleSize: 10,
        particleCount: 150,
        colorTheme: "forest_neon",
        recommendation: `[DEMO MODE] Magnetospheric plasma solar wind. Shimmering emerald-green atmospheric sheets weaving over dark skylines.`
      };
    } else if (lowPrompt.includes("balloon")) {
      mockResult = {
        effectType: "balloons",
        intensity: 35,
        windSpeed: 1.5,
        gravity: -0.6,
        particleSize: 15,
        particleCount: 80,
        colorTheme: "neon_purple",
        recommendation: `[DEMO MODE] Buoyant aerostatic balloons floating upward against gravity with wind-swayed strings.`
      };
    } else if (lowPrompt.includes("rain") || lowPrompt.includes("storm") || lowPrompt.includes("shower")) {
      mockResult = {
        effectType: "rain",
        intensity: 85,
        windSpeed: 3.5,
        gravity: 4.8,
        particleSize: 2,
        particleCount: 500,
        colorTheme: "ice_blue",
        recommendation: `[DEMO MODE] Hyper-realistic precipitation simulation. Rapid vertical water vectors refracting gold visual highlights.`
      };
    } else if (lowPrompt.includes("particle") || lowPrompt.includes("dust") || lowPrompt.includes("float")) {
      mockResult = {
        effectType: "particles",
        intensity: 45,
        windSpeed: -1.2,
        gravity: 0.2,
        particleSize: 5,
        particleCount: 300,
        colorTheme: "luxury_gold",
        recommendation: `[DEMO MODE] Radiant luxury micro-dust particles drifting delicately in dynamic thermal air currents.`
      };
    }

    return res.json(mockResult);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create an environmental simulation setup for this scenario: "${prompt}". Match it to the closest atmospheric effects. Use appropriate controls. Describe the aesthetic intention in the recommendation.`,
      config: {
        systemInstruction: `You are AETHER AI, the high-end generative physical rendering engine integrated into the Aether Environmental Simulation Studio. 
Your goal is to output a perfect simulation parameters JSON object configuration for the user's prompt.
You must choose the best-suited primary 'effectType' and fine-tune physical vectors.

Available Effect Types:
- 'snowfall' (flurry, winter storm, dust storm, ash)
- 'balloons' (ascending objects, celebratory lighter-than-air balls)
- 'rain' (sleets, storms, heavy downpours, digital rainfall)
- 'fireworks' (exploding particles, pyrotechnical radial bursts)
- 'confetti' (tumbling colored squares/circles, carnival, festival)
- 'stars' (twinkling starfields, constellation drifts)
- 'meteor_shower' (fast diagonal streaks across the interface)
- 'aurora' (slow weaving light ribbons, solar wind fields)
- 'particles' (ambient dust, glowing embers, floating energy orbs)

Available Color Themes:
- 'luxury_gold' (deep Obsidian with warm Champagne gold and Amber accents)
- 'ice_blue' (sleek titanium with pristine Glacier blue and White elements)
- 'neon_purple' (high-tech cyberpunk purple, Violet, and Hot-Magenta sparkles)
- 'cosmic_gold' (deep space indigo with royal violet and starry yellow highlights)
- 'forest_neon' (modern organic emerald with mint-green and auroral luminescence)
- 'neon_rainbow' (highly saturated prismatic multi-tones for celebrations)
- 'ruby_red' (passionate scarlet, luxury velvet crimson, and ember highlights)
- 'emerald_wave' (translucent jade and aquamarine fluid hues)

Keep numeric values strictly within realistic boundaries provided.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "effectType",
            "intensity",
            "windSpeed",
            "gravity",
            "particleSize",
            "particleCount",
            "colorTheme",
            "recommendation"
          ],
          properties: {
            effectType: {
              type: Type.STRING,
              description: "The primary simulation effect to activate: 'snowfall', 'balloons', 'rain', 'fireworks', 'confetti', 'stars', 'meteor_shower', 'aurora', or 'particles'."
            },
            intensity: {
              type: Type.INTEGER,
              description: "Scale of overall density or rate of particle generation from 1 to 100."
            },
            windSpeed: {
              type: Type.NUMBER,
              description: "Horizontal speed factor from -10 (strong blowing left) to 10 (strong blowing right). Use 0 for absolute stillness."
            },
            gravity: {
              type: Type.NUMBER,
              description: "Vertical force speed factor. Positive is downwards (gravity) from 0.1 to 5.0. Negative is upwards buoyancy (e.g., balloons) from -0.1 to -2.0. Near zero (0 to 0.1) for space/vacuum drift."
            },
            particleSize: {
              type: Type.NUMBER,
              description: "Primary diameter or radius of visual particle elements in pixels, ranging from 1 to 20."
            },
            particleCount: {
              type: Type.INTEGER,
              description: "Maximum active particle elements onscreen from 50 to 1000."
            },
            colorTheme: {
              type: Type.STRING,
              description: "The visual palette: 'luxury_gold', 'ice_blue', 'neon_purple', 'cosmic_gold', 'forest_neon', 'neon_rainbow', 'ruby_red', or 'emerald_wave'."
            },
            recommendation: {
              type: Type.STRING,
              description: "An elegant, descriptive 1-2 sentence breakdown of why this setting matches the prompt beautifully, incorporating physics concepts (e.g., buoyancy, velocity vector, thermal draft) as an advanced Tesla/SpaceX engineer would."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty text returned from Gemini API");
    }

    const config = JSON.parse(text);
    return res.json(config);
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({
      error: "Failed to generate simulation. Internal Engine Error.",
      details: error.message
    });
  }
});

// Configure Vite or Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    // Production Mode serving compiled static bundle
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static build from /dist directory.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aether Environmental Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
