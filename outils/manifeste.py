"""Génère petits-loups.appcache : la liste des fichiers que l'iPad garde pour marcher sans internet.

Safari 9 (iOS 9) ne connaît pas les « service workers » ; il utilise l'ancien
« Application Cache ». À relancer après chaque modification du site :

    python outils/manifeste.py

La version (empreinte des fichiers) change dès qu'un fichier change,
ce qui pousse l'iPad à se mettre à jour tout seul.
"""
import hashlib, os

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FICHIERS_FIXES = ["index.html", "icon.png", "css/style.css",
                  "js/contenu.js", "js/app.js", "js/jeux.js"]
DOSSIERS_AUDIO = ["audio/histoires"]

fichiers = list(FICHIERS_FIXES)
for d in DOSSIERS_AUDIO:
    chemin = os.path.join(RACINE, d)
    if os.path.isdir(chemin):
        fichiers += sorted(d + "/" + f for f in os.listdir(chemin) if f.endswith(".mp3"))

empreinte = hashlib.sha1()
for f in fichiers:
    with open(os.path.join(RACINE, f), "rb") as fh:
        empreinte.update(f.encode() + fh.read())

lignes = ["CACHE MANIFEST", "# version " + empreinte.hexdigest()[:12], "", "CACHE:"]
lignes += fichiers
lignes += ["", "NETWORK:", "*", ""]
with open(os.path.join(RACINE, "petits-loups.appcache"), "w", newline="\n") as fh:
    fh.write("\n".join(lignes))
print(len(fichiers), "fichiers, version", empreinte.hexdigest()[:12])
