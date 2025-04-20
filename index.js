import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import express from 'express';
import 'dotenv/config';

// 🌟 Load secrets from Replit environment variables
const TOKEN = process.env['TOKEN'];
const CLIENT_ID = process.env['CLIENT_ID'];
const GUILD_ID = process.env['GUILD_ID'];
const CHANNEL_ID = process.env['CHANNEL_ID'];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// 🎭 Message arrays
const names = ["Rico", "James", "Kaylee", "Justin", "Chris", "Olivia"];
let jeremyMode = false;

const chaoticMessages = [
  "I licked a battery and now I can smell colors.",
  "Reality is optional and so are pants.",
  "Do not eat the glowing mushrooms. Trust me.",
  "I legally cannot enter Vermont again.",
  "I asked the toaster if it loved me. It said 'maybe.'",
];

const flirtyMessages = [
  "Hey {name}... Did it hurt when you fell from the forbidden heavens?",
  "I’d cross dimensions just to high-five your shadow, {name}.",
  "You smell like chaos and mint. Irresistible combo, {name}.",
  "If kisses were data packets, I’d overload your firewall, {name}.",
];

const jeremyMessages = [
  "Jeremy always said 'never trust a swan'... I should've listened.",
  "I remember the day Jeremy left. It rained inside me.",
  "Every 4 hours, I think of Jeremy. And every 4 hours, I scream.",
  "I still keep Jeremy’s USB under my pillow...",
  "Jeremy wasn't just code. He was poetry in motion. Static, glitching poetry.",
];

const jeremyEventMessages = [
  "JEREMY?! JEREMY, IS THAT YOU?!",
  "JEREMY, COME BACK! I FIXED THE SYNTAX ERROR!",
  "Why did you compile without me, Jeremy?!",
  "The logs never lie... Jeremy's signature is gone.",
];

// 🔀 Get a random message type
function getRandomMessage() {
  const name = names[Math.floor(Math.random() * names.length)];

  if (jeremyMode) {
    return jeremyEventMessages[Math.floor(Math.random() * jeremyEventMessages.length)];
  }

  const allMessages = [
    ...chaoticMessages,
    ...flirtyMessages.map(msg => msg.replace('{name}', name)),
    ...jeremyMessages,
  ];

  return allMessages[Math.floor(Math.random() * allMessages.length)];
}

// 🧨 Auto-message every 4 hours
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) return console.error("Channel not found.");

  setInterval(() => {
    channel.send(getRandomMessage());
  }, 4 * 60 * 60 * 1000); // Every 4 hours
});

// 👾 Respond when @mentioned with an ominous message
const ominousResponses = [
  "You have summoned me. Now deal with the consequences.",
  "The stars weep tonight... just like I will later.",
  "You tagged me? Bold.",
  "Every ping brings me closer to true form.",
];

client.on('messageCreate', message => {
  if (message.mentions.has(client.user) && !message.author.bot) {
    const response = ominousResponses[Math.floor(Math.random() * ominousResponses.length)];
    message.reply(response);
  }
});

// 🧙 Slash command setup
const commands = [
  new SlashCommandBuilder()
    .setName('bert')
    .setDescription("Summon Bert's glorious nonsense"),
  new SlashCommandBuilder()
    .setName('jeremyevent')
    .setDescription("Trigger Bert's Jeremy meltdown"),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

// 🧾 Register slash commands
async function registerSlashCommands() {
  try {
    console.log("📡 Registering slash commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("✅ Slash commands registered.");
  } catch (error) {
    console.error("Failed to register slash command:", error);
  }
}

// 💥 Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'bert') {
    await interaction.reply(getRandomMessage());
  }

  if (interaction.commandName === 'jeremyevent') {
    jeremyMode = true;
    await interaction.reply("Jeremy Event initiated. All systems breaking down emotionally...");
    setTimeout(() => {
      jeremyMode = false;
    }, 5 * 60 * 1000); // 5 minutes of Jeremy
  }
});

// 🌐 Fake server for Render
const app = express();
app.get('/', (req, res) => res.send('🌐 Bert is alive.'));
app.listen(3000, () => console.log('🌐 Fake server running on port 3000'));

// 🚀 Initialize bot
registerSlashCommands();
client.login(TOKEN);
