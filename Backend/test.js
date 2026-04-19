require('dotenv').config();  // Load .env variables

const { OpenRouter } = require("@openrouter/sdk");

const openRouterAI = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// List of models to test
const modelsToTest = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-26b-a4b-it:free",
  "moonshotai/kimi-k2.5",
  "liquid/lfm-2.5-1.2b-thinking:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter/elephant-alpha",

];

async function testModel(model) {
  console.log(`Testing model: ${model}...`);

  try {
    const stream = await openRouterAI.chat.send({
      chatRequest: {
        model: model,
        messages: [
          {
            role: "user",
            content: "Say 'Hello, this model is working!' in one sentence."
          }
        ],
        max_tokens: 20,
        stream: true
      }
    });

    let response = "";
    for await (const chunk of stream) {
      if (chunk?.choices?.[0]?.delta?.content) {
        response += chunk.choices[0].delta.content;
      }
    }

    console.log(`✅ Model ${model} is working! Response:`, response.trim());
    return true;  // Success

  } catch (error) {
    console.error(`❌ Model ${model} failed:`, error.message);
    if (error.statusCode === 503) {
      console.log(`   Service unavailable for ${model} - provider down.`);
    }
    return false;  // Failure
  }
}

async function testOpenRouter() {
  console.log("Testing multiple OpenRouter models...\n");

  let anyWorking = false;
  for (const model of modelsToTest) {
    const worked = await testModel(model);
    if (worked) {
      anyWorking = true;
      break;  // Stop after first working model
    }
    console.log("");  // Spacer
  }

  if (!anyWorking) {
    console.log("❌ All models failed. OpenRouter may be having issues.");
  } else {
    console.log("🎉 At least one model is working!");
  }
}

testOpenRouter();