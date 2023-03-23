import { useState } from "react";

import type { BmPlanCreatorServiceForm } from "./bmPlanCreator.types";

export const createPrompt = (data: BmPlanCreatorServiceForm) => {
  const { itemName, itemDescription, nation } = data;

  return `
      Business Items Name: ${itemName}\n
      Business Items Description: ${itemDescription}\n
      Target Country: ${nation}\n
      
      The above information is about business items. 
      Based on this information, please fill out the business plan according to the form below.
      (I hope that additional specific indicators will be included and Please write the ${nation} as a target.)
       
      1. Vision and Purpose\n
      2. Customer Analysis\n
      3. Market Size or Trend Analysis\n
      4. Prospects\n
      5. Operational Plan\n
      6. Financial Plan\n
      7. Risk Management Plan\n
      8. Summarize.
      \n
      and Please tell me the answer in Korean.
      (There is no need to show business item information with fewer users again.)
    `;
};

export const useBMPlanCreatorService = () => {
  const [answerByTurbo, setAnswerByTurbo] = useState("");
  const [answerByDavinci, setAnswerByDavinci] = useState("");

  const getBMPlanByDavinci = async (
    data: BmPlanCreatorServiceForm
  ): Promise<{ result: string }> => {
    const response = await fetch("api/davinci", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("서버 오류가 발생했습니다.");
    }

    return await response.json();
  };

  const getBMPlanByTurbo = async (
    data: BmPlanCreatorServiceForm
  ): Promise<{ result: string }> => {
    const response = await fetch("api/turbo", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("서버 오류가 발생했습니다.");
    }

    return response.json();
  };

  return {
    answerByTurbo,
    setAnswerByTurbo,
    answerByDavinci,
    setAnswerByDavinci,
    getBMPlanByDavinci,
    getBMPlanByTurbo,
  };
};
