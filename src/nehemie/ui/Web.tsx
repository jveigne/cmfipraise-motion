import React from 'react';
import {
  IoBusinessOutline,
  IoCalendarOutline,
  IoChevronDown,
  IoChevronForward,
  IoCreateOutline,
  IoDocumentTextOutline,
  IoGitNetworkOutline,
  IoLocationOutline,
  IoMegaphoneOutline,
  IoMenu,
  IoPeopleOutline,
  IoSparklesOutline,
} from 'react-icons/io5';
import { P } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import { WEB } from '../textes';
import { W } from '../web';

/**
 * Primitives de l'espace web redessinées (`web/src/components/ui.tsx` + classes de
 * `theme/styles.css`), en px CSS, mise en page étroite (`@media (max-width: 900px)`). Icônes :
 * équivalents Ionicons du jeu `components/Icon` du web.
 */

export const LARGEUR_CONTENU = 600 - 2 * 14;

/** `.mobile-topbar` : bouton menu + « Shephr ». Hauteur 59. */
export const BarreMobile: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${W.line}`, background: W.ivoryCard }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${W.line}`, display: 'grid', placeItems: 'center', color: W.green800 }}>
      <IoMenu size={20} />
    </div>
    <span style={{ fontFamily: P.serif, fontSize: 16, color: W.green800 }}>{WEB.titreMobile}</span>
  </div>
);

/** `TopBar` : fil d'Ariane + titre de page (21 px en étroit). */
export const BarrePage: React.FC<{ titre: string; fil: readonly string[] }> = ({ titre, fil }) => (
  <div style={{ padding: '12px 16px 10px', borderBottom: `1px solid ${W.line}`, background: 'linear-gradient(180deg, rgba(245,236,212,.45), rgba(232,220,196,0))' }}>
    <div style={{ fontSize: 12, color: W.ink500, display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
      {fil.map((c, i) => (
        <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: i === fil.length - 1 ? W.ink800 : W.ink500 }}>
          {i > 0 ? <IoChevronForward size={11} style={{ opacity: 0.55 }} /> : null}
          {c}
        </span>
      ))}
    </div>
    <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 21, letterSpacing: -0.2, color: W.green800, lineHeight: 1.25 }}>{titre}</div>
  </div>
);

/** Page complète : barre mobile, barre de page, contenu (`.content` : 16 × 14). */
export const PageWeb: React.FC<{ titre: string; fil: readonly string[]; defilement?: number; children: React.ReactNode }> = ({ titre, fil, defilement = 0, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: W.parchment, fontFamily: P.sans, fontSize: 14, lineHeight: 1.45, color: W.ink800, overflow: 'hidden' }}>
    <div style={{ transform: `translateY(${defilement}px)` }}>
      <BarreMobile />
      <BarrePage titre={titre} fil={fil} />
      <div style={{ padding: '16px 14px 48px' }}>{children}</div>
    </div>
  </div>
);

/** Trois parties de la page « Suivi de la ville » (plan 05 P-08 : une seule page, une entrée de menu). */
export type Section = 'bertoua' | 'journal' | 'evenements';
export const Sections: React.FC<{ active: Section; halo?: { section: Section; intensite: number } }> = ({ active, halo }) => {
  const items: { id: Section; label: string; Icone: typeof IoCreateOutline }[] = [
    { id: 'bertoua', label: WEB.nav.study, Icone: IoCreateOutline },
    { id: 'journal', label: WEB.nav.assembly, Icone: IoCalendarOutline },
    { id: 'evenements', label: WEB.nav.events, Icone: IoMegaphoneOutline },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
      {items.map(({ id, label, Icone }) => {
        const on = id === active;
        return (
          <Halo key={id} intensite={halo && halo.section === id ? halo.intensite : 0} rayon={10} marge={3} etalement={3}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 11px',
                borderRadius: 8,
                border: `1px solid ${on ? W.green800 : W.line}`,
                background: on ? W.green800 : W.ivoryCard,
                color: on ? W.ivoryCard : W.ink700,
                fontSize: 12.5,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <Icone size={13} />
              {label}
            </div>
          </Halo>
        );
      })}
    </div>
  );
};

/** `.tabs` / `.tab` : soulignement vert sous l'onglet actif. */
export const Onglets: React.FC<{ items: readonly { label: string; Icone?: typeof IoCreateOutline }[]; actif: number; halo?: { i: number; intensite: number } }> = ({
  items,
  actif,
  halo,
}) => (
  <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${W.line}`, marginBottom: 16 }}>
    {items.map(({ label, Icone }, i) => (
      <Halo key={label} intensite={halo && halo.i === i ? halo.intensite : 0} rayon={8} marge={2} margeY={1} etalement={3}>
        <div
          style={{
            padding: '9px 12px',
            fontSize: 13.5,
            fontWeight: 500,
            color: i === actif ? W.green800 : W.ink500,
            borderBottom: `2px solid ${i === actif ? W.green700 : 'transparent'}`,
            marginBottom: -1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          {Icone ? <Icone size={15} /> : null}
          {label}
        </div>
      </Halo>
    ))}
  </div>
);

export const ICONES_ONGLETS_VILLE = [IoBusinessOutline, IoPeopleOutline, IoSparklesOutline] as const;

/** `.card`. */
export const CarteWeb: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: W.ivoryCard, border: `1px solid ${W.line}`, borderRadius: 14, boxShadow: W.shadowSm, overflow: 'hidden', ...style }}>{children}</div>
);

/** `.card-head` + `.ttl` / `.sub`, et un élément à droite. */
export const TeteCarte: React.FC<{ titre: string; sous?: string; droite?: React.ReactNode }> = ({ titre, sous, droite }) => (
  <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: `1px solid ${W.lineSoft}` }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 16, color: W.green800, lineHeight: 1.3 }}>{titre}</div>
      {sous ? <div style={{ color: W.ink500, fontSize: 12.5, marginTop: 2 }}>{sous}</div> : null}
    </div>
    {droite}
  </div>
);

/** `.kpi` : libellé en capitales, valeur Fraunces 26, pastille terre en coin. */
export const Kpi: React.FC<{ label: string; valeur: React.ReactNode; sous?: React.ReactNode; halo?: number }> = ({ label, valeur, sous, halo = 0 }) => (
  <Halo intensite={halo} rayon={14} marge={3}>
    <div style={{ background: W.ivoryCard, border: `1px solid ${W.line}`, borderRadius: 14, padding: '14px 16px', position: 'relative', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ fontSize: 11, color: W.ink500, textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>{label}</div>
      <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 26, color: W.green800, marginTop: 6, letterSpacing: '-.015em', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>
        {valeur}
      </div>
      {sous ? <div style={{ fontSize: 12, marginTop: 4, color: W.ink500, position: 'relative', zIndex: 1 }}>{sous}</div> : null}
      <div style={{ position: 'absolute', right: -28, top: -28, width: 52, height: 52, borderRadius: '50%', background: W.earth50, opacity: 0.55 }} />
    </div>
  </Halo>
);

export interface Colonne<T> {
  label: React.ReactNode;
  largeur?: number | string;
  align?: 'left' | 'center' | 'right';
  rendu: (r: T, i: number) => React.ReactNode;
}

/**
 * `Table` (`table.tbl`, zébrée) : en-têtes en capitales 11,5 px, cellules 13,5 px. `padX` réduit
 * l'espacement horizontal (12 au lieu de 14) pour que les colonnes tiennent dans 572 px. `halos` :
 * surbrillance d'une ligne (annotation vidéo), `opacites` : apparition d'une ligne.
 */
export function TableWeb<T>({
  colonnes,
  lignes,
  padX = 12,
  padY = 11,
  halos,
  teinteHalo,
}: {
  colonnes: readonly Colonne<T>[];
  lignes: readonly T[];
  padX?: number;
  padY?: number;
  halos?: Partial<Record<number, number>>;
  teinteHalo?: string;
}) {
  const cellule = (c: Colonne<T>): React.CSSProperties => ({
    width: c.largeur,
    flex: c.largeur === undefined ? 1 : undefined,
    flexShrink: 0,
    padding: `0 ${padX}px`,
    textAlign: c.align ?? 'left',
    boxSizing: 'border-box',
    minWidth: 0,
  });
  return (
    <div style={{ fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: `1px solid ${W.line}`, padding: '11px 0', background: W.ivoryCard }}>
        {colonnes.map((c, i) => (
          <div
            key={i}
            style={{ ...cellule(c), fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: W.ink500, lineHeight: 1.25 }}
          >
            {c.label}
          </div>
        ))}
      </div>
      {lignes.map((r, i) => (
        <Halo key={i} intensite={halos?.[i] ?? 0} rayon={8} marge={2} margeY={0} etalement={3} teinte={teinteHalo}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${padY}px 0`,
              borderBottom: i === lignes.length - 1 ? undefined : `1px solid ${W.lineSoft}`,
              background: i % 2 === 1 ? 'rgba(244,235,211,.45)' : undefined,
            }}
          >
            {colonnes.map((c, j) => (
              <div key={j} style={cellule(c)}>
                {c.rendu(r, i)}
              </div>
            ))}
          </div>
        </Halo>
      ))}
    </div>
  );
}

/** `Badge` (`.badge.ok` / `.gray` / `.warn`), avec point. */
export const BadgeWeb: React.FC<{ ton: 'ok' | 'gray' | 'warn'; children: React.ReactNode }> = ({ ton, children }) => {
  const c = { ok: [W.okBg, W.ok, 'rgba(47,107,76,.2)'], gray: ['rgba(123,107,85,.1)', W.ink700, 'rgba(123,107,85,.18)'], warn: [W.warnBg, W.warn, 'rgba(176,122,42,.25)'] }[ton];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 500,
        lineHeight: 1.3,
        border: `1px solid ${c[2]}`,
        background: c[0],
        color: c[1],
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 3, background: 'currentColor' }} />
      {children}
    </span>
  );
};

/** `ProgressBar` de Assembly.tsx (hauteur 6, piste `--line`, remplissage `--green-700`). */
export const Barre: React.FC<{ p: number; hauteur?: number }> = ({ p, hauteur = 6 }) => (
  <div style={{ height: hauteur, borderRadius: 999, background: W.line, overflow: 'hidden', minWidth: 40, flex: 1 }}>
    <div style={{ width: `${Math.max(0, Math.min(1, p)) * 100}%`, height: '100%', borderRadius: 999, background: W.green700 }} />
  </div>
);

/** `Field` + `Picker` : libellé, puis la valeur choisie et un chevron. */
export const ChampWeb: React.FC<{ label: string; valeur: string; largeur: number; halo?: number }> = ({ label, valeur, largeur, halo = 0 }) => (
  <div style={{ width: largeur }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: W.ink700, marginBottom: 6 }}>{label}</div>
    <Halo intensite={halo} rayon={8} marge={3}>
      <div
        style={{
          height: 36,
          borderRadius: 8,
          border: `1px solid ${W.line}`,
          background: W.ivoryRaised,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: 13.5,
          color: W.ink800,
          gap: 8,
        }}
      >
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{valeur}</span>
        <IoChevronDown size={14} color={W.ink500} />
      </div>
    </Halo>
  </div>
);

/** `.btn.sm` secondaire (ou principal). */
export const BoutonWeb: React.FC<{ label: string; icone?: React.ReactNode; principal?: boolean; halo?: number }> = ({ label, icone, principal, halo = 0 }) => (
  <Halo intensite={halo} rayon={8} marge={3}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 7,
        fontSize: 12.5,
        fontWeight: 500,
        border: `1px solid ${principal ? W.green800 : W.line}`,
        background: principal ? W.green800 : W.ivoryCard,
        color: principal ? W.ivoryCard : W.ink800,
        whiteSpace: 'nowrap',
      }}
    >
      {icone}
      {label}
    </div>
  </Halo>
);

// ---------------------------------------------------------------------------------------------
// Menu en tiroir (`.sidebar` en étroit : 264 px, fond `--green-800`)

/** Entrées du menu d'un dirigeant de ville (Sidebar.tsx, ordre du code ; Dons masqués). */
const PILOTAGE = [
  { label: WEB.nav.goals, Icone: IoSparklesOutline },
  { label: WEB.nav.assembly, Icone: IoCalendarOutline },
  { label: WEB.nav.study, Icone: IoCreateOutline },
  { label: WEB.nav.studyCity, Icone: IoLocationOutline },
  { label: WEB.nav.events, Icone: IoMegaphoneOutline },
  { label: WEB.nav.memberCare, Icone: IoPeopleOutline },
  { label: WEB.nav.documents, Icone: IoDocumentTextOutline },
];
const ORGANISATION = [
  { label: WEB.nav.structure, Icone: IoBusinessOutline },
  { label: WEB.nav.users, Icone: IoPeopleOutline },
  { label: WEB.nav.hierarchy, Icone: IoGitNetworkOutline },
];

/** Index de « Suivi de la ville » dans la section Pilotage. */
export const ENTREE_VILLE = 3;
/** Centre de l'entrée « Suivi de la ville » (px CSS de la page). */
export const CENTRE_ENTREE_VILLE = { x: 110, y: 22 + 54 + 18 + 4 + 18 + ENTREE_VILLE * 38 + 19 };

export const Tiroir: React.FC<{ p: number; actif?: number; halo?: number }> = ({ p, actif = -1, halo = 0 }) => {
  if (p <= 0.001) return null;
  const Item: React.FC<{ label: string; Icone: typeof IoMenu; on: boolean; h?: number }> = ({ label, Icone, on, h = 0 }) => (
    <Halo intensite={h} rayon={8} marge={2} margeY={1} etalement={3} teinte="201,149,107">
      <div
        style={{
          height: 36,
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '0 10px',
          borderRadius: 8,
          fontSize: 13.5,
          color: on ? W.sidebarActive : W.sidebarText,
          background: on ? 'rgba(201,149,107,.18)' : undefined,
          boxShadow: on ? `inset 2px 0 0 ${W.earth500}` : undefined,
        }}
      >
        <Icone size={16} />
        {label}
      </div>
    </Halo>
  );
  const Rubrique: React.FC<{ children: string }> = ({ children }) => (
    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.14em', color: W.sidebarLabel, padding: '0 10px', margin: '4px 0' }}>{children}</div>
  );
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(20,39,31,${0.35 * p})` }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 264,
          transform: `translateX(${(1 - p) * -105}%)`,
          background: W.green800,
          padding: '22px 16px',
          boxSizing: 'border-box',
          boxShadow: '0 10px 40px rgba(20,39,31,.35)',
          fontFamily: P.sans,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 14px', borderBottom: '1px solid rgba(232,220,196,.12)', height: 54, boxSizing: 'border-box' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: W.earth500, color: W.green900, display: 'grid', placeItems: 'center', fontFamily: P.serif, fontWeight: 600, fontSize: 18 }}>
            S
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 20, color: '#F5ECD4' }}>{WEB.marque}</span>
            <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.14em', color: 'rgba(232,220,196,.55)', marginTop: 2 }}>{WEB.administration}</span>
          </div>
        </div>
        <div style={{ height: 18 }} />
        <Rubrique>{WEB.nav.pilotage}</Rubrique>
        {PILOTAGE.map((it, i) => (
          <Item key={it.label} label={it.label} Icone={it.Icone} on={i === actif} h={i === ENTREE_VILLE ? halo : 0} />
        ))}
        <div style={{ height: 14 }} />
        <Rubrique>{WEB.nav.organisation}</Rubrique>
        {ORGANISATION.map((it) => (
          <Item key={it.label} label={it.label} Icone={it.Icone} on={false} />
        ))}
      </div>
    </>
  );
};
