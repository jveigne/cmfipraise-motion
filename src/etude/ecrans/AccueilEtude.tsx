import React from 'react';
import { IoChevronDown, IoChevronForward, IoChevronUp, IoEllipseOutline, IoSchoolOutline, IoTrendingUpOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Carte, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { Retour } from '../../journal/ui/elements';
import { useEtude } from '../langue';

/**
 * Accueil de l'étude (`app/study/index.tsx`), sous ses trois formes (contenu selon `/study/me`,
 * D-ETU-05) :
 * - **dirigeant** de l'assemblée (`AssemblySection`, D-ETU-07), aucune séance en cours : nom de
 *   l'assemblée, « Commencer une séance », l'unité `code · nom` + « 0 / 5 leçons », dépliée sur le
 *   livre (italique) et ses leçons « Commencer » ; « Séances terminées » ; « Avancement de
 *   l'assemblée » ; « Ma progression » (le dirigeant est aussi répondant, D-ETU-06) ;
 * - **répondant** (D-ETU-06) : la carte `moss` de la séance en cours, « Répondre », puis « Ma
 *   progression » (D-ETU-10) ;
 * - **sans assemblée** (Daniel, dirigeant de ville) : « Avancement des assemblées » (`Overview`,
 *   D-ETU-08), jamais le contenu des copies.
 * Écran poussé sur la pile racine : pas de barre d'onglets (`withTabBar={false}`).
 */

/** En-tête commun des écrans de l'étude : chevron, surtitre mono argile, titre Fraunces. */
export const TeteEtude: React.FC<{ kicker: string; titre: string; taille?: number; lignesKicker?: number }> = ({
  kicker,
  titre,
  taille = 28,
  lignesKicker = 1,
}) => (
  <>
    <Retour />
    <div
      style={{
        marginTop: 10,
        fontFamily: P.mono,
        fontSize: 11,
        lineHeight: '14px',
        height: 14 * lignesKicker,
        color: S.clay,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {kicker}
    </div>
    <div style={{ fontFamily: P.serif, fontSize: taille, lineHeight: `${taille + 6}px`, color: S.ink, letterSpacing: -0.4, marginTop: 4 }}>{titre}</div>
  </>
);

/** Ligne de liste (`row` : papier, rayon 16, filet), hauteur explicite. */
export const Rangee: React.FC<{ hauteur: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ hauteur, children, style }) => (
  <div
    style={{
      height: hauteur,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderRadius: R.md,
      background: S.paper,
      border: `1px solid ${S.hair}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Positions (points d'écran), défilement nul. */
export const PT_ACCUEIL_ETUDE = {
  /** Dirigeant : la rangée de l'unité UEMB002, puis « Commencer » de la leçon 1 (unité dépliée). */
  unite: { x: 195, y: 277 },
  commencer1: { x: 322, y: 380 },
  /** Répondant : « Répondre › » de la carte de la séance en cours. */
  repondre: { x: 312, y: 300 },
  /** Sans assemblée : la rangée de Paris Ouest (3ᵉ rangée, `rangeeAssemblee(2)`). */
  parisOuest: { x: 195, y: 390 },
} as const;

/**
 * Centre de la rangée `i` de la vue d'ensemble (rangées de 65, écarts de 8) : en anglais, le tri
 * par nom met « Leeds West » en 4ᵉ rangée (storyboard § 10) ; `rangeeAssemblee(2)` = `parisOuest`.
 */
export const rangeeAssemblee = (i: number) => ({ x: PT_ACCUEIL_ETUDE.parisOuest.x, y: PT_ACCUEIL_ETUDE.parisOuest.y + (i - 2) * (65 + 8) });

/** Hauteur des leçons dépliées (livre + 5 leçons de 60, écarts de 6). */
const H_LECONS = 6 + 18 + 5 * (6 + 60);

export const EcranAccueilDirigeant: React.FC<{
  /** Dépliement de l'unité (0 → 1). */
  ouverture?: number;
  haloUnite?: number;
  haloLecon1?: number;
}> = ({ ouverture = 0, haloUnite = 0, haloLecon1 = 0 }) => {
  const { app: APP, d } = useEtude();
  const { ASSEMBLEE, UNITE, UNITE_LIBELLE } = d;
  return (
  <Ecran>
    <TeteEtude kicker={APP.kicker} titre={APP.tile.title} />
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Etiquette style={{ color: S.mossSoft, lineHeight: '15px' }}>{ASSEMBLEE}</Etiquette>
      <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{APP.home.startSession}</Etiquette>
      <div>
        <Halo intensite={haloUnite} rayon={R.md}>
          <Rangee hauteur={85}>
            <div style={{ width: 38, height: 38, borderRadius: R.sm, background: S.mossTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IoSchoolOutline size={19} color={S.moss} />
            </div>
            <div style={{ flex: 1 }}>
              {/* `numberOfLines={2}` : le libellé de l'unité est coupé à deux lignes. */}
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
                {UNITE_LIBELLE}
              </div>
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.home.lessonsDone(0, UNITE.lecons.length)}</div>
            </div>
            {ouverture > 0.5 ? <IoChevronUp size={18} color={S.ink3} /> : <IoChevronDown size={18} color={S.ink3} />}
          </Rangee>
        </Halo>
        <div style={{ height: H_LECONS * ouverture, overflow: 'hidden' }}>
          <div style={{ marginLeft: 12, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 6, opacity: Math.min(1, ouverture * 1.5) }}>
            <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 13.5, lineHeight: '18px', color: S.ink2 }}>{UNITE.livre}</div>
            {UNITE.lecons.map((l) => (
              <Halo key={l.numero} intensite={l.numero === 1 ? haloLecon1 : 0} rayon={R.sm}>
                <div
                  style={{
                    height: 60,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: R.sm,
                    background: S.paper2,
                    border: `1px solid ${S.hair}`,
                  }}
                >
                  <IoEllipseOutline size={20} color={S.ink3} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, lineHeight: '19px', color: S.ink }}>{l.titre ? APP.lessonTitled(l.numero, l.titre) : APP.lesson(l.numero)}</div>
                    <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{l.portion}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: S.moss }}>{APP.home.start}</div>
                </div>
              </Halo>
            ))}
          </div>
        </div>
      </div>
      <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{APP.home.sessions}</Etiquette>
      <div style={{ fontSize: 13, lineHeight: '18px', color: S.ink3 }}>{APP.home.noSessions}</div>
      <Bouton label={APP.home.unitProgress} variante="soft" hauteur={46} style={{ marginTop: 14 }} />
    </div>
    <Bouton
      label={APP.home.myProgress}
      variante="ghost"
      hauteur={48}
      style={{ marginTop: 20 }}
      icone={<IoTrendingUpOutline size={18} color={S.moss} />}
    />
  </Ecran>
  );
};

/** Carte `moss` de la séance en cours (`currentCard`) : point terre, état, leçon, unité, action. */
export const CarteSeanceEnCours: React.FC<{ halo?: number }> = ({ halo = 0 }) => {
  const { app: APP, d } = useEtude();
  const { UNITE, UNITE_LIBELLE } = d;
  return (
  <Halo intensite={halo} rayon={R.lg}>
    <Carte style={{ background: S.moss, padding: '16px 18px', height: 152, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: S.earth }} />
        <div style={{ fontFamily: P.mono, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: S.parchment }}>{APP.status.REPONSES_OUVERTES}</div>
      </div>
      <div style={{ marginTop: 8, fontFamily: P.serif, fontSize: 21, lineHeight: '26px', color: S.white, letterSpacing: -0.2 }}>
        {APP.lessonTitled(1, UNITE.lecons[0].titre ?? '')}
      </div>
      <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.parchment, height: 34 }}>{UNITE_LIBELLE}</div>
      <div style={{ marginTop: 14, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: S.white }}>{APP.home.answer}</div>
        <IoChevronForward size={18} color={S.white} />
      </div>
    </Carte>
  </Halo>
  );
};

export const EcranAccueilRepondant: React.FC<{ halo?: number }> = ({ halo = 0 }) => {
  const { app: APP } = useEtude();
  return (
  <Ecran>
    <TeteEtude kicker={APP.kicker} titre={APP.tile.title} />
    <div style={{ marginTop: 20 }}>
      <CarteSeanceEnCours halo={halo} />
    </div>
    <Bouton
      label={APP.home.myProgress}
      variante="ghost"
      hauteur={48}
      style={{ marginTop: 20 }}
      icone={<IoTrendingUpOutline size={18} color={S.moss} />}
    />
  </Ecran>
  );
};

/** Vue d'ensemble de la ville (D-ETU-08) : une rangée par assemblée, `nom · ville` / `code · n / 5 leçons`. */
export const EcranVueEnsemble: React.FC<{ haloOuest?: number }> = ({ haloOuest = 0 }) => {
  const { app: APP, d } = useEtude();
  const { ASSEMBLEE, ASSEMBLEES_PARIS, UNITE, VILLE } = d;
  return (
  <Ecran>
    <TeteEtude kicker={APP.kicker} titre={APP.tile.title} />
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{APP.home.overviewTitle}</Etiquette>
      {ASSEMBLEES_PARIS.map((a) => (
        <Halo key={a.nom} intensite={a.nom === ASSEMBLEE ? haloOuest : 0} rayon={R.md}>
          <Rangee hauteur={65}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink }}>{`${a.nom} · ${VILLE}`}</div>
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>
                {[UNITE.code, APP.home.lessonsDone(a.faites, UNITE.lecons.length)].join(' · ')}
              </div>
            </div>
            <IoChevronForward size={18} color={S.ink3} />
          </Rangee>
        </Halo>
      ))}
    </div>
  </Ecran>
  );
};
