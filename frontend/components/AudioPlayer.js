export default function AudioPlayer({ audioId, originalName }) {
  const audioUrl = `http://localhost:5001/api/audio/${audioId}`;
  return (
    <div className="w-full">
      <audio controls className="w-full">
        <source src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
