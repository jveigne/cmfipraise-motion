import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoPeople } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { DrapeauCI, DrapeauCM, DrapeauFR } from '../../ui/Drapeaux';
import { CARTONS, FIL, LEGENDES } from '../textes';
import { BulleFichier, BulleTexte, EnteteFil, Fil, Separateur } from '../ui/Conversation';
import { LIEUX, Planisphere, Point, Pulsation, TEINTE_FR, pos, proj } from '../ui/Carte';
import { IconeFichier } from '../ui/Couverture';
import { LegendeDocuments, borne, lisse } from './commun';

/**
 * Partie « Le problème » (P1–P3, 19,5 s) : les documents circulent en PDF dans une conversation de
 * groupe — (1) perdus dans le fil ; (2) plusieurs versions ; (3) un document d'un pays envoyé à
 * tout le monde. Conversation stylisée (aucune marque), puis la carte du monde.
 */
export const DUREE_P1 = 195;
export const DUREE_P2 = 195;
export const DUREE_P3 = 195;

/** Panneau de conversation hors téléphone : 390 points agrandis 2,3 fois, sous la légende. */
const PANNEAU = { echelle: 2.3, x: (1080 - 390 * 2.3) / 2, y: 470, hauteur: 590 };

const Panneau: React.FC<{ entree: number; children: React.ReactNode }> = ({ entree, children }) => (
  <div
    style={{
      position: 'absolute',
      left: PANNEAU.x,
      top: PANNEAU.y,
      width: 390,
      height: PANNEAU.hauteur,
      transform: `translateY(${(1 - entree) * 120}px) scale(${PANNEAU.echelle})`,
      transformOrigin: '0 0',
      opacity: borne(entree * 1.4),
    }}
  >
    <div
      style={{
        width: 390,
        height: PANNEAU.hauteur,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(42,38,32,0.18)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EnteteFil nom={FIL.groupe} sous={FIL.membresGroupe} />
      {children}
    </div>
  </div>
);

const H_FIL = PANNEAU.hauteur - 57;

// ---------------------------------------------------------------------------------------------
// P1 — « Quelqu'un a le PDF ? »

export const P1Perdu: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = spring({ frame: f, fps, config: { damping: 16 } });
  // Le PDF d'origine est en vue (i 0 → 40), puis le fil défile : 7 messages (i 44 → 80), la date
  // du jour, et les trois questions (i 96, 122, 148).
  const defilent = FIL.defilent.map((m, i) => ({
    cle: `d${i}`,
    p: lisse(f, fps, 44 + i * 5, 8),
    noeud: <BulleTexte de={m.de} texte={m.texte} heure={`${9 + i}:${10 + i * 7}`} />,
  }));
  const questions = FIL.questions.map((q, i) => ({
    cle: `q${i}`,
    p: lisse(f, fps, 96 + i * 26, 10),
    noeud: <BulleTexte de={q.de} texte={q.texte} heure={`10:${42 + i * 3}`} />,
  }));
  return (
    <AbsoluteFill>
      <Panneau entree={entree}>
        <Fil
          hauteur={H_FIL}
          elements={[
            { cle: 'v0', noeud: <BulleTexte de="Sophie" texte={FIL.defilent[6].texte} heure="18:02" /> },
            { cle: 'v1', noeud: <BulleTexte de="Marc" texte={FIL.defilent[4].texte} heure="18:20" /> },
            { cle: 'sep', noeud: <Separateur texte={FIL.ilYa3Mois} /> },
            { cle: 'envoi', noeud: <BulleTexte de={FIL.envoiUmpj.de} texte={FIL.envoiUmpj.texte} heure="21:02" /> },
            {
              cle: 'pdf',
              noeud: <BulleFichier de="Jean" fichier={FIL.fichierUmpj} meta="PDF · 12 pages · 1,8 Mo" heure="21:02" halo={doux(f, [12, 22, 36, 44], [0, 1, 1, 0])} />,
            },
            { cle: 'merci', noeud: <BulleTexte de={FIL.merciUmpj.de} texte={FIL.merciUmpj.texte} heure="21:15" /> },
            ...defilent,
            { cle: 'auj', p: lisse(f, fps, 86, 8), noeud: <Separateur texte={FIL.aujourdhui} /> },
            ...questions,
          ]}
        />
      </Panneau>
      <LegendeDocuments lignes={LEGENDES.p1} duree={DUREE_P1} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P2 — Trois versions

export const P2Versions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = spring({ frame: f, fps, config: { damping: 16 } });
  const metas = ['PDF · 4 pages · 310 ko', 'PDF · 4 pages · 312 ko', 'PDF · 4 pages · 318 ko'];
  const heures = ['lun. 18:02', 'mar. 09:40', 'jeu. 21:17'];
  const fichiers = FIL.fichiersPriere.map((nom, i) => ({
    cle: `f${i}`,
    p: lisse(f, fps, 14 + i * 26, 10),
    noeud: <BulleFichier de={FIL.envoisPriere[i]} fichier={nom} meta={metas[i]} heure={heures[i]} halo={doux(f, [96 + i * 4, 104 + i * 4], [0, 1])} />,
  }));
  // Le « ? » argile se pose sur les trois fichiers (i 100), qui tremblent un instant.
  const question = spring({ frame: f - 100, fps, config: { damping: 11 } });
  const tremble = f > 100 && f < 124 ? Math.sin((f - 100) * 1.6) * (1 - (f - 100) / 24) * 4 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${tremble}px)` }}>
        <Panneau entree={entree}>
          <Fil
            hauteur={H_FIL}
            elements={[
              ...FIL.avantPriere.map((m, i) => ({ cle: `a${i}`, noeud: <BulleTexte de={m.de} texte={m.texte} heure={`dim. 20:${14 + i * 9}`} /> })),
              { cle: 'sep', noeud: <Separateur texte={FIL.cetteSemaine} /> },
              fichiers[0],
              fichiers[1],
              { cle: 'rq', p: lisse(f, fps, 52, 10), noeud: <BulleTexte de={FIL.remarquePriere.de} texte={FIL.remarquePriere.texte} heure="mar. 09:41" /> },
              fichiers[2],
            ]}
          />
        </Panneau>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 770,
          top: 1010,
          width: 220,
          height: 220,
          borderRadius: 110,
          background: S.clay,
          color: S.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 170,
          lineHeight: 1,
          paddingBottom: 14,
          boxSizing: 'border-box',
          boxShadow: '0 24px 50px rgba(184,106,74,0.4)',
          transform: `scale(${question}) rotate(${(1 - question) * -30}deg)`,
        }}
      >
        ?
      </div>
      <LegendeDocuments lignes={LEGENDES.p2} duree={DUREE_P2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P3 — Envoyé à tout le monde

/** Le groupe « International », au milieu de l'Atlantique. */
const GROUPE = proj(-33, 33);
/** Destinations des flèches : tous les pays du groupe. */
const CIBLES: (keyof typeof LIEUX)[] = [
  'montreal', 'abidjan', 'douala', 'saoPaulo', 'kinshasa', 'newYork', 'bruxelles', 'dakar', 'johannesburg',
  'portAuPrince', 'nairobi', 'geneve', 'lome', 'bogota', 'londres', 'moscou', 'libreville',
];
/** Pays nommés à l'arrivée (storyboard : Cameroun, Côte d'Ivoire, Canada…). */
const NOMMES: { lieu: keyof typeof LIEUX; nom: string; drapeau?: React.ReactNode; dx: number; dy: number }[] = [
  { lieu: 'montreal', nom: CARTONS.pays.CA, dx: -10, dy: -78 },
  { lieu: 'abidjan', nom: CARTONS.pays.CI, drapeau: <DrapeauCI largeur={36} />, dx: -270, dy: 30 },
  { lieu: 'douala', nom: CARTONS.pays.CM, drapeau: <DrapeauCM largeur={36} />, dx: 40, dy: 0 },
];

/** Étiquette de pays (pixels vidéo). */
export const EtiquettePays: React.FC<{ x: number; y: number; nom: string; drapeau?: React.ReactNode; p: number; taille?: number }> = ({
  x,
  y,
  nom,
  drapeau,
  p,
  taille = 30,
}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 16px',
        borderRadius: 99,
        background: S.paper2,
        boxShadow: '0 8px 20px rgba(42,38,32,0.16)',
        fontFamily: P.sans,
        fontWeight: 600,
        fontSize: taille,
        color: S.ink,
        whiteSpace: 'nowrap',
        opacity: borne(p),
        transform: `scale(${0.7 + 0.3 * borne(p)})`,
        transformOrigin: 'left center',
      }}
    >
      {drapeau}
      {nom}
    </div>
  );

/** Puce « fichier » en pixels vidéo : icône PDF et nom du fichier. */
const PuceFichier: React.FC<{ nom: string; x: number; y: number; echelle: number }> = ({ nom, x, y, echelle }) =>
  echelle <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${echelle})`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px 12px 12px',
        borderRadius: 18,
        background: S.paper2,
        boxShadow: '0 14px 30px rgba(42,38,32,0.22)',
        fontFamily: P.sans,
        fontWeight: 600,
        fontSize: 26,
        color: S.ink,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ width: 40, height: 50, borderRadius: 6, background: S.clay, color: S.white, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6, boxSizing: 'border-box' }}>
        PDF
      </div>
      {nom}
    </div>
  );

export const P3Partout: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const carte = doux(f, [0, 14], [0, 1]);
  const fr = doux(f, [10, 24], [0, 1]);
  const france = pos('france');
  // Le fichier sort de la France (i 22 → 34), puis file vers le groupe (i 40 → 64).
  const sortie = spring({ frame: f - 22, fps, config: { damping: 14 } });
  const trajet = doux(f, [40, 64], [0, 1]);
  const groupe = spring({ frame: f - 30, fps, config: { damping: 13 } });
  const fichierX = france.x + (GROUPE.x - france.x) * trajet - 60 * (1 - trajet);
  const fichierY = france.y - 70 * (1 - trajet) + (GROUPE.y - france.y + 70) * trajet;
  const avale = doux(f, [64, 72], [1, 0.55]);
  return (
    <AbsoluteFill>
      <Planisphere fr={fr} opacite={carte} />
      <Pulsation x={france.x} y={france.y} p={(f - 12) / 26} couleur={TEINTE_FR} />
      <EtiquettePays x={france.x + 38} y={france.y - 70} nom={CARTONS.pays.FR} drapeau={<DrapeauFR largeur={36} />} p={doux(f, [16, 26, 70, 80], [0, 1, 1, 0])} />

      {/* Flèches du groupe vers tous les pays (i 78 → 130). */}
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        {CIBLES.map((l, i) => {
          const c = pos(l);
          const a = 78 + i * 3;
          const p = doux(f, [a, a + 18], [0, 1]);
          if (p <= 0) return null;
          const mx = (GROUPE.x + c.x) / 2;
          const my = (GROUPE.y + c.y) / 2 - 90;
          const longueur = Math.hypot(c.x - GROUPE.x, c.y - GROUPE.y) * 1.15;
          return (
            <path
              key={l}
              d={`M${GROUPE.x},${GROUPE.y} Q${mx},${my} ${c.x},${c.y}`}
              fill="none"
              stroke={S.clay}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={`${longueur} ${longueur}`}
              strokeDashoffset={longueur * (1 - p)}
              opacity={0.75}
            />
          );
        })}
      </svg>
      {CIBLES.map((l, i) => {
        const c = pos(l);
        const a = 78 + i * 3 + 16;
        const p = spring({ frame: f - a, fps, config: { damping: 12 } });
        return (
          <React.Fragment key={l}>
            <Point x={c.x} y={c.y} couleur={S.clay} echelle={p} />
            {p > 0.01 ? (
              <div style={{ position: 'absolute', left: c.x - 4, top: c.y - 54, transform: `scale(${p})`, transformOrigin: 'bottom left' }}>
                <IconeFichier taille={42} />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {NOMMES.map((n, i) => {
        const c = pos(n.lieu);
        return <EtiquettePays key={n.lieu} x={c.x + n.dx} y={c.y + n.dy} nom={n.nom} drapeau={n.drapeau} p={doux(f, [120 + i * 8, 132 + i * 8], [0, 1])} taille={28} />;
      })}

      {/* Le groupe « International ». */}
      {groupe > 0.01 ? (
        <div style={{ position: 'absolute', left: GROUPE.x, top: GROUPE.y, transform: `translate(-50%, -50%) scale(${groupe})` }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              background: S.ink2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 16px 36px rgba(42,38,32,0.3)',
              margin: '0 auto',
            }}
          >
            <IoPeople size={62} color={S.white} />
          </div>
          <div style={{ position: 'absolute', top: 130, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: P.sans, fontWeight: 600, fontSize: 28, color: S.ink2 }}>
            {CARTONS.groupeInternational}
          </div>
        </div>
      ) : null}
      <PuceFichier nom={FIL.fichierProgramme} x={fichierX} y={fichierY} echelle={f < 72 ? sortie * avale : 0} />

      <LegendeDocuments lignes={LEGENDES.p3} duree={DUREE_P3} />
    </AbsoluteFill>
  );
};
