import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeaderSection from '../components/HeaderSection';
import ContactFormSection from '../components/ContactFormSection';

export default function UploadRecitation() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <HeaderSection
          title="Upload Your Quran Recitation"
          description="Share your recitation with the community. Fill out the form below to upload your audio file."
        />

        {/* CTA Form Section (upload form) */}
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
}
