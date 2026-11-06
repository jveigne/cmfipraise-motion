import React from 'react';
import { IoChevronForward, IoSearch } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Carte, Ecran, Halo } from '../../evenements/ui/app';
import { APP } from '../textes';
import { ASSEMBLEE, FICHES, STATUTS, VILLE } from '../donnees';
import { BarreOnglets6, ONGLETS6 } from '../ui/Habillage';

/**
 * Onglet « Brebis » de Samuel (`app/(tabs)/care/index.tsx`, refonte D-ASM-01/02) : titre, sous-titre,
 * segments Suivi | Redevabilité, une seule assemblée (nom · ville, pas de sélecteur), recherche,
 * pastilles de statut (« Tous » + les statuts actifs du ministère), puis une carte avec une ligne par
 * membre : pastille de couleur du statut, nom, « statut · présent le … » (présences lues dans les
 * comptes rendus, D-ASM-12). Samuel est le dirigeant de l'assemblée : il écrit, pas de bandeau
 * « Lecture seule ».
 */
export const EcranBrebis: React.FC<{
  /** Entrée de chaque ligne (0 → 1). */
  entrees?: readonly number[];
  haloStatuts?: number;
  haloLigne?: { index: number; intensite: number };
  defilement?: number;
}> = ({ entrees = [], haloStatuts = 0, haloLigne, defilement = 0 }) => (
  <>
    <Ecran defilement={defilement}>
      <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{APP.care.title}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '19px' }}>{APP.care.subtitle}</div>

      {/* `tabRow` : fond encre 5 %, onglet actif papier. */}
      <div style={{ marginTop: 18, display: 'flex', background: 'rgba(42,38,32,0.05)', borderRadius: 99, padding: 3 }}>
        {[APP.care.tabRecords, APP.care.tabAccountability].map((l, i) => (
          <div
            key={l}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 99,
              textAlign: 'center',
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

      <div style={{ marginTop: 16, fontFamily: P.serif, fontSize: 19, lineHeight: '24px' }}>
        {ASSEMBLEE}
        <span style={{ fontFamily: P.sans, fontSize: 13, color: S.ink3 }}> · {VILLE}</span>
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 14px',
          borderRadius: 14,
          background: S.paper2,
          border: `1px solid ${S.hair}`,
        }}
      >
        <IoSearch size={17} color={S.ink3} />
        <div style={{ fontSize: 15, color: S.ink3 }}>{APP.care.searchPlaceholder}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Halo intensite={haloStatuts} rayon={14} marge={5}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[APP.care.all, ...STATUTS.map((s) => s.label)].map((l, i) => (
              <div
                key={l}
                style={{
                  padding: '7px 12px',
                  borderRadius: 999,
                  border: `1px solid ${i === 0 ? S.mossDeep : 'transparent'}`,
                  background: i === 0 ? S.moss : 'rgba(42,38,32,0.045)',
                  color: i === 0 ? S.white : S.ink2,
                  fontSize: 12.5,
                  fontWeight: 500,
                  lineHeight: '16px',
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </Halo>
      </div>

      <Carte style={{ marginTop: 14, overflow: 'visible' }}>
        {FICHES.map((r, i) => {
          const e = entrees[i] ?? 1;
          const couleur = STATUTS.find((s) => s.label === r.statut)?.couleur ?? S.moss;
          return (
            <div key={r.nom} style={{ opacity: e, transform: `translateY(${(1 - e) * 16}px)` }}>
              <Halo intensite={haloLigne?.index === i ? haloLigne.intensite : 0} rayon={R.md} marge={2} etalement={4}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 16px',
                    borderBottom: i < FICHES.length - 1 ? '1px solid rgba(42,38,32,0.06)' : undefined,
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: couleur }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink, lineHeight: '19px' }}>{r.nom}</div>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: S.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.statut} · {APP.care.lastAttendanceShort(r.presence)}
                    </div>
                  </div>
                  <IoChevronForward size={18} color={S.ink3} />
                </div>
              </Halo>
            </div>
          );
        })}
      </Carte>
    </Ecran>
    <BarreOnglets6 actif={ONGLETS6.brebis} />
  </>
);
