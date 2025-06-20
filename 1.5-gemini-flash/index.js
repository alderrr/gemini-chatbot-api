require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const result = await model.generateContent(message);
    const response = result.response;
    res.status(200).json({ reply: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Gemini Chatbot running on port: ${port}`);
});
