/*
 * Contenu de Petits Loups : comptines, chansons et histoires.
 * Paroles traditionnelles ou du domaine public ; histoires réécrites en version courte.
 *
 * Mélodies : une ligne de paroles = une suite « Note Durée » (durée en temps).
 * Exemple : "C4 1 D4 0.5" = do (1 temps) puis ré (un demi-temps).
 * Une ligne sans mélodie est lue à voix haute par l'iPad.
 * Pour ajouter un enregistrement : mettre le fichier dans audio/ et renseigner « audio ».
 */
var CONTENU = {};

CONTENU.chansons = [
  /* ----- Comptines françaises ----- */
  {
    id: 'escargot', titre: 'Petit escargot', emoji: '🐌', groupe: 'fr', langue: 'fr-FR',
    lignes: [
      ['Petit escargot', '', '🐌'],
      ['Porte sur son dos', '', '🐌'],
      ['Sa maisonnette.', '', '🏠'],
      ['Aussitôt qu\'il pleut,', '', '☔'],
      ['Il est tout heureux,', '', '😊'],
      ['Il sort sa tête !', '', '🐌']
    ]
  },
  {
    id: 'meunier', titre: 'Meunier, tu dors', emoji: '😴', groupe: 'fr', langue: 'fr-FR',
    lignes: [
      ['Meunier, tu dors,', '', '😴'],
      ['Ton moulin, ton moulin va trop vite.', '', '💨'],
      ['Meunier, tu dors,', '', '😴'],
      ['Ton moulin, ton moulin va trop fort.', '', '💨'],
      ['Ton moulin, ton moulin va trop vite,', '', '🌾'],
      ['Ton moulin, ton moulin va trop fort !', '', '🌾']
    ]
  },
  {
    id: 'crocodiles', titre: 'Les crocodiles', emoji: '🐊', groupe: 'fr', langue: 'fr-FR',
    lignes: [
      ['Un crocodile, s\'en allant à la guerre,', '', '🐊'],
      ['Disait au revoir à ses petits enfants.', '', '👋'],
      ['Traînant sa queue, sa queue dans la poussière,', '', '🐊'],
      ['Il s\'en allait combattre les éléphants.', '', '🐘'],
      ['Ah ! Les crocrocro, les crocrocro, les crocodiles,', '', '🐊'],
      ['Sur les bords du Nil, ils sont partis,', '', '🌊'],
      ['N\'en parlons plus !', '', '👋']
    ]
  },
  {
    id: 'frere-jacques', titre: 'Frère Jacques', emoji: '🔔', groupe: 'fr', langue: 'fr-FR', tempo: 110,
    lignes: [
      ['Frère Jacques, frère Jacques,', 'C4 1 D4 1 E4 1 C4 1 C4 1 D4 1 E4 1 C4 1', '😴'],
      ['Dormez-vous ? Dormez-vous ?', 'E4 1 F4 1 G4 2 E4 1 F4 1 G4 2', '😴'],
      ['Sonnez les matines, sonnez les matines,', 'G4 0.5 A4 0.5 G4 0.5 F4 0.5 E4 1 C4 1 G4 0.5 A4 0.5 G4 0.5 F4 0.5 E4 1 C4 1', '🔔'],
      ['Ding, dang, dong ! Ding, dang, dong !', 'C4 1 G3 1 C4 2 C4 1 G3 1 C4 2', '🔔']
    ]
  },
  {
    id: 'clair-lune', titre: 'Au clair de la lune', emoji: '🌙', groupe: 'fr', dodo: true, langue: 'fr-FR', tempo: 96,
    lignes: [
      ['Au clair de la lune,', 'C4 1 C4 1 C4 1 D4 1 E4 2 D4 2', '🌙'],
      ['Mon ami Pierrot,', 'C4 1 E4 1 D4 1 D4 1 C4 4', '😊'],
      ['Prête-moi ta plume', 'C4 1 C4 1 C4 1 D4 1 E4 2 D4 2', '✏️'],
      ['Pour écrire un mot.', 'C4 1 E4 1 D4 1 D4 1 C4 4', '✉️'],
      ['Ma chandelle est morte,', 'D4 1 D4 1 D4 1 D4 1 A3 2 A3 2', '💡'],
      ['Je n\'ai plus de feu.', 'D4 1 C4 1 B3 1 A3 1 G3 4', '🌑'],
      ['Ouvre-moi ta porte', 'C4 1 C4 1 C4 1 D4 1 E4 2 D4 2', '🚪'],
      ['Pour l\'amour de Dieu.', 'C4 1 E4 1 D4 1 D4 1 C4 4', '⭐']
    ]
  },

  /* ----- Chansons de Noël (en anglais) ----- */
  {
    id: 'jingle-bells', titre: 'Jingle Bells', emoji: '🔔', groupe: 'noel', langue: 'en-US', tempo: 130,
    lignes: [
      ['Jingle bells, jingle bells,', 'E4 1 E4 1 E4 2 E4 1 E4 1 E4 2', '🔔'],
      ['Jingle all the way!', 'E4 1 G4 1 C4 1.5 D4 0.5 E4 4', '🎅'],
      ['Oh what fun it is to ride in a', 'F4 1 F4 1 F4 1.5 F4 0.5 F4 1 E4 1 E4 1 E4 0.5 E4 0.5', '🐴'],
      ['one-horse open sleigh, hey!', 'E4 1 D4 1 D4 1 E4 1 D4 2 G4 2', '❄️'],
      ['Jingle bells, jingle bells,', 'E4 1 E4 1 E4 2 E4 1 E4 1 E4 2', '🔔'],
      ['Jingle all the way!', 'E4 1 G4 1 C4 1.5 D4 0.5 E4 4', '🎅'],
      ['Oh what fun it is to ride in a', 'F4 1 F4 1 F4 1.5 F4 0.5 F4 1 E4 1 E4 1 E4 0.5 E4 0.5', '🐴'],
      ['one-horse open sleigh!', 'G4 1 G4 1 F4 1 D4 1 C4 4', '🎄']
    ]
  },
  {
    id: 'we-wish-you', titre: 'We Wish You a Merry Christmas', emoji: '🎄', groupe: 'noel', langue: 'en-US', tempo: 150,
    lignes: [
      ['We wish you a Merry Christmas,', 'D4 1 G4 1 G4 0.5 A4 0.5 G4 0.5 F#4 0.5 E4 1 E4 1', '🎄'],
      ['We wish you a Merry Christmas,', 'E4 1 A4 1 A4 0.5 B4 0.5 A4 0.5 G4 0.5 F#4 1 D4 1', '🎁'],
      ['We wish you a Merry Christmas,', 'D4 1 B4 1 B4 0.5 C5 0.5 B4 0.5 A4 0.5 G4 1 E4 1', '🎅'],
      ['And a Happy New Year!', 'D4 0.5 D4 0.5 E4 1 A4 1 F#4 1 G4 3', '⭐']
    ]
  },
  {
    id: 'deck-the-halls', titre: 'Deck the Halls', emoji: '🎁', groupe: 'noel', langue: 'en-US', tempo: 130,
    lignes: [
      ['Deck the halls with boughs of holly,', 'G4 1.5 F4 0.5 E4 1 D4 1 C4 1 D4 1 E4 1 C4 1', '🎄'],
      ['Fa la la la la, la la la la!', 'D4 0.5 E4 0.5 F4 0.5 D4 0.5 E4 1.5 D4 0.5 C4 1 B3 1 C4 2', '🎶'],
      ['\'Tis the season to be jolly,', 'G4 1.5 F4 0.5 E4 1 D4 1 C4 1 D4 1 E4 1 C4 1', '😊'],
      ['Fa la la la la, la la la la!', 'D4 0.5 E4 0.5 F4 0.5 D4 0.5 E4 1.5 D4 0.5 C4 1 B3 1 C4 2', '🎶']
    ]
  },
  {
    id: 'silent-night', titre: 'Silent Night', emoji: '⭐', groupe: 'noel', dodo: true, langue: 'en-US', tempo: 120,
    lignes: [
      ['Silent night,', 'G4 1.5 A4 0.5 G4 1 E4 3', '🌙'],
      ['Holy night,', 'G4 1.5 A4 0.5 G4 1 E4 3', '⭐'],
      ['All is calm,', 'D5 2 D5 1 B4 3', '❄️'],
      ['All is bright,', 'C5 2 C5 1 G4 3', '✨'],
      ['Round yon Virgin, Mother and Child,', 'A4 2 A4 1 C5 1.5 B4 0.5 A4 1 G4 1.5 A4 0.5 G4 1 E4 3', '👶'],
      ['Holy Infant so tender and mild,', 'A4 2 A4 1 C5 1.5 B4 0.5 A4 1 G4 1.5 A4 0.5 G4 1 E4 3', '💛'],
      ['Sleep in heavenly peace,', 'D5 2 D5 1 F5 1.5 D5 0.5 B4 1 C5 3 E5 3', '😴'],
      ['Sleep in heavenly peace.', 'C5 1 G4 1 E4 1 G4 1.5 F4 0.5 D4 1 C4 6', '🌙']
    ]
  },
  {
    id: 'twinkle', titre: 'Twinkle, Twinkle, Little Star', emoji: '✨', groupe: 'noel', dodo: true, langue: 'en-US', tempo: 96,
    lignes: [
      ['Twinkle, twinkle, little star,', 'C4 1 C4 1 G4 1 G4 1 A4 1 A4 1 G4 2', '⭐'],
      ['How I wonder what you are!', 'F4 1 F4 1 E4 1 E4 1 D4 1 D4 1 C4 2', '✨'],
      ['Up above the world so high,', 'G4 1 G4 1 F4 1 F4 1 E4 1 E4 1 D4 2', '🌍'],
      ['Like a diamond in the sky.', 'G4 1 G4 1 F4 1 F4 1 E4 1 E4 1 D4 2', '💎'],
      ['Twinkle, twinkle, little star,', 'C4 1 C4 1 G4 1 G4 1 A4 1 A4 1 G4 2', '⭐'],
      ['How I wonder what you are!', 'F4 1 F4 1 E4 1 E4 1 D4 1 D4 1 C4 2', '🌙']
    ]
  },

  /* ----- Berceuse instrumentale ----- */
  {
    id: 'brahms', titre: 'Berceuse de Brahms', emoji: '🌛', groupe: 'dodo', dodo: true, langue: 'fr-FR', tempo: 84,
    lignes: [
      ['🎶', 'E4 0.5 E4 0.5 G4 2 E4 0.5 E4 0.5 G4 2', '🌛'],
      ['🎶', 'E4 0.5 G4 0.5 C5 1 B4 1.5 A4 0.5 A4 1 G4 1', '⭐'],
      ['🎶', 'D4 0.5 E4 0.5 F4 1 D4 1 D4 0.5 E4 0.5 F4 2', '✨'],
      ['🎶', 'D4 0.5 F4 0.5 B4 0.5 A4 0.5 G4 1 B4 1 C5 2', '🌙'],
      ['🎶', 'C4 0.5 C4 0.5 C5 2 A4 0.5 F4 0.5 G4 2', '⭐'],
      ['🎶', 'E4 0.5 C4 0.5 F4 1 G4 1 A4 1 G4 2', '✨'],
      ['🎶', 'C4 0.5 C4 0.5 C5 2 A4 0.5 F4 0.5 G4 2', '🌛'],
      ['🎶', 'E4 0.5 C4 0.5 F4 1 E4 1 D4 1 C4 3', '😴']
    ]
  }
];

CONTENU.histoires = [
  {
    id: 'cochons', titre: 'Les trois petits cochons', emoji: '🐷',
    pages: [
      ['🐷🐷🐷', 'Il était une fois trois petits cochons. Chacun voulait sa maison.'],
      ['🐷🌾🏠', 'Le premier construit une maison en paille. C\'est vite fait ! Et hop, il va jouer.'],
      ['🐷🌲🏠', 'Le deuxième construit une maison en bois. C\'est vite fait aussi !'],
      ['🐷🔨🏡', 'Le troisième construit une maison en briques. C\'est long… mais c\'est très solide.'],
      ['🐺💨🌾', 'Un jour, le loup arrive. Il souffle sur la maison de paille. Pfff ! Elle s\'envole. Le petit cochon court chez son frère.'],
      ['🐺💨🌲', 'Le loup souffle sur la maison de bois. Pfff ! Elle s\'envole aussi. Les deux cochons courent chez le troisième.'],
      ['🐺💨🏡', 'Le loup souffle, souffle, et souffle encore… Mais la maison de briques ne bouge pas !'],
      ['🐺🔥🏃', 'Le loup grimpe sur le toit et glisse dans la cheminée. Aïe, c\'est chaud ! Il s\'enfuit très loin et ne revient jamais.'],
      ['🐷🐷🐷🎉', 'Les trois petits cochons dansent dans leur maison solide. Fin.']
    ]
  },
  {
    id: 'chaperon', titre: 'Le Petit Chaperon rouge', emoji: '👧',
    pages: [
      ['👧🔴', 'Il était une fois une petite fille qui portait toujours un joli chaperon rouge.'],
      ['👩🍰👵', 'Un jour, sa maman lui dit : « Va porter cette galette à Mère-Grand. Et ne t\'arrête pas en chemin ! »'],
      ['👧🌲🌸', 'Dans la forêt, le Petit Chaperon rouge cueille des fleurs pour sa mamie.'],
      ['🐺👧🌲', 'Le loup arrive. « Où vas-tu, petite fille ? » « Chez ma Mère-Grand, de l\'autre côté du bois. »'],
      ['🐺🏠👵', 'Le loup court très vite chez Mère-Grand. Mère-Grand a peur : elle se cache dans l\'armoire. Le loup met son bonnet et se couche dans le lit.'],
      ['👧👀🐺', 'Le Petit Chaperon rouge arrive. « Mère-Grand, comme vous avez de grands yeux ! » « C\'est pour mieux te voir, mon enfant. »'],
      ['👧👂🐺', '« Mère-Grand, comme vous avez de grandes oreilles ! » « C\'est pour mieux t\'entendre… »'],
      ['👨🌲🐺💨', 'Juste à ce moment, le bûcheron entre. « Ouste, le loup ! » Le loup s\'enfuit dans la forêt et ne revient plus.'],
      ['👵👧🍰', 'Mère-Grand sort de l\'armoire, et tout le monde mange la galette. Fin.']
    ]
  },
  {
    id: 'boucle', titre: 'Boucle d\'or et les trois ours', emoji: '🐻',
    pages: [
      ['🐻🐻🐻🏡', 'Au fond des bois vivent trois ours : Papa Ours, Maman Ours et Bébé Ours.'],
      ['🍲🍲🍲🌳', 'Un matin, la soupe est trop chaude. Les trois ours partent se promener en attendant.'],
      ['👧🌼🏡', 'Une petite fille aux cheveux d\'or, Boucle d\'or, trouve la maison. La porte est ouverte… elle entre.'],
      ['👧🍲😋', 'Elle goûte la soupe de Papa Ours : trop chaude ! Celle de Maman Ours : trop froide ! Celle de Bébé Ours : parfaite ! Elle mange tout.'],
      ['👧💺💥', 'Elle essaie les chaises. La grande est trop dure, la moyenne trop molle, et la petite… crac ! Elle se casse.'],
      ['👧💤', 'Boucle d\'or est fatiguée. Le petit lit de Bébé Ours est parfait. Elle s\'endort.'],
      ['🐻🐻🐻😮', 'Les ours rentrent. « Quelqu\'un a mangé ma soupe ! » dit Bébé Ours. « Et cassé ma chaise ! »'],
      ['🐻👧😮', '« Et quelqu\'un dort dans mon lit ! » Boucle d\'or se réveille, voit les trois ours… et saute par la fenêtre.'],
      ['👧🏃🏡', 'Elle court jusque chez elle. Depuis, elle n\'entre plus chez les autres sans demander. Fin.']
    ]
  },
  {
    id: 'cendrillon', titre: 'Cendrillon', emoji: '👸',
    pages: [
      ['👧✨', 'Il était une fois une jeune fille très gentille, Cendrillon. Elle vivait avec sa belle-mère et ses deux demi-sœurs, pas gentilles du tout.'],
      ['👧🏠💦', 'Cendrillon faisait tout le travail de la maison, du matin au soir.'],
      ['🏰👑🎶', 'Un jour, le prince invite tout le royaume à un grand bal au château.'],
      ['👧😢', 'Les sœurs partent au bal. Cendrillon n\'a pas de jolie robe. Elle reste seule et pleure.'],
      ['✨🌟👗', 'Soudain, sa marraine la fée apparaît ! D\'un coup de baguette, elle lui donne une robe magnifique et des souliers de verre.'],
      ['🎃🐭🐴', 'La citrouille devient un carrosse, les souris deviennent des chevaux. « Mais attention : rentre avant minuit ! »'],
      ['👑👸💃', 'Au bal, le prince danse toute la soirée avec Cendrillon.'],
      ['🕛👠🏃', 'Mais minuit sonne ! Cendrillon s\'enfuit si vite qu\'elle perd un soulier de verre dans l\'escalier.'],
      ['👑👠👸', 'Le prince cherche partout la jeune fille à qui va le soulier. Il va parfaitement à Cendrillon !'],
      ['👑👸🎉', 'Le prince et Cendrillon se marient et vivent heureux. Fin.']
    ]
  }
];
