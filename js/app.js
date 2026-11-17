/*
 * Petits Loups — écrit en JavaScript ES5 pour Safari 9 (iPad 2, iOS 9.3.5).
 * Pas de let/const, pas de fonctions fléchées, pas de fetch, pas de Promise.
 */
(function () {
  'use strict';

  /* ---------- Petits utilitaires ---------- */
  function $(id) { return document.getElementById(id); }
  function tous(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

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

  /* ---------- Navigation entre les vues ---------- */
  // Une seule page : en mode « écran d'accueil », un lien classique ouvrirait Safari.
  var historique = ['accueil'];
  function afficher(nom) {
    tous('.vue').forEach(function (v) { v.className = 'vue'; });
    var vue = $('vue-' + nom);
    if (vue) { vue.className = 'vue active'; }
  }
  function aller(nom) {
    if (nom === 'accueil') { historique = ['accueil']; }
    else { historique.push(nom); }
    afficher(nom);
  }
  function retour() {
    if (historique.length > 1) { historique.pop(); }
    afficher(historique[historique.length - 1]);
  }
  document.addEventListener('click', function (e) {
    var el = e.target;
    while (el && el !== document) {
      if (el.getAttribute && el.getAttribute('data-aller')) { aller(el.getAttribute('data-aller')); return; }
      if (el.getAttribute && el.getAttribute('data-retour')) { retour(); return; }
      el = el.parentNode;
    }
  }, false);

  /* ---------- Son (Web Audio, préfixé webkit sur iOS 9) ---------- */
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audio = null;
  var sonsActifs = [];
  var sonCoupe = false;

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

  // Gamme douce (do majeur, pentatonique + do aigu)
  var NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];

  function jouerNote(freq) {
    if (!audio || sonCoupe) { return; }
    var t = audio.currentTime;
    var osc = audio.createOscillator();
    var gain = audio.createGain ? audio.createGain() : audio.createGainNode();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(gain);
    gain.connect(audio.destination);
    if (osc.start) { osc.start(t); osc.stop(t + 1.25); }
    else { osc.noteOn(t); osc.noteOff(t + 1.25); }
    sonsActifs.push(osc);
    osc.onended = function () {
      var i = sonsActifs.indexOf(osc);
      if (i >= 0) { sonsActifs.splice(i, 1); }
    };
  }

  function arreterTousLesSons() {
    sonsActifs.forEach(function (o) {
      try { if (o.stop) { o.stop(0); } else { o.noteOff(0); } } catch (e) {}
    });
    sonsActifs = [];
    tous('audio, video').forEach(function (m) { try { m.pause(); } catch (e) {} });
  }

  /* ---------- Piano des couleurs ---------- */
  tous('.touche').forEach(function (touche) {
    function appuyer(e) {
      e.preventDefault();
      preparerAudio();
      jouerNote(NOTES[parseInt(touche.getAttribute('data-note'), 10)]);
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
  $('fermer-parent').addEventListener('click', fermerParent, false);

  /* ---------- Minuteur : tout s'arrête quand le temps est écoulé ---------- */
  var CLE_FIN = 'petitsLoups.finMinuteur';

  function finMinuteur() {
    var v = parseInt(lire(CLE_FIN), 10);
    return isNaN(v) ? 0 : v;
  }

  tous('.durees button').forEach(function (b) {
    b.addEventListener('click', function () {
      var minutes = parseInt(b.getAttribute('data-minutes'), 10);
      if (minutes > 0) { ecrire(CLE_FIN, String(Date.now() + minutes * 60000)); }
      else { ecrire(CLE_FIN, null); }
      sonCoupe = false;
      $('ecran-fin').className = 'couche fin';
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
    if (!fin) { etat.innerHTML = 'Pas de limite de temps.'; }
    else if (fin <= Date.now()) { etat.innerHTML = 'Le temps est écoulé. Choisis une nouvelle durée pour relancer.'; }
    else { etat.innerHTML = 'Temps restant : ' + formater(fin - Date.now()); }
  }

  function verifier() {
    var fin = finMinuteur();
    var reste = $('reste');
    if (!fin) { reste.innerHTML = ''; return; }
    var restant = fin - Date.now();
    if (restant > 0) {
      reste.innerHTML = formater(restant);
      return;
    }
    reste.innerHTML = '';
    if ($('ecran-fin').className.indexOf('visible') < 0) {
      arreterTousLesSons();
      sonCoupe = true;
      $('ecran-fin').className = 'couche fin visible';
      aller('accueil');
    }
  }

  setInterval(function () {
    verifier();
    if ($('panneau-parent').className.indexOf('visible') >= 0) { majEtat(); }
  }, 1000);
  verifier();

  // Petit accès pour les tests et les prochaines étapes.
  window.PetitsLoups = { aller: aller, jouerNote: jouerNote, arreterTousLesSons: arreterTousLesSons };
})();
