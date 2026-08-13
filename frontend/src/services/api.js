const API_KEY = "67af2372907b1eda796d797e247ad0da";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const BACKEND_URL = "http://localhost:5192";

// ==========================================
// 1. TMDb API Servisleri (Home.jsx & Arama)
// ==========================================

// Home.jsx'in çağırdığı ve eksik olan fonksiyon:
export const getPopularMovies = async () => {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

// Film Arama Fonksiyonu
export const searchMovies = async (query) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

// Öneri motorundan gelen film isimleri için TMDb'den kapak/detay arayan fonksiyon
export const fetchMovieDetailsFromTMDB = async (movieTitleWithYear) => {
  try {
    // 1. Regex ile film adını ve parantez içindeki yılı ayırıyoruz.
    // Örn: "The Odyssey (2026)" -> Title: "The Odyssey", Year: "2026"
    const match = movieTitleWithYear.match(/^(.*?)\s*\((19\d\d|20\d\d)\)$/);
    
    let title = movieTitleWithYear;
    let year = "";

    if (match) {
      title = match[1].trim(); // Film adı
      year = match[2];         // Yıl
    }

    // 2. TMDb API'ye yılı da parametre olarak gönderiyoruz
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
    if (year) {
      url += `&primary_release_year=${year}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // 3. Eğer yılla arama sonuç vermezse sadece film adıyla tekrar dene (Fall-back)
    let movie = data.results && data.results[0];
    if (!movie && year) {
      const fallbackResponse = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
      );
      const fallbackData = await fallbackResponse.json();
      movie = fallbackData.results && fallbackData.results[0];
    }

    // 4. TMDb'den veri geldiyse poster ve detayları döndür
    if (movie) {
      return {
        id: movie.id, // TMDb ID'si
        title: movieTitleWithYear, // Orijinal tam başlık
        poster_path: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : "https://via.placeholder.com/500x750?text=No+Poster",
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview
      };
    }
  } catch (error) {
    console.error("TMDb fetch error for:", movieTitleWithYear, error);
  }

  // Eşleşme bulunamazsa varsayılan kart
  return {
    id: Math.random(),
    title: movieTitleWithYear,
    poster_path: "https://via.placeholder.com/500x750?text=No+Poster",
    release_date: "N/A"
  };
};
// ==========================================
// 2. C# Backend Servisleri (Rating & Öneri)
// ==========================================

export const rateMovie = async (userId, movieId, score) => {
  const response = await fetch(`${BACKEND_URL}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, movieId, score }),
  });
  return await response.json();
};

export const getRecommendations = async (userId, X = 5, K = 3) => {
  const response = await fetch(`${BACKEND_URL}/recommendations/${userId}?X=${X}&K=${K}`);
  return await response.json();
};



// export const getPopularMovies = async()=>{
//     const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
//     const data=await response.json();
//     return data.results;
// }

// export const searchMovies = async(query)=>{
//     const response = await fetch(
//         `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
//             query
//         )}`
//     );
//     const data=await response.json();
//     return data.results;
// }