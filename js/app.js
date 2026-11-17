/*
 * Petits Loups — écrit en JavaScript ES5 pour Safari 9 (iPad 2, iOS 9.3.5).
 * Pas de let/const, pas de fonctions fléchées, pas de fetch, pas de Promise.
 */
(function () {
  'use strict';

  /* ---------- Petits utilitaires ---------- */
  function $(id) { return document.getElementById(id); }
  function tous(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function texte(id, t) { $(id).textContent = t; }

  // localStorage peut lever une erreur en navigation privée sur iOS 9.
  var memoireSecours = {};
  function lire(cle) {
    try { return window.localStorage.getItem(cle); } catch (e) { return memoireSecours[cle] || null; }
  }
  function ecrire(cle, valeur) {
    memoireSecours[cle] = valeur;
    try {
      if (valeur === null) { window.localStorage.removeItem(cle); }
      else { window.localStorage.setItem(cle, valeur); }
    } catch (e) { /* on garde la copie en mémoire */ }
  }

  // Empêche le zoom / défilement élastique de la page entière.
  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  /* ---------- Son (Web Audio, préfixé webkit sur iOS 9) ---------- */
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audio = null;
  var sonsActifs = [];
  var minuteriesSon = [];   // setTimeout liés à la lecture en cours
  var sonCoupe = false;
  var lecture = 0;          // change à chaque arrêt : les rappels périmés s'ignorent

  function preparerAudio() {
    if (audio || !AudioCtx) { return; }
    audio = new AudioCtx();
    // iOS ne joue du son qu'après un geste : on « débloque » avec un son muet.
    var tampon = audio.createBuffer(1, 1, 22050);
    var source = audio.createBufferSource();
    source.buffer = tampon;
    source.connect(audio.destination);
    if (source.start) { source.start(0); } else { source.noteOn(0); }
  }
  document.addEventListener('touchend', preparerAudio, false);
  document.addEventListener('mousedown', preparerAudio, false);

  function plusTard(fn, ms) {
    var id = setTimeout(fn, ms);
    minuteriesSon.push(id);
    return id;
  }

  // Une note de boîte à musique : son doux qui s'éteint tout seul.
  function note(freq, quand, duree, volume) {
    if (!audio || sonCoupe) { return; }
    var t = quand || audio.currentTime;
    var fin = t + Math.max(duree, 0.6) + 0.8;
    [[1, volume || 0.35], [2, (volume || 0.35) * 0.25]].forEach(function (h) {
      var osc = audio.createOscillator();
      var gain = audio.createGain ? audio.createGain() : audio.createGainNode();
      osc.type = 'sine';
      osc.frequency.value = freq * h[0];
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(h[1], t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, fin);
      osc.connect(gain);
      gain.connect(audio.destination);
      if (osc.start) { osc.start(t); osc.stop(fin + 0.05); }
      else { osc.noteOn(t); osc.noteOff(fin + 0.05); }
      sonsActifs.push(osc);
      osc.onended = function () {
        var i = sonsActifs.indexOf(osc);
        if (i >= 0) { sonsActifs.splice(i, 1); }
      };
    });
  }

  var NOMS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function frequence(nom) {
    var m = /^([A-G])(#|b)?(\d)$/.exec(nom);
    if (!m) { return 0; }
    var midi = 12 * (parseInt(m[3], 10) + 1) + NOMS[m[1]] + (m[2] === '#' ? 1 : (m[2] === 'b' ? -1 : 0));
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  // "C4 1 D4 0.5" -> [{f: 261.6, d: 1}, {f: 293.7, d: 0.5}]
  function lireMelodie(txt) {
    var morceaux = (txt || '').split(/\s+/), notes = [], i;
    for (i = 0; i + 1 < morceaux.length; i += 2) {
      notes.push({ f: frequence(morceaux[i]), d: parseFloat(morceaux[i + 1]) });
    }
    return notes;
  }

  /* ---------- Accompagnement : basse, accords et petit rythme ---------- */
  var DEMI_TONS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function noteMidi(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  // Son doux et rond (piano feutré) pour les accords.
  function doux(freq, t, duree, volume) {
    if (!audio || sonCoupe) { return; }
    var osc = audio.createOscillator();
    var gain = audio.createGain ? audio.createGain() : audio.createGainNode();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    osc.connect(gain);
    gain.connect(audio.destination);
    if (osc.start) { osc.start(t); osc.stop(t + duree + 0.05); }
    else { osc.noteOn(t); osc.noteOff(t + duree + 0.05); }
    sonsActifs.push(osc);
  }

  // Petit « tchik » de maracas pour marquer le rythme.
  var bruit = null;
  function tchik(t, volume) {
    if (!audio || sonCoupe) { return; }
    if (!bruit) {
      bruit = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.08), audio.sampleRate);
      var d = bruit.getChannelData(0);
      for (var i = 0; i < d.length; i++) { d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); }
    }
    var src = audio.createBufferSource();
    var filtre = audio.createBiquadFilter();
    var gain = audio.createGain ? audio.createGain() : audio.createGainNode();
    src.buffer = bruit;
    try { filtre.type = 'highpass'; } catch (e) { filtre.type = 1; }
    filtre.frequency.value = 5000;
    gain.gain.value = volume;
    src.connect(filtre); filtre.connect(gain); gain.connect(audio.destination);
    if (src.start) { src.start(t); } else { src.noteOn(t); }
    sonsActifs.push(src);
  }

  // "C 4 G 4" : accord de do pendant 4 temps, puis sol pendant 4 temps.
  function accompagner(accords, t, temps, nuit) {
    var m = (accords || '').split(/\s+/), i, b;
    for (i = 0; i + 1 < m.length; i += 2) {
      var nom = m[i], duree = parseFloat(m[i + 1]);
      var mineur = nom.charAt(nom.length - 1) === 'm';
      var racine = 48 + DEMI_TONS[nom.charAt(0)] + (nom.charAt(1) === '#' ? 1 : (nom.charAt(1) === 'b' ? -1 : 0));
      var tierce = racine + (mineur ? 3 : 4), quinte = racine + 7;
      for (b = 0; b < duree; b++) {
        var tb = t + b * temps;
        if (b === 0) { doux(noteMidi(racine - 12), tb, temps * 1.8, nuit ? 0.12 : 0.18); }
        else if (b % 2 === 1) { doux(noteMidi(quinte), tb, temps * 0.9, nuit ? 0.05 : 0.07); doux(noteMidi(tierce + 12), tb, temps * 0.9, nuit ? 0.04 : 0.06); }
        else { doux(noteMidi(racine), tb, temps * 0.9, nuit ? 0.06 : 0.09); }
        if (!nuit) { tchik(tb + (b % 2 ? 0 : temps / 2), 0.05); }
      }
      t += duree * temps;
    }
  }

  /* ---------- Voix de l'iPad (synthèse vocale) ---------- */
  var synthese = window.speechSynthesis;
  var phraseEnCours = null; // garder une référence : sinon iOS peut oublier le « fini »

  function choisirVoix(langue) {
    if (!synthese || !synthese.getVoices) { return null; }
    var voix = synthese.getVoices(), i, prefixe = langue.slice(0, 2);
    for (i = 0; i < voix.length; i++) { if (voix[i].lang && voix[i].lang.replace('_', '-') === langue) { return voix[i]; } }
    for (i = 0; i < voix.length; i++) { if (voix[i].lang && voix[i].lang.indexOf(prefixe) === 0) { return voix[i]; } }
    return null;
  }

  // Lit un texte puis appelle « ensuite » (une seule fois, même si iOS se trompe).
  function parler(phrase, langue, vitesse, ensuite) {
    var maLecture = lecture, fait = false;
    function fini() {
      if (fait || maLecture !== lecture) { return; }
      fait = true;
      if (ensuite) { ensuite(); }
    }
    // Filet de sécurité si l'événement de fin n'arrive jamais.
    plusTard(fini, 2500 + phrase.length * 110 / vitesse);
    if (!synthese || sonCoupe) { return; }
    var u = new window.SpeechSynthesisUtterance(phrase);
    u.lang = langue;
    u.rate = vitesse;
    var v = choisirVoix(langue);
    if (v) { u.voice = v; }
    u.onend = fini;
    phraseEnCours = u;
    synthese.speak(u);
  }

  /* ---------- Voix enregistrées (fichiers MP3, plus douces que la voix de l'iPad) ---------- */
  var lecteur = document.createElement('audio');
  lecteur.preload = 'auto';
  document.body.appendChild(lecteur);
  var lecteurDebloque = false;
  // iOS n'autorise la lecture qu'après un geste : on « débloque » le lecteur au premier toucher.
  function debloquerLecteur() {
    if (lecteurDebloque) { return; }
    lecteurDebloque = true;
    try { lecteur.load(); } catch (e) {}
  }
  document.addEventListener('touchend', debloquerLecteur, false);

  // Joue un fichier ; si le fichier manque, on se rabat sur la voix de l'iPad.
  function dire(fichier, phrase, langue, vitesse, ensuite) {
    if (!CONTENU.voixEnregistrees || !fichier) { parler(phrase, langue, vitesse, ensuite); return; }
    var maLecture = lecture, fait = false;
    function fini() {
      if (fait || maLecture !== lecture) { return; }
      fait = true;
      if (ensuite) { ensuite(); }
    }
    lecteur.onended = fini;
    lecteur.onerror = function () {
      if (fait || maLecture !== lecture) { return; }
      fait = true;
      parler(phrase, langue, vitesse, ensuite);
    };
    if (sonCoupe) { return; }
    lecteur.src = fichier;
    try { lecteur.play(); } catch (e) { lecteur.onerror(); }
  }

  function arreterTousLesSons() {
    lecture++;
    minuteriesSon.forEach(function (id) { clearTimeout(id); });
    minuteriesSon = [];
    sonsActifs.forEach(function (o) {
      try { if (o.stop) { o.stop(0); } else { o.noteOff(0); } } catch (e) {}
    });
    sonsActifs = [];
    if (synthese) { try { synthese.cancel(); } catch (e) {} }
    phraseEnCours = null;
    tous('audio').forEach(function (m) { try { m.pause(); } catch (e) {} });
  }

  /* ---------- Navigation entre les vues ---------- */
  // Une seule page : en mode « écran d'accueil », un lien classique ouvrirait Safari.
  var historique = [{ vue: 'accueil' }];
  var modeNuit = false;

  function afficher(etape) {
    arreterTousLesSons();
    if (window.PetitsLoups && window.PetitsLoups.quandOnQuitte) { window.PetitsLoups.quandOnQuitte(); }
    tous('.vue').forEach(function (v) { v.className = 'vue'; });
    if (etape.preparer) { etape.preparer(); }
    var vue = $('vue-' + etape.vue);
    if (vue) { vue.className = 'vue active'; }
    // Le mode nuit reste actif tant qu'on est « dans » le Dodo.
    modeNuit = false;
    historique.forEach(function (h) { if (h.nuit) { modeNuit = true; } });
    document.body.className = modeNuit ? 'nuit' : '';
    if (etape.lancer) { etape.lancer(); }
  }
  function aller(nom, preparer, lancer, nuit) {
    var etape = { vue: nom, preparer: preparer, lancer: lancer, nuit: nuit };
    if (nom === 'accueil') { historique = [etape]; }
    else { historique.push(etape); }
    afficher(etape);
  }
  function retour() {
    if (historique.length > 1) { historique.pop(); }
    var etape = historique[historique.length - 1];
    afficher({ vue: etape.vue, preparer: etape.preparer });
  }

  document.addEventListener('click', function (e) {
    var el = e.target, a;
    while (el && el !== document) {
      if (el.getAttribute) {
        if ((a = el.getAttribute('data-aller'))) { aller(a); return; }
        if (el.getAttribute('data-retour')) { retour(); return; }
        if ((a = el.getAttribute('data-liste'))) { ouvrirListe(a); return; }
        if ((a = el.getAttribute('data-chanson'))) { ouvrirChanson(a); return; }
        if ((a = el.getAttribute('data-histoire'))) { ouvrirHistoire(a); return; }
      }
      el = el.parentNode;
    }
  }, false);

  /* ---------- Listes ---------- */
  var LISTES = {
    fr: { titre: 'Comptines', nuit: false },
    noel: { titre: 'Noël', nuit: false },
    histoires: { titre: 'Histoires', nuit: false },
    dodo: { titre: 'Dodo', nuit: true }
  };

  function tuile(attr, id, emoji, titre) {
    return '<button class="tuile carte" ' + attr + '="' + id + '">' +
      '<span class="emoji">' + emoji + '</span><span class="libelle">' + titre + '</span></button>';
  }

  function ouvrirListe(nom) {
    var def = LISTES[nom];
    aller('liste', function () {
      var html = '';
      texte('liste-titre', def.titre);
      if (nom === 'histoires' || nom === 'dodo') {
        CONTENU.histoires.forEach(function (h) { html += tuile('data-histoire', h.id, h.emoji, h.titre); });
      }
      CONTENU.chansons.forEach(function (c) {
        if ((nom === 'dodo' && c.dodo) || c.groupe === nom) { html += tuile('data-chanson', c.id, c.emoji, c.titre); }
      });
      $('liste-tuiles').innerHTML = html;
    }, null, def.nuit);
  }

  function trouver(liste, id) {
    for (var i = 0; i < liste.length; i++) { if (liste[i].id === id) { return liste[i]; } }
    return null;
  }

  /* ---------- Lecteur de chanson ---------- */
  var chansonCourante = null;

  function montrerLigne(c, i) {
    var l = c.lignes[i], s = c.lignes[i + 1];
    texte('chanson-ligne', l ? l[0] : '');
    texte('chanson-suivante', s ? s[0] : '');
    texte('chanson-image', (l && l[2]) || c.emoji);
  }

  function ouvrirChanson(id) {
    var c = trouver(CONTENU.chansons, id);
    if (!c) { return; }
    aller('chanson', function () {
      chansonCourante = c;
      texte('chanson-titre', c.titre);
      montrerLigne(c, 0);
    }, function () { jouerChanson(c); });
  }

  function chansonTerminee() {
    if (modeNuit) { plusTard(function () { bonneNuit(); }, 1500); }
  }

  function jouerChanson(c) {
    arreterTousLesSons();
    preparerAudio();
    montrerLigne(c, 0);
    var aMelodie = c.lignes[0][1] !== '';
    if (!aMelodie) {
      // Pas de mélodie : l'iPad dit les paroles, une ligne après l'autre.
      var vitesse = modeNuit ? 0.75 : 0.85;
      var suivante = function (i) {
        if (i >= c.lignes.length) { chansonTerminee(); return; }
        montrerLigne(c, i);
        dire('audio/chansons/' + c.id + '-' + (i + 1) + '.mp3', c.lignes[i][0], c.langue, vitesse, function () { plusTard(function () { suivante(i + 1); }, 400); });
      };
      suivante(0);
      return;
    }
    if (!audio) { return; }
    var temps = 60 / ((c.tempo || 110) * (modeNuit ? 0.85 : 1));
    var debut = audio.currentTime + 0.15, t = debut;
    c.lignes.forEach(function (ligne, i) {
      var depart = t;
      plusTard(function () { montrerLigne(c, i); }, (depart - audio.currentTime) * 1000);
      if (ligne[3]) { accompagner(ligne[3], t, temps, modeNuit); }
      lireMelodie(ligne[1]).forEach(function (n) {
        if (n.f > 0) { note(n.f, t, n.d * temps, modeNuit ? 0.22 : 0.35); }
        t += n.d * temps;
      });
    });
    plusTard(chansonTerminee, (t - audio.currentTime) * 1000 + 800);
  }
  $('chanson-rejouer').addEventListener('click', function () {
    if (chansonCourante) { jouerChanson(chansonCourante); }
  }, false);

  /* ---------- Lecteur d'histoire ---------- */
  var histoireCourante = null, pageCourante = 0, lectureAuto = false;

  function montrerPage() {
    var h = histoireCourante, p = h.pages[pageCourante];
    texte('histoire-image', p[0]);
    texte('histoire-texte', p[1]);
    texte('histoire-numero', (pageCourante + 1) + ' / ' + h.pages.length);
    $('histoire-prec').className = 'gros-bouton' + (pageCourante === 0 ? ' inactif' : '');
    $('histoire-suiv').className = 'gros-bouton' + (pageCourante === h.pages.length - 1 ? ' inactif' : '');
    $('histoire-lire').innerHTML = lectureAuto ? '⏸' : '🔊';
  }

  function lirePage() {
    var h = histoireCourante;
    arreterTousLesSons();
    montrerPage();
    dire('audio/histoires/' + h.id + '-' + (pageCourante + 1) + '.mp3', h.pages[pageCourante][1], 'fr-FR', modeNuit ? 0.75 : 0.9, function () {
      if (!lectureAuto) { return; }
      if (pageCourante < h.pages.length - 1) {
        plusTard(function () { pageCourante++; lirePage(); }, modeNuit ? 2000 : 1200);
      } else {
        lectureAuto = false;
        montrerPage();
        if (modeNuit) { plusTard(bonneNuit, 2000); }
      }
    });
  }

  function ouvrirHistoire(id) {
    var h = trouver(CONTENU.histoires, id);
    if (!h) { return; }
    aller('histoire', function () {
      histoireCourante = h;
      pageCourante = 0;
      lectureAuto = false;
      texte('histoire-titre', h.titre);
      montrerPage();
    }, function () {
      // L'histoire se lit toute seule jusqu'au bout (le bouton ⏸ met en pause).
      lectureAuto = true; lirePage();
    });
  }

  $('histoire-lire').addEventListener('click', function () {
    lectureAuto = !lectureAuto;
    if (lectureAuto) { lirePage(); } else { arreterTousLesSons(); montrerPage(); }
  }, false);
  $('histoire-prec').addEventListener('click', function () {
    if (pageCourante > 0) { pageCourante--; if (lectureAuto) { lirePage(); } else { arreterTousLesSons(); montrerPage(); } }
  }, false);
  $('histoire-suiv').addEventListener('click', function () {
    if (pageCourante < histoireCourante.pages.length - 1) {
      pageCourante++;
      if (lectureAuto) { lirePage(); } else { arreterTousLesSons(); montrerPage(); }
    }
  }, false);

  /* ---------- Piano des couleurs ---------- */
  var GAMME = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
  tous('.touche').forEach(function (touche) {
    function appuyer(e) {
      e.preventDefault();
      preparerAudio();
      note(GAMME[parseInt(touche.getAttribute('data-note'), 10)], 0, 0.6, 0.4);
      touche.className = 'touche joue';
      setTimeout(function () { touche.className = 'touche'; }, 180);
    }
    touche.addEventListener('touchstart', appuyer, false);
    touche.addEventListener('mousedown', appuyer, false);
  });

  /* ---------- Bouton parent : appui long de 3 secondes ---------- */
  var boutonParent = $('bouton-parent');
  var minuterieAppui = null;
  function debutAppui(e) {
    e.preventDefault();
    boutonParent.className = 'appui';
    clearTimeout(minuterieAppui);
    minuterieAppui = setTimeout(function () {
      boutonParent.className = '';
      ouvrirParent();
    }, 3000);
  }
  function finAppui() {
    clearTimeout(minuterieAppui);
    boutonParent.className = '';
  }
  boutonParent.addEventListener('touchstart', debutAppui, false);
  boutonParent.addEventListener('touchend', finAppui, false);
  boutonParent.addEventListener('touchcancel', finAppui, false);
  boutonParent.addEventListener('mousedown', debutAppui, false);
  boutonParent.addEventListener('mouseup', finAppui, false);
  boutonParent.addEventListener('mouseleave', finAppui, false);

  function ouvrirParent() {
    majEtat();
    $('panneau-parent').className = 'couche visible';
  }
  function fermerParent() {
    $('panneau-parent').className = 'couche';
  }
  $('fermer-parent').addEventListener('click', function () {
    fermerParent();
    // L'écran « Bonne nuit » se ferme ; celui du minuteur reste tant que le temps est écoulé.
    if (!tempsEcoule()) { cacherFin(); }
  }, false);

  /* ---------- Écran de fin (minuteur ou « Bonne nuit ») ---------- */
  function montrerFin(titre, sousTitre) {
    arreterTousLesSons();
    sonCoupe = true;
    texte('fin-titre', titre);
    texte('fin-sous-titre', sousTitre);
    $('ecran-fin').className = 'couche fin visible';
  }
  function cacherFin() {
    sonCoupe = false;
    $('ecran-fin').className = 'couche fin';
  }
  function finVisible() { return $('ecran-fin').className.indexOf('visible') >= 0; }

  function bonneNuit() {
    montrerFin('Bonne nuit…', 'Fais de beaux rêves ⭐');
  }

  /* ---------- Minuteur : tout s'arrête quand le temps est écoulé ---------- */
  var CLE_FIN = 'petitsLoups.finMinuteur';

  function finMinuteur() {
    var v = parseInt(lire(CLE_FIN), 10);
    return isNaN(v) ? 0 : v;
  }
  function tempsEcoule() {
    var fin = finMinuteur();
    return fin > 0 && fin <= Date.now();
  }

  tous('.durees button').forEach(function (b) {
    b.addEventListener('click', function () {
      var minutes = parseInt(b.getAttribute('data-minutes'), 10);
      if (minutes > 0) { ecrire(CLE_FIN, String(Date.now() + minutes * 60000)); }
      else { ecrire(CLE_FIN, null); }
      cacherFin();
      fermerParent();
      verifier();
    }, false);
  });

  function formater(ms) {
    var s = Math.ceil(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function majEtat() {
    var fin = finMinuteur();
    var etat = $('etat-minuteur');
    if (!fin) { etat.textContent = 'Pas de limite de temps.'; }
    else if (fin <= Date.now()) { etat.textContent = 'Le temps est écoulé. Choisis une nouvelle durée pour relancer.'; }
    else { etat.textContent = 'Temps restant : ' + formater(fin - Date.now()); }
  }

  function verifier() {
    var fin = finMinuteur();
    var reste = $('reste');
    if (!fin) { reste.textContent = ''; return; }
    var restant = fin - Date.now();
    if (restant > 0) {
      reste.textContent = formater(restant);
      return;
    }
    reste.textContent = '';
    if (!finVisible()) {
      aller('accueil');
      montrerFin('C\'est fini pour aujourd\'hui !', 'Bravo, à bientôt ⭐');
    }
  }

  setInterval(function () {
    verifier();
    if ($('panneau-parent').className.indexOf('visible') >= 0) { majEtat(); }
  }, 1000);
  verifier();

  // Accès pour les tests.
  window.PetitsLoups = { note: note, preparerAudio: preparerAudio, maintenant: function () { return audio ? audio.currentTime : 0; }, aller: aller, ouvrirListe: ouvrirListe, ouvrirChanson: ouvrirChanson, ouvrirHistoire: ouvrirHistoire, arreterTousLesSons: arreterTousLesSons };
})();
