export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="text-2xl font-extrabold text-blue-500 tracking-tighter">Kuvyal.</span>
            <p className="mt-2 text-sm text-gray-400">Preserving Tamil literature for the digital age.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Kuvyal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}