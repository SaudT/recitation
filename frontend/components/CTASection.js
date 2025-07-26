import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-12 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to share or listen?</h2>
      <p className="text-gray-600 mb-6">Sign up to upload your own recitations or browse the library to listen to others.</p>
      <div className="flex justify-center space-x-4">
        <Link href="/signup">
          <span className="inline-block bg-green-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-green-700 transition cursor-pointer">Sign Up</span>
        </Link>
        <Link href="/upload">
          <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition cursor-pointer">Upload Recitation</span>
        </Link>
      </div>
    </section>
  );
}
