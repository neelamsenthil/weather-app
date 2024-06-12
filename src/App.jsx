import { useState } from 'react'
import './App.css'
import sun from "./assets/sun.png";
import cloudDayIcon from "./assets/weather-app.png";
import cloudNightIcon from "./assets/weatherNight.png";
import drizzling from "./assets/drizzle.png";
import wind from "./assets/wind.png";
import rain from "./assets/thunderstorm.png";
import snowy from "./assets/snowy.png";
import windIcon from "./assets/wind Icon.png";
import humidityIcon from "./assets/humidity.png";
import searchIcon from "./assets/loupe.png";
import { useEffect } from 'react';



const WeatherDetails = ({ icon, temp, city, country, lat, long, humidity, windspeed }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt='image' />
      </div>
      <div className='temp'>
        {temp}°C
      </div>
      <div className='location'>
        {city}
      </div>
      <div className='country'>
        {country}
      </div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>

      </div>
      <div className='data-container'>
        <div className='elements'>
          <img src={humidityIcon} alt='humidity' />
          <div className='data'>
            <div>{humidity}%</div>
            <div>Humidity</div>
          </div>

        </div>

        <div className='elements'>
          <img src={windIcon} alt='wind' />
          <div className='data'>
            <div>{windspeed} km/h</div>
            <div>Wind Speed</div>
          </div>

        </div>

      </div>


    </>
  )
}



function App() {
  let api_key = "e344699ddf460a146234609b0c224abc"

  const [text, setText] = useState("thanjavur")
  const [icon, setIcon] = useState(cloudDayIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [windspeed, setWindSpeed] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const weatherIconMap = {
    "01d": sun,
    "01n": cloudNightIcon,
    "02d": cloudDayIcon,
    "02n": cloudNightIcon,
    "03d": drizzling,
    "03n": drizzling,
    "04d": sun,
    "04n": drizzling,
    "05d": rain,
    "05n": rain,
    "10d": wind,
    "10n": snowy,
    "12d": wind,
    "12n": snowy,

  }


  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      // console.log(data)

      if (data.cod === "404") {
        console.error("city not found")
        setCityNotFound(true)
        setLoading(false)
        return;

      }


      setHumidity(data.main.humidity)
      setWindSpeed(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLong(data.coord.lon)
      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || cloudDayIcon)
      setCityNotFound(false)



    } catch (error) {
      console.error("An error occurred:", error.message)
      setError("Error: Internet Disconnected:(")

    } finally {
      setLoading(false)

    }

  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  useEffect(() =>{
    search()
  },[])



  return (
    <>
      <div className="container">
        <div className="inpit-container">
          <input type="text" placeholder="Search City" value={text} name='city' onChange={handleCity} onKeyDown={handleKeyDown} />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          windspeed={windspeed} />}

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City Not Found</div>}




      </div>
    </>
  )
}

export default App
