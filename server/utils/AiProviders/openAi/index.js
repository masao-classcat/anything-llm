class OpenAi {
  constructor() {
    const { Configuration, OpenAIApi } = require("openai");
    const config = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(config);
    this.openai = openai;
  }

  isValidChatModel(modelName = "") {
    // const validModels = ["gpt-4", "gpt-3.5-turbo"];
		const validModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k", "gpt-4", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0613"];

    return validModels.includes(modelName);
  }

  async isSafe(input = "") {
    const { flagged = false, categories = {} } = await this.openai
      .createModeration({ input })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("results"))
          throw new Error("OpenAI moderation: No results!");
        if (res.results.length === 0)
          throw new Error("OpenAI moderation: No results length!");
        return res.results[0];
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::CreateModeration failed with: ${error.message}`
        );
      });

    if (!flagged) return { safe: true, reasons: [] };
    const reasons = Object.keys(categories)
      .map((category) => {
        const value = categories[category];
        if (value === true) {
          return category.replace("/", " or ");
        } else {
          return null;
        }
      })
      .filter((reason) => !!reason);

    return { safe: false, reasons };
  }

  async sendChat(chatHistory = [], prompt, workspace = {}) {
    console.log(">> debug > IN : OpenAi::sendChat (server/utils/AiProviders/openAi/index.js)")

    const model = process.env.OPEN_MODEL_PREF;
    if (!this.isValidChatModel(model))
      throw new Error(
        `OpenAI chat: ${model} is not valid for chat completion!`
      );

    console.log(model)
    temperature = Number(workspace?.openAiTemp ?? 0.7)
    console.log(temperature)
    
    const textResponse = await this.openai
      .createChatCompletion({
        model,
        temperature: Number(workspace?.openAiTemp ?? 0.7),
        n: 1,
        messages: [
          { role: "system", content: "" },
          ...chatHistory,
          { role: "user", content: prompt },
        ],
      })
      .then((json) => {
        const res = json.data;
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .catch((error) => {
        console.log(error);
        throw new Error(
          `OpenAI::createChatCompletion failed with: ${error.message}`
        );
      });

    return textResponse;
  }

  async getChatCompletion(messages = [], { temperature = 0.7 }) {
    console.log(">> debug > IN : OpenAi::getChatCompletion (server/utils/AiProviders/openAi/index.js)")
    const model = process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
    console.log(model)
    console.log(messages)
    console.log(temperature)
    const { data } = await this.openai.createChatCompletion({
      model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(textInput);
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const {
      data: { data },
    } = await this.openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: textChunks,
    });

    return data.length > 0 &&
      data.every((embd) => embd.hasOwnProperty("embedding"))
      ? data.map((embd) => embd.embedding)
      : null;
  }
}

module.exports = {
  OpenAi,
};
