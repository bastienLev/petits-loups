/*
 * Petits Loups — les jeux du grand (3-4 ans). JavaScript ES5 pour Safari 9.
 * Memory, Les ombres, Le tri des couleurs, Le chemin de l'abeille.
 */
(function () {
  'use strict';

  var PL = window.PetitsLoups;
  var zone = document.getElementById('jeu-zone');
  var jeuCourant = null;   // fonction qui relance une manche du jeu ouvert
  var niveau = 0;
  var minuteries = [];

  function $(id) { return document.getElementById(id); }
  function plusTard(fn, ms) { minuteries.push(setTimeout(fn, ms)); }
  function nettoyer() {
    minuteries.forEach(function (id) { clearTimeout(id); });
    minuteries = [];
    zone.innerHTML = '';
    zone.ontouchstart = zone.ontouchmove = zone.ontouchend = null;
    zone.onmousedown = zone.onmousemove = zone.onmouseup = null;
  }
  function melanger(t) {
    var a = t.slice(), i, j, x;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function el(tag, classe, html) {
    var e = document.createElement(tag);
    if (classe) { e.className = classe; }
    if (html) { e.innerHTML = html; }
    return e;
  }
  function placer(e, x, y) {
    e.style.left = x + 'px';
    e.style.top = y + 'px';
  }
  function largeur() { return zone.offsetWidth; }
  function hauteur() { return zone.offsetHeight; }

  /* ---------- Sons ---------- */
  function tic() { PL.note(880, 0, 0.15, 0.15); }
  function ding() { PL.note(1046.5, 0, 0.4, 0.3); PL.note(1318.5, 0, 0.4, 0.2); }
  function oups() { PL.note(220, 0, 0.3, 0.2); }
  function fanfare() {
    var t = PL.maintenant(), n = [523.25, 659.25, 783.99, 1046.5];
    n.forEach(function (f, i) { PL.note(f, t + i * 0.12, 0.5, 0.3); });
  }

  // « Bravo ! » puis une nouvelle manche, un peu plus difficile.
  function bravo() {
    fanfare();
    var b = el('div', 'bravo', '⭐<br>Bravo !');
    zone.appendChild(b);
    plusTard(function () { niveau++; if (jeuCourant) { jeuCourant(); } }, 2200);
  }

  /* ---------- Glisser-déposer au doigt (et à la souris pour tester) ---------- */
  function point(e) {
    var t = e.changedTouches ? e.changedTouches[0] : e;
    var r = zone.getBoundingClientRect();
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  // pieces : éléments déplaçables ; lacher(piece, x, y) renvoie true si la pièce est bien placée.
  function rendreDeplacable(pieces, lacher) {
    var tenue = null, dx = 0, dy = 0, depart = null;
    function prendre(e) {
      var cible = e.target;
      while (cible && cible !== zone && pieces.indexOf(cible) < 0) { cible = cible.parentNode; }
      if (!cible || cible === zone || cible.getAttribute('data-place')) { return; }
      e.preventDefault();
      PL.preparerAudio();
      var p = point(e);
      tenue = cible;
      depart = { x: cible.offsetLeft, y: cible.offsetTop };
      dx = p.x - cible.offsetLeft;
      dy = p.y - cible.offsetTop;
      tenue.className += ' tenue';
      tic();
    }
    function bouger(e) {
      if (!tenue) { return; }
      e.preventDefault();
      var p = point(e);
      placer(tenue, p.x - dx, p.y - dy);
    }
    function poser(e) {
      if (!tenue) { return; }
      var p = point(e), piece = tenue;
      tenue = null;
      piece.className = piece.className.replace(' tenue', '');
      var cx = piece.offsetLeft + piece.offsetWidth / 2, cy = piece.offsetTop + piece.offsetHeight / 2;
      if (!lacher(piece, cx, cy)) {
        oups();
        piece.className += ' retour-anime';
        placer(piece, depart.x, depart.y);
        setTimeout(function () { piece.className = piece.className.replace(' retour-anime', ''); }, 300);
      }
    }
    zone.ontouchstart = prendre; zone.ontouchmove = bouger; zone.ontouchend = poser;
    zone.onmousedown = prendre; zone.onmousemove = bouger; zone.onmouseup = poser;
  }
  function centre(e) { return { x: e.offsetLeft + e.offsetWidth / 2, y: e.offsetTop + e.offsetHeight / 2 }; }
  function proche(a, x, y, rayon) {
    var c = centre(a);
    return Math.abs(c.x - x) < rayon && Math.abs(c.y - y) < rayon;
  }

  /* ---------- 1. Memory ---------- */
  var ANIMAUX = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐷', '🐵', '🐮', '🐔', '🐧'];
  function memory() {
    nettoyer();
    var paires = [3, 4, 6][Math.min(niveau, 2)];
    var choix = melanger(ANIMAUX).slice(0, paires);
    var cartes = melanger(choix.concat(choix));
    var colonnes = paires === 3 ? 3 : 4;
    var taille = paires === 6 ? 140 : 160, ecart = 24;
    var lignes = Math.ceil(cartes.length / colonnes);
    var x0 = (largeur() - (colonnes * taille + (colonnes - 1) * ecart)) / 2;
    var y0 = (hauteur() - (lignes * taille + (lignes - 1) * ecart)) / 2;
    var ouvertes = [], trouvees = 0, bloque = false;

    cartes.forEach(function (animal, i) {
      var c = el('button', 'carte-memory', '<span>' + animal + '</span>');
      c.style.width = c.style.height = taille + 'px';
      c.style.fontSize = Math.round(taille * 0.6) + 'px';
      c.style.lineHeight = taille + 'px';
      placer(c, x0 + (i % colonnes) * (taille + ecart), y0 + Math.floor(i / colonnes) * (taille + ecart));
      c.onclick = function () {
        PL.preparerAudio();
        if (bloque || c.className.indexOf('ouverte') >= 0) { return; }
        c.className = 'carte-memory ouverte';
        tic();
        ouvertes.push({ c: c, a: animal });
        if (ouvertes.length < 2) { return; }
        var a = ouvertes[0], b = ouvertes[1];
        ouvertes = [];
        if (a.a === b.a) {
          trouvees++;
          plusTard(function () {
            a.c.className = b.c.className = 'carte-memory ouverte trouvee';
            ding();
            if (trouvees === paires) { plusTard(bravo, 500); }
          }, 300);
        } else {
          bloque = true;
          plusTard(function () {
            a.c.className = b.c.className = 'carte-memory';
            bloque = false;
          }, 1000);
        }
      };
      zone.appendChild(c);
    });
  }

  /* ---------- 2. Les ombres ---------- */
  var OBJETS = ['🐘', '🐢', '🐟', '🐝', '🌵', '🍎', '🍌', '⛄', '🚗', '🏠', '🐳', '🐌', '🍓', '🌻', '⚽', '🎈'];
  function ombres() {
    nettoyer();
    var nb = [3, 4, 5][Math.min(niveau, 2)];
    var choix = melanger(OBJETS).slice(0, nb);
    var pas = largeur() / nb, places = 0;
    var cibles = [], pieces = [];
    melanger(choix).forEach(function (o, i) {
      var c = el('div', 'ombre', o);
      c.setAttribute('data-objet', o);
      placer(c, pas * i + pas / 2 - 60, hauteur() - 190);
      zone.appendChild(c);
      cibles.push(c);
    });
    choix.forEach(function (o, i) {
      var p = el('div', 'piece-ombre', o);
      p.setAttribute('data-objet', o);
      placer(p, pas * i + pas / 2 - 60, 40);
      zone.appendChild(p);
      pieces.push(p);
    });
    rendreDeplacable(pieces, function (piece, x, y) {
      for (var i = 0; i < cibles.length; i++) {
        var c = cibles[i];
        if (c.getAttribute('data-objet') === piece.getAttribute('data-objet') && proche(c, x, y, 90)) {
          placer(piece, c.offsetLeft, c.offsetTop);
          piece.setAttribute('data-place', '1');
          c.className = 'ombre remplie';
          ding();
          places++;
          if (places === nb) { plusTard(bravo, 500); }
          return true;
        }
      }
      return false;
    });
  }

  /* ---------- 3. Le tri des couleurs ---------- */
  var COULEURS = [
    { nom: 'rouge', c: '#ff6b6b', f: 'rgba(255,107,107,0.2)' }, { nom: 'bleu', c: '#4dabf7', f: 'rgba(77,171,247,0.2)' },
    { nom: 'jaune', c: '#ffd43b', f: 'rgba(255,212,59,0.25)' }, { nom: 'vert', c: '#69db7c', f: 'rgba(105,219,124,0.2)' }
  ];
  function triCouleurs() {
    nettoyer();
    var nbCouleurs = niveau === 0 ? 2 : (niveau === 1 ? 3 : 4);
    var parCouleur = niveau === 0 ? 2 : 3;
    var couleurs = melanger(COULEURS).slice(0, nbCouleurs);
    var paniers = [], pieces = [], ranges = 0, total = nbCouleurs * parCouleur;
    var pas = largeur() / nbCouleurs;
    couleurs.forEach(function (co, i) {
      var p = el('div', 'panier');
      p.style.borderColor = co.c;
      p.style.backgroundColor = co.f;
      p.setAttribute('data-couleur', co.nom);
      placer(p, pas * i + pas / 2 - 100, hauteur() - 210);
      zone.appendChild(p);
      paniers.push(p);
    });
    var formes = [];
    couleurs.forEach(function (co) {
      for (var k = 0; k < parCouleur; k++) { formes.push(co); }
    });
    melanger(formes).forEach(function (co, i) {
      var f = el('div', 'forme ' + (['rond', 'carre', 'goutte'][i % 3]));
      f.style.backgroundColor = co.c;
      f.setAttribute('data-couleur', co.nom);
      var colonnes = Math.ceil(total / 2);
      var pasF = largeur() / colonnes;
      placer(f, pasF * (i % colonnes) + pasF / 2 - 45 + (Math.random() * 30 - 15), 30 + Math.floor(i / colonnes) * 130);
      zone.appendChild(f);
      pieces.push(f);
    });
    rendreDeplacable(pieces, function (piece, x, y) {
      for (var i = 0; i < paniers.length; i++) {
        var p = paniers[i];
        if (proche(p, x, y, 110)) {
          if (p.getAttribute('data-couleur') !== piece.getAttribute('data-couleur')) { return false; }
          var dedans = parseInt(p.getAttribute('data-n') || '0', 10);
          p.setAttribute('data-n', dedans + 1);
          placer(piece, p.offsetLeft + 15 + (dedans % 2) * 85, p.offsetTop + 10 + Math.floor(dedans / 2) * 60);
          piece.className += ' rangee';
          piece.setAttribute('data-place', '1');
          ding();
          ranges++;
          if (ranges === total) { plusTard(bravo, 500); }
          return true;
        }
      }
      return false;
    });
  }

  /* ---------- 4. Le chemin de l'abeille ---------- */
  function chemin() {
    nettoyer();
    var L = largeur(), H = hauteur();
    var canvas = el('canvas', 'toile');
    canvas.width = L; canvas.height = H;
    zone.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var vagues = 1 + Math.min(niveau, 3) * 0.5, amplitude = H * (0.18 + Math.min(niveau, 3) * 0.04);
    var pts = [], i, n = 120;
    for (i = 0; i <= n; i++) {
      var x = 90 + (L - 180) * i / n;
      pts.push({ x: x, y: H / 2 + Math.sin(i / n * Math.PI * 2 * vagues) * amplitude });
    }
    var progres = 0, largeurRoute = 90 - Math.min(niveau, 3) * 10;
    var abeille = el('div', 'acteur', '🐝'), fleur = el('div', 'acteur', '🌸');
    zone.appendChild(abeille); zone.appendChild(fleur);
    function poser(e, p) { placer(e, p.x - 40, p.y - 40); }
    poser(fleur, pts[n]);

    function dessiner() {
      ctx.clearRect(0, 0, L, H);
      ctx.lineCap = ctx.lineJoin = 'round';
      function trace(jusqua, couleur, epaisseur) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var k = 1; k <= jusqua; k++) { ctx.lineTo(pts[k].x, pts[k].y); }
        ctx.strokeStyle = couleur; ctx.lineWidth = epaisseur; ctx.stroke();
      }
      trace(n, '#e9d8b4', largeurRoute);
      trace(n, '#f8f0dc', largeurRoute - 14);
      if (progres > 0) { trace(progres, '#ffd43b', largeurRoute - 30); }
      poser(abeille, pts[progres]);
    }
    dessiner();

    var actif = false, fini = false, dernierSon = 0;
    function suivre(e) {
      if (fini) { return; }
      e.preventDefault();
      PL.preparerAudio();
      var p = point(e), k, meilleur = -1, dist;
      // On ne cherche que juste devant l'abeille : impossible de « sauter » le chemin.
      for (k = progres; k <= Math.min(n, progres + 8); k++) {
        dist = Math.sqrt(Math.pow(pts[k].x - p.x, 2) + Math.pow(pts[k].y - p.y, 2));
        if (dist < largeurRoute * 0.8) { meilleur = k; }
      }
      if (meilleur > progres) {
        progres = meilleur;
        if (progres - dernierSon >= 10) { dernierSon = progres; PL.note(392 + progres * 4, 0, 0.2, 0.12); }
        dessiner();
        if (progres >= n) { fini = true; ding(); plusTard(bravo, 400); }
      }
    }
    zone.ontouchstart = function (e) { actif = true; suivre(e); };
    zone.ontouchmove = function (e) { if (actif) { suivre(e); } };
    zone.ontouchend = function () { actif = false; };
    zone.onmousedown = function (e) { actif = true; suivre(e); };
    zone.onmousemove = function (e) { if (actif) { suivre(e); } };
    zone.onmouseup = function () { actif = false; };
  }

  /* ---------- Ouverture d'un jeu ---------- */
  var JEUX = {
    memory: { titre: 'Memory', fn: memory },
    ombres: { titre: 'Les ombres', fn: ombres },
    couleurs: { titre: 'Les couleurs', fn: triCouleurs },
    chemin: { titre: 'Le chemin', fn: chemin }
  };
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.getAttribute && t.getAttribute('data-jeu')) {
        var j = JEUX[t.getAttribute('data-jeu')];
        PL.aller('jeu', function () {
          $('jeu-titre').textContent = j.titre;
          niveau = 0;
          jeuCourant = j.fn;
        }, function () { j.fn(); });
        return;
      }
      t = t.parentNode;
    }
  }, false);
  // En quittant la vue, on arrête les minuteries du jeu.
  PL.quandOnQuitte = function () { nettoyer(); jeuCourant = null; };
})();
