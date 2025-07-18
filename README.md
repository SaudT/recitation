# Recitation App

This project is a Quran listening app that allows users to upload, search, and listen to Quran audio files with metadata (title, label, description).

---

## Project Structure

```
recitation/
  backend/
    index.js
    db.js
    schema.sql
    package.json
    routes/
      audio.js
  frontend/
    package.json
    postcss.config.js
    tailwind.config.js
    pages/
      index.js
  .gitignore
  README.md
```

---

## Backend Setup (Express + PostgreSQL)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up your PostgreSQL database:**
   - Make sure PostgreSQL is running.
   - Create a database (e.g., `recitehub`).
   - Run the schema:
     ```bash
     psql -d recitehub -f schema.sql
     ```
   - Create a `.env` file in `backend/` with your DB credentials:
     ```env
     DB_USER=your_db_user
     DB_HOST=localhost
     DB_NAME=recitehub
     DB_PASSWORD=your_db_password
     DB_PORT=5432
     PORT=5001
     ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   - The backend will run at [http://localhost:5001](http://localhost:5001)

---

## Frontend Setup (Next.js)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   - The frontend will run at [http://localhost:3000](http://localhost:3000)

3. **(Optional) Production build:**
   ```bash
   npm run build
   npm start
   ```

---

## Usage
- Upload Quran audio files with title, label, and description.
- Search for audio files by title.
- Listen to audio files directly in the browser.

---

## Notes
- Do **not** commit `.env` files or `node_modules` to git (see `.gitignore`).
- If you have any issues, check your terminal for errors and ensure both backend and frontend are running.
