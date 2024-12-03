const movListElement = document.getElementById("movies-list")
const searchInput = document.getElementById("search")
const searchCheckbox = document.getElementById("check")

let isSearchTriggerEnabled = false
let lastSearchQuery = null

const debounceTime = (() => {
  let timer = null
  return (callback, ms) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(callback, ms)
  }
})()

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.Search) throw "The server returned incorect data"
      return data.Search
    })

const addMovieToList = ({ Poster: poster, Title: title, Year: year }) => {
  const item = document.createElement("div")
  const img = document.createElement("img")

  item.classList.add("movie")
  img.classList.add("movie__img")
  img.src = /^(https?:\/\/)/i.test(poster) ? poster : "assets/noimage.jpg"
  img.alt = `${title} ${year}`
  img.title = `${title} ${year}`

  item.append(img)
  movListElement.prepend(item)
}

const clearMoviesMarkup = () => {
  if (movListElement) movListElement.innerHTML = ""
}

const inputSearchHandler = (e) => {
  debounceTime(() => {
    const searchQuery = e.target.value.trim()

    if (
      !searchQuery ||
      searchQuery.length < 4 ||
      searchQuery === lastSearchQuery
    )
      return
    if (!isSearchTriggerEnabled) clearMoviesMarkup()

    getData(
      `https://www.omdbapi.com/?i=tt3896198&apikey=95325aa8&s=${searchQuery}`
    )
      .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
      .catch((err) => console.error(err))

    lastSearchQuery = searchQuery
  }, 2000)
}

searchInput.addEventListener("input", inputSearchHandler)
searchCheckbox.addEventListener(
  "change",
  (e) => (isSearchTriggerEnabled = e.target.checked)
)
