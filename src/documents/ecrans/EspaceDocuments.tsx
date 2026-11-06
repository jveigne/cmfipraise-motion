import React from 'react';
import { IoChevronBack, IoChevronForward, IoDocumentTextOutline, IoFolderOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Champ, Etiquette, Halo } from '../../evenements/ui/app';
import { Doc, libellePortee } from '../donnees';
import { APP } from '../textes';

/**
 * Espace Documents (`app/documents/index.tsx`) : `ScreenShell` sans barre d'onglets, chevron de
 * retour, surtitre (« Enseignements » à la racine, fil d'Ariane « Documents » dans un dossier),
 * titre, champ de recherche, puis les blocs « Dossiers » (`FolderRow`) et documents
 * (`DocumentRow` : titre sur 2 lignes au plus, « portée · N pages »).
 *
 * Les hauteurs de ligne sont posées explicitement : les plans s'en servent pour placer les appuis
 * (repère 390 × 844 du `Telephone`).
 */

/** Haut du premier bloc (label) : zone sûre 59 + 12, retour 22, surtitre, titre, recherche. */
const HAUT_BLOC = 241;
/** Hauteur d'une ligne de dossier ou de document à titre sur une ligne ; 84 sur deux lignes. */
export const H_LIGNE = 64;
export const H_LIGNE_2 = 84;
const ECART = 8;
/** Titre assez long pour passer sur deux lignes (≈ 26 signes en Fraunces 16 sur 236 points). */
const surDeuxLignes = (t: string) => t.length > 26;
export const hauteurDoc = (d: Doc) => (surDeuxLignes(d.titre) ? H_LIGNE_2 : H_LIGNE);

/** Haut (points) de la ligne `i` d'un bloc qui commence en `haut`. */
export const hautLigne = (hauteurs: readonly number[], i: number, haut = HAUT_BLOC + 23) =>
  haut + hauteurs.slice(0, i).reduce((a, h) => a + h + ECART, 0);

/** Centre de la ligne `i` du premier bloc. */
export const centreLigne = (hauteurs: readonly number[], i: number) => ({ x: 195, y: hautLigne(hauteurs, i) + hauteurs[i] / 2 });

const Ligne: React.FC<{
  icone: React.ReactNode;
  fondIcone: string;
  titre: string;
  meta: string;
  hauteur: number;
  halo?: number;
  teinte?: string;
  style?: React.CSSProperties;
}> = ({ icone, fondIcone, titre, meta, hauteur, halo = 0, teinte, style }) => (
  <Halo intensite={halo} rayon={R.md} teinte={teinte}>
    <div
      style={{
        height: hauteur,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 14px',
        borderRadius: R.md,
        background: S.paper,
        border: `1px solid ${S.hair}`,
        ...style,
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: R.sm, background: fondIcone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icone}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: P.serif,
            fontSize: 16,
            lineHeight: '20px',
            color: S.ink,
            letterSpacing: -0.1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {titre}
        </div>
        <div style={{ fontSize: 12.5, lineHeight: '16px', color: S.ink3, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</div>
      </div>
      <IoChevronForward size={18} color={S.ink3} />
    </div>
  </Halo>
);

/** `DocumentRow` : « portée · N pages » (pas d'auteur dans les données fictives). */
export const LigneDocument: React.FC<{ doc: Doc; halo?: number; teinte?: string; pages?: number; style?: React.CSSProperties }> = ({
  doc,
  halo,
  teinte,
  pages = doc.pages,
  style,
}) => (
  <Ligne
    icone={<IoDocumentTextOutline size={20} color={S.moss} />}
    fondIcone={S.mossTint}
    titre={doc.titre}
    meta={[libellePortee(doc.portee), APP.space.pages(pages)].join(' · ')}
    hauteur={hauteurDoc(doc)}
    halo={halo}
    teinte={teinte}
    style={style}
  />
);

export const EcranEspace: React.FC<{
  /** Dossier ouvert (fil d'Ariane « Documents », titre = nom du dossier) ; absent : la racine. */
  dossier?: string;
  dossiers?: readonly { nom: string; compte: number }[];
  docs?: readonly Doc[];
  /** Libellé du bloc de documents : « Sans dossier » à la racine, « Documents » dans un dossier. */
  haloDossier?: number;
  /** Surbrillance de chaque ligne de document (0 → 1) et sa teinte « r,g,b ». */
  halos?: readonly number[];
  teintes?: readonly (string | undefined)[];
  /** Entrée de chaque ligne de document (0 → 1, P6 : elles se posent). */
  entrees?: readonly number[];
  /** Calque posé dans l'écran (P6 : la carte fantôme). */
  calque?: React.ReactNode;
}> = ({ dossier, dossiers = [], docs = [], haloDossier = 0, halos = [], teintes = [], entrees = [], calque }) => (
  <div style={{ position: 'absolute', inset: 0, background: S.parchment, overflow: 'hidden', fontFamily: P.sans, color: S.ink }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: '71px 20px 0' }}>
      <div style={{ height: 22, display: 'flex', alignItems: 'center' }}>
        <IoChevronBack size={22} color={S.ink2} />
      </div>
      <div style={{ marginTop: 10, fontFamily: P.mono, fontSize: 11, lineHeight: '14px', color: S.clay, letterSpacing: 1.2, textTransform: 'uppercase' }}>
        {dossier ? APP.space.title : APP.space.kicker}
      </div>
      <div style={{ marginTop: 4, fontFamily: P.serif, fontSize: 28, lineHeight: '34px', color: S.ink, letterSpacing: -0.4 }}>{dossier ?? APP.space.title}</div>
      <div style={{ marginTop: 16 }}>
        <Champ indication={APP.space.searchPlaceholder} hauteur={50} />
      </div>

      {dossiers.length > 0 ? (
        <div style={{ marginTop: 20 }}>
          <Etiquette style={{ lineHeight: '15px', marginBottom: 8 }}>{APP.space.folders}</Etiquette>
          <div style={{ display: 'flex', flexDirection: 'column', gap: ECART }}>
            {dossiers.map((d, i) => (
              <Ligne
                key={d.nom}
                icone={<IoFolderOutline size={20} color={S.clay} />}
                fondIcone={S.paper2}
                titre={d.nom}
                meta={APP.space.documentCount(d.compte)}
                hauteur={H_LIGNE}
                halo={i === 0 ? haloDossier : 0}
              />
            ))}
          </div>
        </div>
      ) : null}

      {docs.length > 0 ? (
        <div style={{ marginTop: 20 }}>
          <Etiquette style={{ lineHeight: '15px', marginBottom: 8 }}>{dossier ? APP.space.documents : APP.space.unfiled}</Etiquette>
          <div style={{ display: 'flex', flexDirection: 'column', gap: ECART }}>
            {docs.map((d, i) => {
              const e = entrees[i] ?? 1;
              return (
                <div key={d.titre} style={{ opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
                  <LigneDocument doc={d} halo={halos[i]} teinte={teintes[i]} />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {calque}
    </div>
  </div>
);
