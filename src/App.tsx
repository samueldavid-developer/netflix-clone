import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { getMovies, getTrailer, searchMovies, GENRES, IMAGE_BASE_URL, BACKDROP_BASE_URL } from './api';
import './App.css';

function App() {
  const [categories, setCategories] = useState<any>({});
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showNavBlack, setShowNavBlack] = useState(false);

  useEffect(() => {
    loadData();
    const handleScroll = () => setShowNavBlack(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function loadData() {
    const [trending, accion, terror, romance, drama] = await Promise.all([
      getMovies(GENRES.TRENDING),
      getMovies(GENRES.ACCION.toString(), true),
      getMovies(GENRES.TERROR.toString(), true),
      getMovies(GENRES.ROMANCE.toString(), true),
      getMovies(GENRES.DRAMA.toString(), true),
    ]);
    setCategories({ "Tendencias": trending, "Acción": accion, "Terror": terror, "Romance": romance, "Drama": drama });
    setFeaturedMovie(trending[Math.floor(Math.random() * trending.length)]);
  }

  const handleSearch = async (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      const results = await searchMovies(value);
      setSearchResults(results);
    }
  };

  const scrollRow = (id: string, direction: 'left' | 'right') => {
    const row = document.getElementById(id);
    if (row) {
      const offset = direction === 'left' ? -window.innerWidth * 0.8 : window.innerWidth * 0.8;
      row.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!featuredMovie) return <div className="loading">Cargando...</div>;

  return (
    <div className="app">
      <nav className={`nav ${(showNavBlack || searchTerm) && "nav__black"}`}>
        <img className="nav__logo" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Logo" onClick={() => {setSearchTerm(""); window.scrollTo(0,0);}} />
        <div className="nav__search-simple">
          <input type="text" placeholder="🔍 Buscar..." value={searchTerm} onChange={handleSearch} />
        </div>
        <div className="nav__right">
  {/* Enlace a tu perfil de GitHub */}
  <a href="https://github.com/TU_USUARIO" target="_blank" rel="noopener noreferrer">
    <img
      className="nav__avatar"
      src="logogit.png" 
      alt="GitHub Profile"
    />
  </a>
</div>
      </nav>

      {!searchTerm && (
        <header className="banner" style={{ backgroundImage: `url("${BACKDROP_BASE_URL}${featuredMovie.backdrop_path}")` }}>
          <div className="banner__contents">
            <h1 className="banner__title">{featuredMovie.title || featuredMovie.name}</h1>
            <button className="banner__button-play" onClick={() => getTrailer(featuredMovie.id).then(id => id ? setTrailerUrl(id) : alert("No disponible"))}>▶ Reproducir</button>
            <p className="banner__description">{featuredMovie.overview?.substring(0, 150)}...</p>
          </div>
          <div className="banner--fadeBottom" />
        </header>
      )}

      <div className="main_content">
        {searchTerm ? (
          <div className="search_grid">
            {searchResults.map(m => m.poster_path && (
              <img key={m.id} src={`${IMAGE_BASE_URL}${m.poster_path}`} className="poster-anim" onClick={() => getTrailer(m.id).then(id => id && setTrailerUrl(id))} />
            ))}
          </div>
        ) : (
          Object.entries(categories).map(([title, movies]: any) => (
            <div key={title} className="row">
              <h2 className="row-title">{title}</h2>
              <div className="row-wrapper">
                <div className="arrow left" onClick={() => scrollRow(title, 'left')}>‹</div>
                <div id={title} className="posters-container">
                  {movies.map((m: any) => (
                    <img key={m.id} src={`${IMAGE_BASE_URL}${m.poster_path}`} className="poster-anim" onClick={() => getTrailer(m.id).then(id => id && setTrailerUrl(id))} />
                  ))}
                </div>
                <div className="arrow right" onClick={() => scrollRow(title, 'right')}>›</div>
              </div>
            </div>
          ))
        )}
      </div>

      {trailerUrl && (
        <div className="modal" onClick={() => setTrailerUrl(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <YouTube 
              videoId={trailerUrl} 
              className="youtube-video"
              opts={{ 
                width: '100%', 
                height: '100%', 
                playerVars: { autoplay: 1, modestbranding: 1 } 
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;