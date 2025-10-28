import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import { runAgent } from "../agent/index.js";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp AI Agent siap digunakan!");
});

client.on("message", async (message) => {
  console.log(`📩 Pesan dari ${message.from}: ${message.body}`);

  try {
    const aiReply = await runAgent(message.body);
    await message.reply(aiReply);
  } catch (error) {
    console.error("❌ Error di agent:", error);
    await message.reply("Terjadi kesalahan pada AI Agent. Coba lagi nanti.");
  }
});

client.initialize();
