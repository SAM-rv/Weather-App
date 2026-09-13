// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE_URL = 'http://localhost:8080';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  unit: 'C',        // 'C' | 'F' — applies to the Current page
  currentRaw: null,  // last WeatherDTO fetched, kept so unit toggle can re-render
};

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const pageTabs = document.getElementById('page-tabs');
const pages = {
  current: document.getElementById('page-current'),
  forecast: document.getElementById('page-forecast'),
  location: document.getElementById('page-location'),
};

const currentForm = document.getElementById('current-form');
const currentCityInput = document.getElementById('current-city');
const currentEmpty = document.getElementById('current-empty');
const currentError = document.getElementById('current-error');
const currentResult = document.getElementById('current-result');
const currentIcon = document.getElementById('current-icon');
const currentTemp = document.getElementById('current-temp');
const currentPlace = document.getElementById('current-place');
const currentCondition = document.getElementById('current-condition');
const currentLocaltime = document.getElementById('current-localtime');
const unitToggle = document.getElementById('unit-toggle');

const forecastForm = document.getElementById('forecast-form');
const forecastCityInput = document.getElementById('forecast-city');
const forecastDaysInput = document.getElementById('forecast-days');
const forecastEmpty = document.getElementById('forecast-empty');
const forecastError = document.getElementById('forecast-error');
const forecastResult = document.getElementById('forecast-result');
const forecastPlace = document.getElementById('forecast-place');
const forecastLocaltime = document.getElementById('forecast-localtime');
const forecastDaysRow = document.getElementById('forecast-days-row');

const locationForm = document.getElementById('location-form');
const locationCityInput = document.getElementById('location-city');
const locationEmpty = document.getElementById('location-empty');
const locationError = document.getElementById('location-error');
const locationResult = document.getElementById('location-result');
const locFields = {
  name: document.getElementById('loc-name'),
  region: document.getElementById('loc-region'),
  country: document.getElementById('loc-country'),
  lat: document.getElementById('loc-lat'),
  lon: document.getElementById('loc-lon'),
  tz: document.getElementById('loc-tz'),
  localtime: document.getElementById('loc-localtime'),
};

// ---------------------------------------------------------------------------
// Icon set (inline SVG, mapped from condition text)
// ---------------------------------------------------------------------------
function iconMarkup(conditionText = '') {
  const c = conditionText.toLowerCase();

  const sun = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="var(--icon-sun)"/>
    ${[0,45,90,135,180,225,270,315].map(a => `<line x1="32" y1="6" x2="32" y2="14" stroke="var(--icon-sun)" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 32 32)"/>`).join('')}
  </svg>`;

  const cloudSvg = `<svg viewBox="0 0 64 64"><path d="M46 40H18a10 10 0 0 1-1-19.9A14 14 0 0 1 44 22.5 10 10 0 0 1 46 40Z" fill="var(--icon-cloud)"/></svg>`;

  const partly = `<svg viewBox="0 0 64 64">
    <circle cx="24" cy="22" r="10" fill="var(--icon-sun)"/>
    ${[0,60,120,180,240,300].map(a => `<line x1="24" y1="4" x2="24" y2="9" stroke="var(--icon-sun)" stroke-width="2.5" stroke-linecap="round" transform="rotate(${a} 24 22)"/>`).join('')}
    <path d="M48 46H24a9 9 0 0 1-1-17.9A12.5 12.5 0 0 1 47 29a9 9 0 0 1 1 17Z" fill="var(--icon-cloud)"/>
  </svg>`;

  const rain = `<svg viewBox="0 0 64 64">
    <path d="M46 32H18a10 10 0 0 1-1-19.9A14 14 0 0 1 44 14.5 10 10 0 0 1 46 32Z" fill="var(--icon-cloud-shadow)"/>
    ${[20,29,38,47].map((x) => `<line x1="${x}" y1="40" x2="${x-4}" y2="54" stroke="var(--accent-blue)" stroke-width="3" stroke-linecap="round"/>`).join('')}
  </svg>`;

  const mist = `<svg viewBox="0 0 64 64">
    <path d="M42 26H22a8 8 0 0 1-1-15.9A11 11 0 0 1 41 12a8 8 0 0 1 1 14Z" fill="var(--icon-cloud)"/>
    ${[16,28,40].map((y) => `<line x1="10" y1="${y+16}" x2="54" y2="${y+16}" stroke="var(--icon-cloud-shadow)" stroke-width="3" stroke-linecap="round"/>`).join('')}
  </svg>`;

  const storm = `<svg viewBox="0 0 64 64">
    <path d="M46 28H18a10 10 0 0 1-1-19.9A14 14 0 0 1 44 10.5 10 10 0 0 1 46 28Z" fill="var(--icon-cloud-shadow)"/>
    <polygon points="34,32 24,48 31,48 27,58 42,40 34,40" fill="var(--icon-sun)"/>
  </svg>`;

  const snow = `<svg viewBox="0 0 64 64">
    <path d="M46 28H18a10 10 0 0 1-1-19.9A14 14 0 0 1 44 10.5 10 10 0 0 1 46 28Z" fill="var(--icon-cloud)"/>
    ${[20,32,44].map((x) => `<circle cx="${x}" cy="46" r="2.4" fill="#e8eaed"/>`).join('')}
  </svg>`;

  if (c.includes('thunder') || c.includes('storm')) return storm;
  if (c.includes('snow') || c.includes('blizzard') || c.includes('ice')) return snow;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return rain;
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return mist;
  if (c.includes('overcast') || (c.includes('cloud') && !c.includes('partly'))) return cloudSvg;
  if (c.includes('partly') || c.includes('patchy')) return partly;
  if (c.includes('clear') || c.includes('sun')) return sun;
  return partly;
}

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Page switching
// ---------------------------------------------------------------------------
pageTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-tab');
  if (!btn) return;
  const target = btn.dataset.page;

  pageTabs.querySelectorAll('.page-tab').forEach(b => b.classList.toggle('active', b === btn));
  Object.entries(pages).forEach(([key, section]) => section.classList.toggle('active', key === target));
});

// ---------------------------------------------------------------------------
// Temperature helper
// ---------------------------------------------------------------------------
function toDisplayTemp(celsius) {
  const v = state.unit === 'C' ? celsius : (celsius * 9) / 5 + 32;
  return Math.round(v);
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

// ---------------------------------------------------------------------------
// CURRENT WEATHER PAGE — GET /weather/{city}
// ---------------------------------------------------------------------------
function renderCurrent() {
  const data = state.currentRaw;
  if (!data) return;

  currentIcon.innerHTML = iconMarkup(data.condition);
  currentTemp.textContent = `${toDisplayTemp(data.temperature)}°`;
  currentPlace.textContent = `${data.city}, ${data.region}, ${data.country}`;
  currentCondition.textContent = data.condition;
  currentLocaltime.textContent = new Date(data.localtime * 1000).toLocaleString(undefined, {
    weekday: 'long', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short',
  });
}

currentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = currentCityInput.value.trim();
  if (!city) return;

  currentError.hidden = true;
  currentEmpty.hidden = true;
  currentResult.hidden = true;

  try {
    const data = await fetchJSON(`${BASE_URL}/weather/${encodeURIComponent(city)}`);
    state.currentRaw = data;
    renderCurrent();
    currentResult.hidden = false;
  } catch (err) {
    console.error(err);
    currentError.textContent = `Couldn't load current weather for "${city}". Check the API is running at ${BASE_URL} and allows requests from this page (CORS).`;
    currentError.hidden = false;
  }
});

unitToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.unit');
  if (!btn) return;
  state.unit = btn.dataset.unit;
  unitToggle.querySelectorAll('.unit').forEach(b => b.classList.toggle('active', b === btn));
  if (state.currentRaw) renderCurrent();
});

// ---------------------------------------------------------------------------
// FORECAST PAGE — GET /weather/forecast?city=&days=
// ---------------------------------------------------------------------------
forecastForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = forecastCityInput.value.trim();
  const days = forecastDaysInput.value;
  if (!city || !days) return;

  forecastError.hidden = true;
  forecastEmpty.hidden = true;
  forecastResult.hidden = true;

  try {
    const data = await fetchJSON(`${BASE_URL}/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`);
    const w = data.weatherDTO || {};
    forecastPlace.textContent = [w.city, w.region, w.country].filter(Boolean).join(', ') || '—';
    forecastLocaltime.textContent = w.localtime
      ? new Date(w.localtime * 1000).toLocaleString(undefined, { weekday: 'long', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })
      : '—';

    const dayList = data.dayForecast || [];
    forecastDaysRow.innerHTML = dayList.map(d => `
      <div class="forecast-card">
        <div class="day-label">${formatDayLabel(d.date)}</div>
        <div class="icon-sm">${iconMarkup(d.condition?.text || '')}</div>
        <div class="condition-text">${d.condition?.text ?? '—'}</div>
        <div class="temps">
          <span class="hi">${toDisplayTemp(d.maxtemp_c)}°</span><span class="lo">${toDisplayTemp(d.mintemp_c)}°</span>
        </div>
        <div class="avg">Avg: ${toDisplayTemp(d.avgtemp_c)}°</div>
        <div class="wind">${Math.round(d.maxwind_kph)} km/h</div>
      </div>
    `).join('');

    forecastResult.hidden = false;
  } catch (err) {
    console.error(err);
    forecastError.textContent = `Couldn't load forecast for "${city}". Check the API is running at ${BASE_URL} and allows requests from this page (CORS).`;
    forecastError.hidden = false;
  }
});

// ---------------------------------------------------------------------------
// LOCATION PAGE — GET /weather/location/{city}
// ---------------------------------------------------------------------------
locationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = locationCityInput.value.trim();
  if (!city) return;

  locationError.hidden = true;
  locationEmpty.hidden = true;
  locationResult.hidden = true;

  try {
    const data = await fetchJSON(`${BASE_URL}/weather/location/${encodeURIComponent(city)}`);
    locFields.name.textContent = data.name ?? '—';
    locFields.region.textContent = data.region ?? '—';
    locFields.country.textContent = data.country ?? '—';
    locFields.lat.textContent = data.lat ?? '—';
    locFields.lon.textContent = data.lon ?? '—';
    locFields.tz.textContent = data.tz_id ?? '—';
    locFields.localtime.textContent = data.localtime ?? '—';

    locationResult.hidden = false;
  } catch (err) {
    console.error(err);
    locationError.textContent = `Couldn't load location for "${city}". Check the API is running at ${BASE_URL} and allows requests from this page (CORS).`;
    locationError.hidden = false;
  }
});

// No default fetch on load — every page starts empty until the user submits a form.