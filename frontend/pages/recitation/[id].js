import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AudioPlayer from '../../components/AudioPlayer';

export default function RecitationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchAudio() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/audio/${id}`);
        if (res.ok) {
          // The endpoint returns the audio file, not metadata, so fetch from /api/audio and filter
          const all = await fetch('http://localhost:5001/api/audio');
          const data = await all.json();
          const found = (data.files || []).find(f => String(f.id) === String(id));
          setAudio(found || null);
        } else {
          setAudio(null);
        }
      } catch {
        setAudio(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAudio();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-500 py-16">Loading...</div>
        ) : !audio ? (
          <div className="text-center text-gray-500 py-16">Recitation not found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{audio.surah}</h1>
            {audio.description && <p className="text-gray-700 mb-4">{audio.description}</p>}
            <AudioPlayer audioId={audio.id} originalName={audio.original_name} />
            <div className="mt-4 text-sm text-gray-500">
              <div>File: {audio.original_name}</div>
              <div>Size: {(audio.file_size / 1024 / 1024).toFixed(2)} MB</div>
              <div>Uploaded: {new Date(audio.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
