import React from 'react';
import {
  IoBookOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoChevronForward,
  IoFlagOutline,
  IoHomeOutline,
  IoMegaphoneOutline,
  IoMicOutline,
  IoPersonOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { APP, chiffres } from '../textes';
import { LigneEvenement } from '../donnees';
import { P, R, S } from '../theme';

/**
 * Briques de l'app Shephr redessinées à l'identique (shephr-app/mobile/components) : mêmes
 * tailles en points, mêmes couleurs, mêmes marges. Tout est posé dans le repère de l'écran
 * du `Telephone` (390 × 844 points).
 */

/** Haut de la zone sûre d'un iPhone à Dynamic Island : `insets.top` de l'app. */
export const ZONE_SURE = 59;

/**
 * `ScreenShell` : fond parchemin, marges latérales de 20, contenu défilant. `defilement` (points,
 * négatif = vers le bas) déplace le contenu ; `haut` = `insets.top + paddingTop`.
 * Écart assumé : sous la barre d'état, une bande parchemin estompe le contenu défilé — dans
 * l'app il passe dessous en clair, ce qui brouille l'heure à l'image.
 */
export const Ecran: React.FC<{
  haut?: number;
  defilement?: number;
  fond?: string;
  children: React.ReactNode;
}> = ({ haut = ZONE_SURE + 12, defilement = 0, fond = S.parchment, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: fond, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        padding: `${haut}px 20px 120px`,
        transform: `translateY(${defilement}px)`,
        fontFamily: P.sans,
        color: S.ink,
      }}
    >
      {children}
    </div>
    {haut >= ZONE_SURE && defilement < 0 ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 64,
          background: `linear-gradient(to bottom, ${fond} 0px, ${fond} 50px, rgba(232,220,196,0) 64px)`,
        }}
      />
    ) : null}
  </div>
);

/** `Label` : Inter 12, majuscules, espacé, encre 3. */
export const Etiquette: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: P.sans,
      fontSize: 12,
      letterSpacing: 0.72,
      textTransform: 'uppercase',
      color: S.ink3,
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Surtitre en JetBrains Mono argile (« ÉVANGÉLISATION », « ÉVÈNEMENTS »). */
export const Surtitre: React.FC<{ children: React.ReactNode; haut?: number }> = ({ children, haut = 4 }) => (
  <div
    style={{
      marginTop: haut,
      fontFamily: P.mono,
      fontSize: 11,
      color: S.clay,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

export const Titre: React.FC<{ children: React.ReactNode; taille?: number }> = ({ children, taille = 28 }) => (
  <div style={{ fontFamily: P.serif, fontSize: taille, color: S.ink, letterSpacing: taille >= 30 ? -0.5 : -0.4, marginTop: 4, lineHeight: 1.2 }}>
    {children}
  </div>
);

export const Intro: React.FC<{ children: React.ReactNode; largeur?: number; haut?: number }> = ({
  children,
  largeur,
  haut = 6,
}) => (
  <div style={{ fontFamily: P.sans, fontSize: 13, color: S.ink3, marginTop: haut, lineHeight: '20px', maxWidth: largeur }}>
    {children}
  </div>
);

/** `Card` : papier, rayon 22, filet léger. */
export const Carte: React.FC<{
  children: React.ReactNode;
  variante?: 'paper' | 'paper2' | 'tinted';
  style?: React.CSSProperties;
}> = ({ children, variante = 'paper', style }) => (
  <div
    style={{
      background: variante === 'paper2' ? S.paper2 : variante === 'tinted' ? S.mossTint : S.paper,
      borderRadius: R.lg,
      border: '1px solid rgba(42,38,32,0.07)',
      boxShadow: '0 6px 18px rgba(42,38,32,0.04)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/** `Chip` : pastille de choix ; `choisie` passe en mousse pleine. */
export const Pastille: React.FC<{ label: string; choisie?: boolean }> = ({ label, choisie }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 14px',
      borderRadius: 999,
      border: `1px solid ${choisie ? S.mossDeep : 'transparent'}`,
      background: choisie ? S.moss : 'rgba(42,38,32,0.045)',
      color: choisie ? S.white : S.ink2,
      fontFamily: P.sans,
      fontSize: 13,
      fontWeight: 500,
      lineHeight: '16px',
    }}
  >
    {label}
  </div>
);

type Variante = 'primary' | 'ghost' | 'soft' | 'danger';
const PALETTES: Record<Variante, { bg: string; fg: string; bord?: string }> = {
  primary: { bg: S.moss, fg: S.white },
  ghost: { bg: 'transparent', fg: S.moss, bord: S.hairStrong },
  soft: { bg: S.parchmentDeep, fg: S.mossDeep },
  danger: { bg: 'transparent', fg: S.clay, bord: 'rgba(184,106,74,0.3)' },
};

/** `Button` : rayon 18, Inter 16 600 ; `inactif` = opacité 0,4 comme dans l'app. */
export const Bouton: React.FC<{
  label: string;
  variante?: Variante;
  hauteur?: number;
  icone?: React.ReactNode;
  /** Icône après le libellé (`iconRight` du `Button`), facultative : vidéo « Documents » (mur de l'aperçu). */
  iconeDroite?: React.ReactNode;
  inactif?: number;
  style?: React.CSSProperties;
}> = ({ label, variante = 'primary', hauteur = 54, icone, iconeDroite, inactif = 0, style }) => {
  const p = PALETTES[variante];
  return (
    <div
      style={{
        height: hauteur,
        borderRadius: 18,
        padding: '0 22px',
        background: p.bg,
        border: p.bord ? `1px solid ${p.bord}` : undefined,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: p.fg,
        fontFamily: P.sans,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: -0.1,
        opacity: 1 - 0.6 * inactif,
        ...style,
      }}
    >
      {icone}
      <span>{label}</span>
      {iconeDroite}
    </div>
  );
};

/** `Field` : champ de saisie (papier 2, rayon 14). Sans valeur, le texte indicatif est gris. */
export const Champ: React.FC<{ valeur?: string; indication?: string; hauteur?: number; curseur?: boolean }> = ({
  valeur,
  indication,
  hauteur,
  curseur,
}) => (
  <div
    style={{
      background: S.paper2,
      border: `1px solid ${S.hair}`,
      borderRadius: 14,
      padding: '14px 16px',
      fontFamily: P.sans,
      fontSize: 16,
      lineHeight: '20px',
      minHeight: hauteur,
      boxSizing: 'border-box',
      color: valeur ? S.ink : S.ink3,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }}
  >
    {valeur || indication}
    {curseur ? <span style={{ display: 'inline-block', width: 2, height: 19, marginLeft: 1, background: S.moss, verticalAlign: -3 }} /> : null}
  </div>
);

/** Bandeau de rattachement (`banner` de declare.tsx / EventForm.tsx). */
export const Bandeau: React.FC<{ icone: React.ReactNode; children: React.ReactNode; haut?: number }> = ({
  icone,
  children,
  haut = 18,
}) => (
  <div
    style={{
      marginTop: haut,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 14px',
      borderRadius: R.md,
      background: S.mossTint,
    }}
  >
    {icone}
    <div style={{ flex: 1, fontSize: 12.5, color: S.ink2, lineHeight: '18px' }}>{children}</div>
  </div>
);

/** `EventPill` : pastille de statut teintée. */
export const PastilleStatut: React.FC<{ ton: string; icone: React.ReactNode; texte: string; echelle?: number }> = ({
  ton,
  icone,
  texte,
  echelle = 1,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: 99,
      border: `1px solid ${ton}3A`,
      background: `${ton}16`,
      color: ton,
      fontFamily: P.sans,
      fontSize: 10.5,
      fontWeight: 600,
      lineHeight: '14px',
      transform: `scale(${echelle})`,
      opacity: Math.min(1, echelle),
      whiteSpace: 'nowrap',
    }}
  >
    {icone}
    {texte}
  </div>
);

export const PastilleProgramme = () => (
  <PastilleStatut ton={S.earthDeep} icone={<IoCalendarOutline size={11} />} texte={APP.status.PLANNED} />
);
export const PastilleACloturer = () => (
  <PastilleStatut ton={S.clay} icone={<IoTimeOutline size={11} />} texte={APP.toCloseBadge} />
);
export const PastilleRealise = ({ echelle = 1 }: { echelle?: number }) => (
  <PastilleStatut ton={S.moss} icone={<IoCheckmarkCircleOutline size={11} />} texte={APP.status.DONE} echelle={echelle} />
);
export const PastilleAVerifier = ({ echelle = 1 }: { echelle?: number }) => (
  <PastilleStatut ton={S.clay} icone={<IoFlagOutline size={11} />} texte={APP.toVerify} echelle={echelle} />
);

/**
 * `EventPreacherLine` (EventRow.tsx, D-EVT-16) : « Prédicateur : … », micro mousse, seulement s'il
 * est renseigné.
 */
export const LignePredicateur: React.FC<{ nom?: string }> = ({ nom }) =>
  nom ? (
    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
      <IoMicOutline size={13} color={S.moss} />
      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: S.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {APP.mine.preacher(nom)}
      </div>
    </div>
  ) : null;

/** `EventRow` : type, pastilles, intitulé, « date · lieu · nœud », prédicateur, compteurs saisis. */
export const LigneEvt: React.FC<{ evt: LigneEvenement; halo?: number; style?: React.CSSProperties }> = ({
  evt,
  halo = 0,
  style,
}) => (
  <Halo intensite={halo} rayon={R.md}>
    <Carte style={{ padding: '12px 14px', borderRadius: R.md, ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120, fontFamily: P.serif, fontSize: 16.5, color: S.ink, letterSpacing: -0.2, lineHeight: '21px' }}>
          {evt.type}
        </div>
        {evt.mien ? (
          <PastilleStatut ton={S.moss} icone={<IoPersonOutline size={11} />} texte={APP.mine.ownBadge} />
        ) : null}
        {evt.statut === 'programme' ? <PastilleProgramme /> : null}
        {evt.statut === 'aCloturer' ? <PastilleACloturer /> : null}
        <IoChevronForward size={16} color={S.ink3} style={{ marginTop: 2 }} />
      </div>
      {evt.titre ? <div style={{ marginTop: 2, fontSize: 13, color: S.ink2 }}>{evt.titre}</div> : null}
      <div style={{ marginTop: 4, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>
        {[evt.dates, evt.lieu, evt.noeud].filter(Boolean).join(' · ')}
      </div>
      <LignePredicateur nom={evt.predicateur} />
      {/* `EventFigures` : seulement les compteurs saisis (D-EVT-15), invités dans les participants (D-EVT-17). */}
      {chiffres(evt) ? (
        <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 600, color: S.mossSoft }}>{chiffres(evt)}</div>
      ) : null}
    </Carte>
  </Halo>
);

/** En-tête d'un bloc d'agenda (`AgendaBlock`) : titre Fraunces 20 + pastille de compte. */
export const TeteBloc: React.FC<{ titre: string; compte?: React.ReactNode; ton?: string; sous?: string; halo?: number }> = ({
  titre,
  compte,
  ton = S.moss,
  sous,
  halo = 0,
}) => (
  <div style={{ marginTop: 28 }}>
    {/* Halo serré verticalement : le sous-titre est à 4 pt sous le titre. */}
    <Halo intensite={halo} rayon={10} marge={6} margeY={1} etalement={2}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: P.serif, fontSize: 20, color: S.ink, lineHeight: '25px' }}>{titre}</div>
        {compte != null ? (
          <div
            style={{
              minWidth: 22,
              padding: '2px 7px',
              boxSizing: 'border-box',
              borderRadius: 99,
              background: ton,
              color: S.white,
              fontSize: 11.5,
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: '15px',
            }}
          >
            {compte}
          </div>
        ) : null}
      </div>
    </Halo>
    {sous ? <div style={{ marginTop: 4, fontSize: 12, color: S.ink3, lineHeight: '17px' }}>{sous}</div> : null}
  </div>
);

/**
 * Surbrillance douce (annotation vidéo) : un halo argile autour de l'élément, qui ne change pas
 * sa mise en page. `intensite` de 0 à 1. `margeY` (par défaut `marge`) et `etalement` (largeur
 * du liseré extérieur, 6 par défaut) se réduisent quand un texte voisin est collé à l'élément :
 * le halo ne doit pas mordre dessus.
 */
export const Halo: React.FC<{
  intensite: number;
  rayon?: number;
  marge?: number;
  margeY?: number;
  etalement?: number;
  /**
   * Teinte du halo en « r,g,b » (facultative, argile par défaut) : la vidéo « Documents » distingue
   * ainsi la France et le Cameroun (P6).
   */
  teinte?: string;
  children: React.ReactNode;
}> = ({ intensite, rayon = 16, marge = 4, margeY = marge, etalement = 6, teinte = '184,106,74', children }) => (
  <div style={{ position: 'relative' }}>
    {children}
    {intensite > 0.001 ? (
      <div
        style={{
          position: 'absolute',
          top: -margeY,
          bottom: -margeY,
          left: -marge,
          right: -marge,
          borderRadius: rayon + Math.min(marge, margeY),
          border: `2.5px solid rgba(${teinte},${0.85 * intensite})`,
          boxShadow: `0 0 0 ${etalement}px rgba(${teinte},${0.18 * intensite}), 0 0 ${4 * etalement + 2}px rgba(${teinte},${0.35 * intensite})`,
          pointerEvents: 'none',
        }}
      />
    ) : null}
  </div>
);

/**
 * Onglets visibles pour un compte rattaché (`(tabs)/_layout.tsx`, dans l'ordre des
 * `Tabs.Screen`) : Accueil, Objectifs (`hasMemberGoals` ou dirigeant), Assemblée (abonnement
 * ASSEMBLY), Évènements (abonnement EVENTS + `canDeclareEvents`), Profil. Déclarations et Brebis
 * sont masqués : pas d'abonnement DONATIONS dans le scénario, Brebis réservé aux dirigeants
 * disposant de Member Care — non montré dans la vidéo.
 */
export const ONGLETS = { accueil: 0, objectifs: 1, assemblee: 2, evenements: 3, profil: 4 } as const;

/** Géométrie de la barre (points) : `left/right/bottom` 14, hauteur 60 + `insets.bottom` 34. */
const BARRE = { marge: 14, hauteur: 94, haut: 8 };

/**
 * Centre de l'icône d'un onglet, en points d'écran (appui du doigt sur la barre) : cinq onglets
 * de même largeur entre les marges de 14.
 */
export const centreOnglet = (i: number) => {
  const largeur = (390 - 2 * BARRE.marge) / APP.onglets.length;
  return { x: BARRE.marge + largeur * (i + 0.5), y: 844 - BARRE.marge - BARRE.hauteur + BARRE.haut + 18 };
};

/**
 * Barre d'onglets flottante de l'app (`(tabs)/_layout.tsx`) : icônes Ionicons « -outline »,
 * actif en mousse, inactifs en encre 3. `actif` : index de l'onglet (`ONGLETS`). `halo` (facultatif) :
 * surbrillance argile d'un onglet (annotation vidéo, P5 : « Évènements »), `intensite` de 0 à 1.
 * `libelles` (facultatif) : noms des cinq onglets dans une autre langue (« Journal de l'assemblée »
 * en anglais, JP 14/10/2026) ; par défaut ceux de fr.json.
 */
export const BarreOnglets: React.FC<{ actif: number; halo?: { onglet: number; intensite: number }; libelles?: readonly string[] }> = ({
  actif,
  halo,
  libelles = APP.onglets,
}) => {
  const icones = [IoHomeOutline, IoFlagOutline, IoBookOutline, IoMegaphoneOutline, IoPersonOutline];
  return (
    <div
      style={{
        position: 'absolute',
        left: BARRE.marge,
        right: BARRE.marge,
        bottom: BARRE.marge,
        height: BARRE.hauteur,
        borderRadius: 24,
        border: '1px solid rgba(42,38,32,0.08)',
        background: 'rgba(245,236,216,0.96)',
        boxShadow: '0 8px 24px rgba(42,38,32,0.08)',
        display: 'flex',
        padding: `${BARRE.haut}px 0 38px`,
        boxSizing: 'border-box',
      }}
    >
      {libelles.map((nom, i) => {
        const Icone = icones[i];
        const couleur = i === actif ? S.moss : S.ink3;
        const intensite = halo && halo.onglet === i ? halo.intensite : 0;
        return (
          <div key={nom} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Halo intensite={intensite} rayon={10} marge={2} margeY={4} etalement={3}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Icone size={24} color={couleur} />
                <div style={{ fontFamily: P.sans, fontSize: 11, fontWeight: 600, color: couleur }}>{nom}</div>
              </div>
            </Halo>
          </div>
        );
      })}
    </div>
  );
};

/** Ligne libellé / valeur de la carte de détail (`Row` de events/[id].tsx). */
export const LigneDetail: React.FC<{ label: string; valeur?: string | number | null; derniere?: boolean }> = ({
  label,
  valeur,
  derniere,
}) => {
  const vide = valeur == null || valeur === '';
  return (
    <div style={{ padding: '10px 0', borderBottom: derniere ? undefined : `1px solid ${S.hair}` }}>
      <div style={{ fontSize: 11.5, color: S.ink3, lineHeight: '15px' }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 14, color: vide ? S.ink3 : S.ink, lineHeight: '20px' }}>
        {vide ? '—' : String(valeur)}
      </div>
    </div>
  );
};

/** Trait ondulé « fait main » (`HandDivider`). */
export const TraitMain: React.FC<{ marge?: number }> = ({ marge = 8 }) => (
  <svg width="100%" height={14} viewBox="0 0 240 12" preserveAspectRatio="none" style={{ display: 'block', margin: `${marge}px 0` }}>
    <path d="M2 6 Q 30 1, 60 6 T 120 6 T 180 6 T 238 6" stroke={S.moss} strokeOpacity={0.35} strokeWidth={1.3} strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * Clés des compteurs d'un évènement, dans l'ordre de l'app (`COUNTER_KEYS` de utils/events.ts) :
 * les deux généraux (`GENERAL_COUNTERS` : participants, invités — D-EVT-17), puis les trois
 * évangéliques (D-EVT-15).
 */
export type CleCompteur = 'participants' | 'invites' | 'conversions' | 'restaurations' | 'baptemes';
const CLES_COMPTEURS: readonly CleCompteur[] = ['participants', 'invites', 'conversions', 'restaurations', 'baptemes'];
const LIBELLES_COMPTEURS: Record<CleCompteur, string> = {
  participants: APP.declare.participants,
  invites: APP.declare.guests,
  conversions: APP.declare.conversions,
  restaurations: APP.declare.restorations,
  baptemes: APP.declare.baptisms,
};

/**
 * `EventCounterFields` (D-EVT-15, D-EVT-17, JP 14/10) : « Participants » et « Invités » (aide « dont
 * personnes extérieures » sous le champ) pour tout type ; conversions, restaurations et baptêmes
 * pour un type évangélique seulement. Grille de cellules à 47 % (deux par ligne, écarts 12 × 14),
 * « — » quand c'est vide, et l'indication « Facultatif : … » sous la grille si le type est
 * évangélique. Partagé par la déclaration et « Marquer comme réalisé ». La vidéo saisit toujours
 * invités ≤ participants : le message d'erreur sous le champ (RG-EVT-09) n'y apparaît pas.
 */
export const ChampsCompteurs: React.FC<{
  evangelique: boolean;
  valeurs?: Partial<Record<CleCompteur, string>>;
  curseur?: CleCompteur | null;
}> = ({ evangelique, valeurs = {}, curseur = null }) => (
  <div style={{ marginTop: 18 }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 14 }}>
      {(evangelique ? CLES_COMPTEURS : CLES_COMPTEURS.slice(0, 2)).map((cle) => (
        <div key={cle} style={{ width: '47%', flexGrow: 0 }}>
          <Etiquette style={{ marginBottom: 8 }}>{LIBELLES_COMPTEURS[cle]}</Etiquette>
          <Champ valeur={valeurs[cle]} indication="—" curseur={curseur === cle} />
          {cle === 'invites' ? <div style={{ marginTop: 6, fontSize: 12, color: S.ink3 }}>{APP.declare.guestsHint}</div> : null}
        </div>
      ))}
    </div>
    {evangelique ? (
      <div style={{ marginTop: 8, fontSize: 12, color: S.ink3, lineHeight: '17px' }}>{APP.declare.countersHint}</div>
    ) : null}
  </div>
);

/**
 * `EventPreacherField` (D-EVT-16, JP 14/10) : « Prédicateur », champ libre, pour un type évangélique
 * seulement, juste après le type et la date. `halo` : surbrillance argile (annotation vidéo).
 */
export const ChampPredicateur: React.FC<{ valeur?: string; curseur?: boolean; halo?: number }> = ({ valeur, curseur, halo = 0 }) => (
  <div style={{ marginTop: 18 }}>
    <Etiquette style={{ marginBottom: 8 }}>{APP.declare.preacher}</Etiquette>
    <Halo intensite={halo} rayon={14}>
      <Champ valeur={valeur} indication={APP.declare.preacherPlaceholder} curseur={curseur} />
    </Halo>
  </div>
);
