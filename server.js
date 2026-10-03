const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, "public")));

const crops = {
  onion: ["Purple blotch (Alternaria porri)", "Downy mildew", "Thrips (Thrips tabaci)"],
  wheat: ["Leaf rust", "Stripe rust", "Aphids"],
  cotton: ["Cotton leaf curl disease", "Whitefly", "Pink bollworm"],
  rice: ["Bacterial leaf blight", "Rice blast"],
  maize: ["Fall armyworm", "Maize leaf blight"],
  tomato: ["Early blight", "Late blight", "Whitefly"],
  chilli: ["Anthracnose / fruit rot", "Thrips"],
  potato: ["Late blight", "Early blight"],
  okra: ["Yellow vein mosaic disease", "Jassid"],
  brinjal: ["Shoot and fruit borer", "Bacterial wilt"],
  sugarcane: ["Red rot", "Early shoot borer"]
};

app.post("/api/analyze", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No photo uploaded." });

    const crop = req.body.crop || "auto";
    const lang = req.body.lang || "en";
    const languageName = lang === "ur" ? "Urdu" : lang === "sd" ? "Sindhi" : "English";
    const cropContext = crop === "auto" ? "Identify the crop yourself." :
      `The user selected crop: ${crop}.`;

    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const prompt = `You are Zarkhera, a Pakistan-focused crop health assistant.
${cropContext}
Analyze the uploaded crop photo carefully. Consider common Pakistani crop diseases, pests, nutrient problems, and non-disease damage.
Do NOT pretend certainty from a single photo. If the image is unclear, say so and ask for a clearer close-up.
Return ONLY valid JSON with these keys:
crop, diagnosis, category, confidence_percent, symptoms, severity, management, prevention, needs_expert_check.
The response language must be ${languageName}.
For management, give practical integrated pest/disease management. Do not invent pesticide brand names or unsafe doses. If a chemical is potentially needed, say to use a locally registered product strictly according to its label and local agriculture department advice.
Possible Pakistan-relevant conditions for reference include: ${JSON.stringify(crops)}.`;

    const response = await client.responses.create({
      model: "gpt-6-luna",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          { type: "input_image", image_url: dataUrl, detail: "high" }
        ]
      }]
    });

    const raw = response.output_text.trim();
    let result;
    try { result = JSON.parse(raw); }
    catch {
      const cleaned = raw.replace(/^```json\s*/i,"").replace(/```$/,"").trim();
      result = JSON.parse(cleaned);
    }
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI analysis failed. Check the server/API key and try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Zarkhera running on http://localhost:${port}`));
