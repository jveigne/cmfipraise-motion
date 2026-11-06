import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoGlobeOutline } from 'react-icons/io5';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Telephone } from '../../ui/Telephone';
import { DrapeauCM, DrapeauFR } from '../../ui/Drapeaux';
import { DOCS, Doc, VUE_MARIE, VUE_PAUL, libellePortee } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';
import { EcranEspace, LigneDocument, hauteurDoc, hautLigne } from '../ecrans/EspaceDocuments';
import { CARTE, LIEUX, Planisphere, Point, Pulsation, TEINTE_CM, TEINTE_FR, pos } from '../ui/Carte';
import { CarteDoc } from '../ui/Couverture';
import { EtiquettePays } from './Probleme';
import { LegendeDocuments, borne, montee } from './commun';

/**
 * Partie « 1 · Mondial et par pays » (P5–P6) : un document pour tout le ministère (la nappe
 * recouvre toutes les nations), puis un document par pays (la France, le Cameroun). Enfin deux
 * téléphones côte à côte : Marie à Paris et Paul à Douala ont la même ligne « Tout le ministère »,
 * chacun ne voit que son pays (RG-FOLDER-02).
 */
export const DUREE_P5 = 285;
export const DUREE_P6 = 480;

/** Places des cartes de document (pixels vidéo, coin haut gauche ; largeur 380). */
const PLACE = {
  /** Sous la carte : le document mondial, une fois posé. */
  umpj: { x: 350, y: 1470 },
  /** Au large de la France, dans l'Atlantique : les deux documents de la France. */
  fr1: { x: 210, y: 650 },
  fr2: { x: 210, y: 790 },
  /** Dans le golfe de Guinée : le document du Cameroun. */
  cm: { x: 300, y: 1170 },
} as const;
const LARGEUR_CARTE = 380;
/** Hauteur d'une carte de document (vignette 62 × 88 + marges 14). */
const H_CARTE = 116;

/** Carte de document qui tombe du haut sur sa place (`p` : ressort 0 → 1). */
const Chute: React.FC<{ doc: Doc; x: number; y: number; p: number; echelle?: number; largeur?: number }> = ({ doc, x, y, p, echelle = 1, largeur = LARGEUR_CARTE }) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateY(${(1 - p) * -260}px) scale(${echelle * (1.15 - 0.15 * borne(p))})`,
        transformOrigin: 'left top',
        opacity: borne(p * 2),
      }}
    >
      <CarteDoc doc={doc} largeur={largeur} />
    </div>
  );

/** Trait pointillé d'une carte vers son pays. */
const Lien: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; couleur: string }> = ({ x1, y1, x2, y2, p, couleur }) =>
  p <= 0.001 ? null : (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={couleur} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" />
      {p > 0.95 ? <circle cx={x2} cy={y2} r={8} fill={couleur} /> : null}
    </svg>
  );

/** Bandeau « Tout le ministère » en tête de la nappe. */
const BandeauNappe: React.FC<{ p: number }> = ({ p }) =>
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, right: 0, top: CARTE.haut - 90, display: 'flex', justifyContent: 'center', opacity: borne(p), transform: `translateY(${(1 - borne(p)) * -30}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 30px',
          borderRadius: 99,
          background: S.moss,
          color: S.white,
          fontFamily: P.sans,
          fontWeight: 600,
          fontSize: 36,
          boxShadow: '0 14px 30px rgba(30,58,47,0.3)',
        }}
      >
        <IoGlobeOutline size={42} color={S.white} />
        {libellePortee('monde')}
      </div>
    </div>
  );

/** Toutes les nations du cadre (points posés par la nappe). */
const NATIONS = Object.keys(LIEUX).filter((l) => l !== 'france' && l !== 'cameroun') as (keyof typeof LIEUX)[];

// ---------------------------------------------------------------------------------------------
// P5 — Tout le ministère

export const P5Ministere: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const carte = doux(f, [0, 14], [0, 1]);
  const nappe = doux(f, [26, 86], [0, 1]);
  const chute = spring({ frame: f - 100, fps, config: { damping: 14 } });
  // La carte se pose au milieu (i 100), puis descend sous la carte (i 236 → 266).
  const descente = doux(f, [236, 266], [0, 1]);
  const centre = { x: 540 - LARGEUR_CARTE * 0.6, y: 900 };
  const x = centre.x + (PLACE.umpj.x - centre.x) * descente;
  const y = centre.y + (PLACE.umpj.y - centre.y) * descente;
  const echelle = 1.2 - 0.2 * descente;
  return (
    <AbsoluteFill>
      <Planisphere nappe={nappe} opacite={carte} />
      <BandeauNappe p={doux(f, [20, 34], [0, 1])} />
      {NATIONS.map((l, i) => {
        const c = pos(l);
        const a = 140 + i * 4;
        const p = spring({ frame: f - a, fps, config: { damping: 12 } });
        const sortie = doux(f, [240, 262], [1, 0]);
        return (
          <React.Fragment key={l}>
            <Point x={c.x} y={c.y} couleur={S.moss} echelle={p * sortie} />
            <Pulsation x={c.x} y={c.y} p={(f - a) / 24} couleur={S.moss} rayon={34} />
          </React.Fragment>
        );
      })}
      <Chute doc={DOCS.umpj} x={x} y={y} p={chute} echelle={echelle} />
      <LegendeDocuments lignes={LEGENDES.p5} duree={DUREE_P5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P6 — Chaque pays le sien

/** Les deux téléphones côte à côte (échelle 1,24) ; haut de l'écran à y = 576. */
const DUO = { echelle: 1.24, y: 560, x: [17, 549] as const };
const ecranVersVideo = (tel: 0 | 1, x: number, y: number) => ({ x: DUO.x[tel] + 16 + x * DUO.echelle, y: DUO.y + 16 + y * DUO.echelle });

/** Teintes des halos (« r,g,b ») : commun en argile, France en terre, Cameroun en mousse claire. */
const T_FR = '167,117,75';
const T_CM = '46,81,66';

/** Image de bascule de la carte vers les téléphones. */
const BASCULE = 176;

export const P6Pays: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fr = doux(f, [8, 24], [0, 1]);
  const cm = doux(f, [84, 100], [0, 1]);
  const france = pos('france');
  const cameroun = pos('cameroun');
  const chuteFr1 = spring({ frame: f - 24, fps, config: { damping: 14 } });
  const chuteFr2 = spring({ frame: f - 44, fps, config: { damping: 14 } });
  const chuteCm = spring({ frame: f - 100, fps, config: { damping: 14 } });
  // La carte remonte et s'efface (i 176 → 210), les téléphones montent (à partir de i 188).
  const sortieCarte = doux(f, [BASCULE, BASCULE + 34], [0, 1]);
  const tel = montee(f, fps, BASCULE + 12);

  // Halos : la ligne commune (i 236 → 300), puis les lignes de chaque pays (i 306 → 370).
  const commun = doux(f, [236, 248, 290, 302], [0, 1, 1, 0]);
  const pays = doux(f, [306, 318, 360, 372], [0, 1, 1, 0]);

  // Carte fantôme « Programme national » : elle quitte la liste de Marie (i 380), glisse vers
  // celle de Paul (i 384 → 410), bute et se dissout (i 412 → 436).
  const hMarie = VUE_MARIE.map(hauteurDoc);
  const hPaul = VUE_PAUL.map(hauteurDoc);
  const depart = ecranVersVideo(0, 20, hautLigne(hMarie, 2));
  const arrivee = ecranVersVideo(1, 20, hautLigne(hPaul, 2));
  const glisse = doux(f, [384, 410], [0, 1]);
  const dissout = doux(f, [412, 436], [0, 1]);
  const bute = f >= 408 && f < 420 ? Math.sin((f - 408) * 1.8) * (1 - (f - 408) / 12) * 10 : 0;
  const fantome = f >= 380 && dissout < 1;

  return (
    <AbsoluteFill>
      {/* La carte et ses documents. */}
      {sortieCarte < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - sortieCarte, transform: `translateY(${-sortieCarte * 500}px)` }}>
          <Planisphere nappe={1} fr={fr} cm={cm} attenue={Math.max(fr, cm) * 0.5} />
          <BandeauNappe p={1} />
          <Pulsation x={france.x} y={france.y} p={(f - 10) / 26} couleur={TEINTE_FR} />
          <Pulsation x={cameroun.x} y={cameroun.y} p={(f - 86) / 26} couleur={TEINTE_CM} />
          <EtiquettePays x={france.x + 40} y={france.y - 40} nom={CARTONS.pays.FR} drapeau={<DrapeauFR largeur={36} />} p={doux(f, [14, 24], [0, 1])} taille={28} />
          <EtiquettePays x={cameroun.x + 40} y={cameroun.y - 30} nom={CARTONS.pays.CM} drapeau={<DrapeauCM largeur={36} />} p={doux(f, [90, 100], [0, 1])} taille={28} />
          <Lien x1={PLACE.fr1.x + LARGEUR_CARTE} y1={PLACE.fr1.y + H_CARTE / 2} x2={france.x} y2={france.y} p={doux(f, [40, 52], [0, 1])} couleur={TEINTE_FR} />
          <Lien x1={PLACE.fr2.x + LARGEUR_CARTE} y1={PLACE.fr2.y + H_CARTE / 2} x2={france.x} y2={france.y} p={doux(f, [60, 72], [0, 1])} couleur={TEINTE_FR} />
          <Lien x1={PLACE.cm.x + LARGEUR_CARTE} y1={PLACE.cm.y + H_CARTE / 2} x2={cameroun.x} y2={cameroun.y} p={doux(f, [116, 128], [0, 1])} couleur={TEINTE_CM} />
          <Chute doc={DOCS.priere} x={PLACE.fr1.x} y={PLACE.fr1.y} p={chuteFr1} />
          <Chute doc={DOCS.programme} x={PLACE.fr2.x} y={PLACE.fr2.y} p={chuteFr2} />
          <Chute doc={DOCS.convention} x={PLACE.cm.x} y={PLACE.cm.y} p={chuteCm} />
          <Chute doc={DOCS.umpj} x={PLACE.umpj.x} y={PLACE.umpj.y} p={1} />
        </AbsoluteFill>
      ) : null}

      {/* Les deux téléphones. */}
      {f >= BASCULE ? (
        <AbsoluteFill style={{ transform: `translateY(${tel}px)` }}>
          {[
            { nom: CARTONS.marie, drapeau: <DrapeauFR largeur={44} />, docs: VUE_MARIE, halos: [commun, pays, pays], teintes: [undefined, T_FR, T_FR] },
            { nom: CARTONS.paul, drapeau: <DrapeauCM largeur={44} />, docs: VUE_PAUL, halos: [commun, pays], teintes: [undefined, T_CM] },
          ].map((t, i) => (
            <React.Fragment key={t.nom}>
              <div
                style={{
                  position: 'absolute',
                  left: DUO.x[i],
                  width: 390 * DUO.echelle + 32,
                  top: DUO.y - 74,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: P.sans,
                  fontWeight: 600,
                  fontSize: 36,
                  color: S.ink,
                }}
              >
                {t.drapeau}
                {t.nom}
              </div>
              <Telephone x={DUO.x[i]} y={DUO.y} echelle={DUO.echelle}>
                <EcranEspace docs={t.docs} halos={t.halos} teintes={t.teintes} />
              </Telephone>
            </React.Fragment>
          ))}
        </AbsoluteFill>
      ) : null}

      {fantome ? (
        <div
          style={{
            position: 'absolute',
            left: depart.x + (arrivee.x - depart.x) * glisse + bute,
            top: depart.y + (arrivee.y - depart.y) * glisse - Math.sin(glisse * Math.PI) * 60,
            width: 350,
            transform: `scale(${DUO.echelle * (1 + 0.06 * Math.sin(glisse * Math.PI) - 0.1 * dissout)})`,
            transformOrigin: '0 0',
            opacity: (f < 384 ? doux(f, [380, 384], [0, 0.85]) : 0.85) * (1 - dissout),
            filter: `blur(${dissout * 10}px)`,
            boxShadow: glisse > 0 ? '0 18px 30px rgba(42,38,32,0.2)' : undefined,
            borderRadius: 16,
          }}
        >
          <LigneDocument doc={DOCS.programme} style={{ borderStyle: 'dashed', borderColor: S.clay, borderWidth: 2 }} />
        </div>
      ) : null}

      <LegendeDocuments lignes={LEGENDES.p6Pays} duree={DUREE_P6} fin={BASCULE + 4} />
      <LegendeDocuments lignes={LEGENDES.p6Chacun} duree={DUREE_P6} debut={BASCULE + 20} />
    </AbsoluteFill>
  );
};
