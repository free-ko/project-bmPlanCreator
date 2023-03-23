import type { NextApiRequest, NextApiResponse } from "next";
import { CreateCompletionRequest } from "openai/api";

import { createPrompt } from "~/features/bmPlanCreator/useBmPlanCreatorService";
import type { BmPlanCreatorServiceForm } from "~/features/bmPlanCreator/bmPlanCreator.types";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
});

const davinci = new OpenAIApi(configuration);

const getBMPlanByDavinci = async (
  data: BmPlanCreatorServiceForm
): Promise<string> => {
  const completionParams: CreateCompletionRequest = {
    model: "text-davinci-003",
    max_tokens: 3500,
    prompt: createPrompt(data),
  };

  const response = await davinci.createCompletion(completionParams);
  return response.data.choices[0].text.trim();
};

type ResultResponse = { result: string } | { message: string };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultResponse>
) {
  try {
    const reqBody = req.body;
    const reply = await getBMPlanByDavinci(reqBody);

    res.status(200).json({ result: reply });
  } catch (error) {
    console.error("에러가 발생 했습니다. = ", error);
    res.status(500).json({ message: "에러가 발생했습니다." });
  }
}
