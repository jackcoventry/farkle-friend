const lighthouseConfig = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
      },
      startServerCommand: 'PORT=4173 HOST=127.0.0.1 npm run preview',
      startServerReadyPattern: 'Serving',
      startServerReadyTimeout: 120000,
      url: ['http://127.0.0.1:4173/', 'http://127.0.0.1:4173/game/'],
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:pwa': ['warn', { minScore: 0.75 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

export default lighthouseConfig;
