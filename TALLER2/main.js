
const loadingRef = document.getElementById('loading');
const movieContainerRef = document.getElementById('movie-container');
const errorContainerRef = document.getElementById('error-container');

//  CORRECCIÓN #4: Array global para trackear el estado de los objetos
let moviesState = [];


//  1. FUNCIÓN getMovies()
function getMovies() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const movies = [
                { id: 1, title: "InceptiOn", genre: "Sci-Fi", watched: false, releaseYear: 2010 },
                { id: 2, title: "The WhAle", genre: "Drama", watched: true, releaseYear: 2022 },
                { id: 3, title: "ThE Shinning", genre: "Terror", watched: false, releaseYear: 1980 },
                { id: 4, title: "AmAdeUs", genre: "Drama", watched: false, releaseYear: 1984 },
                { id: 5, title: "ThEre WilL Be blooD", genre: "Drama", watched: true, releaseYear: 2007 }
            ];
            console.log(" API Movies cargadas");
            resolve(movies);
        }, 1500);
    });
}


//  2. FUNCIÓN PRINCIPAL initApp()
async function initApp() {
    try {
        console.log(" Iniciando app...");

        loadingRef.style.display = 'block';
        errorContainerRef.style.display = 'none';

        const moviesRaw = await getMovies();
        console.log(" Datos crudos:", moviesRaw);

        const moviesLimpias = moviesRaw.map(movie => {
            //  CORRECCIÓN #1: Regex corregida — faltaban los backslashes (\w\S*)
            const titleLimpio = movie.title.replace(/\w\S*/g,
                txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
            );

            const type = movie.releaseYear < 2000 ? 'Classic' : 'Modern';

            return {
                ...movie,
                title: titleLimpio,
                type: type
            };
        });

        //  CORRECCIÓN #4: Guardar referencia al array normalizado
        moviesState = moviesLimpias;

        console.log(" Datos normalizados:", moviesLimpias);

        loadingRef.style.display = 'none';

        moviesLimpias.forEach((movie, index) => {
            const movieElement = crearTarjetaMovie(movie, index);
            movieContainerRef.appendChild(movieElement);
        });

    } catch (error) {
        console.error(" Error API:", error);
        loadingRef.style.display = 'none';
        errorContainerRef.innerHTML = '<div class="error"> Error cargando películas. Revisa consola.</div>';
        errorContainerRef.style.display = 'block';
    }
}


//  3. FUNCIÓN crearTarjetaMovie()
function crearTarjetaMovie(movie, index) {
    const div = document.createElement('div');

    // CORRECCIÓN #2: Faltaban los backticks (`) en ambas asignaciones
    div.className = `movie-card ${movie.type.toLowerCase()} ${movie.watched ? 'watched' : ''}`;
    div.id = `movie-${movie.id}`;

    div.innerHTML = `
        <h3>${movie.title}</h3>
        <div class="movie-info">
            <strong>Género:</strong> ${movie.genre} | 
            <strong>Año:</strong> ${movie.releaseYear} | 
            <strong>Tipo:</strong> <span style="color: #007bff;">${movie.type}</span> | 
            <strong>Estado:</strong> <span id="estado-${movie.id}">${movie.watched ? ' Vista' : ' No vista'}</span>
        </div>
        <button onclick="toggleWatched(${movie.id})">Marcar como ${movie.watched ? 'No vista' : 'Vista'}</button>
    `;

    return div;
}


// 4. FUNCIÓN toggleWatched()
function toggleWatched(movieId) {
    // CORRECCIÓN #3: Faltaban backticks en todas las siguientes líneas
    const movieElement = document.getElementById(`movie-${movieId}`);

    const isWatched = movieElement.classList.contains('watched');
    movieElement.classList.toggle('watched');

    // CORRECCIÓN #4: Actualizar el objeto de datos (requerimiento del profesor)
    const movieData = moviesState.find(m => m.id === movieId);
    if (movieData) {
        movieData.watched = !isWatched;
    }

    // Actualizar botón
    const button = movieElement.querySelector('button');
    button.textContent = `Marcar como ${isWatched ? 'Vista' : 'No vista'}`;

    // Actualizar texto de estado visible
    const estadoSpan = document.getElementById(`estado-${movieId}`);
    estadoSpan.textContent = !isWatched ? ' Vista' : ' No vista';

    //  CORRECCIÓN #3: Backticks en console.log
    console.log(` Película ${movieId} ${isWatched ? 'desmarcada' : 'marcada'} como vista`);
    console.log(" Estado actual del objeto:", movieData);
}


//  INICIALIZAR APP
document.addEventListener('DOMContentLoaded', initApp);
