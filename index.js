const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const airQualityValue = document.querySelector('.air-quality');
const mainPollutant = document.querySelector('.main-pollutant');
const colorIndicators = document.querySelectorAll('.color');

searchButton.addEventListener('click', async () => {
    const APIKey = '3db4e972a55bd021a3e83d07ba8da9e1';
    const city = document.querySelector('.search-box input').value.trim();

    if (city === '') {
        return;
    }

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === '404') {
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
            return;
        }

        error404.style.display = 'none';
        error404.classList.remove('fadeIn');

        const image = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        switch (weatherData.weather[0].main) {
            case 'Clear':
                image.src = 'images/clear.png';
                break;
            case 'Rain':
                image.src = 'images/rain.png';
                break;
            case 'Snow':
                image.src = 'images/snow.png';
                break;
            case 'Clouds':
                image.src = 'images/cloud.png';
                break;
            case 'Haze':
                image.src = 'images/mist.png';
                break;
            default:
                image.src = '';
        }

        temperature.innerHTML = `${Math.round(weatherData.main.temp)}<span>°C</span>`;
        description.innerHTML = `${weatherData.weather[0].description}`;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        wind.innerHTML = `${Math.round(weatherData.wind.speed)} Km/h`;

        // Obtener calidad del aire
        const airQualityResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${APIKey}`);
        const airQualityData = await airQualityResponse.json();

        if (airQualityData.list && airQualityData.list.length > 0) {
            const airQualityIndex = airQualityData.list[0].main.aqi;
            airQualityValue.textContent = `: ${airQualityIndex}`;
           
            // Actualizar indicador de color basado en AQI
            updateColorIndicator(airQualityIndex);
        }

        weatherBox.style.display = 'block';
        weatherDetails.style.display = 'block';
        container.style.height = '650px';

        // Animación fadeIn
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Manejar errores aquí, por ejemplo, mostrar un mensaje de error genérico
        error404.style.display = 'block';
        error404.textContent = 'Error fetching weather data';
    }
});

// Función para actualizar el indicador de color basado en el índice de calidad del aire
function updateColorIndicator(aqi) {
    colorIndicators.forEach(indicator => {
        indicator.style.display = 'none';
    });

    if (aqi <= 1) {
        document.querySelector('.good').style.display = 'block';
    } else if (aqi <= 3) {
        document.querySelector('.moderate').style.display = 'block';
    } else if (aqi <= 6) {
        document.querySelector('.unhealthy').style.display = 'block';
    } else if (aqi <= 8) {
        document.querySelector('.hazardous').style.display = 'block';
    } 
}
