import { GoogleGenAI, Part } from '@google/genai';

export async function getLearningOptions(message: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'application/json',
  };

  const model = 'gemini-2.5-flash-preview-05-20';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: message,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  return response.text;
}

export async function getLearningObjective(messages: Part[]) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'application/json',
  };

  const model = 'gemini-2.5-flash-preview-05-20';

  const contents = [
    {
      role: 'user',
      parts: messages,
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  return response.text;
}
