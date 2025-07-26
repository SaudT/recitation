import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureListSection from '../components/FeatureListSection';
import CTASection from '../components/CTASection';
import ListSection from '../components/ListSection';

export default function Recitations() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Features List Section (search/filter) */}
        <FeatureListSection />

        {/* CTA Section to upload */}
        <CTASection />

        {/* List of recitations */}
        <ListSection />
      </main>
      <Footer />
    </div>
  );
}
