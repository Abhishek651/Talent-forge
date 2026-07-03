const { OpenRouter } = require("@openrouter/sdk");

// Creates connection to OpenRouter AI
const openRouterAI = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function openRouterService(prompt) {
  try {
    const stream = await openRouterAI.chat.send({
      chatRequest: {
        model: process.env.Model,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_object",
        },

        stream: true,
      },
    });

    let responseString = "";

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content;

      if (content) {
        responseString += content;
      }
    }
    console.log(responseString);
    return responseString;
  } catch (error) {
    console.error("Resume Generation Error:", error);
    throw new Error("Failed to generate resume data");
  }
}

module.exports = openRouterService 
