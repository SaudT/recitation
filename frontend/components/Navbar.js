import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-xl font-bold text-blue-700 cursor-pointer">Quran Audio Hub</span>
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/recitations" className="text-gray-700 hover:text-blue-700 font-medium">Recitations</Link>
        <Link href="/upload" className="text-gray-700 hover:text-blue-700 font-medium">Upload</Link>
        <Link href="/signin" className="text-gray-700 hover:text-blue-700 font-medium">Sign In</Link>
        <Link href="/signup" className="text-gray-700 hover:text-blue-700 font-medium">Sign Up</Link>
      </div>
    </nav>
  );
}
