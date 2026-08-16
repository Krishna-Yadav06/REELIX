// ============================================================
// REELIX — DOM ELEMENT ID REFERENCE
// ============================================================

// ---------- Loading ----------
// #loadingScreen
// #loadingLogo
// #loadingText
// #loadingDots

// ---------- Navbar ----------
// #logo
// #homeBtn
// #moviesBtn
// #watchlistBtn
// #searchInput
// #searchBtn
// #hamburger

// ---------- Hero ----------
// #heroSection
// #heroTitle
// #heroDescription
// #exploreBtn
// #trendingBtn

// ---------- Movies ----------
// #movies
// #movieTitle
// #movieGrid

// ---------- Filters ----------
// #genreFilter
// #sortFilter

// ---------- Search ----------
// #searchSection
// #searchResults
// #searchResultsTitle

// ---------- Movie Details ----------
// #movieDetails
// #moviePoster
// #movieTitle
// #movieGenres
// #movieRating
// #movieReleaseDate
// #movieDescription
// #trailerBtn
// #addWatchlistBtn

// ---------- Watchlist ----------
// #watchlist
// #watchlistGrid

// ---------- Messages ----------
// #errorMessage
// #emptyMessage


// ============================================================
// YOUR JAVASCRIPT STARTS HERE
// ============================================================


// Step 1:
// Select the DOM elements you need.
//
// Example:
//
// const searchInput = document.querySelector("#searchInput");


// Step 2:
// We will connect TMDB API here.


// Step 3:
// We will fetch movies.


// Step 4:
// We will render movie cards.


// Step 5:
// We will implement search.


// Step 6:
// We will implement genre filtering.


// Step 7:
// We will implement movie details.


// Step 8:
// We will implement watchlist.

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
let allMovies = []

const loadingScreen = document.querySelector("#loadingScreen")
const movieGrid = document.querySelector("#movieGrid")
const searchInput = document.querySelector("#searchInput")
const searchBtn = document.querySelector("#searchBtn")
const searchResults = document.querySelector("#searchResults")
const watchlistGrid = document.querySelector("#watchlistGrid")
const loadMoreBtn = document.querySelector("#loadMoreBtn")
const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector(".navbar nav");
const navActions = document.querySelector(".nav-actions");



let moreMoviesPage = 2




hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    navActions.classList.toggle("active");
});
window.addEventListener("load", () => {
    setTimeout(() => {
        loadingScreen.classList.add("hide")
    }, 3000)
})

searchBtn.addEventListener("click", () => {
    const searchIn = searchInput.value.trim()
    fetchMovies(searchIn)
})

loadMoreBtn.addEventListener("click", () => {
    moreMoviesFunc()
})

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {

        const movieId = Number(e.target.dataset.id)

        handleWatchlist(movieId, e.target)
    }
})

const apiUrl =
    "https://movies-api.accel.li/api/v2/list_movies.json"

async function fetchMovies(searchIn = "") {
    try {
        let url = `${apiUrl}?limit=20`

        if (searchIn) {
            url += `&query_term=${encodeURIComponent(searchIn)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (searchIn) {
            renderMoreMovies(data.data.movies)
        } else {
            renderMovies(data.data.movies)
        }

    } catch (error) {
        console.log("Error:", error)
    }
}

function renderMovies(movies) {
    allMovies.push(...movies)

    movies.forEach(movie => {
        const isSaved = watchlist.some(
            item => item.id === movie.id
        )

        const card = `
            <div class="movie-card">
                <img src="reelix.png" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.year}</p>
                <button
                    class="like-btn ${isSaved ? "saved" : ""}"
                    data-id="${movie.id}">
                    🔖
                </button>
            </div>
        `

        movieGrid.innerHTML += card
    })
}

async function moreMoviesFunc() {
    try {
        const response = await fetch(
            `${apiUrl}?limit=20&page=${moreMoviesPage}`
        )

        const data = await response.json()

        renderMovies(data.data.movies)

        moreMoviesPage++

    } catch (error) {
        console.log("Error:", error)
    }
}

function renderMoreMovies(movies) {
    searchResults.innerHTML = ""

    movies.forEach(movie => {
        allMovies.push(movie)

        const isSaved = watchlist.some(
            item => item.id === movie.id
        )

        const card = `
            <div class="movie-card">
                <img src="reelix.png" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.year}</p>
                <button
                    class="like-btn ${isSaved ? "saved" : ""}"
                    data-id="${movie.id}">
                    🔖
                </button>
            </div>
        `

        searchResults.innerHTML += card
    })
}

function handleWatchlist(movieId, button) {

    const movie = allMovies.find(
        movie => movie.id === movieId
    )

    const alreadySaved = watchlist.some(
        movie => movie.id === movieId
    )

    if (alreadySaved) {

        watchlist = watchlist.filter(
            movie => movie.id !== movieId
        )

        button.classList.remove("saved")

    } else {

        watchlist.push(movie)

        button.classList.add("saved")
    }

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    )

    renderWatchlist()
}

function renderWatchlist() {
    watchlistGrid.innerHTML = ""

    watchlist.forEach(movie => {
        const card = `
            <div class="movie-card">
                <img src="reelix.png" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.year}</p>
                <button
                    class="like-btn saved"
                    data-id="${movie.id}">
                    🔖
                </button>
            </div>
        `

        watchlistGrid.innerHTML += card
    })
}

fetchMovies()
renderWatchlist()