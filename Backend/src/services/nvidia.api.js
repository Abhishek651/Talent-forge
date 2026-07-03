const axios = require("axios");

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;
const apiKey = process.env.NVIDIA_API_KEY;

// console.log(apiKey)
const headers = {
  Authorization: `Bearer ${apiKey}`,
  Accept: stream ? "text/event-stream" : "application/json",
};

// MiniMax-M3 is multimodal. To send images or video, set a message's
// "content" to an array of parts (a public URL or a base64 data URI):
//   messages: [{ role: "user", content: [
//       { type: "text", text: "Describe this." },
//       { type: "image_url", image_url: { url: "https://example.com/image.jpg" } },
//       { type: "video_url", video_url: { url: "https://example.com/video.mp4" } },
//   ]}]

// minimaxai/minimax-m3
async function nvidiaService(prompt) {
  console.log('Using Nvidia services')
  const payload = {
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 8192,
    temperature: 1.0,
    top_p: 0.95,
    stream: stream,
  };
  try {
    const response = await axios.post(invokeUrl, payload, {
      headers,
      responseType: stream ? "stream" : "json",
    });

    // if (stream) {
    //   let responseString = "";
    //   response.data.on("data", (chunk) => {
    //     responseString += chunk.toString();
    //   });
    //   return responseString;
    // }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error.response?.data || error);
    throw error;
  }
}

// response().then((data)=>{
//     console.log(data.choices[0].message.content)
// });

// use when import
// nvidiaService().then((data) => {
//     console.log(data.choices[0].message.content);
// });

module.exports = nvidiaService;
