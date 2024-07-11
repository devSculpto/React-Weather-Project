import { useState, useEffect } from 'react';
import './Weather.css';

export default function Weather() {
    const [input, setInput] = useState("");
    const [info, setInfo] = useState({
        temp: 28,
        minTemp: 25,
        maxTemp: 30,
        humidity: 4.5,
        description: "clear cloud",
        speed: 4,
        name: "Mumbai"
    });
    const [error, setError] = useState(null);
    const API_KEY = "de1a7baca8f785fe3256cf04bac66512";
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";

    const extractInfo = async (e) => {
        e.preventDefault();
        if (input !== "") {
            try {
                let rawData = await fetch(`${API_URL}?q=${input}&appid=${API_KEY}&units=metric`);
                let data = await rawData.json();

                if (data.cod && data.cod !== 200) {
                    throw new Error(data.message || 'Failed to fetch weather data');
                }

                setInfo((preInfo) => ({
                    ...preInfo,
                    temp: data.main.temp,
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    humidity: data.main.humidity,
                    description: data.weather[0].description,
                    speed: data.wind.speed,
                    name: data.name
                }));
                setInput("");
                setError(null);
            } catch (error) {
                console.error("Error fetching weather data:", error.message);
                setError(error.message);
            }
        }
    }

    const updateInputVal = (e) => {
        setInput(e.target.value);
    }

    useEffect(() => {
        document.body.style.backgroundImage = `url('/images/${info.description.toLowerCase().replace(' ', '-')}.jpg')`;
    }, [info.description]);

    return (
        <>
            <form onSubmit={extractInfo}>
                <div className="weather-box">
                    <h3>Weather App</h3>
                    <div className="search-box">
                        <input type="text"
                            placeholder='Enter your city'
                            onChange={updateInputVal}
                            value={input}
                        />
                        <button type='submit'><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>

                    {error && <p className="error-message" style={{color : "#F51720"}}>{error}!</p>}

                    <div className="info-box">
                        <div className="weatherIcon">
                            <img src="./images/rainy-day.png" alt="weatherIcon" id='weatherIcon' />
                        </div>
                        <h1>{info.temp}&deg;C</h1>
                        <h2>{info.name}</h2>
                        <div className="weatherData">
                            <div className="left">
                                <img src="./images/humidity color.png" alt="humidity" id='humidity' />
                                <div>
                                    <p>{info.humidity} %</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className="right">
                                <img src="./images/wind color.png" alt="wind speed" id='windSpeed' />
                                <div>
                                    <p>{info.speed} Km/hr</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
