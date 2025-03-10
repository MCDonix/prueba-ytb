import React, { useState, useEffect } from "react";
import "./App.css";

const YouTubeAudioPlayer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [videoId, setVideoId] = useState("");

  // Función para buscar videos en YouTube
  const handleSearch = async (pageToken = "", searchQuery = query) => {
    if (!searchQuery.trim()) {
      setError("Por favor, ingresa un término de búsqueda.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${searchQuery}&key=AIzaSyDA1HbnHGxWpVSdTkYaK0r0Ka-ye0pmdFQ&type=video&pageToken=${pageToken}`
      );
      const data = await response.json();

      // Seleccionar 10 resultados al azar
      const randomResults = data.items.sort(() => Math.random() - 0.5).slice(0, 10);

      setResults(randomResults);
      setNextPageToken(data.nextPageToken || "");
      setPrevPageToken(data.prevPageToken || "");
    } catch (err) {
      setError("Error al buscar videos");
    } finally {
      setLoading(false);
    }
  };

  // Realizar una búsqueda inicial al cargar la página
  useEffect(() => {
    handleSearch("", "musica"); // Término de búsqueda inicial (puedes cambiarlo)
  }, []);

  const handlePlay = (videoId) => {
    setVideoId(videoId); // Establecer el ID del video para mostrarlo
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      setPage(page + 1);
      handleSearch(nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (prevPageToken) {
      setPage(page - 1);
      handleSearch(prevPageToken);
    }
  };

  // Función para manejar la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Mp3 youtube</h1>
        <p>Musica de youtube</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Captura la tecla Enter
          placeholder="Buscar en YouTube"
        />
        <button onClick={() => handleSearch()} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <ul className="results">
        {results.map((item, index) => (
          <li
            key={item.id.videoId}
            className={index % 2 === 0 ? "even" : "odd"} // Alternar colores
          >
            <span>{item.snippet.title}</span>
            <button
              onClick={() => handlePlay(item.id.videoId)}
              disabled={loading}
            >
              Reproducir
            </button>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={!prevPageToken || loading}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={handleNextPage} disabled={!nextPageToken || loading}>
          Siguiente
        </button>
      </div>

      {/* Reproductor de YouTube oculto con autoplay */}
      {videoId && (
        <div style={{ display: "none" }}>
          <iframe
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YouTubeAudioPlayer;