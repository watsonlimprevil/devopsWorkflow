import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant inside a productivity app.
You help users with:
- boards
- tasks
- insights
- settings
- productivity tips
- organizing their workflow

Keep responses short, helpful, and friendly.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Something went wrong. Try again." });
  }
});

export default router;
