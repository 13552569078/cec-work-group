export default [
  {
    'id': 'gl-draw-symbol-inactive',
    'type': 'symbol',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'user_display-type', 'symbol'],
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'text-color': ['get', 'user_text-color'],
    },
    'layout': {
      'text-allow-overlap': true,
      'icon-allow-overlap': true,
      'text-size': ['get', 'user_text-size'],
      'icon-image': ['get', 'user_image-id'],
      'icon-size': ['get', 'user_icon-size'],
      'text-field': ['get', 'user_text'],
      'text-font': ['Open Sans Regular']
    }
  },
  {
    'id': 'gl-draw-symbol-active',
    'type': 'symbol',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'user_display-type', 'symbol'],
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['==', 'meta', 'feature']
    ],
    'paint': {
      'text-color': ['get', 'user_text-color'],
    },
    'layout': {
      'text-allow-overlap': true,
      'icon-allow-overlap': true,
      'text-size': ['get', 'user_text-size'],
      'icon-image': ['get', 'user_image-id'],
      'icon-size': ['get', 'user_icon-size'],
      'text-field': ['get', 'user_text'],
      'text-font': ['Open Sans Regular']
    }
  },
  {
    'id': 'gl-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'fill-color': ['get', 'user_fill-color'],
      'fill-outline-color': ['get', 'user_line-color'],
      'fill-opacity': ['get', 'user_opacity']
    },
  },
  {
    'id': 'gl-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': ['get', 'user_fill-color'],
      'fill-outline-color': ['get', 'user_line-color'],
      'fill-opacity': ['get', 'user_opacity']
    },
  },
  {
    'id': 'gl-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': ['get', 'user_line-color'],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': ['get', 'user_line-color'],
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': ['get', 'user_line-color'],
      'line-width': ['get', 'user_line-width'],
      'line-opacity': ['get', 'user_opacity'],
    }
  },
  {
    'id': 'gl-draw-line-active',
    'type': 'line',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-dasharray': [0.2, 2],
      'line-color': ['get', 'user_line-color'],
      'line-width': 18,
      'line-opacity': 1,
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['!has', 'user_display-type'],
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['!has', 'user_display-type'],
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#3bb2d0'
    }
  },
  {
    'id': 'gl-draw-point-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['!=', 'user_visible', false],
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-polygon-fill-static',
    'type': 'fill',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#404040',
      'fill-outline-color': '#404040',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-static',
    'type': 'line',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-static',
    'type': 'line',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-point-static',
    'type': 'circle',
    'filter': ['all', ['!=', 'user_visible', false], ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#404040'
    }
  },
];
