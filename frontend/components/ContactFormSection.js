import { useState } from 'react';

export default function ContactFormSection() {
  const [file, setFile] = useState(null);
  const [surah, setSurah] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !surah) {
      alert('Please select a file and enter a surah name');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('surah', surah);
      formData.append('description', description);
      const res = await fetch('http://localhost:5001/api/audio/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.message) {
        alert('Upload successful!');
        setFile(null);
        setSurah('');
        setDescription('');
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="max-w-lg mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={e => setFile(e.target.files[0])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Surah Name</label>
        <input
          type="text"
          placeholder="e.g., Al-Fatiha, An-Nas"
          value={surah}
          onChange={e => setSurah(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
        <textarea
          placeholder="Add a description..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Upload Recitation'}
      </button>
    </form>
  );
}
