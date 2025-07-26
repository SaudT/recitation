import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Header Section */}
        <section className="bg-white py-16 px-4 text-center shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome to Quran Audio Hub</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Listen to, search, and upload Quran recitations. Enjoy a growing library of recitations from various reciters, with easy search and upload features.
          </p>
          <a href="/upload" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-blue-700 transition">Upload Your Recitation</a>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Use Quran Audio Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Community Library</h3>
              <p className="text-gray-600">Access a wide range of recitations uploaded by users from around the world.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Easy Upload & Search</h3>
              <p className="text-gray-600">Upload your own recitations or search for your favorite surahs and reciters in seconds.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2">Free & Open</h3>
              <p className="text-gray-600">No sign-up required to listen. Share and benefit from the recitations freely.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
