const img_prefix = "https://image.tmdb.org/t/p/original";

const search_prefix = "https://api.themoviedb.org/3/search/movie?language=en-US&page=1&include_adult=false"
const get_movie_prefix = "https://api.themoviedb.org/3/movie/"
//Api key after logging into website
const API_KEY = "e6a11d5175b0ce37a97f607aa1ca78e4";
//Array for genres
let genres = {}

//Array for movies
let list_movies = [];

//Intializing page here
let PAGE = 1;

let movieIsShowing = true


async function  getMovies(PAGE) {

  //Fetch movies using page and Given API key
  const result = await fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      API_KEY +
      "&language=en-US&page=" +
      PAGE
  );




  data = await result.json();

  // Run loop for each movie to create format
  for (movie of data["results"]) {

    // create movie elem
    let movieElem = document.createElement("div");
    movieElem.classList.add("movie-item");
    movieElem.style.margin = '0 0 20px'

    // create title
    let movieTitle = document.createElement("p");
    movieTitle .style.textAlign = "center";
    movieTitle .innerHTML = movie["original_title"];
    movieTitle .style.margin = 0;

    // create rating
    let movieElemRating = document.createElement("p");
    movieElemRating.style.textAlign = "center";
    movieElemRating.innerHTML = "Voter Average: " + movie["vote_average"];
    movieElemRating.style.margin = 0;

    // create movie element to be added to dom
    let movieElemImg = document.createElement("img");
    movieElemImg.src = img_prefix + movie["poster_path"];
    movieElemImg.alt = movie["original_title"] + '_' + movie.id;


    movieElemImg.addEventListener('click', (event) => {
      handleImageClick(event)
    })

    // append poster, title, rating, break
    movieElem.appendChild(movieElemImg);
    movieElem.appendChild(movieTitle);
    movieElem.appendChild(movieElemRating);
    movieElem.appendChild(document.createElement("br"));


    if(movieIsShowing)
      document.getElementById('movies').appendChild(movieElem);
    else
      document.getElementById('searchmovies').appendChild(movieElem);



  }


}

async function listMovies() {
  try {
    const response = await getMovies(PAGE);
    PAGE++;

    moviesShowing = true

    document
      .getElementById("loadmore")
      .addEventListener("click", async function () {
        await getMovies(PAGE);
        PAGE++;
      });
  } catch (err) {
    console.log(err);
  }
}

async function handleSearchQuery(inputStr){

  moviesIsShowing = false


  if(inputStr){


    document.getElementById('movies').style.display ='none'

    // clear prev search movies
    document.getElementById('searchmovies').innerHTML = ''



    const res = await fetch(
      search_prefix +
      "&query=" +
      inputStr.replace(' ', '%20') +
      "&api_key=" +
      API_KEY
    )
    data = await res.json()

    const results = data['results']



    for(movie of results) {
      let movieElem = document.createElement('div')
      movieElem.style.margin = '0 0 20px'
      movieElem.classList.add("movie-item")
      movieElem.classList.add("movies")

      movieElem.innerHTML += `
        <img class="movie-search-item" src="${img_prefix + movie['poster_path']}" alt="${movie['original_title']}_${movie.id}">
        <p style="text-align: center; margin: 0">
        ${movie['original_title']}
        </p>
        <p style="text-align: center; margin: 0">
        ${"Rating:" + movie["vote_average"]}
        </p>
      `




      document.getElementById('searchmovies').appendChild(movieElem)


    }

  }

  else{
    document.getElementById('movies').style.display ='flex'
  }
}

async function handleImageClick(event){




  const alt = event.target.alt
  const id = alt.substring(alt.indexOf('_')+1)


  const res = await fetch(
    get_movie_prefix + id
    + '?api_key=' + API_KEY + '&language=en-US'
  )
  const data = await res.json()

  console.log(data);

  document.getElementById('preview').innerHTML = `
    <div style="position: fixed; top:0; width: 100vw; height:100vh; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, .5);">
      <div id="preview-details" style="position:absolute; background-color: white; width: 800px; height: 600px; color: black">
        <div>

          <h2 style="text-align: center;">${data.title}</h2>
          <p style="text-align: center;">Genre(s): ${data.genres.map((el) => el.name)}</p>
          <img style="position:absolute" width=150 height=225 alt="poster" src="${img_prefix + data.poster_path}">
          <img width=600 height=337.5 alt="background" src="${img_prefix + data.backdrop_path}">
          <p style="text-align: center;">${data.runtime} minutes |
          ${data.release_date} |
          ${data.vote_average}
          <p style="padding: 10px">${data.overview}</p>
        </div>
      </div>
    </div>
  `
  const newdiv = document.createElement('div')
  const exit_button = document.createElement('button')
  newdiv.appendChild(exit_button)

  exit_button.innerHTML = 'Close'
  newdiv.style = `
    position: absolute;
    top: 0;
    right: 0;
    margin: 5px;
  `
  exit_button.style = `
    background-color: #4CAF50;
    color: white;
    padding: 15px 32px;
    font-size: 16px;
  `
  document.getElementById('preview-details').appendChild(newdiv)

  exit_button.addEventListener('click', handleLeavePreview)

}

function handleLeavePreview(){
  document.getElementById('preview').innerHTML = ''
}


window.onload = function() {


  listMovies();

  let input = document.querySelector('.search input')
  input.addEventListener('input', () => {

    handleSearchQuery(input.value)
  })


  document.body.addEventListener('click', (event) => {
    if(event.target.matches('.movie-search-item')){
      handleImageClick(event)
    }
  })






}
