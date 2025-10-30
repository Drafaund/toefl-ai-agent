# 🧠 TOEFL AI Agent (Groq + WhatsApp)

Agen AI interaktif yang membantu pengguna berlatih **TOEFL Grammar** melalui percakapan WhatsApp.  
Dibangun menggunakan **Groq API** dan **whatsapp-web.js**, serta dilengkapi **OCR (Optical Character Recognition)** menggunakan **Tesseract** untuk membaca soal dari gambar.

---

## 👥 Anggota Tim

| Nama                      | NIM                | Peran                                               |
| ------------------------- | ------------------ | --------------------------------------------------- |
| **Faundra Pratama Sukma** | 22/505520/TK/55323 | Integrasi WhatsApp + AI Core (Groq, LangChain, OCR) |
| **Natanael Albert**       | 22/503184/TK/54968 | Evaluasi jawaban + Laporan dan Testing              |

---

## 🎯 Latar Belakang

Kebutuhan latihan bahasa Inggris, khususnya persiapan **TOEFL**, meningkat seiring bertambahnya peserta ujian akademik dan beasiswa.  
Latihan interaktif lewat **chat (WhatsApp)** memungkinkan praktik real-time, akses luas, dan keterlibatan pengguna yang lebih tinggi dibandingkan kuis statis.  
Kemajuan **model bahasa besar (LLM)** memungkinkan pembuatan soal yang relevan dan penjelasan yang informatif berbasis konteks.  
Menggabungkan **Groq** dengan **integrasi WhatsApp** memberi solusi yang dapat diakses dan hemat biaya untuk pembelajaran mandiri.

---

## 🎯 Tujuan

- Membangun **agen percakapan** yang membantu pengguna berlatih soal TOEFL Grammar secara interaktif melalui WhatsApp.
- Menyediakan **penilaian jawaban dan penjelasan singkat yang kontekstual** untuk mempercepat pembelajaran.
- Menjamin pengalaman yang dapat direproduksi dan aman melalui **penyimpanan log percakapan**, **isolasi sesi**, serta **pengujian otomatis (unit test)**.
- Mendemonstrasikan **integrasi LLM (Groq)** dengan antarmuka chat populer (**whatsapp-web.js**).

---

## 🏗️ Arsitektur Sistem

### 🔹 Komponen Utama

| Komponen               | Deskripsi                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **WhatsApp Client**    | Menggunakan `whatsapp-web.js` untuk menerima dan mengirim pesan melalui WhatsApp Web.               |
| **Agent Orchestrator** | Menggunakan `LangChain` dan `Groq` untuk mengelola konteks percakapan dan memberikan respon cerdas. |
| **OCR Processor**      | Menggunakan `Tesseract` untuk membaca teks dari gambar soal yang dikirim pengguna.                  |
| **Node.js Server**     | Menjalankan seluruh logika bot, integrasi API, dan event handler.                                   |
| **Testing Module**     | Menggunakan `Jest` untuk melakukan pengujian fungsi AI Agent dan WhatsApp handler.                  |
| **Storage (Session)**  | Menyimpan sesi dan riwayat percakapan agar konteks tetap terjaga antar pesan.                       |

---

## ⚙️ Tech Stack

| Teknologi                      | Kegunaan                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Node.js**                    | Runtime utama untuk menjalankan server chatbot dan agent secara asynchronous serta menangani integrasi antar modul. |
| **whatsapp-web.js**            | Library untuk otomatisasi WhatsApp Web — menghubungkan chatbot dengan akun WhatsApp pengguna.                       |
| **LangChain**                  | Framework untuk mengatur alur percakapan dan mengelola konteks LLM (memory, reasoning, prompt management).          |
| **Groq API (@langchain/groq)** | Model bahasa yang digunakan untuk menghasilkan soal, memberikan penilaian, dan menjelaskan jawaban TOEFL.           |
| **Tesseract.js**               | Engine OCR untuk mengekstraksi teks dari gambar soal yang dikirim pengguna melalui WhatsApp.                        |
| **Jest**                       | Framework testing untuk memastikan fungsi AI dan WhatsApp berjalan sesuai ekspektasi tanpa error.                   |
| **dotenv**                     | Mengelola konfigurasi kunci API dan variabel lingkungan dengan aman melalui file `.env`.                            |
| **qrcode-terminal**            | Menampilkan QR Code di terminal untuk otentikasi WhatsApp Web pertama kali.                                         |

---

## 🚀 Fitur Utama

| Fitur                                          | Deskripsi                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🧠 **Ingat Percakapan (Conversation Memory)**  | Bot dapat memahami konteks dari percakapan sebelumnya (misalnya jawaban “B” mengacu pada soal sebelumnya).               |
| 🖼️ **OCR Gambar Soal (Tesseract Integration)** | Pengguna dapat mengirim gambar berisi teks soal TOEFL, dan bot akan membacanya lalu memberikan jawaban serta pembahasan. |
| 🔍 **Filter Direct Message (DM Only)**         | Bot hanya merespons pesan pribadi (bukan grup, broadcast, atau status) untuk menjaga privasi.                            |
| 💬 **Interaksi Real-Time di WhatsApp**         | Pengguna dapat langsung mengobrol dengan AI di WhatsApp layaknya chatting biasa.                                         |
| 🧪 **Testing Otomatis (Jest)**                 | Pengujian otomatis untuk menjaga stabilitas dan konsistensi hasil respons AI.                                            |

---

## 🧱 Alur Data

### Aliran Data

<img width="1358" height="1611" alt="Flowchart-diagram drawio-2" src="https://github.com/user-attachments/assets/cd5a6fe4-d205-421e-af9c-6cbdc858523f" />


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
npm run start
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
