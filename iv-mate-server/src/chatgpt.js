const { OpenAI } = require("openai");
const { config } = require("dotenv");
require("dotenv").config();

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//callChatGPT 함수
const callChatGPT = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", //모델
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content; //응답 메시지 반환
  } catch (error) {
    console.error("Error calling ChatGPT:", error);
    return null;
  }
};

module.exports = { callChatGPT };
