import type { NextApiRequest, NextApiResponse } from "next";
import { CreateChatCompletionRequest } from "openai/api";

import { createPrompt } from "~/features/bmPlanCreator/useBmPlanCreatorService";
import type { BmPlanCreatorServiceForm } from "~/features/bmPlanCreator/bmPlanCreator.types";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
});

const turbo = new OpenAIApi(configuration);

const getBMPlanByTurbo = async (
  data: BmPlanCreatorServiceForm
): Promise<string> => {
  const completionParams: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `
        You are an expert in writing business plans well around the world.
        You're an expert at writing up a business plan very carefully.
        You writing up a business plan using figures and indicators well.
        `,
      },
      {
        role: "user",
        content: createPrompt(data),
      },
      { role: "assistant", content: "Q: " },
    ],
  };

  const response = await turbo.createChatCompletion(completionParams);
  return response.data.choices[0].message.content;
};

type ResultResponse = { result: string } | { message: string };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultResponse>
) {
  try {
    const reqBody = req.body;
    const reply = await getBMPlanByTurbo(reqBody);

    res.status(200).json({ result: reply });
  } catch (error) {
    console.error("에러가 발생 했습니다. = ", error);
    res.status(500).json({ message: "에러가 발생했습니다." });
  }
}
