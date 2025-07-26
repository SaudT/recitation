import { useState } from 'react';

export default function FeatureListSection() {
  const [search, setSearch] = useState('');
  const [reciter, setReciter] = useState('');
  const [language, setLanguage] = useState('');

  return (
    <section className="bg-white py-8 px-4 shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Find Recitations</h2>
      <form className="flex flex-col md:flex-row md:items-center md:space-x-4 max-w-3xl mx-auto space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by surah..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={reciter}
          onChange={e => setReciter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Reciters</option>
          <option value="reciter1">Reciter 1</option>
          <option value="reciter2">Reciter 2</option>
        </select>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Languages</option>
          <option value="arabic">Arabic</option>
          <option value="english">English</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </section>
  );
}
