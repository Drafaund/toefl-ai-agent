import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { runAgent } from "../agent/index.js";

// === Inisialisasi WhatsApp Client ===
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// === Direktori sementara ===
const TEMP_DIR = "./temp";
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// === Fungsi cek apakah Direct Message ===
const isDirectMessage = (message) => {
  // Filter lengkap untuk HANYA DM
  return (
    !message.fromMe && // Bukan dari diri sendiri
    !message.isGroupMsg && // Bukan grup biasa
    !message.broadcast && // Bukan broadcast
    !message.isStatus && // Bukan status
    !message.from.includes("@g.us") && // Grup & Community
    !message.from.includes("@s.whatsapp.net")
  ); // Status reply
};

// === Tampilkan QR Code ===
client.on("qr", (qr) => {
  console.log("📱 Scan QR Code di bawah ini:");
  qrcode.generate(qr, { small: true });
});

// === Koneksi siap ===
client.on("ready", () => {
  console.log("✅ WhatsApp AI Agent siap (HANYA DM)!");
});

// === Fungsi cleanup ===
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT")
      console.error("Gagal hapus file:", filePath);
  });
};

// === PESAN MASUK ===
client.on("message", async (message) => {
  // ✅ FILTER DM SAJA
  if (!isDirectMessage(message)) {
    // Debug opsional
    if (process.env.DEBUG === "true") {
      console.log(`⏭️  Diabaikan: ${message.from} [${message.type}]`);
    }
    return;
  }

  const from = message.from;
  const type = message.type;
  const body = message.body;

  console.log(`📩 DM dari ${from}: [${type}] ${body || "[media]"}`);

  try {
    // ====== 1. GAMBAR ======
    if (type === "image") {
      let media;
      try {
        media = await message.downloadMedia();
      } catch (dlErr) {
        console.error("Gagal download media:", dlErr);
        await message.reply("Gagal mengunduh gambar.");
        return;
      }

      if (!media?.data) {
        await message.reply("Gambar tidak valid.");
        return;
      }

      const imagePath = path.join(TEMP_DIR, `img_${Date.now()}.jpg`);
      const buffer = Buffer.from(media.data, "base64");
      fs.writeFileSync(imagePath, buffer);

      console.log("🖼️  Gambar disimpan:", imagePath);

      const ocrCommand = `tesseract "${imagePath}" stdout -l eng+ind`;
      exec(ocrCommand, async (err, stdout, stderr) => {
        deleteFile(imagePath);

        if (err) {
          console.error("OCR error:", err.message, stderr);
          await message.reply("Gagal membaca teks dari gambar.");
          return;
        }

        const extractedText = stdout.trim();
        if (!extractedText) {
          await message.reply("Tidak ada teks yang terbaca dari gambar.");
          return;
        }

        console.log(
          "📝 Teks terbaca:",
          extractedText.substring(0, 100) + "..."
        );

        await message.reply(
          `📖 Teks dari gambar:\n\`\`\`${extractedText}\`\`\``
        );

        try {
          const aiReply = await runAgent(extractedText);
          await message.reply(`💡 Jawaban:\n${aiReply}`);
        } catch (agentErr) {
          console.error("AI error:", agentErr);
          await message.reply("Gagal memproses jawaban AI.");
        }
      });

      return;
    }

    // ====== 2. TEKS ======
    if (type === "chat" && body) {
      console.log("💬 Memproses teks:", body.substring(0, 50) + "...");
      const aiReply = await runAgent(body);
      await message.reply(aiReply);
    }
  } catch (error) {
    console.error("Error:", error);
    try {
      await message.reply("Terjadi kesalahan. Coba lagi.");
    } catch {}
  }
});

// === Error handling ===
client.on("auth_failure", (msg) => console.error("Auth gagal:", msg));
client.on("disconnected", (reason) => {
  console.log("Terputus:", reason);
  client.initialize();
});

client.initialize();
