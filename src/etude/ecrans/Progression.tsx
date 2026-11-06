import React from 'react';
import { IoCheckmarkCircle, IoChevronForward, IoEllipseOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Carte, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { useEtude } from '../langue';
import { Rangee, TeteEtude } from './AccueilEtude';

/**
 * Avancement (`app/study/progress.tsx`), sous deux formes :
 * - `PersonView` (D-ETU-10) — *Ma progression* de Marie (`?mine=1`, chevrons vers ses copies), ou
 *   sa progression ouverte par la ville (`?userId=`, `leader = 0` : **aucun** chevron, `canOpenCopy`
 *   faux, RG-ETU-13) : carte de l'unité « 3 / 5 leçons », barre, « Note cumulée : 18,5 / 22 »,
 *   puis les leçons ✓ / ○, date, note, « Pas encore faite » ;
 * - `UnitView` (RG-ETU-17b, D-ETU-08) — l'assemblée : « 3 / 5 leçons », barre, « Dernière séance
 *   le … », puis « Membres » (leçons faites et note cumulée de chacun).
 * La barre de progression s'affiche pleine d'emblée dans l'app ; `remplissage` l'anime (annotation).
 */

/** Positions (points, défilement nul). */
export const PT_PROGRESSION = {
  /** La barre de la carte de l'unité (foyer du zoom de P16). */
  barre: { x: 195, y: 269 },
  /** Haut de la liste des membres (UnitView) ; une rangée fait 65, écart 8. */
  hautMembres: 351,
} as const;

export const centreMembre = (i: number) => PT_PROGRESSION.hautMembres + i * 73 + 32.5;

const Barre: React.FC<{ pct: number }> = ({ pct }) => (
  <div style={{ height: 6, borderRadius: 3, background: S.mossTint2, overflow: 'hidden' }}>
    <div style={{ height: 6, width: `${pct}%`, borderRadius: 3, background: S.moss }} />
  </div>
);

/** Carte de l'unité : titre `code · nom` (2 lignes), « n / 5 leçons », barre, puis `pied`. */
const CarteUnite: React.FC<{ faites: number; remplissage: number; haloLecons: number; pied: React.ReactNode }> = ({
  faites,
  remplissage,
  haloLecons,
  pied,
}) => {
  const { app: APP, d } = useEtude();
  const { UNITE, UNITE_LIBELLE } = d;
  return (
  <Carte style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontFamily: P.serif, fontSize: 18, lineHeight: '23px', color: S.ink, letterSpacing: -0.2, height: 46 }}>{UNITE_LIBELLE}</div>
    <Halo intensite={haloLecons} rayon={10} marge={8} margeY={14} etalement={4}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px', color: S.moss }}>{APP.home.lessonsDone(faites, UNITE.lecons.length)}</div>
        <Barre pct={(faites / UNITE.lecons.length) * 100 * remplissage} />
      </div>
    </Halo>
    {pied}
  </Carte>
  );
};

export const EcranMaProgression: React.FC<{
  /** `mine` : « Ma progression » ; sinon la progression de Marie vue par la ville (sans chevrons). */
  mienne: boolean;
  remplissage?: number;
  haloLecons?: number;
  haloCumul?: number;
  /** Surbrillance de la colonne des leçons (P17 : aucun chevron). */
  haloListe?: number;
}> = ({ mienne, remplissage = 1, haloLecons = 0, haloCumul = 0, haloListe = 0 }) => {
  const { app: APP, d } = useEtude();
  const fmtPoints = APP.fmtPoints;
  const p = d.PROGRESSION_MARIE;
  return (
    <Ecran>
      <TeteEtude kicker={APP.tile.title} titre={mienne ? APP.progress.mineTitle : d.PERSONNES.marie.nom} />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CarteUnite
          faites={p.faites}
          remplissage={remplissage}
          haloLecons={haloLecons}
          pied={
            <div style={{ display: 'flex' }}>
              <Halo intensite={haloCumul} rayon={6} marge={6} margeY={2} etalement={3}>
                <div style={{ fontFamily: P.mono, fontSize: 13, lineHeight: '18px', color: S.ink2 }}>
                  {APP.progress.cumulative(fmtPoints(p.note), fmtPoints(p.sur))}
                </div>
              </Halo>
            </div>
          }
        />
        <Halo intensite={haloListe} rayon={R.md} marge={6} etalement={5}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {p.lecons.map((l) => (
              <Rangee key={l.numero} hauteur={64} style={{ gap: 10 }}>
                {l.note != null ? <IoCheckmarkCircle size={20} color={S.moss} /> : <IoEllipseOutline size={20} color={S.ink3} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, lineHeight: '19px', color: S.ink }}>{l.titre ? APP.lessonTitled(l.numero, l.titre) : APP.lesson(l.numero)}</div>
                  <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{l.date ?? APP.progress.notDone}</div>
                </div>
                {l.note != null ? <div style={{ fontFamily: P.mono, fontSize: 13.5, color: S.moss }}>{APP.score(fmtPoints(l.note), fmtPoints(l.max))}</div> : null}
                {/* RG-ETU-13 : le lien vers la copie n'est offert qu'à son auteur (et à son dirigeant). */}
                {mienne && l.note != null ? <IoChevronForward size={18} color={S.ink3} /> : null}
              </Rangee>
            ))}
          </div>
        </Halo>
      </div>
    </Ecran>
  );
};

export const EcranAvancementAssemblee: React.FC<{ defilement?: number; haloLecons?: number; haloMarie?: number }> = ({
  defilement = 0,
  haloLecons = 0,
  haloMarie = 0,
}) => {
  const { app: APP, d } = useEtude();
  const { ASSEMBLEE, DERNIERE_SEANCE, MEMBRES_PARIS_OUEST, UNITE } = d;
  const fmtPoints = APP.fmtPoints;
  return (
  <Ecran defilement={defilement}>
    <TeteEtude kicker={APP.progress.unitTitle} titre={ASSEMBLEE} />
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <CarteUnite
        faites={3}
        remplissage={1}
        haloLecons={haloLecons}
        pied={<div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.progress.lastSession(DERNIERE_SEANCE)}</div>}
      />
      <Etiquette style={{ marginTop: 8, lineHeight: '15px' }}>{APP.progress.members}</Etiquette>
      {MEMBRES_PARIS_OUEST.map((m) => (
        <Halo key={m.nom} intensite={m.nom === d.PERSONNES.marie.nom ? haloMarie : 0} rayon={R.md}>
          <Rangee hauteur={65} style={{ gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink }}>{m.nom}</div>
              <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.home.lessonsDone(m.faites, UNITE.lecons.length)}</div>
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 13.5, color: S.moss }}>
              {m.faites > 0 && m.note != null && m.sur != null ? APP.score(fmtPoints(m.note), fmtPoints(m.sur)) : '–'}
            </div>
            <IoChevronForward size={18} color={S.ink3} />
          </Rangee>
        </Halo>
      ))}
    </div>
  </Ecran>
  );
};
