// Tests for Hinode server backend services and routes
import request from 'supertest';

// Set required env variables for authentication and external APIs (mocked)
process.env.SERVER_CLIENT_TOKEN = 'test-token';
process.env.OPENWEATHER_API_KEY = 'test-key';
process.env.UNSPLASH_ACCESS_KEY = 'test-key';

// Mock external dependencies before importing the app
jest.mock('./services/shayari.service', () => ({
  getRandomShayari: jest.fn(),
}));

jest.mock('./db/db', () => ({
  db: {
    run: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('./services/weather.service', () => ({
  getCurrentWeather: jest.fn(),
}));

jest.mock('./services/background.service', () => ({
  getBackground: jest.fn(),
}));

jest.mock('./services/home.service', () => ({
  getHomePayload: jest.fn(),
}));

// Import the app after mocks are in place
import app from './index';

// Import the mocked modules for configuring return values
const { getRandomShayari } = require('./services/shayari.service');
const { db } = require('./db/db');
const { getCurrentWeather } = require('./services/weather.service');
const { getBackground } = require('./services/background.service');
const { getHomePayload } = require('./services/home.service');

describe('Health route', () => {
  it('should respond with ok true', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

describe('Shayari routes', () => {
  const token = process.env.SERVER_CLIENT_TOKEN as string;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/shayari/random returns 404 when no shayari', async () => {
    (getRandomShayari as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/shayari/random');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'No shayari found' });
  });

  it('GET /api/shayari/random returns shayari when present', async () => {
    (getRandomShayari as jest.Mock).mockResolvedValue({ id: '1', text: 'test', language: 'en' });
    const res = await request(app).get('/api/shayari/random');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ shayari: { id: '1', text: 'test', language: 'en' } });
  });

  it('POST /api/shayari creates shayari and returns 201', async () => {
    // db.run should call callback with null error indicating success
    (db.run as jest.Mock).mockImplementation((_sql: string, _params: any[], cb: (err: any) => void) => cb(null));
    const payload = { id: 'abc', text: 'sample', language: 'en' };
    const res = await request(app)
      .post('/api/shayari')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: payload.id });
  });

  it('POST /api/shayari duplicate ID returns 409', async () => {
    const err: any = new Error('constraint');
    err.code = 'SQLITE_CONSTRAINT';
    (db.run as jest.Mock).mockImplementation((_sql: string, _params: any[], cb: (err: any) => void) => cb(err));
    const payload = { id: 'dup', text: 'dup', language: 'en' };
    const res = await request(app)
      .post('/api/shayari')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Shayari with this ID already exists' });
  });
});

describe('Weather route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/weather/current returns weather data', async () => {
    const sampleWeather = {
      temperature: 22,
      humidity: 55,
      windSpeed: 4,
      condition: 'Clouds',
      icon: '02d',
      cityName: 'Sample City',
    };
    (getCurrentWeather as jest.Mock).mockResolvedValue(sampleWeather);
    const res = await request(app).get('/api/weather/current?lat=0&lon=0&unit=metric');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ weather: sampleWeather });
  });
});

describe('Background routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/background/today returns background', async () => {
    const sampleBg = { image_url: 'https://example.com/today.jpg', query: 'nature' };
    (getBackground as jest.Mock).mockResolvedValue(sampleBg);
    const res = await request(app).get('/api/background/today?query=mountain');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ background: sampleBg });
  });

  it('GET /api/background/random returns random background', async () => {
    const sampleBg = { image_url: 'https://example.com/random.jpg', query: 'nature' };
    (getBackground as jest.Mock).mockResolvedValue(sampleBg);
    const res = await request(app).get('/api/background/random?query=sea');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ background: sampleBg });
  });
});

describe('Home route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/home returns combined payload', async () => {
    const samplePayload = {
      weather: { temperature: 20, humidity: 50, windSpeed: 5, condition: 'Clear', icon: '01d', cityName: 'Test City' },
      background: { image_url: 'https://example.com/bg.jpg', query: 'nature' },
      shayari: { id: '1', text: 'test', language: 'en' },
      serverTime: new Date().toISOString(),
    };
    (getHomePayload as jest.Mock).mockResolvedValue(samplePayload);
    const res = await request(app).get('/api/home?lat=0&lon=0&backgroundQuery=sky');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      weather: expect.any(Object),
      background: expect.any(Object),
      shayari: expect.any(Object),
      serverTime: expect.any(String),
    });
  });
});

describe('Home service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should combine weather, background and shayari payloads', async () => {
    (getCurrentWeather as jest.Mock).mockResolvedValue({
      temperature: 20,
      humidity: 50,
      windSpeed: 5,
      condition: 'Clear',
      icon: '01d',
      cityName: 'Test City',
    });
    (getBackground as jest.Mock).mockResolvedValue({
      image_url: 'https://example.com/img.jpg',
      query: 'nature',
    });
    (getRandomShayari as jest.Mock).mockResolvedValue({ id: '1', text: 'test', language: 'en' });

    const payload = await getHomePayload({ lat: 0, lon: 0, backgroundQuery: 'nature' });
    expect(payload).toMatchObject({
      weather: expect.objectContaining({ temperature: 20 }),
      background: expect.objectContaining({ image_url: expect.any(String) }),
      shayari: expect.objectContaining({ id: '1' }),
    });
    expect(payload.serverTime).toBeDefined();
  });
});
