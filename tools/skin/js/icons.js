/* Skin Studio — иконки (inline SVG, stroke) */
(function () {
  'use strict';
  var P = {
    open: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
    help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01',
    hand: 'M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7 6 6 0 0 1-5-3l-2.5-4.5a1.5 1.5 0 0 1 2.6-1.5L8 15',
    pencil: 'M4 20l4-1 11-11-3-3L5 16zM14 7l3 3',
    eraser: 'M8 20h12M5 15l9-9 5 5-8 8H8z M10 10l5 5',
    fill: 'M5 11l7-7 7 7-7 7zM5 11h14M20 15s2 2.5 2 3.5a2 2 0 0 1-4 0c0-1 2-3.5 2-3.5z',
    picker: 'M15 4l5 5-2 2-5-5zM13 6l-8 8v5h5l8-8M7 17h.01',
    line: 'M5 19L19 5M4 18a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0M17 6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0',
    darken: 'M12 21a9 9 0 1 0 0-18zM12 3a9 9 0 0 1 0 18',
    lighten: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    noise: 'M5 5h3v3H5zM11 5h3v3h-3zM17 5h2v3h-2zM8 11h3v3H8zM14 11h3v3h-3zM5 17h3v2H5zM11 17h3v2h-3zM17 14h2v5h-2z',
    mirror: 'M12 3v18M9 7L4 12l5 5zM15 7l5 5-5 5z',
    grid: 'M4 4h16v16H4zM4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16',
    undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
    redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
    camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    target: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 2v4M12 18v4M2 12h4M18 12h4'
  };
  window.SS.icon = function (name) {
    var d = P[name];
    if (!d) return '';
    var fill = name === 'darken' ? '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>' : '';
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/>' + fill + '</svg>';
  };
})();
