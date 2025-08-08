
import React, { useState, useEffect, useRef } from 'react';

function QuranAudioApp() {
  const [file, setFile] = useState(null);
  const [surah, setSurah] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSurahs, setAllSurahs] = useState([]);
  const searchRef = useRef(null);

  // Common Surah names for suggestions
  const commonSurahs = [
    'Al-Fatiha', 'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah', 'Al-Anam',
    'Al-Araf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf', 'Ar-Rad',
    'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
    'Al-Anbiya', 'Al-Hajj', 'Al-Muminun', 'An-Nur', 'Al-Furqan', 'Ash-Shuara',
    'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum', 'Luqman', 'As-Sajdah',
    'Al-Ahzab', 'Saba', 'Fatir', 'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar',
    'Ghafir', 'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah',
    'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf', 'Adh-Dhariyat',
    'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman', 'Al-Waqiah', 'Al-Hadid',
    'Al-Mujadilah', 'Al-Hashr', 'Al-Mumtahanah', 'As-Saff', 'Al-Jumuah',
    'Al-Munafiqun', 'At-Taghabun', 'At-Talaq', 'At-Tahrim', 'Al-Mulk',
    'Al-Qalam', 'Al-Haqqah', 'Al-Maarij', 'Nuh', 'Al-Jinn', 'Al-Muzzammil',
    'Al-Muddaththir', 'Al-Qiyamah', 'Al-Insan', 'Al-Mursalat', 'An-Naba',
    'An-Naziat', 'Abasa', 'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin',
    'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-Ala', 'Al-Ghashiyah',
    'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh',
    'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat',
    'Al-Qariah', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh',
    'Al-Maun', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas',
    'Al-Falaq', 'An-Nas'
  ];

  // Load all unique surahs from database
  useEffect(() => {
    const fetchAllSurahs = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/audio/surahs');
        const data = await response.json();
        setAllSurahs(data.surahs || []);
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      }
    };
    fetchAllSurahs();
  }, []);

  // Handle search input changes and filter suggestions
  useEffect(() => {
    if (search.trim()) {
      const combinedSurahs = [...new Set([...allSurahs, ...commonSurahs])];
      const filtered = combinedSurahs.filter(surahName => 
        surahName.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, allSurahs]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !surah) return alert('File and surah are required!');
    
    setIsUploading(true);
    try {
      const res = await uploadAudio({ file, surah, description });
      alert(res.message || 'Upload complete!');
      setFile(null);
      setSurah('');
      setDescription('');
      // Reset file input
      e.target.reset();
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const files = await searchAudioBySurah(search);
      setResults(files);
    } catch (error) {
      alert('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear results when search is empty
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
    }
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-emerald-500">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            <span className="text-emerald-600">Quran</span> Recitation Hub
          </h1>
          <p className="text-gray-600 text-center mt-2">Upload, search, and listen to beautiful Quran recitations</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Audio</h2>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audio File *
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={e => setFile(e.target.files[0])} 
                    required 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Surah Name *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Al-Fatiha, Al-Baqarah" 
                  value={surah} 
                  onChange={e => setSurah(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Add details about the recitation..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  'Upload Audio'
                )}
              </button>
            </form>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Search Audio</h2>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative" ref={searchRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Surah
                </label>
                <input 
                  type="text" 
                  placeholder="Enter surah name..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => search && suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                
                {/* Dropdown Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSearch(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                          </svg>
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {(search.trim() || results.length > 0) && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isSearching ? 'Searching...' : `Search Results (${results.length})`}
                </h2>
              </div>
              {search.trim() && (
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  "{search}"
                </div>
              )}
            </div>

            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-purple-600 font-medium">Searching for recitations...</span>
              </div>
            )}
            
            {!isSearching && results.length > 0 && (
              <div className="grid gap-6">
                {results.map((audio, index) => (
                <div key={audio.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                        <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                          {index + 1}
                        </span>
                        {audio.surah}
                      </h3>
                      {audio.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">{audio.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-4">
                        Original file: <span className="font-medium">{audio.original_name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <AudioPlayer audioId={audio.id} originalName={audio.original_name} />
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!isSearching && results.length === 0 && search.trim() && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12c0-4.411-3.589-8-8-8s-8 3.589-8 8c0 2.152.851 4.103 2.233 5.535"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try searching with a different surah name.</p>
            </div>
          )}
          </div>
      </div>
  );
}

// Helper functions
async function uploadAudio({ file, surah, description }) {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('surah', surah);
  formData.append('description', description);

  const response = await fetch('http://localhost:5001/api/audio/upload', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

async function searchAudioBySurah(surah) {
  const response = await fetch(
    `http://localhost:5001/api/audio/search?surah=${encodeURIComponent(surah)}`
  );
  const data = await response.json();
  return data.files;
}

function AudioPlayer({ audioId, originalName }) {
  const audioUrl = `http://localhost:5001/api/audio/${audioId}`;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Audio Player</span>
        <span className="text-xs text-gray-500">{originalName}</span>
      </div>
      <audio 
        controls 
        className="w-full h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
        style={{
          filter: 'sepia(20%) saturate(70%) hue-rotate(88deg) brightness(119%) contrast(119%)'
        }}
      >
        <source src={audioUrl} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default QuranAudioApp;
