import React from 'react';
import { IoDocumentTextOutline, IoGlobeOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { DrapeauCM, DrapeauFR } from '../../ui/Drapeaux';
import { Doc, Portee, libellePortee } from '../donnees';

/**
 * Couvertures et pages de PDF dessinées en code (storyboard § 4 : « aplats + titre Fraunces »), et
 * carte de document posée sur la carte du monde. Tailles en pixels du repère où on les pose
 * (vidéo, ou points d'écran quand elles sont dans un téléphone).
 */

/** Rapport hauteur / largeur d'une page A4. */
export const A4 = 1.414;

/**
 * Couverture d'un document = page 1 du PDF : aplat de couleur, un grand disque en motif, surtitre
 * JetBrains Mono, titre Fraunces. `version` (facultatif) : mention « v1 » / « v2 » en pied de page ;
 * la v1 (P8) paraît passée, désaturée, pour que le remplacement se voie.
 */
export const Couverture: React.FC<{
  doc: Doc;
  largeur: number;
  version?: string;
  hauteur?: number;
  style?: React.CSSProperties;
}> = ({ doc, largeur, version, hauteur = largeur * A4, style }) => {
  const u = largeur / 100;
  const c = doc.couverture;
  return (
    <div
      style={{
        position: 'relative',
        width: largeur,
        height: hauteur,
        background: c.fond,
        overflow: 'hidden',
        flexShrink: 0,
        filter: version === 'v1' ? 'saturate(0.3) brightness(1.1)' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 120 * u,
          height: 120 * u,
          borderRadius: '50%',
          right: -48 * u,
          top: -40 * u,
          background: c.motif,
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 60 * u,
          height: 60 * u,
          borderRadius: '50%',
          left: -22 * u,
          bottom: 14 * u,
          border: `${1.6 * u}px solid ${c.motif}`,
          opacity: 0.35,
        }}
      />
      <div style={{ position: 'absolute', left: 9 * u, top: 12 * u, right: 9 * u }}>
        <div style={{ fontFamily: P.mono, fontSize: 5.4 * u, letterSpacing: 0.6 * u, color: S.parchment, opacity: 0.85, textTransform: 'uppercase' }}>
          {c.surtitre}
        </div>
        <div style={{ marginTop: 3 * u, width: 14 * u, height: 0.9 * u, background: c.motif }} />
        <div
          style={{
            marginTop: 6 * u,
            fontFamily: P.serif,
            fontWeight: 500,
            fontSize: 13 * u,
            lineHeight: 1.08,
            letterSpacing: -0.3 * u,
            color: S.white,
          }}
        >
          {c.lignes.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 9 * u,
          right: 9 * u,
          bottom: 7 * u,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontFamily: P.mono,
          fontSize: 4.6 * u,
          color: S.parchment,
          opacity: 0.85,
        }}
      >
        <span>CMCI</span>
        {version ? <span style={{ fontSize: 6 * u, fontWeight: 500, color: S.white }}>{version}</span> : null}
      </div>
    </div>
  );
};

/**
 * Page intérieure d'un PDF : papier blanc, titre de section et paragraphes en traits gris. `n` :
 * numéro de la page (varie la longueur des lignes).
 */
export const PagePdf: React.FC<{ largeur: number; n: number; titre?: string }> = ({ largeur, n, titre }) => {
  const u = largeur / 100;
  const lignes = Array.from({ length: 22 }, (_, i) => 62 + ((i * 37 + n * 13) % 30));
  return (
    <div style={{ position: 'relative', width: largeur, height: largeur * A4, background: '#FFFDF8', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: 10 * u, right: 10 * u, top: 10 * u }}>
        {titre ? (
          <div style={{ fontFamily: P.serif, fontSize: 6.4 * u, color: S.ink, lineHeight: 1.2, marginBottom: 4 * u }}>{titre}</div>
        ) : null}
        {lignes.map((l, i) => (
          <div
            key={i}
            style={{
              height: 1.5 * u,
              width: i % 6 === 5 ? `${l * 0.55}%` : `${l + 10}%`,
              background: 'rgba(42,38,32,0.16)',
              borderRadius: u,
              marginTop: i % 6 === 0 && i > 0 ? 5 * u : 2.6 * u,
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 5 * u, left: 0, right: 0, textAlign: 'center', fontFamily: P.mono, fontSize: 3.6 * u, color: S.ink3 }}>
        {n}
      </div>
    </div>
  );
};

/** Pastille de portée : globe (« Tout le ministère ») ou drapeau du pays. `taille` : police en px. */
export const MentionPortee: React.FC<{ portee: Portee; taille: number; couleur?: string }> = ({ portee, taille, couleur = S.ink2 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: taille * 0.4, fontFamily: P.sans, fontSize: taille, fontWeight: 600, color: couleur }}>
    {portee === 'monde' ? (
      <IoGlobeOutline size={taille * 1.2} color={S.moss} />
    ) : portee === 'FR' ? (
      <DrapeauFR largeur={taille * 1.3} />
    ) : (
      <DrapeauCM largeur={taille * 1.3} />
    )}
    <span>{libellePortee(portee)}</span>
  </div>
);

/**
 * Carte de document posée sur la carte du monde (P5, P6) : vignette de couverture, titre Fraunces,
 * portée. Annotation vidéo, pas un écran de l'app. `largeur` en pixels vidéo.
 */
export const CarteDoc: React.FC<{ doc: Doc; largeur?: number; style?: React.CSSProperties }> = ({ doc, largeur = 380, style }) => (
  <div
    style={{
      width: largeur,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '14px 18px 14px 14px',
      borderRadius: 22,
      background: S.paper2,
      border: '1px solid rgba(42,38,32,0.08)',
      boxShadow: '0 18px 40px rgba(42,38,32,0.18)',
      ...style,
    }}
  >
    <div style={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 4px 10px rgba(42,38,32,0.2)' }}>
      <Couverture doc={doc} largeur={62} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: P.serif, fontSize: 29, lineHeight: '34px', color: S.ink, letterSpacing: -0.4 }}>{doc.titre}</div>
      <div style={{ marginTop: 8 }}>
        <MentionPortee portee={doc.portee} taille={22} />
      </div>
    </div>
  </div>
);

/** Petite icône de document (P3 : le fichier arrive dans chaque pays). */
export const IconeFichier: React.FC<{ taille: number; couleur?: string }> = ({ taille, couleur = S.clay }) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille * 0.28,
      background: S.paper2,
      boxShadow: '0 6px 14px rgba(42,38,32,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <IoDocumentTextOutline size={taille * 0.62} color={couleur} />
  </div>
);
