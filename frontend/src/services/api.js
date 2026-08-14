const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "67af2372907b1eda796d797e247ad0da"; // Kendi TMDb API Key'inizi yazın

const BACKEND_URL = "http://localhost:5192/api"; // Backend'in çalıştığı adres

// ==========================================
// 1. TMDb API Servisleri
// ==========================================

export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`);
    if (!response.ok) throw new Error("TMDb API isteği başarısız oldu");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Popular movies fetch error:", error);
    return [];
  }
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

// export const fetchMovieDetailsFromTMDB = async (movieTitleWithYear) => {
//   try {
//     // Tırnak işaretlerini temizle
//     const cleanRaw = movieTitleWithYear.replace(/^["']|["']$/g, '').trim();

//     const match = cleanRaw.match(/^(.*?)\s*\((19\d\d|20\d\d)\)$/);
//     let title = cleanRaw;
//     let year = "";

//     if (match) {
//       title = match[1].trim();
//       year = match[2];
//     }

//     let url = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
//     if (year) {
//       url += `&primary_release_year=${year}`;
//     }

//     const response = await fetch(url);
//     const data = await response.json();

//     let movie = data.results && data.results[0];
//     if (!movie && year) {
//       const fallbackResponse = await fetch(
//         `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
//       );
//       const fallbackData = await fallbackResponse.json();
//       movie = fallbackData.results && fallbackData.results[0];
//     }

//     if (movie) {
//       return {
//         id: movie.id,
//         title: cleanRaw,
//         poster_path: movie.poster_path 
//           ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
//           : "https://via.placeholder.com/500x750?text=No+Poster",
//         release_date: movie.release_date,
//         vote_average: movie.vote_average,
//         overview: movie.overview
//       };
//     }
//   } catch (error) {
//     console.error("TMDb fetch error for:", movieTitleWithYear, error);
//   }

//   return {
//     id: Math.random(),
//     title: movieTitleWithYear,
//     poster_path: "https://via.placeholder.com/500x750?text=No+Poster",
//     release_date: "N/A"
//   };
// };

export const fetchMovieDetailsFromTMDB = async (movieTitleWithYear) => {
  try {
    if (!movieTitleWithYear) return null;

    // Tırnak işaretlerini ve boşlukları temizle
    const cleanRaw = String(movieTitleWithYear).replace(/^["']|["']$/g, '').trim();

    // Regex ile başlığı ve yılı ayır (Örn: "Spider-Man: Brand New Day (2026)" -> title: "Spider-Man: Brand New Day", year: "2026")
    const match = cleanRaw.match(/^(.*?)\s*\((\d{4})\)$/);
    let title = cleanRaw;
    let year = "";

    if (match) {
      title = match[1].trim();
      year = match[2];
    }

    // TMDb'de film arıyoruz
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
    if (year) {
      url += `&primary_release_year=${year}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    let movie = data.results && data.results.length > 0 ? data.results[0] : null;

    // Eğer yılla arama sonuç vermediyse sadece isimle dene
    if (!movie && year) {
      const fallbackResponse = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
      );
      const fallbackData = await fallbackResponse.json();
      movie = fallbackData.results && fallbackData.results.length > 0 ? fallbackData.results[0] : null;
    }

    if (movie) {
      return {
        id: movie.id,
        title: cleanRaw,
        poster_path: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : "https://via.placeholder.com/500x750?text=No+Poster",
        url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : "https://via.placeholder.com/500x750?text=No+Poster",
        release_date: movie.release_date || year,
        vote_average: movie.vote_average
      };
    }
  } catch (error) {
    console.error("TMDb fetch error for:", movieTitleWithYear, error);
  }

  // TMDb'de bulunamazsa placeholder ile dön
  return {
    id: Math.random(),
    title: movieTitleWithYear,
    poster_path: "https://via.placeholder.com/500x750?text=No+Poster",
    url: "https://via.placeholder.com/500x750?text=No+Poster",
    release_date: "N/A"
  };
};
// ==========================================
// 2. C# Backend Servisleri
// ==========================================

// Rating
export const rateMovie = async (userId, movieTitle, score) => {
  const response = await fetch(`${BACKEND_URL}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      UserId: parseInt(userId, 10), 
      MovieTitle: String(movieTitle), 
      Score: parseFloat(score) 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Rating failed");
  }

  return await response.json();
};

// Recommendations
export const getRecommendations = async (userId, X = 5, K = 3) => {
  const response = await fetch(`${BACKEND_URL}/recommendations/${userId}?X=${X}&K=${K}`);
  if (!response.ok) throw new Error("Get recommendations failed");
  return await response.json();
};

// Login Servisi
export const loginUser = async (username, password) => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data; // { userId, username, message }
};

// Signup Servisi
export const signupUser = async (username, password) => {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }
  return data; // { userId, username, message }
};

// Favorileri Backend CSV'den Getirme (EKSİK OLAN FONKSİYON 1)
export const getFavoritesFromDb = async (userId) => {
  const response = await fetch(`${BACKEND_URL}/favorites/${userId}`);
  if (!response.ok) throw new Error("Favoriler getirilemedi");
  return await response.json();
};

// Favori Durumunu Değiştirme / Kaydetme (EKSİK OLAN FONKSİYON 2)
export const toggleFavoriteInDb = async (userId, movieTitle) => {
  const response = await fetch(`${BACKEND_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: parseInt(userId, 10), movieTitle })
  });
  if (!response.ok) throw new Error("Favori güncellenemedi");
  return await response.json();
};



// 67af2372907b1eda796d797e247ad0da