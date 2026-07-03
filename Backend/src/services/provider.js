const provider = process.env.AI_PROVIDER;

let aiService;

switch (provider) {
    case "nvidia":
        aiService = require("./nvidia.api");
        break;

    case "openrouter":
        aiService = require("./openRouter.api");
        break;

    default:
        throw new Error("Invalid AI_PROVIDER");
}

module.exports = aiService;