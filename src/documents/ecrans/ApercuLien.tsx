import React from 'react';
import { ZONE_SURE } from '../../evenements/ui/app';
import { DOCS, URL_PARTAGE } from '../donnees';
import { FIL } from '../textes';
import { BulleLien, BulleTexte, EnteteFil, Fil, Saisie, Separateur } from '../ui/Conversation';

/**
 * Conversations dans le téléphone (P9) — une messagerie stylisée, pas une marque (storyboard § 2) :
 * le groupe de P1, où Marie répond aux trois questions par le lien du document ; puis la
 * conversation d'un ami avec Marie, qui reçoit le même lien.
 */

/** En-tête 116 points, barre de saisie 87 : le fil occupe le reste. */
const H_FIL = 844 - 116 - 87;

/** Centre de l'aperçu reçu dans la conversation de l'ami (points), pour l'appui. */
export const PT_APERCU_RECU = { x: 160, y: 560 };

export const EcranGroupe: React.FC<{ envoi: number; haloApercu?: number }> = ({ envoi, haloApercu = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
    <EnteteFil nom={FIL.groupe} sous={FIL.membresGroupe} haut={ZONE_SURE} />
    <Fil
      hauteur={H_FIL}
      elements={[
        { cle: 's', noeud: <Separateur texte={FIL.aujourdhui} /> },
        ...FIL.questions.map((q, i) => ({ cle: `q${i}`, noeud: <BulleTexte de={q.de} texte={q.texte} heure={`10:${42 + i * 3}`} /> })),
        { cle: 'lien', p: envoi, noeud: <BulleLien doc={DOCS.umpj} url={URL_PARTAGE} heure="11:10" sortant halo={haloApercu} /> },
      ]}
    />
    <Saisie texte={FIL.saisie} bas={34} />
  </div>
);

export const EcranAmi: React.FC<{ haloApercu?: number }> = ({ haloApercu = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
    <EnteteFil nom={FIL.marie} sous={FIL.enLigne} haut={ZONE_SURE} initiale="M" />
    <Fil
      hauteur={H_FIL}
      bas={60}
      elements={[
        { cle: 's', noeud: <Separateur texte={FIL.aujourdhui} /> },
        { cle: 'lien', noeud: <BulleLien doc={DOCS.umpj} url={URL_PARTAGE} heure="11:12" halo={haloApercu} /> },
      ]}
    />
    <Saisie texte={FIL.saisie} bas={34} />
  </div>
);
