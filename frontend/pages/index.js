import React, { useState } from 'react';

function QuranAudioApp() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert('File and title are required!');
    const res = await uploadAudio({ file, title, description });
    alert(res.message || 'Upload complete!');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const files = await searchAudioByTitle(search);
    setResults(files);
  };

  return (
    <div>
      <h2>Upload Quran Audio</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} required />
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Upload</button>
      </form>

      <h2>Search Audio by Title</h2>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Search title..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <h2>Results</h2>
      <ul>
        {results.map(audio => (
          <li key={audio.id}>
            <strong>{audio.title}</strong><br />
            {audio.description}<br />
            <AudioPlayer audioId={audio.id} originalName={audio.original_name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper functions from above
async function uploadAudio({ file, title, description }) {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('title', title);
  formData.append('description', description);

  const response = await fetch('http://localhost:5001/api/audio/upload', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

async function searchAudioByTitle(title) {
  const response = await fetch(
    `http://localhost:5001/api/audio/search?title=${encodeURIComponent(title)}`
  );
  const data = await response.json();
  return data.files;
}

function AudioPlayer({ audioId, originalName }) {
  const audioUrl = `http://localhost:5001/api/audio/${audioId}`;
  return (
    <audio controls>
      <source src={audioUrl} />
      Your browser does not support the audio element.
    </audio>
  );
}

export default QuranAudioApp;
