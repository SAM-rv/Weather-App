# Weather App

A full-stack weather application built with **Spring Boot** on the backend and a lightweight **HTML/CSS/JavaScript** UI served from the app's static resources. It shows current conditions, a multi-day forecast, and location details for any city.

## Features

- **Current Weather** — city, region, country, temperature, condition, and local time
- **Forecast** — day-by-day min/max/avg temperature, max wind speed, and condition, for a configurable number of days
- **Location Lookup** — coordinates, timezone, and local time for a city
- Unit toggle (°C / °F) on the current weather view
- No backend framework or build step needed for the frontend — plain HTML/CSS/JS served as static resources

## Tech Stack

**Backend**
- Java / Spring Boot
- Spring Web (REST controllers)
- [WeatherAPI.com](https://www.weatherapi.com/) as the upstream weather data provider

**Frontend**
- HTML5, CSS3, vanilla JavaScript (no framework, no build tools)
- Served directly from `src/main/resources/static`

## Project Structure

```
Weather_App/
├── src/
│   └── main/
│       ├── java/com/example/Weather_App/
│       │   ├── controller/
│       │   │   └── WeatherController.java
│       │   ├── service/
│       │   │   └── WeatherService.java
│       │   └── dto/
│       │       ├── WeatherDTO.java
│       │       ├── Location.java
│       │       ├── MyForecast.java
│       │       └── Root.java
│       └── resources/
│           ├── static/
│           │   ├── index.html
│           │   ├── style.css
│           │   └── script.js
│           └── application.properties
├── pom.xml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description | Query / Path Params |
|---|---|---|---|
| GET | `/weather/{city}` | Current weather for a city | `city` (path) |
| GET | `/weather/location/{city}` | Location details for a city | `city` (path) |
| GET | `/weather/forecast` | Multi-day forecast for a city | `city`, `days` (query) |

### Sample responses

**`GET /weather/pune`**
```json
{
  "city": "Pune",
  "region": "Maharashtra",
  "country": "India",
  "temperature": 19.9,
  "condition": "Patchy rain nearby",
  "localtime": 1789222414
}
```

**`GET /weather/location/pune`**
```json
{
  "name": "Pune",
  "region": "Maharashtra",
  "country": "India",
  "lat": 18.5333,
  "lon": 73.8667,
  "tz_id": "Asia/Kolkata",
  "localtime_epoch": 1789222414,
  "localtime": "2026-09-12 19:43"
}
```

**`GET /weather/forecast?city=pune&days=3`**
```json
{
  "weatherDTO": {
    "city": "Pune",
    "region": "Maharashtra",
    "country": "India",
    "temperature": 19.9,
    "condition": "Patchy rain nearby",
    "localtime": 1789222482
  },
  "dayForecast": [
    {
      "date": "2026-09-12",
      "maxtemp_c": 25.7,
      "mintemp_c": 17.8,
      "avgtemp_c": 20.9,
      "maxwind_kph": 17.6,
      "condition": {
        "text": "Mist",
        "icon": "//cdn.weatherapi.com/weather/64x64/day/143.png",
        "code": 1030
      }
    }
  ]
}
```

## Getting Started

### Prerequisites

- Java 17+ (adjust to match your `pom.xml`)
- Maven (or the Maven wrapper `./mvnw` included in the project)
- A free API key from [WeatherAPI.com](https://www.weatherapi.com/)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Configure your API key

Add your WeatherAPI.com key to `src/main/resources/application.properties`:

```properties
weather.api.key=YOUR_WEATHERAPI_KEY_HERE
```

> Update the property name above to match whatever key you actually used in `WeatherService`.

### 3. Run the application

Using Maven:

```bash
./mvnw spring-boot:run
```

Or build a jar and run it:

```bash
./mvnw clean package
java -jar target/Weather_App-0.0.1-SNAPSHOT.jar
```

By default the app starts on **http://localhost:8080**.

### 4. Open the UI

Since the frontend lives in `src/main/resources/static`, Spring Boot serves it automatically — just open:

```
http://localhost:8080
```

No separate frontend server or CORS configuration is needed, because the UI and API are served from the same origin.

> **Note:** `script.js` currently points `BASE_URL` at `http://localhost:8080`. Since the UI is now served by the same Spring Boot app, you can simplify this to a relative/empty base (`''`) so it keeps working regardless of host or port.

## Screenshots

| Current | Forecast | Location |
|---|---|---|
| ![Current weather]() 
| ![Forecast]() 
| ![Location]() |

> Add your own screenshots to `docs/screenshots/` and update the paths above if you name the files differently.

## Frontend Pages

The UI is a single `index.html` with three tab-switched views (no page reload):

- **Current** — enter a city to fetch `/weather/{city}`
- **Forecast** — enter a city and number of days to fetch `/weather/forecast?city=&days=`
- **Location** — enter a city to fetch `/weather/location/{city}`

Nothing loads until you submit a form on the relevant tab.

## Possible Improvements

- Add humidity, precipitation, and wind to the current-weather API response so the UI can display them
- Cache upstream API responses to reduce calls to WeatherAPI.com
- Add city autocomplete / suggestions
- Add automated tests for the controller and service layers

## License

B.Tech ,
Information Technology Department , 
M.S.Bidve engineering College Latur
