interface HeaderProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

function Header({ searchQuery, onSearch }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-6 px-2 md:px-12 mb-8">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <img src="https://res.cloudinary.com/dgdoej1q8/image/upload/v1761824653/logo_pzyc8y.png" className="w-13 h-13 rounded-full" />
        <span className="font-bold text-sm text-gray-700">highway<br />delite</span>
      </div>
    
      {(searchQuery !== undefined && onSearch) && (
        <form
          className="flex items-center gap-2 w-full md:w-auto"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="search"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search experiences"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full md:w-[280px]"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 rounded px-5 py-2 font-semibold text-gray-800 transition shadow"
          >
            Search
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;

