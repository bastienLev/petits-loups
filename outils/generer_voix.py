"""Génère les fichiers audio des histoires avec une voix naturelle (edge-tts).

Usage :  pip install edge-tts
         python generer_voix.py voix.json DOSSIER_SORTIE
"""
import asyncio, json, os, sys
import edge_tts

VOIX = "fr-FR-DeniseNeural"
VITESSE = "-12%"

async def main(manifeste, sortie):
    with open(manifeste, encoding="utf-8") as f:
        items = json.load(f)
    for i, it in enumerate(items, 1):
        chemin = os.path.join(sortie, it["fichier"])
        os.makedirs(os.path.dirname(chemin), exist_ok=True)
        if os.path.exists(chemin) and os.path.getsize(chemin) > 0:
            continue
        await edge_tts.Communicate(it["texte"], VOIX, rate=VITESSE).save(chemin)
        print(f"{i}/{len(items)} {it['fichier']}")

asyncio.run(main(sys.argv[1], sys.argv[2]))
