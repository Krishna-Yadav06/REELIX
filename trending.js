let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

const loadingScreen = document.querySelector("#loadingScreen");

const trendingMovies = document.querySelector("#trendingMovies");
const ratedMovies = document.querySelector("#ratedMovies");
const likedMovies = document.querySelector("#likedMovies");
const recentMovies = document.querySelector("#recentMovies");

async function fetchMovies(sortBy, container) {
    try {
        const url =
            `https://movies-api.accel.li/api/v2/list_movies.json?limit=10&sort_by=${sortBy}&order_by=desc`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await response.json();

        renderMovies(data.data.movies || [], container);

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p>Unable to load movies.</p>
        `;
    }
}

function renderMovies(movies, container) {

    movies.forEach(movie => {

        const isSaved = watchlist.some(
            item => item.id === movie.id
        );

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `
            <img
                src="reelix.png"
                alt="${movie.title}"
            >

            <div class="movie-info">

                <h3>${movie.title}</h3>

                <p>${movie.year} • ⭐ ${movie.rating}</p>

                <button
                    class="watchlist-btn ${isSaved ? "saved" : ""}"
                    data-id="${movie.id}"
                >
                    ${isSaved ? "✓ Saved" : "+ Watchlist"}
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("watchlist-btn")) {
        return;
    }

    const id = Number(e.target.dataset.id);

    const movieCard = e.target.closest(".movie-card");

    const title = movieCard.querySelector("h3").textContent;

    const movie = {
        id: id,
        title: title,
        medium_cover_image:
            movieCard.querySelector("img").src,
        year: Number(
            movieCard.querySelector("p").textContent.split(" • ")[0]
        )
    };

    const existingIndex = watchlist.findIndex(
        item => item.id === id
    );

    if (existingIndex === -1) {

        watchlist.push(movie);

        e.target.classList.add("saved");
        e.target.textContent = "✓ Saved";

    } else {

        watchlist.splice(existingIndex, 1);

        e.target.classList.remove("saved");
        e.target.textContent = "+ Watchlist";
    }

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );
});

async function loadTrendingPage() {

    await Promise.all([
        fetchMovies("download_count", trendingMovies),
        fetchMovies("rating", ratedMovies),
        fetchMovies("like_count", likedMovies),
        fetchMovies("date_added", recentMovies)
    ]);

    setTimeout(() => {
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 3000);

}, 5000);
}

loadTrendingPage();