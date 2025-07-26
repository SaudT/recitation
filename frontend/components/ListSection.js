import { useEffect, useState } from 'react';
import AudioPlayer from './AudioPlayer';

export default function ListSection() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5001/api/audio');
        const data = await res.json();
        setFiles(data.files || []);
      } catch (e) {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Uploaded Recitations</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : files.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No recitations found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map(audio => (
            <div key={audio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{audio.surah}</h3>
              {audio.description && (
                <p className="text-sm text-gray-600 mb-3">{audio.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-3">
                <div>Size: {(audio.file_size / 1024 / 1024).toFixed(2)} MB</div>
                <div>Uploaded: {new Date(audio.created_at).toLocaleDateString()}</div>
              </div>
              <AudioPlayer audioId={audio.id} originalName={audio.original_name} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
