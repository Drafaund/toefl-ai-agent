# toefl-ai-agent
🧠 TOEFL AI Agent (Groq + LangChain + WhatsApp)

AI Agent ini membantu pengguna berlatih TOEFL Grammar melalui percakapan WhatsApp secara interaktif. Dibangun menggunakan LangChain, Groq API, dan whatsapp-web.js dengan konsep Retrieval-Augmented Generation (RAG) untuk memberikan soal dan penjelasan yang akurat.

## 🧩 Anggota Tim
| Nama | NIM | Peran | 
|----------|----------|-----------|
| Faundra Pratama Sukma | 22/505520/TK/55323 | Integrasi WhatsApp + AI Core (Groq, LangChain, RAG) |
| Natanael Albert | 22/503184/TK/54968 | Evaluasi jawaban + Laporan dan testing |

## 🎯 Latar Belakang & Tujuan

- Kebutuhan latihan TOEFL meningkat seiring bertambahnya peserta ujian akademik/beasiswa
- Interaksi lewat WhatsApp meningkatkan aksesibilitas dan keterlibatan pengguna
- LLM + RAG memungkinkan pemberian soal dan penjelasan yang kontekstual
- Integrasi Groq + LangChain + WhatsApp menyediakan solusi hemat biaya

## 🏗️ Arsitektur

### Komponen
- **WhatsApp Client**: whatsapp-web.js — menerima/mengirim pesan
- **Agent Orchestrator**: Node.js + LangChain — mengelola prompt, memori, RAG
- **LLM**: Groq API (via @langchain/groq) — menghasilkan jawaban/pembahasan
- **Storage**: File session.json untuk menyimpan sesi/log
- **Testing**: Jest untuk unit test dengan mock LLM client

### Aliran Data
1. User mengirim pesan via WhatsApp
2. Module WhatsApp menerima event, filter DM
3. Pesan diteruskan ke Agent (runAgent)
4. Agent memanggil Groq API dengan context
5. Balasan dikirim kembali via WhatsApp

## 🚀 Fitur Utama

- 🔤 Memberikan soal grammar TOEFL acak.
- ✅ Memeriksa jawaban pengguna dan memberikan penjelasan singkat.
- 💬 Dapat digunakan langsung lewat WhatsApp Chatbot.
- 📈 Menyimpan log percakapan untuk analisis.
- 🧪 Unit testing untuk memastikan kualitas kode

## ⚙️ Setup & Installation
1. Clone Repository
```bash
git clone https://github.com/username/toefl-ai-agent.git
cd toefl-ai-agent
```

2. Install Dependencies
```bash
npm install
```

3. Setup Environment  
Buat file .env berdasarkan contoh .env.example:
```bash
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=optional
```

4. Jalankan Agent (CLI Mode)
```bash
npm run agent
```

5. Jalankan WhatsApp Bot
```bash
npm start
```

Saat pertama kali dijalankan, akan muncul QR Code di terminal.
Scan dengan WhatsApp untuk mengaktifkan sesi.

## 🧪 Testing

### Test Cases
- **Agent Tests** (tests/agent.test.js):
  - Mengembalikan balasan assistant
  - Mengembalikan fallback saat tidak ada choices
  - Memastikan pesan user dikirim ke API
  - Mempertahankan conversation history

- **WhatsApp Tests** (tests/whatsapp.test.js):
  - Validasi Direct Message detection
  - Filter pesan grup/fromMe

### Menjalankan Test
```bash
npm test
```

### Lokasi Test Files
```
tests/
├── agent.test.js    # Test untuk Agent/LLM
└── whatsapp.test.js # Test untuk WhatsApp helpers
```

## 📝 License

MIT License © 2025 — Tim TOEFL Agent

