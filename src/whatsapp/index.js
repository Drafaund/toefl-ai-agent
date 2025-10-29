import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { runAgent } from "../agent/index.js"; // tetap panggil agent kamu

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
  console.log("📁 Direktori temp dibuat:", TEMP_DIR);
}

// === Tampilkan QR Code di terminal ===
client.on("qr", (qr) => {
  console.log("📱 Scan QR Code di bawah ini:");
  qrcode.generate(qr, { small: true });
});

// === Jika koneksi siap ===
client.on("ready", () => {
  console.log("✅ WhatsApp AI Agent siap digunakan!");
});

// === Fungsi untuk cleanup file ===
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Gagal hapus file:", filePath, err);
    }
  });
};

// === Saat menerima pesan ===
client.on("message", async (message) => {
  // Abaikan pesan dari diri sendiri, grup, atau broadcast
  if (message.fromMe || message.isGroupMsg || message.broadcast) return;

  const from = message.from;
  const type = message.type;
  const body = message.body;

  console.log(`📩 Pesan dari ${from}: [${type}] ${body || "[media]"}`);

  try {
    // ====== 1. Jika pesan berupa GAMBAR ======
    if (type === "image") {
      let media;
      try {
        media = await message.downloadMedia();
      } catch (dlErr) {
        console.error("Gagal download media:", dlErr);
        await message.reply("Gagal mengunduh gambar. Coba lagi.");
        return;
      }

      if (!media || !media.data) {
        await message.reply("Gambar tidak valid.");
        return;
      }

      const imagePath = path.join(TEMP_DIR, `img_${Date.now()}.jpg`);

      // PERBAIKAN: Simpan sebagai Buffer, bukan string base64
      const buffer = Buffer.from(media.data, "base64");
      fs.writeFileSync(imagePath, buffer);

      console.log("Gambar disimpan:", imagePath);

      // Jalankan Tesseract OCR
      const ocrCommand = `tesseract "${imagePath}" stdout -l eng+ind`; // dukung Inggris & Indonesia
      console.log("Menjalankan OCR:", ocrCommand);

      exec(ocrCommand, async (err, stdout, stderr) => {
        // Hapus file setelah OCR selesai (baik sukses/gagal)
        deleteFile(imagePath);

        if (err) {
          console.error("OCR gagal (exec error):", err.message);
          console.error("Stderr:", stderr);
          await message.reply(
            "Gagal membaca teks dari gambar.\n" +
              "Pastikan Tesseract OCR sudah terinstal: https://github.com/tesseract-ocr/tesseract"
          );
          return;
        }

        const extractedText = stdout.trim();

        if (!extractedText) {
          await message.reply("Tidak ada teks yang terbaca dari gambar.");
          return;
        }

        await message.reply(`Teks dari gambar:\n\`\`\`${extractedText}\`\`\``);

        // Kirim ke AI Agent
        try {
          console.log("Mengirim ke AI Agent...");
          const aiReply = await runAgent(extractedText);
          await message.reply(`Jawaban:\n${aiReply}`);
        } catch (agentErr) {
          console.error("AI Agent error:", agentErr);
          await message.reply("Gagal mendapatkan jawaban dari AI. Coba lagi.");
        }
      });

      return; // hentikan eksekusi untuk pesan teks
    }

    // ====== 2. Jika pesan berupa TEKS ======
    if (type === "chat" && body) {
      console.log("Mengirim ke AI Agent:", body);
      const aiReply = await runAgent(body);
      await message.reply(aiReply);
    }
  } catch (error) {
    console.error("Error tak terduga:", error);
    try {
      await message.reply("Terjadi kesalahan internal. Coba lagi nanti.");
    } catch (replyErr) {
      console.error("Gagal kirim pesan error:", replyErr);
    }
  }
});

// === Error handling global ===
client.on("auth_failure", (msg) => {
  console.error("Auth gagal:", msg);
});

client.on("disconnected", (reason) => {
  console.log("Terputus dari WhatsApp:", reason);
  // Otomatis reconnect
  client.initialize();
});

// === Mulai client ===
client.initialize();
