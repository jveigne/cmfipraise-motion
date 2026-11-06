import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoHome } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Plateau } from '../../ui/Plateau';
import { Appui, LegendeEtude, Voile, haloEntre, lisse, montee, voilePour } from '../../etude/plans/commun';
import { CARTONS, LEGENDES } from '../textes';
import { ASSEMBLEES, CleAssemblee, HORS_CHAINE, PERSONNES } from '../donnees';
import { EcranHierarchieCaleb, rangeeArbre } from '../ecrans/Hierarchie';

/**
 * Partie « 1 · La chaîne » : P3, l'illustration « pas la carte, la chaîne » (les assemblées
 * quittent la carte des villes pour se ranger sous la personne à qui leur dirigeant rend compte ;
 * Évry Sud, hors de la chaîne, s'efface) ; P4, l'arbre de la Hiérarchie dans l'app, jusqu'à Évry
 * Centre, dans une autre ville, sous Nadège, qui rend compte à Marc.
 */
export const DUREE_P3 = 240;
export const DUREE_P4 = 300;

// ---------------------------------------------------------------------------------------------
// P3 — la carte, puis la chaîne (illustration)

/** Pastille d'assemblée : maison sur rond terre. */
const Maison: React.FC<{ taille: number; teinte?: string }> = ({ taille, teinte = S.earthDeep }) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille / 2,
      background: S.paper,
      border: `3px solid ${teinte}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px rgba(42,38,32,0.12)',
      boxSizing: 'border-box',
    }}
  >
    <IoHome size={taille * 0.48} color={teinte} />
  </div>
);

/** Rangées de l'arbre (pixels vidéo) : personne, profondeur, assemblée dirigée. */
const ARBRE: { cle: keyof typeof PERSONNES; profondeur: number; assemblee?: CleAssemblee }[] = [
  { cle: 'daniel', profondeur: 0 },
  { cle: 'sophie', profondeur: 1, assemblee: 'est' },
  { cle: 'thomas', profondeur: 1, assemblee: 'nord' },
  { cle: 'samuel', profondeur: 1, assemblee: 'ouest' },
  { cle: 'marc', profondeur: 1, assemblee: 'sud' },
  { cle: 'nadege', profondeur: 2, assemblee: 'evry' },
];
const Y0 = 560;
const PAS = 168;
const X0 = 110;
const RETRAIT = 120;
const AVATAR = 96;
const xRangee = (p: number) => X0 + p * RETRAIT;
const yRangee = (i: number) => Y0 + i * PAS;
/** Où la maison d'une assemblée se pose dans l'arbre (centre). */
const posArbre = (i: number) => ({ x: xRangee(ARBRE[i].profondeur) + AVATAR + 50, y: yRangee(i) + 92 });

/** Les maisons sur la carte (centre) : quatre à Paris, deux à Évry (dont Évry Sud, hors chaîne). */
const CARTE: Record<CleAssemblee | 'evrySud', { x: number; y: number }> = {
  nord: { x: 540, y: 640 },
  ouest: { x: 280, y: 830 },
  est: { x: 790, y: 790 },
  sud: { x: 560, y: 1010 },
  evry: { x: 380, y: 1440 },
  evrySud: { x: 720, y: 1500 },
};

const Zone: React.FC<{ x: number; y: number; l: number; h: number; nom: string; opacite: number }> = ({ x, y, l, h, nom, opacite }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: l,
      height: h,
      borderRadius: 70,
      background: 'rgba(215,199,166,0.35)',
      border: `3px dashed ${S.parchmentDeep}`,
      opacity: opacite,
    }}
  >
    <div style={{ position: 'absolute', left: 44, top: 30, fontFamily: P.mono, fontWeight: 500, fontSize: 34, letterSpacing: 4, color: S.ink3 }}>{nom}</div>
  </div>
);

/** Une maison qui quitte la carte pour sa place dans l'arbre (`p` de 0 à 1). */
const MaisonMobile: React.FC<{ de: { x: number; y: number }; vers: { x: number; y: number }; p: number; nom: string; ville: string; halo?: number }> = ({
  de,
  vers,
  p,
  nom,
  ville,
  halo = 0,
}) => {
  const x = de.x + (vers.x - de.x) * p;
  const y = de.y + (vers.y - de.y) * p;
  const taille = 92 - 28 * p;
  return (
    <>
      <div style={{ position: 'absolute', left: x - taille / 2, top: y - taille / 2 }}>
        <Maison taille={taille} />
      </div>
      {/* Sur la carte, le nom sous la maison ; dans l'arbre, à droite, avec la ville. */}
      <div
        style={{
          position: 'absolute',
          left: x - 200,
          width: 400,
          top: y + taille / 2 + 10,
          textAlign: 'center',
          fontFamily: P.sans,
          fontWeight: 600,
          fontSize: 32,
          color: S.ink2,
          opacity: 1 - Math.min(1, p * 3),
        }}
      >
        {nom}
      </div>
      <div
        style={{
          position: 'absolute',
          left: x + taille / 2 + 18,
          top: y - 24,
          whiteSpace: 'nowrap',
          fontFamily: P.sans,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: '48px',
          color: S.earthDeep,
          opacity: doux(p, [0.7, 1], [0, 1]),
          padding: '0 12px',
          borderRadius: 14,
          background: halo > 0.001 ? `rgba(184,106,74,${0.14 * halo})` : undefined,
          boxShadow: halo > 0.001 ? `0 0 0 3px rgba(184,106,74,${0.8 * halo})` : undefined,
        }}
      >
        {nom}
        <span style={{ color: S.ink3, fontWeight: 500 }}>{`  ·  ${ville}`}</span>
      </div>
    </>
  );
};

export const P3Carte: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const carte = 1 - doux(f, [100, 124], [0, 1]);
  const horsChaine = 1 - doux(f, [92, 112], [0, 1]);
  const vol = doux(f, [112, 150], [0, 1]);
  const traits = doux(f, [150, 182], [0, 1]);
  const sortie = doux(f, [228, 240], [0, 1]);
  const entreeCarte = lisse(f, fps, 0, 14);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
      <div style={{ opacity: entreeCarte }}>
        <Zone x={80} y={500} l={920} h={660} nom={CARTONS.villes.paris} opacite={carte} />
        <Zone x={170} y={1260} l={740} h={400} nom={CARTONS.villes.evry} opacite={carte} />

        {/* Évry Sud : sur la carte, pas dans la chaîne de Daniel. */}
        {horsChaine > 0.001 ? (
          <div style={{ opacity: horsChaine }}>
            <MaisonMobile de={CARTE.evrySud} vers={CARTE.evrySud} p={0} nom={HORS_CHAINE.nom} ville={HORS_CHAINE.ville} />
          </div>
        ) : null}

        {/* Traits de la chaîne : Daniel → ses quatre dirigeants, Marc → Nadège. */}
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          {[
            { de: 0, a: [1, 2, 3, 4] },
            { de: 4, a: [5] },
          ].map(({ de, a }) => {
            const x = xRangee(ARBRE[de].profondeur) + AVATAR / 2;
            const yHaut = yRangee(de) + AVATAR;
            const yBas = yRangee(a[a.length - 1]) + AVATAR / 2;
            const longueur = yBas - yHaut + RETRAIT * a.length;
            return (
              <path
                key={de}
                d={[`M ${x} ${yHaut} L ${x} ${yBas}`, ...a.map((i) => `M ${x} ${yRangee(i) + AVATAR / 2} L ${xRangee(ARBRE[i].profondeur) - 6} ${yRangee(i) + AVATAR / 2}`)].join(' ')}
                fill="none"
                stroke={S.sauge}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={longueur}
                strokeDashoffset={longueur * (1 - traits)}
              />
            );
          })}
        </svg>

        {/* Les personnes de la chaîne. */}
        {ARBRE.map((r, i) => {
          const p = lisse(f, fps, 128 + i * 6, 14);
          if (p <= 0.001) return null;
          const personne = PERSONNES[r.cle];
          const vous = r.cle === 'daniel';
          return (
            <div
              key={r.cle}
              style={{
                position: 'absolute',
                left: xRangee(r.profondeur),
                top: yRangee(i),
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                opacity: p,
                transform: `translateX(${(1 - p) * -40}px)`,
              }}
            >
              <div
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  borderRadius: AVATAR / 2,
                  background: vous ? S.moss : S.sauge,
                  color: S.white,
                  fontFamily: P.serif,
                  fontSize: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {personne.initiales}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54, marginTop: 4 }}>
                <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 46, letterSpacing: -1, color: S.ink, whiteSpace: 'nowrap' }}>{personne.nom}</div>
                {vous ? (
                  <div style={{ fontFamily: P.mono, fontSize: 24, letterSpacing: 2, color: S.white, background: S.moss, padding: '6px 16px', borderRadius: 99 }}>{CARTONS.vous}</div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Les assemblées : de la carte à l'arbre. */}
        {ARBRE.map((r, i) => {
          if (!r.assemblee) return null;
          const a = ASSEMBLEES[r.assemblee];
          return (
            <MaisonMobile
              key={r.assemblee}
              de={CARTE[r.assemblee]}
              vers={posArbre(i)}
              p={vol}
              nom={a.nom}
              ville={a.ville}
              halo={r.assemblee === 'evry' ? haloEntre(f, 184, 228) : 0}
            />
          );
        })}
      </div>

      <LegendeEtude lignes={LEGENDES.p3Carte} duree={DUREE_P3} debut={6} fin={106} />
      <LegendeEtude lignes={LEGENDES.p3Chaine} duree={DUREE_P3} debut={110} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P4 — l'arbre de la Hiérarchie, dans l'app

/** Défilements : l'écran au chargement, le haut de l'arbre, puis Marc et Nadège. */
const D_ARBRE = -(rangeeArbre('daniel').haut - 80);
const D_MARC = -(rangeeArbre('marc').haut - 200);

export const P4Arbre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defilement = doux(f, [44, 74, 150, 176], [0, D_ARBRE, D_ARBRE, D_MARC]);
  const nadege = rangeeArbre('nadege');
  const evry = rangeeArbre('evry');
  const zoom = doux(f, [204, 220, 278, 294], [1, 1.35, 1.35, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: evry.y + D_MARC }}
        decalageY={montee(f, fps)}
        dessus={<Appui x={nadege.x} y={nadege.y + D_MARC} a={186} />}
      >
        <EcranHierarchieCaleb
          defilement={defilement}
          ouvertureNadege={doux(f, [188, 202], [0, 1])}
          halos={{ vous: haloEntre(f, 80, 112), equipe: haloEntre(f, 108, 146), evry: haloEntre(f, 220, 276) }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeEtude lignes={LEGENDES.p4Arbre} duree={DUREE_P4} debut={6} fin={150} />
      <LegendeEtude lignes={LEGENDES.p4Ville} duree={DUREE_P4} debut={156} />
    </AbsoluteFill>
  );
};
