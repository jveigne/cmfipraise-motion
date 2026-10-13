import React from 'react';
import { interpolate, interpolateColors, spring, useVideoConfig } from 'remotion';
import {
  IoChevronForward,
  IoHeartOutline,
  IoHome,
  IoLanguage,
  IoMenu,
  IoMusicalNote,
  IoPricetag,
  IoPricetagOutline,
  IoSearch,
  IoVideocam,
} from 'react-icons/io5';
import { Couleurs, Polices } from '../theme';
import { Langue, Textes } from '../textes';
import { CONTENU, Categorie } from '../donnees';
import { LigneChant } from './LigneChant';
import { DrapeauFR, DrapeauUK } from './Drapeaux';

const MARGE = 15;

/**
 * Écran Recueils, redessiné d'après la capture de l'app (13/10/2026).
 *
 * - `onglet` : 0 = Langue, 1 = Catégorie, 2 = Favoris (valeur continue : la pastille glisse).
 * - `tCategorie` / `tFavoris` : images écoulées depuis l'ouverture de l'onglet (négatif avant).
 * - `surbrillance` : index (continu) de la catégorie mise en avant, ou null.
 * - `defilement` : décalage vertical de la liste, en points.
 * - `bascule` : 0 → liste dans la langue de la vidéo, 1 → dans l'autre langue (plan 7).
 */
export const EcranRecueils: React.FC<{
  textes: Textes;
  onglet: number;
  tCategorie: number;
  tFavoris?: number;
  surbrillance?: number | null;
  defilement?: number;
  bascule?: number;
  /** Force de la mise en avant (0..1), pour l'allumer et l'éteindre en fondu. */
  intensite?: number;
}> = ({ textes, onglet, tCategorie, tFavoris = -100, surbrillance = null, defilement = 0, bascule = 0, intensite = 1 }) => {
  const { fps } = useVideoConfig();
  const e = textes.ecran;
  const largeurSegment = (ECRAN_L - 2 * MARGE - 6) / 3;

  const libelles: { texte: string; icone: React.ReactNode }[] = [
    { texte: e.langue, icone: <IoLanguage size={18} /> },
    { texte: e.categorie, icone: <IoPricetagOutline size={18} /> },
    { texte: e.favoris, icone: <IoHeartOutline size={18} /> },
  ];

  const opaciteLangue = interpolate(tCategorie, [-6, 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: Polices.sans, color: Couleurs.encre }}>
      {/* En-tête */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: Polices.serif, fontWeight: 600, fontSize: 34, letterSpacing: -0.6 }}>
          {e.titre}
        </span>
        <IoSearch size={24} />
      </div>

      {/* Sélecteur segmenté */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: MARGE,
          right: MARGE,
          height: 40,
          padding: 3,
          borderRadius: 12,
          background: Couleurs.filet,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: 3 + onglet * largeurSegment,
            width: largeurSegment,
            height: 34,
            borderRadius: 9,
            background: Couleurs.bleuCmfi,
          }}
        />
        <div style={{ position: 'relative', display: 'flex', height: 34 }}>
          {libelles.map((l, i) => {
            const actif = Math.max(0, 1 - Math.abs(onglet - i));
            const couleur = interpolateColors(actif, [0, 1], [Couleurs.ardoise, Couleurs.surface]);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 16,
                  color: couleur,
                }}
              >
                {l.icone}
                {l.texte}
              </div>
            );
          })}
        </div>
      </div>

      {/* Onglet Langue */}
      <div style={{ position: 'absolute', top: 166, left: MARGE, right: MARGE, opacity: opaciteLangue }}>
        {[
          { nom: 'Français', drapeau: <DrapeauFR largeur={30} /> },
          { nom: 'English', drapeau: <DrapeauUK largeur={30} id="uk-langue" /> },
        ].map((l) => (
          <div key={l.nom} style={{ ...carte, padding: '20px 16px' }}>
            {l.drapeau}
            <span style={{ flex: 1, fontFamily: Polices.serif, fontWeight: 600, fontSize: 20 }}>{l.nom}</span>
            <IoChevronForward size={20} color={Couleurs.gris} />
          </div>
        ))}
      </div>

      {/* Onglet Catégorie */}
      {tCategorie > -6 ? (
        <div
          style={{
            position: 'absolute',
            top: 164,
            left: 0,
            right: 0,
            bottom: 84,
            overflow: 'hidden',
            opacity: interpolate(onglet, [1, 1.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ transform: `translateY(${defilement}px)` }}>
            <div
              style={{
                display: 'flex',
                gap: 8,
                margin: `0 ${MARGE - 3}px 14px`,
                opacity: interpolate(tCategorie, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            >
              <Bascule actif={poidsLangue('fr', textes.langueListe, bascule)} libelle="Français" drapeau={<DrapeauFR largeur={24} />} />
              <Bascule actif={poidsLangue('en', textes.langueListe, bascule)} libelle="English" drapeau={<DrapeauUK largeur={26} id="uk-bascule" />} />
            </div>
            <div style={{ position: 'relative' }}>
              <ListeCategories
                categories={CONTENU.categories[textes.langueListe]}
                textes={textes}
                tCategorie={tCategorie}
                surbrillance={surbrillance}
                intensite={intensite}
                opacite={1 - bascule}
                decalage={-bascule * 30}
              />
              {bascule > 0 ? (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                  <ListeCategories
                    categories={CONTENU.categories[autre(textes.langueListe)]}
                    textes={textes}
                    tCategorie={1000}
                    surbrillance={null}
                    intensite={0}
                    opacite={bascule}
                    decalage={(1 - bascule) * 30}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Onglet Favoris : les chants directement, sans écran intermédiaire */}
      {tFavoris > -4 ? (
        <div style={{ position: 'absolute', top: 166, left: MARGE, right: MARGE }}>
          {CONTENU.favoris[textes.langueListe].map((c, i) => {
            const p = spring({ frame: tFavoris - i * 3, fps, config: { damping: 200 } });
            return (
              <LigneChant
                key={i}
                chant={c}
                favori
                style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}
              />
            );
          })}
        </div>
      ) : null}

      <BarreOnglets libelles={e.onglets} />
    </div>
  );
};

const autre = (l: Langue): Langue => (l === 'fr' ? 'en' : 'fr');

/** Poids actif (0..1) d'un bouton de la bascule de langue. */
const poidsLangue = (l: Langue, initiale: Langue, bascule: number) => (l === initiale ? 1 - bascule : bascule);

const ListeCategories: React.FC<{
  categories: Categorie[];
  textes: Textes;
  tCategorie: number;
  surbrillance: number | null;
  intensite: number;
  opacite: number;
  decalage: number;
}> = ({ categories, textes, tCategorie, surbrillance, intensite, opacite, decalage }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ opacity: opacite, transform: `translateX(${decalage}px)` }}>
      {categories.map((c, i) => {
        const p = spring({ frame: tCategorie - 4 - Math.min(i, 8) * 3, fps, config: { damping: 200 } });
        const k = surbrillance === null ? 0 : intensite * Math.max(0, 1 - Math.abs(surbrillance - i));
        return (
          <div
            key={c.nom}
            style={{
              ...carte,
              margin: `0 ${MARGE}px 9px`,
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px) scale(${1 + 0.035 * k})`,
              borderColor: interpolateColors(k, [0, 1], ['rgba(22,104,184,0)', Couleurs.bleuCmfi]),
              boxShadow: `0 ${2 + 10 * k}px ${8 + 20 * k}px rgba(18,23,28,${0.04 + 0.1 * k})`,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                background: Couleurs.bleuClair,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IoPricetag size={18} color={Couleurs.bleuCmfi} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: Polices.serif, fontWeight: 600, fontSize: 18.5, lineHeight: 1.15 }}>
                {c.nom}
              </div>
              <div style={{ fontSize: 14.5, color: Couleurs.ardoise, marginTop: 3 }}>
                {textes.ecran.chants(c.chants)}
              </div>
            </div>
            <IoChevronForward size={20} color={Couleurs.gris} />
          </div>
        );
      })}
    </div>
  );
};

const ECRAN_L = 390;

const carte: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px 14px 14px',
  marginBottom: 10,
  borderRadius: 14,
  background: Couleurs.surface,
  border: '1.5px solid rgba(22,104,184,0)',
  boxShadow: '0 2px 8px rgba(18,23,28,0.04)',
};

const Bascule: React.FC<{ actif: number; libelle: string; drapeau: React.ReactNode }> = ({
  actif,
  libelle,
  drapeau,
}) => (
  <div
    style={{
      flex: 1,
      height: 42,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      fontSize: 17,
      fontWeight: 500,
      color: interpolateColors(actif, [0, 1], [Couleurs.ardoise, Couleurs.bleuCmfi]),
      background: interpolateColors(actif, [0, 1], [Couleurs.surface, Couleurs.bleuToggle]),
      border: `1.5px solid ${interpolateColors(actif, [0, 1], [Couleurs.filet, Couleurs.bleuCmfi])}`,
    }}
  >
    {drapeau}
    {libelle}
  </div>
);

export const BarreOnglets: React.FC<{ libelles: [string, string, string, string] }> = ({ libelles }) => {
  const icones = [IoHome, IoMusicalNote, IoVideocam, IoMenu];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        background: Couleurs.surface,
        borderTop: `1px solid ${Couleurs.filet}`,
        display: 'flex',
        paddingTop: 8,
      }}
    >
      {libelles.map((l, i) => {
        const Icone = icones[i];
        const couleur = i === 1 ? Couleurs.bleuCmfi : Couleurs.gris;
        return (
          <div
            key={l}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: couleur }}
          >
            <Icone size={25} />
            <span style={{ fontSize: 12 }}>{l}</span>
          </div>
        );
      })}
    </div>
  );
};
