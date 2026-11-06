import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Carte, Halo } from '../../evenements/ui/app';
import type { TextesJournal } from '../textes';
import { Reunion } from '../donnees';
import { useJournal } from '../langue';

/**
 * Briques de l'app propres à la Vie d'assemblée (shephr-app/mobile/app/(tabs)/assembly/*,
 * components/MeetingReportCard.tsx, AssemblyHierarchyStats.tsx), redessinées aux mêmes tailles en
 * points. Les hauteurs de ligne sont posées explicitement : les positions d'appui des plans en
 * dépendent (repère 390 × 844 du `Telephone`).
 */

/** Interrupteur iOS (`Switch`) : piste mousse quand il est allumé, pastille `paper2`. `p` de 0 à 1. */
export const Interrupteur: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      width: 51,
      height: 31,
      borderRadius: 16,
      background: p > 0.5 ? S.moss : S.hairStrong,
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 2,
        left: 2 + 20 * p,
        width: 27,
        height: 27,
        borderRadius: 14,
        background: S.paper2,
        boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.12)',
      }}
    />
  </div>
);

/** Indicateur d'activité (`ActivityIndicator`) : douze traits qui tournent. */
export const Chargement: React.FC<{ couleur: string; taille?: number }> = ({ couleur, taille = 20 }) => {
  const f = useCurrentFrame();
  const pas = Math.floor(f / 2) % 12;
  return (
    <svg width={taille} height={taille} viewBox="-10 -10 20 20">
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={0}
          y1={-4.5}
          x2={0}
          y2={-8.5}
          stroke={couleur}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.25 + 0.75 * (((i - pas + 12) % 12) / 11)}
          transform={`rotate(${i * 30})`}
        />
      ))}
    </svg>
  );
};

/**
 * Ligne du chevron de retour (`headerRow` des écrans empilés). `hauteur` : 22 (chevron seul), 34
 * quand la ligne porte des boutons ronds (compte rendu : modifier, supprimer).
 */
export const Retour: React.FC<{ hauteur?: number; children?: React.ReactNode }> = ({ hauteur = 22, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: hauteur }}>
    <IoChevronBack size={22} color={S.ink2} />
    <div style={{ flex: 1 }} />
    {children}
  </div>
);

/** Segments « Réunions » | « Avancement » (`tabRow`) : fond mousse 6 %, actif en papier. */
export const Segments: React.FC<{ actif: 0 | 1; halo?: number }> = ({ actif, halo = 0 }) => {
  const { app } = useJournal();
  return (
    <div style={{ marginTop: 18, display: 'flex', background: S.mossTint, borderRadius: 99, padding: 3, height: 40, boxSizing: 'border-box' }}>
      {[app.tabMeetings, app.tabProgress].map((l, i) => (
        <div key={l} style={{ flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Halo intensite={i === 1 ? halo : 0} rayon={99} marge={2}>
              <div
                style={{
                  height: 34,
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: i === actif ? S.paper : 'transparent',
                  boxShadow: i === actif ? '0 1px 3px rgba(42,38,32,0.08)' : undefined,
                  fontSize: 13,
                  fontWeight: 600,
                  color: i === actif ? S.moss : S.ink3,
                }}
              >
                {l}
              </div>
            </Halo>
          </div>
        </div>
      ))}
    </div>
  );
};

/** Rond de navigation ‹ › (`yearBtn` / `navBtn`). `inactif` : opacité 0,3 (pas de période future). */
export const RondNav: React.FC<{ sens: 'avant' | 'apres'; taille?: number; inactif?: boolean }> = ({ sens, taille = 34, inactif }) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille / 2,
      background: S.mossTint,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: inactif ? 0.3 : 1,
      flexShrink: 0,
    }}
  >
    {sens === 'avant' ? <IoChevronBack size={taille * 0.53} color={S.ink2} /> : <IoChevronForward size={taille * 0.53} color={S.ink2} />}
  </div>
);

/**
 * Ligne « ‹ 2026 › » (`yearRow`, `periodRow`) : le libellé est centré, les ronds de part et
 * d'autre à `ecart` points. `largeur` : largeur réservée au libellé (`minWidth`).
 */
export const LignePeriode: React.FC<{
  libelle: React.ReactNode;
  suivantInactif: boolean;
  taille?: number;
  ecart?: number;
  largeur?: number;
  police?: number;
  haut?: number;
}> = ({ libelle, suivantInactif, taille = 34, ecart = 18, largeur, police = 20, haut = 16 }) => (
  <div style={{ marginTop: haut, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: ecart, height: taille }}>
    <RondNav sens="avant" taille={taille} />
    <div style={{ fontFamily: P.serif, fontSize: police, color: S.ink, minWidth: largeur, textAlign: 'center', lineHeight: `${taille}px` }}>
      {libelle}
    </div>
    <RondNav sens="apres" taille={taille} inactif={suivantInactif} />
  </div>
);

/** Sous-titre d'une réunion (`MeetingRows`) : « 9 présents · Fraction de pain · livre — chapitres ». */
export const sousTitreReunion = (app: TextesJournal['app'], m: Reunion) =>
  `${app.attendees(m.presents)}${m.pain ? ` · ${app.breadBreaking}` : ''} · ${
    m.livre && m.chapitres ? `${m.livre} — ${m.chapitres}` : app.noReading
  }`;

/** Hauteur d'une ligne de réunion : 81 points sur deux lignes de sous-titre, 65 sur une. */
export const hauteurReunion = (m: Reunion) => (m.livre ? 81 : 65);

/** Carte des réunions (`MeetingRows`) : date, sous-titre limité à 2 lignes, chevron. */
export const LignesReunions: React.FC<{
  reunions: readonly Reunion[];
  haloPremiere?: number;
  /** Entrée de la première ligne (0 → 1) : elle s'ouvre en haut de la liste. */
  entreePremiere?: number;
}> = ({ reunions, haloPremiere = 0, entreePremiere = 1 }) => {
  const { app } = useJournal();
  return (
    <Carte style={{ marginTop: 14 }}>
      {reunions.map((m, i) => {
        const premiere = i === 0;
        const h = hauteurReunion(m);
        const contenu = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              height: h,
              boxSizing: 'border-box',
              borderBottom: i < reunions.length - 1 ? `1px solid ${S.hair}` : undefined,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink, lineHeight: '19px' }}>{m.date}</div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 11.5,
                  color: S.ink3,
                  lineHeight: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {sousTitreReunion(app, m)}
              </div>
            </div>
            <IoChevronForward size={18} color={S.ink3} />
          </div>
        );
        if (!premiere) return <div key={m.date}>{contenu}</div>;
        return (
          <div key={m.date} style={{ height: h * entreePremiere, overflow: 'hidden', opacity: entreePremiere, background: haloPremiere > 0 ? `rgba(184,106,74,${0.1 * haloPremiere})` : undefined }}>
            {contenu}
          </div>
        );
      })}
    </Carte>
  );
};

/** Bloc d'avancement d'un module (`ModuleProgressBlock`). `remplissage` : 0 → 1 (annotation vidéo). */
export const BlocAvancement: React.FC<{
  livre: string;
  lus: number;
  total: number;
  dernier: number;
  date: string;
  remplissage?: number;
  halo?: number;
}> = ({ livre, lus, total, dernier, date, remplissage = 1, halo = 0 }) => {
  const { app } = useJournal();
  const pct = Math.round((lus / total) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: S.ink, lineHeight: '18px' }}>{livre}</div>
        <div style={{ fontFamily: P.mono, fontSize: 12.5, color: S.mossSoft, lineHeight: '18px' }}>{pct}%</div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: S.mossTint2, overflow: 'hidden' }}>
        <div style={{ height: 8, borderRadius: 4, background: S.moss, width: `${pct * remplissage}%` }} />
      </div>
      <Halo intensite={halo} rayon={8} marge={4} margeY={2} etalement={3}>
        <div style={{ fontSize: 11.5, color: S.ink3, lineHeight: '16px' }}>
          {app.progress.readOf(lus, total)}
          {' · '}
          {app.progress.last(dernier, date)}
        </div>
      </Halo>
    </div>
  );
};

/** Bouton plein mousse « + Nouveau CR » (`newBtn`) ou contour « Journal PDF » (`journalBtn`). */
export const BoutonListe: React.FC<{
  label: string;
  icone: React.ReactNode;
  plein?: boolean;
  haut: number;
  halo?: number;
}> = ({ label, icone, plein, haut, halo = 0 }) => (
  <div style={{ marginTop: haut }}>
    <Halo intensite={halo} rayon={14}>
      <div
        style={{
          height: 44,
          boxSizing: 'border-box',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: plein ? S.moss : S.paper2,
          border: plein ? undefined : `1px solid ${S.hairStrong}`,
          color: plein ? S.white : S.moss,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {icone}
        <span>{label}</span>
      </div>
    </Halo>
  </div>
);

/** Carte à étiquette, gabarit commun des cartes de formulaire (`card` : marges 16). */
export const CarteForm: React.FC<{ children: React.ReactNode; haut?: number; style?: React.CSSProperties }> = ({
  children,
  haut = 14,
  style,
}) => <Carte style={{ marginTop: haut, padding: 16, ...style }}>{children}</Carte>;

/** Fondu d'opacité borné, sur des images locales. */
export const fonduEntre = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

