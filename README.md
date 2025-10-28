# toefl-ai-agent
🧠 TOEFL AI Agent (Groq + LangChain + WhatsApp)

AI Agent ini membantu pengguna berlatih TOEFL Grammar melalui percakapan WhatsApp secara interaktif.
Dibangun menggunakan LangChain, Groq API, dan whatsapp-web.js dengan konsep Retrieval-Augmented Generation (RAG) untuk memberikan soal dan penjelasan yang akurat.

🚀 Fitur Utama

🔤 Memberikan soal grammar TOEFL acak.

✅ Memeriksa jawaban pengguna dan memberikan penjelasan singkat.

📚 Menggunakan dataset kecil (10–20 soal) dengan RAG agar tetap relevan.

💬 Dapat digunakan langsung lewat WhatsApp Chatbot.

📈 Menyimpan log percakapan untuk analisis.

🧰 Tech Stack
Komponen	Teknologi
LLM	Groq API (Llama 3 / Mixtral)
Framework Agent	LangChain
Integrasi Chat	whatsapp-web.js
Server	Node.js + Express
Embedding	FAISS / Chroma Vector Store
Config	dotenv
Testing	Jest / Mocha
⚙️ Setup & Installation
1. Clone Repository
git clone https://github.com/username/toefl-ai-agent.git
cd toefl-ai-agent

2. Install Dependencies
npm install

3. Setup Environment

Buat file .env berdasarkan contoh .env.example:

GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=optional
WHATSAPP_SESSION_PATH=./session.json

4. Jalankan Agent (CLI Mode)
node src/agent/index.js

5. Jalankan WhatsApp Bot
node src/whatsapp/index.js


Saat pertama kali dijalankan, akan muncul QR Code di terminal.
Scan dengan WhatsApp untuk mengaktifkan sesi.

🧪 Testing

Minimal 6 test case tersedia di folder tests/:

npm test

📸 Demo

Contoh Percakapan:

User: Halo, saya mau latihan grammar!
Bot: Baik! Pilih jenis latihan: [Error Recognition / Sentence Completion / Structure]
User: Structure
Bot: Lengkapi kalimat berikut...


📝 Struktur Folder

Lihat struktur lengkap di bagian dokumentasi proyek
 (opsional).

🧩 Kontribusi Tim
Nama	Peran
Anggota 1	Integrasi WhatsApp + AI Core (Groq, LangChain, RAG)
Anggota 2	Dataset TOEFL + Evaluasi jawaban + Laporan dan testing
📚 Referensi

LangChain Docs

Groq Cloud API

whatsapp-web.js

🪪 Lisensi

MIT License © 2025 — Tim TOEFL Agent