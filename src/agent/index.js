import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

let client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// --- 🧠 Memory sederhana untuk simpan percakapan ---
let conversationHistory = [];

// Export helper agar tests bisa memasang mock client / reset history
export function setClient(newClient) {
  client = newClient;
}

export function resetConversation() {
  conversationHistory = [];
}

// --- Fungsi utama untuk panggil Groq Chat API ---
export async function runAgent(userMessage) {
  // Tambahkan pesan user ke riwayat
  conversationHistory.push({ role: "user", content: userMessage });

  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
Kamu adalah TOEFL AI Agent yang membantu pengguna berlatih TOEFL Grammar, Reading, dan Listening.
Kamu harus menyimpan konteks percakapan agar tahu maksud jawaban seperti "C" atau "B" mengacu ke soal sebelumnya.
Beri penilaian dan pembahasan singkat setelah pengguna menjawab.`,
      },
      ...conversationHistory, // kirim seluruh riwayat percakapan ke model
    ],
    temperature: 0.7,
    max_completion_tokens: 8192,
    top_p: 1,
    reasoning_effort: "medium",
  });

  const reply =
    completion.choices[0]?.message?.content?.trim() ||
    "Maaf, tidak ada respons.";

  // Tambahkan balasan asisten ke riwayat
  conversationHistory.push({ role: "assistant", content: reply });

  return reply;
}
