import React from 'react';
import { IoChevronDown, IoChevronUp, IoEllipseOutline, IoLockClosedOutline, IoSchoolOutline, IoTrendingUpOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { Rangee, TeteEtude, PT_ACCUEIL_ETUDE } from '../../etude/ecrans/AccueilEtude';
import { useEtude } from '../../etude/langue';
import { APP } from '../textes';
import { UNITE_SUIVANTE_LIBELLE } from '../donnees';

/**
 * Accueil de l'étude du dirigeant (`app/study/index.tsx` › `AssemblySection`), le programme : même
 * écran que `EcranAccueilDirigeant` d'« Étude » (repris à l'identique, mêmes hauteurs, mêmes points
 * d'appui), avec une seconde unité sous la première, verrouillée par son prérequis dans
 * l'assemblée (D-ETU-19 : icône `lock-closed-outline` sur fond `paper2`, `study.home.locked` à la
 * place de « n / 5 leçons »).
 */

/** Hauteur des leçons dépliées (livre + 5 leçons de 60, écarts de 6) : celle d'« Étude ». */
const H_LECONS = 6 + 18 + 5 * (6 + 60);

/** Points d'appui (défilement nul) : ceux d'« Étude », plus le centre de l'unité verrouillée. */
export const PT_PROGRAMME = {
  unite: PT_ACCUEIL_ETUDE.unite,
  commencer1: PT_ACCUEIL_ETUDE.commencer1,
  /** Unité verrouillée : sous l'unité fermée (85 + écart 8), ou sous ses leçons dépliées. */
  verrou: (ouverture: number) => ({ x: 195, y: PT_ACCUEIL_ETUDE.unite.y + 85 + 8 + H_LECONS * ouverture }),
};

const IconeUnite: React.FC<{ verrou?: boolean }> = ({ verrou = false }) => (
  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: R.sm,
      background: verrou ? S.paper2 : S.mossTint,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {verrou ? <IoLockClosedOutline size={19} color={S.ink3} /> : <IoSchoolOutline size={19} color={S.moss} />}
  </div>
);

const TitreUnite: React.FC<{ texte: string }> = ({ texte }) => (
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
    {texte}
  </div>
);

export const EcranProgramme: React.FC<{
  ouverture?: number;
  haloUnite?: number;
  haloVerrou?: number;
  haloLecon1?: number;
}> = ({ ouverture = 0, haloUnite = 0, haloVerrou = 0, haloLecon1 = 0 }) => {
  const { app: A, d } = useEtude();
  const { ASSEMBLEE, UNITE, UNITE_LIBELLE } = d;
  return (
    <Ecran>
      <TeteEtude kicker={A.kicker} titre={A.tile.title} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Etiquette style={{ color: S.mossSoft, lineHeight: '15px' }}>{ASSEMBLEE}</Etiquette>
        <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{A.home.startSession}</Etiquette>
        <div>
          <Halo intensite={haloUnite} rayon={R.md}>
            <Rangee hauteur={85}>
              <IconeUnite />
              <div style={{ flex: 1, minWidth: 0 }}>
                <TitreUnite texte={UNITE_LIBELLE} />
                <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{A.home.lessonsDone(0, UNITE.lecons.length)}</div>
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
                      <div style={{ fontSize: 14, lineHeight: '19px', color: S.ink }}>{l.titre ? A.lessonTitled(l.numero, l.titre) : A.lesson(l.numero)}</div>
                      <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{l.portion}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: S.moss }}>{A.home.start}</div>
                  </div>
                </Halo>
              ))}
            </div>
          </div>
        </div>
        {/* L'unité suivante : verrouillée tant que son prérequis (UEMB002) n'est pas fait dans l'assemblée. */}
        <Halo intensite={haloVerrou} rayon={R.md}>
          <Rangee hauteur={85}>
            <IconeUnite verrou />
            <div style={{ flex: 1, minWidth: 0 }}>
              <TitreUnite texte={UNITE_SUIVANTE_LIBELLE} />
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {APP.locked}
              </div>
            </div>
            <IoChevronDown size={18} color={S.ink3} />
          </Rangee>
        </Halo>
        <Etiquette style={{ marginTop: 14, lineHeight: '15px' }}>{A.home.sessions}</Etiquette>
        <div style={{ fontSize: 13, lineHeight: '18px', color: S.ink3 }}>{A.home.noSessions}</div>
        <Bouton label={A.home.unitProgress} variante="soft" hauteur={46} style={{ marginTop: 14 }} />
      </div>
      <Bouton label={A.home.myProgress} variante="ghost" hauteur={48} style={{ marginTop: 20 }} icone={<IoTrendingUpOutline size={18} color={S.moss} />} />
    </Ecran>
  );
};
