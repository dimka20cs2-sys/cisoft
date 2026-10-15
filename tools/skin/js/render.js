/* Skin Studio — собственный мини-рендер на WebGL (без библиотек) */
(function () {
  'use strict';
  var SS = window.SS, V = SS.V;

  // aRect — границы грани в текстуре: UV зажимается, чтобы MSAA не тянул соседние пиксели
  var VS = 'attribute vec3 aPos;attribute vec2 aUV;attribute float aShade;attribute vec4 aRect;uniform mat4 uMVP;' +
    'varying vec2 vUV;varying float vShade;varying vec4 vRect;' +
    'void main(){vUV=aUV;vShade=aShade;vRect=aRect;gl_Position=uMVP*vec4(aPos,1.0);}';
  var FS = 'precision mediump float;uniform sampler2D uTex;uniform int uMode;uniform vec4 uColor;' +
    'varying vec2 vUV;varying float vShade;varying vec4 vRect;' +
    'void main(){if(uMode==1){gl_FragColor=uColor;return;}' +
    'if(uMode==2){float d=length(vUV*2.0-1.0);gl_FragColor=vec4(0.0,0.0,0.0,0.38*(1.0-smoothstep(0.15,1.0,d)));return;}' +
    'vec4 c=texture2D(uTex,clamp(vUV,vRect.xy,vRect.zw));if(c.a<0.5)discard;gl_FragColor=vec4(c.rgb*vShade,1.0);}';

  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function lookAt(eye, target, up) {
    var z = V.norm(V.sub(eye, target)), x = V.norm(V.cross(up, z)), y = V.cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
      -V.dot(x, eye), -V.dot(y, eye), -V.dot(z, eye), 1];
  }
  function mul4(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      var s = 0;
      for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
    return o;
  }
  var L1 = V.norm([0.35, 0.9, 0.6]), L2 = V.norm([-0.6, 0.1, -0.7]);
  function shade(n) {
    var nn = V.norm(n);
    return Math.min(1, 0.5 + 0.5 * Math.max(0, V.dot(nn, L1)) + 0.14 * Math.max(0, V.dot(nn, L2)));
  }

  function Renderer(canvas) {
    this.canvas = canvas;
    this.cam = { yaw: 0.55, pitch: 0.12, dist: 64, target: [0, 16.5, 0], fov: 40 * Math.PI / 180 };
    var o = { alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true };
    var gl = this.gl = canvas.getContext('webgl', o) || canvas.getContext('experimental-webgl', o);
    if (!gl) { this.ok = false; return; }
    this.ok = true;
    var p = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]].forEach(function (s) {
      var sh = gl.createShader(s[0]);
      gl.shaderSource(sh, s[1]); gl.compileShader(sh); gl.attachShader(p, sh);
    });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { this.ok = false; return; }
    gl.useProgram(p);
    this.loc = {
      pos: gl.getAttribLocation(p, 'aPos'), uv: gl.getAttribLocation(p, 'aUV'), sh: gl.getAttribLocation(p, 'aShade'), rc: gl.getAttribLocation(p, 'aRect'),
      mvp: gl.getUniformLocation(p, 'uMVP'), mode: gl.getUniformLocation(p, 'uMode'), color: gl.getUniformLocation(p, 'uColor')
    };
    this.buf = gl.createBuffer();
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.texVersion = -1;
  }
  var R = Renderer.prototype;

  R.eye = function () {
    var c = this.cam, cp = Math.cos(c.pitch);
    return [c.target[0] + c.dist * cp * Math.sin(c.yaw), c.target[1] + c.dist * Math.sin(c.pitch),
      c.target[2] + c.dist * cp * Math.cos(c.yaw)];
  };
  R.resize = function () {
    var c = this.canvas, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(c.clientWidth * dpr)), h = Math.max(1, Math.round(c.clientHeight * dpr));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  };
  // Луч из точки экрана (CSS px относительно canvas)
  R.ray = function (cx, cy) {
    var c = this.canvas, w = c.clientWidth, h = c.clientHeight, eye = this.eye();
    var f = V.norm(V.sub(this.cam.target, eye)), r = V.norm(V.cross(f, [0, 1, 0])), u = V.cross(r, f);
    var th = Math.tan(this.cam.fov / 2), x = (cx / w) * 2 - 1, y = 1 - (cy / h) * 2;
    var d = V.add(f, V.add(V.mul(r, x * th * (w / h)), V.mul(u, y * th)));
    return { o: eye, d: V.norm(d) };
  };

  R.push = function (arr, a, b, c, d, uv, s) {
    var P = [a, b, c, a, c, d], T = [[uv[0], uv[1]], [uv[2], uv[1]], [uv[2], uv[3]], [uv[0], uv[1]], [uv[2], uv[3]], [uv[0], uv[3]]];
    for (var i = 0; i < 6; i++) arr.push(P[i][0], P[i][1], P[i][2], T[i][0], T[i][1], s, uv[0], uv[1], uv[2], uv[3]);
  };
  R.drawArr = function (arr, mode, color) {
    var gl = this.gl, L = this.loc;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(L.pos); gl.vertexAttribPointer(L.pos, 3, gl.FLOAT, false, 40, 0);
    gl.enableVertexAttribArray(L.uv); gl.vertexAttribPointer(L.uv, 2, gl.FLOAT, false, 40, 12);
    gl.enableVertexAttribArray(L.sh); gl.vertexAttribPointer(L.sh, 1, gl.FLOAT, false, 40, 20);
    if (L.rc >= 0) { gl.enableVertexAttribArray(L.rc); gl.vertexAttribPointer(L.rc, 4, gl.FLOAT, false, 40, 24); }
    gl.uniform1i(L.mode, mode);
    if (color) gl.uniform4fv(L.color, color);
    gl.drawArrays(gl.TRIANGLES, 0, arr.length / 10);
  };

  // faces — из SS.buildFaces; hi — четырёхугольник подсветки
  R.draw = function (faces, skin, hi, shadow) {
    if (!this.ok) return;
    var gl = this.gl, c = this.canvas;
    gl.viewport(0, 0, c.width, c.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (skin.version !== this.texVersion) {
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skin.canvas);
      this.texVersion = skin.version;
    }
    var proj = perspective(this.cam.fov, c.width / c.height, 1, 500);
    gl.uniformMatrix4fv(this.loc.mvp, false, new Float32Array(mul4(proj, lookAt(this.eye(), this.cam.target, [0, 1, 0]))));
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (shadow !== false) {
      gl.depthMask(false);
      var sh = [];
      this.push(sh, [-10, 0.02, -7], [10, 0.02, -7], [10, 0.02, 7], [-10, 0.02, 7], [0, 0, 1, 1], 1);
      this.drawArr(sh, 2);
      gl.depthMask(true);
    }
    gl.disable(gl.BLEND);
    var arr = [], e = 0.02 / 64;
    for (var i = 0; i < faces.length; i++) {
      var f = faces[i], r = f.rect, b = V.add(f.p0, f.eu);
      this.push(arr, f.p0, b, V.add(b, f.ev), V.add(f.p0, f.ev),
        [r[0] / 64 + e, r[1] / 64 + e, (r[0] + r[2]) / 64 - e, (r[1] + r[3]) / 64 - e], shade(f.n));
    }
    if (arr.length) this.drawArr(arr, 0);
    if (hi) {
      gl.enable(gl.BLEND);
      gl.depthFunc(gl.LEQUAL);
      var q = [];
      this.push(q, hi[0], hi[1], hi[2], hi[3], [0, 0, 1, 1], 1);
      this.drawArr(q, 1, [1, 1, 1, 0.45]);
      gl.depthFunc(gl.LESS);
    }
  };

  // Фон (общий для живого вида, скриншота и обложки)
  SS.paintBg = function (ctx, w, h, mode) {
    var g;
    if (mode === 'light') {
      g = ctx.createRadialGradient(w / 2, h * 0.35, 10, w / 2, h * 0.5, Math.max(w, h) * 0.8);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d6dce7');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    } else if (mode === 'checker') {
      var s = Math.max(12, Math.round(Math.min(w, h) / 32));
      ctx.fillStyle = '#2c2f39'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#3a3e4a';
      for (var y = 0; y < h; y += s) for (var x = ((y / s) % 2) * s; x < w; x += 2 * s) ctx.fillRect(x, y, s, s);
    } else if (mode === 'grass') {
      var hz = Math.round(h * 0.64);
      g = ctx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, '#6aa9f5'); g.addColorStop(1, '#cfe6ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hz);
      g = ctx.createLinearGradient(0, hz, 0, h);
      g.addColorStop(0, '#6dbb45'); g.addColorStop(1, '#3f7f2a');
      ctx.fillStyle = g; ctx.fillRect(0, hz, w, h - hz);
      var seed = 7, bs = Math.max(6, Math.round(w / 90));
      for (var i = 0; i < 260; i++) {
        seed = (seed * 16807) % 2147483647;
        var gx = (seed % 1000) / 1000 * w; seed = (seed * 16807) % 2147483647;
        var gy = hz + (seed % 1000) / 1000 * (h - hz);
        ctx.fillStyle = i % 3 ? 'rgba(40,90,25,0.35)' : 'rgba(150,220,100,0.3)';
        ctx.fillRect(Math.round(gx / bs) * bs, Math.round(gy / bs) * bs, bs, bs);
      }
    } else {
      g = ctx.createRadialGradient(w / 2, h * 0.38, 10, w / 2, h * 0.5, Math.max(w, h) * 0.75);
      g.addColorStop(0, '#262a36'); g.addColorStop(1, '#111217');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
  };

  SS.Renderer = Renderer;
})();
