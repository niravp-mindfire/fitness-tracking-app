self.__BUILD_MANIFEST = {
  polyfillFiles: ['static/chunks/polyfills.js'],
  devFiles: ['static/chunks/react-refresh.js'],
  ampDevFiles: [],
  lowPriorityFiles: [],
  rootMainFiles: ['static/chunks/webpack.js', 'static/chunks/main-app.js'],
  rootMainFilesTree: {},
  pages: {
    '/_app': [
      'static/chunks/webpack.js',
      'static/chunks/main.js',
      'static/chunks/pages/_app.js',
    ],
    '/_error': [
      'static/chunks/webpack.js',
      'static/chunks/main.js',
      'static/chunks/pages/_error.js',
    ],
    '/exercises': [
      'static/chunks/webpack.js',
      'static/chunks/main.js',
      'static/chunks/pages/exercises.js',
    ],
    '/workout-exercise': [
      'static/chunks/webpack.js',
      'static/chunks/main.js',
      'static/chunks/pages/workout-exercise.js',
    ],
    '/workouts': [
      'static/chunks/webpack.js',
      'static/chunks/main.js',
      'static/chunks/pages/workouts.js',
    ],
  },
  ampFirstPages: [],
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
  '/static/' + process.env.__NEXT_BUILD_ID + '/_buildManifest.js',
  ,
  '/static/' + process.env.__NEXT_BUILD_ID + '/_ssgManifest.js',
];
