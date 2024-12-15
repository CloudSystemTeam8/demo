import { OpenAI } from "openai";
import { config } from "dotenv";
config();

// OpenAI 객체 생성
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY  // 환경 변수로 API 키 설정
});
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

// callChatGPT 함수 정의
export const callChatGPT = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // 원하는 모델 설정
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message.content;  // 응답 메시지 반환
  } catch (error) {
    console.error("Error calling ChatGPT:", error);
    return null;
  }
};
