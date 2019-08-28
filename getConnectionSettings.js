function getConnectionSettings(opts = {}) {
  const settings = {
    'slow-2g': {
      ads: false,
      audio: false,
      css: false,
      img: false,
      js: false,
      tracking: false,
      video: false,
    },
    '2g': {
      ads: false,
      audio: false,
      css: {
        type: 'enhanced'
      },
      img: {
        resolution: 'sd',
        fileTypes: ['lossy'],
      },
      js: {
        type: 'enhanced',
      },
      tracking: {
        analytics: true,
        ads: false,
      },
      video: false,
    },
    '3g': {
      ads: false,
      css: {
        type: 'enhanced'
      },
      img: {
        resolution: 'hd',
        fileTypes: ['lossy', 'lossless', 'animated'],
      },
      js: {
        type: 'app',
      },
      tracking: {
        analytics: true,
        ads: false,
      },
      video: {
        resolution: 'sd'
      },
    },
    '4g': {
      ads: false,
      css: {
        type: 'app'
      },
      img: {
        resolution: 'hd',
        fileTypes: ['lossy', 'lossless', 'animated'],
      },
      js: {
        type: 'app',
      },
      tracking: {
        analytics: true,
        ads: false,
      },
      video: {
        resolution: 'hd'
      },
    },
  };

  if (opts.ads === '3g') {
    settings['3g'].ads = true;
    settings['4g'].ads = true;
  } else if (opts.ads) {
    settings['4g'].ads = true;
  }

  if (opts.adTracking === '3g') {
    settings['3g'].tracking.ads = true;
    settings['4g'].tracking.ads = true;
  } else if (opts.adTracking) {
    settings['4g'].tracking.ads = true;
  }

  if (opts.analytics) {
    switch(opts.analytics) {
      case '2g': {
        settings['2g'].tracking.analytics = true;
        settings['3g'].tracking.analytics = true;
        settings['4g'].tracking.analytics = true;
        break;
      }
      case '3g': {
        settings['2g'].tracking.analytics = false;
        settings['3g'].tracking.analytics = true;
        settings['4g'].tracking.analytics = true;
        break;
      }
      case '4g': {
        settings['2g'].tracking.analytics = false;
        settings['3g'].tracking.analytics = false;
        settings['4g'].tracking.analytics = true;
        break;
      }
    }
  } else if (opts.analytics === false) {
    settings['2g'].tracking.analytics = false;
    settings['3g'].tracking.analytics = false;
    settings['4g'].tracking.analytics = false;
  }

  if (opts.hdVideo === false) {
    settings['4g'].video.resolution = 'sd';
  }

  if (opts.js === false) {
    settings['2g'].js = false;
    settings['3g'].js = false;
    settings['4g'].js = false;
  }

  return settings;
}

module.exports = getConnectionSettings;
