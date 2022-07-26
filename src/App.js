import { useState, useEffect } from "react";
import axios from "axios";

const TooMany = () => {
  return (
    <p>Too many matches, specify another filter</p>
  )
}

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({
    main: "",
    weather: [""],
    wind: ""
  });

  const getWeather = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=b4b83f2b8d179c2bad3ddefc61e51390`)
      .then(response => setWeather(response.data));
  }

  const kelvinToCelsius = temp => Math.round(((temp - 273.15) * 100) / 100);
  useEffect(getWeather);

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {kelvinToCelsius(weather.main.temp)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="weather icon" />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const OneCountry = ({ list }) => {
  const country = list[0];

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <Weather country={country} />
    </div>
  )
}

const FilterCountry = ({ list, setFind }) => {
  const showCountry = e => setFind(e.target.value);

  return (
    list.map(country => {
      return <p key={country.name.common}>
        {country.name.common}
        <button value={country.name.common} onClick={showCountry}>show</button>
      </p>
    })
  )
}

const FindCountry = ({ filteredList, list, find, setFind }) => {
  if (filteredList.length > 10 && filteredList.length !== list.length) return <TooMany />
  else if (filteredList.length === 1) return <OneCountry list={filteredList} />
  else if (find) return <FilterCountry list={filteredList} setFind={setFind} />
  else return ""
}

const App = () => {

  const [find, setFind] = useState('');
  const [listOfCountries, setList] = useState([]);

  const filteredList = listOfCountries.filter(country => country.name.common.toLowerCase().includes(find.toLowerCase()));

  const handleFind = e => setFind(e.target.value);

  const getCountries = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setList(response.data));
  }

  useEffect(getCountries, []);

  return (
    <div>
      <span>find countries </span>
      <input value={find} onChange={handleFind} />
      <FindCountry
        filteredList={filteredList}
        list={listOfCountries}
        find={find}
        setFind={setFind} />
    </div >
  )
}

export default App;
