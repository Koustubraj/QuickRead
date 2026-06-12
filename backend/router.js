const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const gemini = new GoogleGenAI({ apiKey: process.env.gemini });

let sessions = new Map();

async function generateText(prompt, session) {
  try {
    if(!sessions.has(session)){
      sessions.set(session,[])
    }
    const history = sessions.get(session)
    // const response = await gemini.models.generateContent({
    //     model:'gemini-3.5-flash',
    //     contents:prompt
    // })
    const chat = await gemini.chats.create({
      model: "gemini-3.5-flash",
      history: history,
    });

    const response = await chat.sendMessage({
      message: prompt,
    });
    const updatedhHistory = await chat.getHistory();
    sessions.set(session, updatedhHistory);

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

async function insertToDb() {}

router.get("/hello", (req, res) => {
  console.log("got hit inside router");
  res.send("Welcome");
});

router.post("/getdata", async (req, res) => {
  console.log(req.body);
  let { message, session } = req.body;
  let response = await generateText(message ?? "Hi there", session);
  res.send({
    data: response,
  });
});

module.exports = router;
