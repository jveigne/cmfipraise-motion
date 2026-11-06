import React from 'react';
import { P, S } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import { COMPTES_RENDUS, EDITION_PDF, JOURNAL, PERIODE_JOURNAL_PDF, SYNTHESE, VILLE, decimal } from '../donnees';
import { WEB } from '../textes';

/**
 * Page 1 du journal PDF de la ville (gabarit de `PageConsolidee` de « Journal » : en-tête, synthèse,
 * tableau par assemblée, comptes rendus) — vue `JOURNAL` du lot « Offres » (plan 05 § 3.3) :
 * le nombre de présents (`attendeeCount`), jamais leurs noms (D-OFF-05). Dessinée en pixels vidéo.
 */
export const LARGEUR_PDF = 860;

const H2: React.FC<{ children: React.ReactNode; haut?: number }> = ({ children, haut = 26 }) => (
  <div style={{ fontFamily: P.serif, fontSize: 30, color: S.moss, margin: `${haut}px 0 12px`, borderBottom: `2px solid ${S.parchmentDeep}`, paddingBottom: 6 }}>{children}</div>
);

export const PdfJournal: React.FC<{ haloPresents?: number }> = ({ haloPresents = 0 }) => {
  const s = SYNTHESE;
  const stats: [string, string][] = [
    [String(s.reunions), WEB.journal.statReunions],
    [String(s.actives), WEB.journal.statActives],
    [String(s.alertes), WEB.journal.statAlerte],
    [decimal(s.moyenne), WEB.journal.statMoyenne],
    [String(s.distinctes), WEB.journal.statDistinctes],
    [String(s.pain), WEB.journal.statPain],
  ];
  const largeurs = ['25%', '14%', '19%', '21%', '21%'];
  const cr = COMPTES_RENDUS[0];
  return (
    <div
      style={{
        width: LARGEUR_PDF,
        height: LARGEUR_PDF * 1.414,
        background: '#FFFFFF',
        borderRadius: 8,
        boxShadow: '0 40px 90px rgba(18,23,28,0.30)',
        padding: '54px 56px',
        boxSizing: 'border-box',
        fontFamily: P.sans,
        color: S.ink,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `3px solid ${S.moss}`, paddingBottom: 14 }}>
        <div>
          <div style={{ fontFamily: P.serif, fontSize: 46, color: S.moss, lineHeight: 1.1 }}>{WEB.journal.docTitre}</div>
          <div style={{ fontSize: 24, color: S.ink2, marginTop: 6 }}>
            {VILLE} — {PERIODE_JOURNAL_PDF}
          </div>
        </div>
        <div style={{ fontSize: 18, color: S.ink3 }}>{WEB.journal.edite(EDITION_PDF)}</div>
      </div>

      <H2>{WEB.journal.synthese}</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {stats.map(([v, l]) => (
          <div key={l} style={{ flex: '0 0 calc(33.3% - 8px)', border: `1.5px solid ${S.parchmentDeep}`, borderRadius: 10, padding: '10px 14px', boxSizing: 'border-box' }}>
            <div style={{ fontFamily: P.serif, fontSize: 34, color: S.moss }}>{v}</div>
            <div style={{ fontSize: 17, color: S.ink3 }}>{l}</div>
          </div>
        ))}
      </div>

      <H2>{WEB.journal.parAssemblee}</H2>
      <div style={{ fontSize: 20 }}>
        <div style={{ display: 'flex', borderBottom: `1.5px solid ${S.parchmentDeep}`, paddingBottom: 6 }}>
          {[WEB.journal.colAssemblee, WEB.journal.colReunions, WEB.journal.colMoyenne, WEB.journal.colPain, WEB.journal.colDernier].map((c, i) => (
            <div key={c} style={{ width: largeurs[i], textAlign: i === 0 ? 'left' : 'right', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.2, color: S.ink3, whiteSpace: 'nowrap' }}>
              {c}
            </div>
          ))}
        </div>
        {JOURNAL.map((l) => (
          <div key={l.nom} style={{ display: 'flex', borderBottom: `1px solid ${S.parchment}`, padding: '6px 0', color: l.alerte ? S.clay : S.ink }}>
            <div style={{ width: largeurs[0] }}>{l.nom}</div>
            <div style={{ width: largeurs[1], textAlign: 'right' }}>{l.reunions}</div>
            <div style={{ width: largeurs[2], textAlign: 'right' }}>{l.moyenne === null ? '—' : decimal(l.moyenne)}</div>
            <div style={{ width: largeurs[3], textAlign: 'right' }}>{l.pain}</div>
            <div style={{ width: largeurs[4], textAlign: 'right' }}>{l.dernier}</div>
          </div>
        ))}
      </div>

      <H2>{WEB.journal.comptesRendus}</H2>
      <div style={{ fontFamily: P.serif, fontSize: 28, color: S.moss, marginBottom: 4 }}>
        {cr.assemblee} <span style={{ fontFamily: P.sans, fontSize: 19, color: S.ink3 }}>· {VILLE}</span>
      </div>
      {cr.blocs.map((b, i) => (
        <div key={b.date} style={{ borderTop: `1.5px solid ${S.parchmentDeep}`, padding: '10px 0 8px' }}>
          <div style={{ fontFamily: P.serif, fontSize: 23, marginBottom: 6 }}>{b.date}</div>
          <Ligne th={WEB.journal.presents}>
            {i === 0 ? (
              <span style={{ display: 'inline-block' }}>
                <Halo intensite={haloPresents} rayon={6} marge={8} margeY={2} etalement={4}>
                  <span style={{ fontWeight: 600 }}>{b.presents}</span>
                </Halo>
              </span>
            ) : (
              b.presents
            )}
          </Ligne>
          <Ligne th={WEB.journal.fraction}>{b.pain ? WEB.journal.oui : WEB.journal.non}</Ligne>
          <Ligne th={WEB.journal.lecture}>{b.lecture}</Ligne>
        </div>
      ))}
    </div>
  );
};

const Ligne: React.FC<{ th: string; children: React.ReactNode }> = ({ th, children }) => (
  <div style={{ display: 'flex', fontSize: 20, lineHeight: '32px' }}>
    <div style={{ width: 210, color: S.ink3 }}>{th}</div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);
