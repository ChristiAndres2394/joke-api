document.addEventListener('DOMContentLoaded', () => {
    const jokeText = document.getElementById('joke-text');
    const getJokeBtn = document.getElementById('get-joke-btn');
    const categorySelect = document.getElementById('category-select');
    const jokeContainer = document.getElementById('joke-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Verificar y cargar el modo oscuro desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    // Alternar modo oscuro
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });

    const fetchJoke = async () => {
        const category = categorySelect.value;
        
        // Categorías que funcionan mejor sin idioma específico
        const englishCategories = ['Dark', 'Pun'];
        const useEnglish = englishCategories.includes(category);
        
        // Construir URL con parámetros adecuados
        const baseUrl = 'https://v2.jokeapi.dev/joke/';
        const params = new URLSearchParams({
            type: 'single,twopart',
            safeMode: true
        });
        
        if (!useEnglish) {
            params.append('lang', 'es');
        }
        
        const url = `${baseUrl}${category}?${params.toString()}`;
        
        try {
            jokeText.textContent = "Cargando chiste...";
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Si no hay chiste disponible en la categoría
            if (data.error || (data.joke === undefined && data.setup === undefined)) {
                throw new Error('No se encontraron chistes en esta categoría');
            }
            
            // Manejar diferentes tipos de chistes
            if (data.type === 'single') {
                jokeText.textContent = data.joke;
            } else if (data.type === 'twopart') {
                jokeText.innerHTML = `${data.setup}<br><br><strong>${data.delivery}</strong>`;
            }
            
            jokeContainer.classList.remove('error');
        } catch (error) {
            console.error("Error fetching joke:", error);
            
            // Mensajes de error específicos
            if (error.message.includes('No se encontraron')) {
                jokeText.innerHTML = `😢 No hay chistes disponibles en "${category}"<br>
                <small>Prueba con otra categoría</small>`;
            } else {
                jokeText.textContent = "¡Error al cargar el chiste! Intenta nuevamente.";
            }
            
            jokeContainer.classList.add('error');
        }
    };

    // Cargar primer chiste al inicio
    fetchJoke();
    
    // Evento para el botón
    getJokeBtn.addEventListener('click', fetchJoke);
});