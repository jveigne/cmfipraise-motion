import React from 'react';
import { IoArrowForward, IoChevronBack, IoClose, IoLibraryOutline, IoShareOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Halo } from '../../evenements/ui/app';
import { Doc } from '../donnees';
import { APP } from '../textes';
import { A4, Couverture, PagePdf } from '../ui/Couverture';

/**
 * Lecteur d'un document (`app/d/[slug].tsx`) : en-tête papier (retour, titre sur une ligne,
 * sous-titre « catégorie », bouton « Partager »), bandeau d'indicateur (« Page 1 / 12 », ou
 * « Aperçu — page 5 sur 5 offertes » en argile), pages du PDF sur fond `parchmentDeep`
 * (`react-native-pdf` : pleine largeur, 8 points d'écart), barre du bas « D'autres documents » pour
 * un compte rattaché, mur de fin d'aperçu pour un lecteur sans compte.
 */

/** Géométrie (points) : en-tête jusqu'à 116, bandeau jusqu'à 143. */
export const PT_LECTEUR = {
  partager: { x: 359, y: 87 },
  corps: 143,
  /** Hauteur d'une page (pleine largeur 390) et écart entre pages. */
  page: 390 * A4,
  ecart: 8,
} as const;

/** Défilement (points) qui amène le haut de la page `n` (1 = première) en haut du corps. */
export const defilementPage = (n: number) => -(n - 1) * (PT_LECTEUR.page + PT_LECTEUR.ecart);

/** Page affichée par l'indicateur pour un défilement donné (celle qui occupe le haut du corps). */
export const pageVisible = (defilement: number) => Math.floor(-defilement / (PT_LECTEUR.page + PT_LECTEUR.ecart) + 0.5) + 1;

export const EcranLecteur: React.FC<{
  doc: Doc;
  sousTitre?: string;
  /** Défilement des pages (points, négatif vers le bas). */
  defilement?: number;
  /** Aperçu (lecteur sans compte) : `offertes` pages, indicateur argile, pas de barre du bas. */
  apercu?: boolean;
  offertes?: number;
  /** Mur de fin d'aperçu (0 → 1 : il monte du bas). */
  mur?: number;
  haloPartager?: number;
  haloBoutons?: number;
  /** Mention de version sur la couverture (P8). */
  version?: string;
}> = ({ doc, sousTitre, defilement = 0, apercu = false, offertes = doc.pages, mur = 0, haloPartager = 0, haloBoutons = 0, version }) => {
  const total = apercu ? offertes : doc.pages;
  const page = Math.min(total, pageVisible(defilement));
  const indicateur = apercu ? APP.reader.previewIndicator(page, offertes) : APP.reader.pageIndicator(page, total);
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div style={{ position: 'absolute', inset: 0, background: S.parchment, fontFamily: P.sans, color: S.ink, overflow: 'hidden' }}>
      {/* Corps : les pages défilent sous l'en-tête. */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: PT_LECTEUR.corps, bottom: 0, background: S.parchmentDeep, overflow: 'hidden' }}>
        <div style={{ transform: `translateY(${defilement}px)`, display: 'flex', flexDirection: 'column', gap: PT_LECTEUR.ecart }}>
          {pages.map((n) =>
            n === 1 ? <Couverture key={n} doc={doc} largeur={390} version={version} /> : <PagePdf key={n} largeur={390} n={n} titre={n === 2 ? doc.titre : undefined} />,
          )}
        </div>
      </div>

      {/* En-tête léger. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          paddingTop: 67,
          paddingBottom: 8,
          paddingLeft: 14,
          paddingRight: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: S.paper,
          borderBottom: `1px solid ${S.hair}`,
        }}
      >
        <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IoChevronBack size={22} color={S.ink2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '23px', letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.titre}</div>
          {sousTitre ? <div style={{ fontSize: 12.5, lineHeight: '16px', color: S.ink3, marginTop: 1 }}>{sousTitre}</div> : null}
        </div>
        <Halo intensite={haloPartager} rayon={17} marge={2}>
          <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IoShareOutline size={21} color={S.moss} />
          </div>
        </Halo>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 116,
          height: 27,
          boxSizing: 'border-box',
          padding: '6px 20px',
          background: S.paper2,
          borderBottom: `1px solid ${S.hair}`,
          fontFamily: P.mono,
          fontSize: 11,
          lineHeight: '15px',
          letterSpacing: 0.6,
          color: apercu ? S.clay : S.ink2,
        }}
      >
        {indicateur}
      </div>

      {/* « D'autres documents » : compte rattaché seulement (`showMore`). */}
      {!apercu ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 14px 44px', background: S.paper, borderTop: `1px solid ${S.hair}` }}>
          <Bouton label={APP.reader.more} variante="soft" hauteur={46} icone={<IoLibraryOutline size={17} color={S.mossDeep} />} />
        </div>
      ) : null}

      {apercu && mur > 0.001 ? <Mur doc={doc} offertes={offertes} p={mur} haloBoutons={haloBoutons} /> : null}
    </div>
  );
};

/** Hauteur du mur ouvert (points), pour le faire monter du bas. */
const HAUT_MUR = 470;

/**
 * Mur de fin d'aperçu (RG-DOC-01), version « non connecté » : carte papier rayon 22, fermer, titre
 * Fraunces 20, texte, « Encore 7 pages » (JetBrains Mono argile, majuscules), indication, boutons
 * « Se connecter » → et « Créer un compte ».
 */
const Mur: React.FC<{ doc: Doc; offertes: number; p: number; haloBoutons: number }> = ({ doc, offertes, p, haloBoutons }) => {
  const reste = doc.pages - offertes;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 14px 46px', transform: `translateY(${(1 - p) * HAUT_MUR}px)` }}>
      <div
        style={{
          position: 'relative',
          padding: 20,
          borderRadius: R.lg,
          background: S.paper,
          border: '1px solid rgba(42,38,32,0.07)',
          boxShadow: '0 -10px 30px rgba(42,38,32,0.16)',
        }}
      >
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <IoClose size={18} color={S.ink3} />
        </div>
        <div style={{ fontFamily: P.serif, fontSize: 20, lineHeight: '25px', letterSpacing: -0.2, paddingRight: 24 }}>{APP.wall.title(doc.titre)}</div>
        <div style={{ fontSize: 14, lineHeight: '20px', color: S.ink2, marginTop: 8 }}>{APP.wall.body}</div>
        <div style={{ fontFamily: P.mono, fontSize: 11.5, lineHeight: '15px', color: S.clay, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 10 }}>
          {APP.wall.remaining(reste)}
        </div>
        <div style={{ fontSize: 13, lineHeight: '19px', color: S.ink3, marginTop: 10 }}>{APP.wall.loginHint}</div>
        <Halo intensite={haloBoutons} rayon={20} marge={4}>
          <div>
            <Bouton label={APP.wall.login} hauteur={50} style={{ marginTop: 12 }} iconeDroite={<IoArrowForward size={18} color={S.white} />} />
            <Bouton label={APP.wall.signup} variante="soft" hauteur={46} style={{ marginTop: 8 }} />
          </div>
        </Halo>
      </div>
    </div>
  );
};
