import React from 'react';
import { S } from '../../evenements/theme';
import { BlocJournal } from '../donnees';
import { useJournal } from '../langue';

/**
 * Pages A4 des journaux PDF (annotation vidéo : l'app n'a pas d'aperçu, elle ouvre directement la
 * feuille de partage). Le CONTENU est celui du fichier réel : `buildJournalHtml` et
 * `buildConsolidatedJournalHtml` (shephr-app/mobile/utils/assemblyJournal.ts), feuille de style
 * `JOURNAL_CSS` comprise — polices système du PDF (Georgia, Helvetica), pas celles de l'app.
 *
 * Une page est dessinée en pixels CSS d'impression (A4 = 794 × 1123 px à 96 ppp, tailles en pt
 * converties × 4/3), puis réduite d'un bloc par `echelle`.
 */
export const PAGE = { largeur: 794, hauteur: 1123 } as const;

const pt = (n: number) => (n * 4) / 3;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = '-apple-system, Helvetica, Arial, sans-serif';

/** Halo de surbrillance (annotation vidéo) autour d'un bloc de page. */
const Surligne: React.FC<{ intensite: number; children: React.ReactNode; marge?: number }> = ({ intensite, children, marge = 8 }) => (
  <div style={{ position: 'relative' }}>
    {children}
    {intensite > 0.001 ? (
      <div
        style={{
          position: 'absolute',
          inset: -marge,
          borderRadius: 12,
          border: `4px solid rgba(184,106,74,${0.85 * intensite})`,
          boxShadow: `0 0 0 8px rgba(184,106,74,${0.18 * intensite})`,
          pointerEvents: 'none',
        }}
      />
    ) : null}
  </div>
);

/** Feuille blanche cassée, ombre douce ; le contenu est posé dans les marges d'impression (16 × 14 mm). */
const Feuille: React.FC<{ echelle: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ echelle, children, style }) => (
  <div style={{ width: PAGE.largeur * echelle, height: PAGE.hauteur * echelle, position: 'relative', ...style }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PAGE.largeur,
        height: PAGE.hauteur,
        transform: `scale(${echelle})`,
        transformOrigin: '0 0',
        background: '#FFFDF8',
        boxShadow: '0 30px 80px rgba(42,38,32,0.22), 0 4px 14px rgba(42,38,32,0.10)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 53, right: 53, top: 60, bottom: 60, fontFamily: SANS, color: S.ink, fontSize: pt(11), overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  </div>
);

const EnTete: React.FC<{ titre: string; sous: string; edition: string }> = ({ titre, sous, edition }) => {
  const { app } = useJournal();
  return (
    <div style={{ borderBottom: `2px solid ${S.moss}`, paddingBottom: 10, marginBottom: 16 }}>
      <div style={{ fontFamily: SERIF, fontSize: pt(24), color: S.moss, lineHeight: 1.15 }}>{titre}</div>
      <div style={{ fontSize: pt(12), color: S.ink2, marginTop: 4 }}>{sous}</div>
      <div style={{ fontSize: pt(9), color: S.ink3, marginTop: 6 }}>{app.journal.generatedOn(edition)}</div>
    </div>
  );
};

const H2: React.FC<{ children: React.ReactNode; haut?: number }> = ({ children, haut = 18 }) => (
  <div style={{ fontFamily: SERIF, fontSize: pt(15), color: S.moss, margin: `${haut}px 0 8px` }}>{children}</div>
);

const Stat: React.FC<{ valeur: React.ReactNode; label: string; base?: string }> = ({ valeur, label, base = '0' }) => (
  <div style={{ flex: `1 1 ${base}`, background: S.paper2, border: `1px solid ${S.parchmentDeep}`, borderRadius: 8, padding: 10 }}>
    <div style={{ fontFamily: SERIF, fontSize: pt(18), color: S.moss }}>{valeur}</div>
    <div style={{ fontSize: pt(8.5), color: S.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
  </div>
);

const LigneTable: React.FC<{ th: string; children: React.ReactNode }> = ({ th, children }) => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '32%', flexShrink: 0, fontWeight: 600, color: S.ink2, padding: '3px 8px 3px 0', fontSize: pt(10) }}>{th}</div>
    <div style={{ flex: 1, padding: '3px 0' }}>{children}</div>
  </div>
);

/** Un compte rendu du journal (`section.meeting`) : date, présents (+ noms), fraction, lecture. */
const Reunion: React.FC<{ b: BlocJournal; halo?: number }> = ({ b, halo = 0 }) => {
  const { app } = useJournal();
  return (
    <Surligne intensite={halo}>
      <div style={{ borderTop: `1px solid ${S.parchmentDeep}`, padding: '10px 0 6px' }}>
        <div style={{ fontFamily: SERIF, fontSize: pt(13), marginBottom: 6 }}>{b.date}</div>
        <LigneTable th={app.journal.attendees}>
          {b.noms.length}
          <div style={{ fontSize: pt(9.5), color: S.ink2, marginTop: 2, lineHeight: 1.45 }}>{b.noms.join(' · ')}</div>
        </LigneTable>
        <LigneTable th={app.journal.breadBreaking}>{b.pain ? app.journal.yes : app.journal.no}</LigneTable>
        <LigneTable th={app.journal.reading}>{b.lecture ?? app.journal.noReading}</LigneTable>
      </div>
    </Surligne>
  );
};

/** Découpage des comptes rendus par page (un bloc n'est jamais coupé : `page-break-inside: avoid`). */
const PAGES_BLOCS = [
  [0, 3],
  [3, 9],
  [9, 12],
] as const;

/** Page `numero` (1 à 3) du journal 2025 de Paris Nord. */
export const PageJournal: React.FC<{
  numero: 1 | 2 | 3;
  echelle: number;
  haloSynthese?: number;
  haloPremier?: number;
  style?: React.CSSProperties;
}> = ({ numero, echelle, haloSynthese = 0, haloPremier = 0, style }) => {
  const { app, d } = useJournal();
  const [de, a] = PAGES_BLOCS[numero - 1];
  const j = d.JOURNAL_2025;
  return (
    <Feuille echelle={echelle} style={style}>
      {numero === 1 ? (
        <>
          <EnTete titre={app.journal.docTitle} sous={j.sousTitre} edition={j.edition} />
          <H2 haut={0}>{app.journal.summary}</H2>
          <Surligne intensite={haloSynthese}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Stat valeur={j.reunions} label={app.journal.statMeetings} />
              <Stat valeur={j.moyenne} label={app.journal.statAverage} />
              <Stat valeur={j.pain} label={app.journal.statBread} />
            </div>
          </Surligne>
          <H2>{app.journal.readings}</H2>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {j.lectures.map((l) => (
              <li key={l.livre} style={{ margin: '3px 0' }}>
                <strong>{l.livre}</strong> — {l.chapitres}
              </li>
            ))}
          </ul>
          <H2>{app.journal.reports}</H2>
        </>
      ) : null}
      {j.blocs.slice(de, a).map((b, i) => (
        <Reunion key={b.date} b={b} halo={numero === 1 && i === 0 ? haloPremier : 0} />
      ))}
    </Feuille>
  );
};

/** Page 1 du journal consolidé de la hiérarchie de Daniel (`buildConsolidatedJournalHtml`). */
export const PageConsolidee: React.FC<{ echelle: number; haloLigne?: number; style?: React.CSSProperties }> = ({ echelle, haloLigne = 0, style }) => {
  const { app, d, langue } = useJournal();
  const h = d.HIERARCHIE;
  const th = app.hierarchy;
  const cellule = (num: boolean): React.CSSProperties => ({
    padding: '4px 6px 4px 0',
    textAlign: num ? 'right' : 'left',
    whiteSpace: num ? 'nowrap' : undefined,
  });
  // Largeurs fixes des colonnes (le PDF, lui, laisse le tableau HTML se dimensionner seul) : en
  // anglais, « AVG. ATTENDANCE » et « BREAD BREAKINGS » sont plus longs, on leur donne la place.
  const colonnes = langue === 'en' ? ['20%', '11%', '12%', '19%', '19%', '15%', '4%'] : ['22%', '13%', '13%', '16%', '17%', '15%', '4%'];
  return (
    <Feuille echelle={echelle} style={style}>
      {/* « octobre 2026 » : `periodLabel` sans majuscule dans le PDF (l'écran, lui, capitalise). */}
      <EnTete titre={th.docTitle} sous={`${th.scopeAll} — ${h.periodePdf}`} edition="14/10/2026" />
      <H2 haut={0}>{app.journal.summary}</H2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Stat base="30%" valeur={h.reunions} label={th.statMeetings} />
        <Stat base="30%" valeur={h.actives} label={th.statActive} />
        <Stat base="30%" valeur={h.alertes} label={th.statAlert} />
        <Stat base="30%" valeur={h.moyenne} label={th.statAverage} />
        <Stat base="30%" valeur={h.distinctes} label={th.statDistinct} />
        <Stat base="30%" valeur={h.pain} label={th.statBread} />
      </div>
      <div style={{ margin: '10px 0 0', fontSize: pt(10) }}>
        <span style={{ color: S.clay }}>⚠ {th.alertTitle}</span> — {h.alerteNoms}
      </div>
      <div style={{ fontSize: pt(8.5), color: S.ink3, marginTop: 6 }}>{th.distinctNote}</div>

      <H2>{th.unitsTitle}</H2>
      <div style={{ fontSize: pt(9.5) }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${S.parchmentDeep}` }}>
          {[...th.cols, '⚠'].map((c, i) => (
            <div
              key={c}
              style={{
                ...cellule(i >= 2),
                width: colonnes[i],
                fontWeight: 600,
                fontSize: pt(8.5),
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                color: S.ink3,
              }}
            >
              {c}
            </div>
          ))}
        </div>
        {h.lignes.map((l) => {
          const valeurs = [l.assemblee, l.ville, l.reunions, l.moyenne, l.pain, l.dernier, l.alerte ? '⚠' : ''];
          const ligne = (
            <div style={{ display: 'flex', borderBottom: `1px solid ${S.parchment}` }}>
              {valeurs.map((v, i) => (
                <div key={i} style={{ ...cellule(i >= 2), width: colonnes[i], color: i === 6 ? S.clay : undefined }}>
                  {v}
                </div>
              ))}
            </div>
          );
          return l.alerte ? (
            <Surligne key={l.assemblee} intensite={haloLigne} marge={4}>
              {ligne}
            </Surligne>
          ) : (
            <div key={l.assemblee}>{ligne}</div>
          );
        })}
      </div>

      <H2>{app.journal.reports}</H2>
      {h.comptesRendus.map((u) => (
        <div key={u.assemblee} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: SERIF, fontSize: pt(14), color: S.moss, marginBottom: 2 }}>
            {u.assemblee} <span style={{ fontFamily: SANS, fontSize: pt(10), color: S.ink3 }}>· {d.VILLE}</span>
          </div>
          {u.blocs.map((b) => (
            <div key={b.date} style={{ borderTop: `1px solid ${S.parchmentDeep}`, padding: '10px 0 6px' }}>
              <div style={{ fontFamily: SERIF, fontSize: pt(11.5), margin: '0 0 4px' }}>{b.date}</div>
              <LigneTable th={app.journal.attendees}>{b.presents}</LigneTable>
              <LigneTable th={app.journal.breadBreaking}>{b.pain ? app.journal.yes : app.journal.no}</LigneTable>
              <LigneTable th={app.journal.reading}>{b.lecture}</LigneTable>
            </div>
          ))}
        </div>
      ))}
    </Feuille>
  );
};
