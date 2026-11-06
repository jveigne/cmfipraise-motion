import React from 'react';
import { IoChevronBack, IoDocumentTextOutline, IoPeople } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Doc } from '../donnees';
import { APP } from '../textes';
import { Couverture } from './Couverture';

/**
 * Conversation de groupe STYLISÉE (storyboard § 2) : bulles neutres aux couleurs de Shephr, aucun
 * logo, aucun vert, aucun nom d'application — on ne copie pas une marque. Tout est en points
 * (repère 390 de large) : posée telle quelle dans un téléphone (P9), agrandie par `scale` hors
 * téléphone (P1, P2).
 */

export const FIL_COULEURS = {
  fond: '#EFE6D3',
  recu: '#FFFCF5',
  envoye: '#DCCFB2',
  entete: S.paper,
};

/** Couleur du nom de chaque membre du groupe. */
const NOMS: Record<string, string> = {
  Marc: S.earthDeep,
  Sophie: S.clay,
  Jean: S.mossSoft,
  Paul: S.sauge,
  Marie: S.moss,
};

/** En-tête de la conversation : retour, avatar du groupe, nom, membres. `haut` : zone sûre. */
export const EnteteFil: React.FC<{ nom: string; sous: string; haut?: number; initiale?: string }> = ({ nom, sous, haut = 0, initiale }) => (
  <div
    style={{
      paddingTop: haut + 8,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: FIL_COULEURS.entete,
      borderBottom: `1px solid ${S.hair}`,
      fontFamily: P.sans,
    }}
  >
    <IoChevronBack size={22} color={S.ink2} />
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        background: initiale ? S.moss : S.parchmentDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: S.white,
        fontFamily: P.serif,
        fontSize: 17,
        flexShrink: 0,
      }}
    >
      {initiale ?? <IoPeople size={20} color={S.ink2} />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: S.ink, lineHeight: '20px' }}>{nom}</div>
      <div style={{ fontSize: 12, color: S.ink3, lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sous}</div>
    </div>
  </div>
);

/** Pastille de date au milieu du fil. */
export const Separateur: React.FC<{ texte: string }> = ({ texte }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
    <div
      style={{
        padding: '4px 12px',
        borderRadius: 8,
        background: 'rgba(245,236,216,0.95)',
        fontFamily: P.sans,
        fontSize: 12,
        fontWeight: 600,
        color: S.ink3,
        boxShadow: '0 1px 2px rgba(42,38,32,0.08)',
      }}
    >
      {texte}
    </div>
  </div>
);

/** Bulle générique, reçue (à gauche, avec le nom) ou envoyée (à droite). */
const Bulle: React.FC<{ de?: string; sortant?: boolean; heure: string; largeur?: number | string; children: React.ReactNode }> = ({
  de,
  sortant,
  heure,
  largeur,
  children,
}) => (
  <div style={{ display: 'flex', justifyContent: sortant ? 'flex-end' : 'flex-start', padding: '3px 0' }}>
    <div
      style={{
        maxWidth: '82%',
        width: largeur,
        boxSizing: 'border-box',
        padding: '7px 10px 6px',
        borderRadius: 14,
        borderTopLeftRadius: sortant ? 14 : 4,
        borderTopRightRadius: sortant ? 4 : 14,
        background: sortant ? FIL_COULEURS.envoye : FIL_COULEURS.recu,
        boxShadow: '0 1px 2px rgba(42,38,32,0.10)',
        fontFamily: P.sans,
        color: S.ink,
      }}
    >
      {de && !sortant ? <div style={{ fontSize: 12.5, fontWeight: 700, color: NOMS[de] ?? S.ink2, lineHeight: '17px', marginBottom: 1 }}>{de}</div> : null}
      {children}
      <div style={{ textAlign: 'right', fontSize: 10.5, color: S.ink3, lineHeight: '13px', marginTop: 2 }}>{heure}</div>
    </div>
  </div>
);

export const BulleTexte: React.FC<{ de?: string; texte: string; heure: string; sortant?: boolean }> = ({ de, texte, heure, sortant }) => (
  <Bulle de={de} heure={heure} sortant={sortant}>
    <div style={{ fontSize: 15.5, lineHeight: '21px' }}>{texte}</div>
  </Bulle>
);

/** Bulle « fichier » : icône PDF, nom du fichier, taille. `halo` : surbrillance argile (0 → 1). */
export const BulleFichier: React.FC<{ de?: string; fichier: string; meta: string; heure: string; sortant?: boolean; halo?: number }> = ({
  de,
  fichier,
  meta,
  heure,
  sortant,
  halo = 0,
}) => (
  <Bulle de={de} heure={heure} sortant={sortant} largeur={300}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 8px',
        borderRadius: 10,
        background: sortant ? 'rgba(255,255,255,0.35)' : 'rgba(42,38,32,0.05)',
        outline: halo > 0 ? `2.5px solid rgba(184,106,74,${0.9 * halo})` : undefined,
      }}
    >
      <div
        style={{
          width: 34,
          height: 42,
          borderRadius: 5,
          background: S.clay,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: S.white,
          flexShrink: 0,
        }}
      >
        <IoDocumentTextOutline size={16} color={S.white} />
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.5, marginTop: 1 }}>PDF</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: '18px', wordBreak: 'break-all' }}>{fichier}</div>
        <div style={{ fontSize: 11.5, color: S.ink3, lineHeight: '15px', marginTop: 1 }}>{meta}</div>
      </div>
    </div>
  </Bulle>
);

/**
 * Bulle de lien avec son aperçu (P9) : vignette de la couverture (l'image OpenGraph `cover.jpg`),
 * titre, description par défaut, domaine ; puis le message partagé (titre et lien, comme
 * `Share.share` de app/d/[slug].tsx). `halo` : surbrillance de l'aperçu (0 → 1).
 */
export const BulleLien: React.FC<{ doc: Doc; url: string; heure: string; sortant?: boolean; de?: string; halo?: number }> = ({
  doc,
  url,
  heure,
  sortant,
  de,
  halo = 0,
}) => (
  <Bulle de={de} heure={heure} sortant={sortant} largeur={292}>
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        background: sortant ? 'rgba(255,255,255,0.45)' : 'rgba(42,38,32,0.05)',
        outline: halo > 0 ? `2.5px solid rgba(184,106,74,${0.9 * halo})` : undefined,
      }}
    >
      {/* Image d'aperçu (la couverture, portrait) à gauche, texte à droite. */}
      <div style={{ display: 'flex', gap: 10, padding: 8 }}>
        <div style={{ borderRadius: 6, overflow: 'hidden', flexShrink: 0, alignSelf: 'flex-start' }}>
          <Couverture doc={doc} largeur={74} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: '18px' }}>{doc.titre}</div>
          <div style={{ fontSize: 12, color: S.ink2, lineHeight: '16px', marginTop: 3 }}>{APP.apercuDescription}</div>
          <div style={{ fontSize: 11.5, color: S.ink3, lineHeight: '15px', marginTop: 4 }}>{APP.domaine}</div>
        </div>
      </div>
    </div>
    <div style={{ fontSize: 14.5, lineHeight: '20px', marginTop: 6 }}>
      {doc.titre}
      <br />
      <span style={{ color: S.mossSoft, textDecoration: 'underline', wordBreak: 'break-all' }}>{url}</span>
    </div>
  </Bulle>
);

/**
 * Fil de messages calé en bas (le plus récent en bas, comme toute messagerie) : ce qui dépasse
 * sort par le haut. Chaque élément a son entrée `p` (0 → 1) : il s'ouvre en hauteur (`maxHeight`)
 * et pousse le fil vers le haut. `decalage` : défilement supplémentaire vers le haut (points).
 */
export const Fil: React.FC<{
  hauteur: number;
  elements: { cle: string; p?: number; noeud: React.ReactNode }[];
  decalage?: number;
  bas?: number;
}> = ({ hauteur, elements, decalage = 0, bas = 8 }) => (
  <div style={{ position: 'relative', height: hauteur, overflow: 'hidden', background: FIL_COULEURS.fond }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bas,
        padding: '0 10px',
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${-decalage}px)`,
      }}
    >
      {elements.map(({ cle, p = 1, noeud }) =>
        p <= 0.001 ? null : (
          <div key={cle} style={{ maxHeight: p >= 0.999 ? undefined : 260 * p, overflow: p >= 0.999 ? undefined : 'hidden', opacity: Math.min(1, p * 1.6) }}>
            {noeud}
          </div>
        ),
      )}
    </div>
  </div>
);

/** Barre de saisie du bas (neutre). */
export const Saisie: React.FC<{ texte: string; bas?: number }> = ({ texte, bas = 0 }) => (
  <div style={{ padding: `8px 12px ${8 + bas}px`, background: FIL_COULEURS.entete, borderTop: `1px solid ${S.hair}`, display: 'flex', gap: 10, alignItems: 'center' }}>
    <div style={{ flex: 1, height: 36, borderRadius: 18, background: S.paper2, border: `1px solid ${S.hair}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: P.sans, fontSize: 14.5, color: S.ink3 }}>
      {texte}
    </div>
    <div style={{ width: 36, height: 36, borderRadius: 18, background: S.moss, opacity: 0.85 }} />
  </div>
);
