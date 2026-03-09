// index.js - AI Discord Bot for Railway
const { Client, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

// Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// OpenAI setup
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Add this to Railway variables
});
const openai = new OpenAIApi(configuration);

// Bot ready
client.once("ready", () => {
    console.log(`AI Bot is online! Logged in as ${client.user.tag}`);
});

// Listen to messages
client.on("messageCreate", async message => {
    if (message.author.bot) return; // Ignore other bots

    // Simple ping
    if (message.content.toLowerCase() === "!ping") {
        return message.channel.send("Pong!");
    }

    // AI response for all other messages
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message.content }],
        });

        const reply = response.data.choices[0].message.content;
        message.channel.send(reply);
    } catch (error) {
        console.error("OpenAI API error:", error);
        message.channel.send("Sorry, I couldn't process that.");
    }
});

// Login using Discord bot token from Railway variable
client.login(process.env.DISCORD_BOT_TOKEN);
