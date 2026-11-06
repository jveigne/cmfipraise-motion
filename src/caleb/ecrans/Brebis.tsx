import React from 'react';
import { IoChevronForward, IoEyeOutline, IoSearch } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Carte, Ecran, Halo } from '../../evenements/ui/app';
import { APP } from '../textes';
import { ASSEMBLEES, CleAssemblee, FICHES, ORDRE, STATUTS } from '../donnees';
import { BarreOnglets6, ONGLETS6 } from '../ui/Onglets';

/**
 * Onglet « Brebis » de Daniel (`app/(tabs)/care/index.tsx`, vue « Suivi ») avec l'offre Caleb : les
 * fiches des assemblées de sa chaîne (plan 27/10 § 3.4, D-OFF-04 / D-OFF-06), une pastille par
 * assemblée (`Chip`, `name · cityName`), la ligne « Lecture seule » (Daniel n'en est pas le
 * dirigeant : `canEdit` faux, D-ASM-05), la recherche, les statuts du ministère et les fiches
 * (pastille de couleur, nom, statut · dernière présence).
 */

/** Pastilles d'assemblée (`filterRow`, `flexWrap`) : deux par rangée sur 350 points, Évry seule en bas. */
const RANGS_PASTILLES: CleAssemblee[][] = [
  ['est', 'nord'],
  ['ouest', 'sud'],
  ['evry'],
];

/** Positions (points, défilement nul), relevées sur l'écran redessiné. */
export const PT_BREBIS = {
  pastilles: { x: 195, y: 275 },
  evry: { x: 95, y: 313 },
  lectureSeule: { x: 195, y: 356 },
  fiches: { x: 195, y: 620 },
} as const;

const Pastille: React.FC<{ label: string; choisie: boolean }> = ({ label, choisie }) => (
  <div
    style={{
      padding: '7px 13px',
      borderRadius: 999,
      border: `1px solid ${choisie ? S.mossDeep : 'transparent'}`,
      background: choisie ? S.moss : 'rgba(42,38,32,0.045)',
      color: choisie ? S.white : S.ink2,
      fontSize: 12.5,
      fontWeight: 500,
      lineHeight: '16px',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

const ListeFiches: React.FC<{ cle: CleAssemblee }> = ({ cle }) => {
  const fiches = FICHES[cle] ?? [];
  return (
    <Carte style={{ marginTop: 14 }}>
      {fiches.map((r, i) => {
        const statut = STATUTS[r.statut];
        return (
          <div
            key={r.nom}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 16px',
              height: 62,
              boxSizing: 'border-box',
              borderBottom: i < fiches.length - 1 ? '1px solid rgba(42,38,32,0.06)' : undefined,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 5, background: statut.couleur }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink, lineHeight: '19px' }}>{r.nom}</div>
              <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2, lineHeight: '16px', whiteSpace: 'nowrap' }}>
                {statut.label} · {APP.care.lastAttendanceShort(r.presence)}
              </div>
            </div>
            <IoChevronForward size={18} color={S.ink3} />
          </div>
        );
      })}
    </Carte>
  );
};

export const EcranBrebis: React.FC<{
  /** Assemblée choisie ; `vers` + `p` : fondu de la liste au changement de pastille. */
  choisie: CleAssemblee;
  vers?: CleAssemblee;
  p?: number;
  haloPastilles?: number;
  haloLecture?: number;
  haloOnglet?: number;
}> = ({ choisie, vers, p = 0, haloPastilles = 0, haloLecture = 0, haloOnglet = 0 }) => {
  const c = APP.care;
  const active = vers && p > 0.5 ? vers : choisie;
  return (
    <>
      <Ecran>
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', color: S.ink, letterSpacing: -0.4 }}>{c.title}</div>
        <div style={{ fontSize: 13, color: S.ink3, marginTop: 4, lineHeight: '19px' }}>{c.subtitle}</div>

        <div style={{ marginTop: 18, display: 'flex', background: 'rgba(42,38,32,0.05)', borderRadius: 99, padding: 3, height: 40, boxSizing: 'border-box' }}>
          {[c.tabRecords, c.tabAccountability].map((l, i) => (
            <div
              key={l}
              style={{
                flex: 1,
                borderRadius: 99,
                textAlign: 'center',
                lineHeight: '34px',
                background: i === 0 ? S.paper : 'transparent',
                boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
                fontSize: 13,
                fontWeight: 600,
                color: i === 0 ? S.moss : S.ink3,
              }}
            >
              {l}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <Halo intensite={haloPastilles} rayon={14} marge={5}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RANGS_PASTILLES.map((rang, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  {rang.map((k) => (
                    <Pastille key={k} label={ASSEMBLEES[k].libelle} choisie={k === active} />
                  ))}
                </div>
              ))}
            </div>
          </Halo>
        </div>

        <Halo intensite={haloLecture} rayon={8} marge={4} margeY={2} etalement={3}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 10 }}>
            <IoEyeOutline size={15} color={S.ink3} style={{ marginTop: 1 }} />
            <div style={{ flex: 1, fontSize: 12, color: S.ink3, lineHeight: '17px' }}>{c.readOnly}</div>
          </div>
        </Halo>

        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 48,
            boxSizing: 'border-box',
            padding: '0 14px',
            borderRadius: 14,
            border: `1px solid ${S.hair}`,
            background: S.paper2,
          }}
        >
          <IoSearch size={17} color={S.ink3} />
          <div style={{ fontSize: 15, color: S.ink3 }}>{c.searchPlaceholder}</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          <Pastille label={c.all} choisie />
          {STATUTS.map((s) => (
            <Pastille key={s.label} label={s.label} choisie={false} />
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          {vers && p > 0 && p < 1 ? (
            <>
              <div style={{ opacity: 1 - p }}>
                <ListeFiches cle={choisie} />
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: p }}>
                <ListeFiches cle={vers} />
              </div>
            </>
          ) : (
            <ListeFiches cle={active} />
          )}
        </div>
      </Ecran>
      <BarreOnglets6 actif={ONGLETS6.brebis} halo={haloOnglet} />
    </>
  );
};

/** Les assemblées dont Daniel lit les fiches : toutes celles de sa chaîne. */
export const ASSEMBLEES_BREBIS = ORDRE;
