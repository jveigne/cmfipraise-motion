import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { P, S } from '../../evenements/theme';
import { Bascule } from '../../evenements/ui/Bascule';
import { DONNEES } from '../donnees';
import { useJournal } from '../langue';
import { EcranVieAssemblee, PT_VIE } from '../ecrans/VieAssemblee';
import { EcranCompteRendu } from '../ecrans/CompteRendu';
import { hauteurReunion } from '../ui/elements';
import { Appui, Decale, LegendeJournal, Voile, borne, voilePour } from './commun';

/**
 * Partie « 2 · Conserver » (P11–P12) : le journal grandit, réunion après réunion ; on le relit
 * année par année, de 2026 à 2017 — 1 an, 5 ans, 10 ans, même après un changement de dirigeant
 * (réponse aux problèmes 1 et 2 du cahier). Puis l'avancement des livres.
 */
export const DUREE_K1 = 285;
export const DUREE_K2 = 135;

/** Appuis sur « ‹ » : année affichée après chaque appui (2025 → 2017). */
const APPUIS_ANNEE = [90, 114, 132, 148, 172, 186, 200, 212, 224];
/** Année visée (dès l'appui) ; la liste, elle, change à mi-fondu (2 images plus tard). */
const anneeA = (f: number, retard = 0) => 2026 - APPUIS_ANNEE.filter((a) => f >= a + retard).length;

/**
 * Défilement de la liste 2017 qui amène sa dernière ligne (10 mai 2017) au-dessus de la barre
 * d'onglets. La hauteur d'une ligne ne dépend que de la présence d'une lecture : même valeur dans
 * les deux langues, calculée sur le jeu français.
 */
const DEFIL_2017 = -(423 + DONNEES.fr.REUNIONS_PAR_ANNEE[2017].reduce((s, m) => s + hauteurReunion(m) + 1, 0) - 720);

/** Décalage du téléphone pour libérer la droite (frise des années). */
const DECALAGE = { dx: -257, reduction: 0.78 };

/** Frise verticale des années (annotation vidéo, à droite du téléphone). */
const HAUT_FRISE = 560;
const PAS_FRISE = 92;

const Frise: React.FC<{ f: number; fps: number; annee: number; apparition: number }> = ({ f, fps, annee, apparition }) => {
  const { cartons, d, langue } = useJournal();
  const ligne = (i: number) => HAUT_FRISE + i * PAS_FRISE;
  // Accolades : « 1 an » (2026), « 5 ans » (2026 → 2022), « 10 ans » (2026 → 2017).
  const accolades = [
    { label: cartons.unAn, jusque: 0, a: 70, x: 868, versLeHaut: langue === 'en' },
    { label: cartons.cinqAns, jusque: 4, a: 150, x: 930, versLeHaut: false },
    { label: cartons.dixAns, jusque: 9, a: 226, x: 992, versLeHaut: false },
  ];
  const nouveau = spring({ frame: f - 120, fps, config: { damping: 14 } });
  const total = spring({ frame: f - 240, fps, config: { damping: 12 } });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: apparition, transform: `translateX(${(1 - apparition) * 80}px)` }}>
      {d.COMPTES_PAR_ANNEE.map((c, i) => {
        const vue = c.annee >= annee;
        const active = c.annee === annee;
        return (
          <div
            key={c.annee}
            style={{
              position: 'absolute',
              left: 600,
              top: ligne(i) - 22,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontFamily: P.mono,
              fontSize: 30,
              color: active ? S.moss : vue ? S.ink2 : S.ink3,
              fontWeight: active ? 500 : 400,
              opacity: vue ? 1 : 0.35,
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 9, background: active ? S.clay : vue ? S.sauge : S.hairStrong }} />
            <span>{c.annee}</span>
            <span style={{ color: S.ink3 }}>·</span>
            <span>{c.n}</span>
          </div>
        );
      })}
      {accolades.map((a) => {
        const p = doux(f, [a.a, a.a + 12], [0, 1]);
        if (p <= 0) return null;
        const y1 = ligne(0) - 24;
        const y2 = ligne(a.jusque) + 24;
        return (
          <React.Fragment key={a.label}>
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1080} height={1920}>
              <path
                d={`M ${a.x - 14} ${y1} L ${a.x} ${y1} L ${a.x} ${y2} L ${a.x - 14} ${y2}`}
                fill="none"
                stroke={S.sauge}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
            </svg>
            {a.versLeHaut ? (
              /*
               * Revue 14/10 (EN seulement) : « 1 year » est plus long que l'accolade d'une seule année
               * (48 px) ; centré, il débordait en haut et en bas et frôlait l'accolade « 5 years ».
               * Il part ici du bas de l'accolade et ne déborde que vers le haut (zone vide), resserré
               * de 4 px vers l'accolade. « 1 an » (FR) garde la pose centrée ci-dessous.
               */
              <div
                style={{
                  position: 'absolute',
                  left: a.x + 24 - 4 - 15,
                  top: y2,
                  height: 30,
                  lineHeight: '30px',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '0 0',
                  fontFamily: P.sans,
                  fontWeight: 700,
                  fontSize: 26,
                  color: S.moss,
                  whiteSpace: 'nowrap',
                  opacity: p,
                }}
              >
                {a.label}
              </div>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: a.x + 24,
                  top: (y1 + y2) / 2,
                  transform: 'translate(-50%, -50%) rotate(-90deg)',
                  fontFamily: P.sans,
                  fontWeight: 700,
                  fontSize: 26,
                  color: S.moss,
                  whiteSpace: 'nowrap',
                  opacity: p,
                }}
              >
                {a.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
      {/* Entre 2024 et 2023 : le nouveau dirigeant retrouve tout l'historique (problème 1). */}
      <div
        style={{
          position: 'absolute',
          left: 590,
          top: (ligne(2) + ligne(3)) / 2 - 19,
          padding: '6px 14px',
          borderRadius: 99,
          background: S.mossSoft,
          color: S.white,
          fontFamily: P.sans,
          fontWeight: 600,
          fontSize: 21,
          whiteSpace: 'nowrap',
          transform: `scale(${nouveau})`,
          transformOrigin: '0 50%',
        }}
      >
        {cartons.nouveauDirigeant2024}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 594,
          top: ligne(9) + 56,
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: -1,
          color: S.moss,
          transform: `scale(${total})`,
          transformOrigin: '0 50%',
          whiteSpace: 'nowrap',
        }}
      >
        {cartons.totalComptesRendus(d.TOTAL_COMPTES)}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// P11 — Le journal grandit : 1 an, 5 ans, 10 ans

export const K1Annees: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { legendes, d } = useJournal();
  const liste2026 = [d.REUNION_DU_JOUR, ...d.REUNIONS_2026];
  const annee = anneeA(f);
  const anneeListe = anneeA(f, 2);
  const dernierAppui = [...APPUIS_ANNEE].reverse().find((a) => f >= a) ?? -100;
  const bascule = doux(f, [dernierAppui, dernierAppui + 6], [0, 1]);
  const fonduListe = doux(f, [dernierAppui, dernierAppui + 2, dernierAppui + 4], [1, 0.2, 1]);
  const decale = doux(f, [54, 74], [0, 1]);
  const reunions = anneeListe === 2026 ? liste2026 : d.REUNIONS_PAR_ANNEE[anneeListe];
  // 2017 : la liste défile jusqu'à la première réunion, le 10 mai 2017 (i 228 → 240).
  const defilement = anneeListe === 2017 ? doux(f, [228, 240], [0, DEFIL_2017]) : 0;
  const vie = (
    <EcranVieAssemblee
      onglet="reunions"
      annee={f >= APPUIS_ANNEE[0] ? <Bascule de={annee + 1} a={annee} p={bascule} hauteur={34} /> : 2026}
      anneeCourante={annee === 2026}
      reunions={reunions}
      defilement={defilement}
      haloPremiere={doux(f, [16, 24, 42, 50], [0, 1, 1, 0])}
      opaciteListe={f >= APPUIS_ANNEE[0] ? fonduListe : 1}
    />
  );
  return (
    <AbsoluteFill>
      <Decale dx={DECALAGE.dx * decale} reduction={1 - (1 - DECALAGE.reduction) * decale}>
        <Plateau
          dessus={
            <>
              {APPUIS_ANNEE.map((a) => (
                <Appui key={a} {...PT_VIE.anneePrecedente} a={a} />
              ))}
            </>
          }
        >
          {/* Retour arrière : le compte rendu recule vers la liste (i 0 → 14). */}
          <Pile p={1 - doux(f, [0, 14], [0, 1])} dessous={vie} dessus={<EcranCompteRendu defilement={-700} copie={1} />} />
        </Plateau>
      </Decale>
      <Frise f={f} fps={fps} annee={annee} apparition={borne(doux(f, [58, 76], [0, 1]) - doux(f, [275, 285], [0, 1]))} />
      <LegendeJournal lignes={legendes.p11Grandit} duree={DUREE_K1} debut={6} fin={84} />
      <LegendeJournal lignes={legendes.p11Annees} duree={DUREE_K1} debut={88} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P12 — L'avancement des livres

export const K2Avancement: React.FC = () => {
  const f = useCurrentFrame();
  const { legendes, d } = useJournal();
  const retour = doux(f, [0, 16], [1, 0]);
  const avancement = f >= 32;
  const zoom = doux(f, [50, 66, 118, 132], [1, 1.3, 1.3, 1]);
  return (
    <AbsoluteFill>
      <Decale dx={DECALAGE.dx * retour} reduction={1 - (1 - DECALAGE.reduction) * retour}>
        <Plateau zoom={zoom} foyer={PT_VIE.avancement} dessus={<Appui {...PT_VIE.segmentAvancement} a={30} />}>
          {avancement ? (
            <EcranVieAssemblee onglet="avancement" remplissage={doux(f, [34, 64], [0, 1])} haloAvancement={doux(f, [66, 74, 104, 112], [0, 1, 1, 0])} />
          ) : (
            // Raccord sur 2026 (dans l'app, l'année choisie resterait 2017 : sans effet sur l'avancement).
            <EcranVieAssemblee
              onglet="reunions"
              annee={f < 20 ? 2017 : 2026}
              anneeCourante={f >= 20}
              reunions={f < 20 ? d.REUNIONS_PAR_ANNEE[2017] : [d.REUNION_DU_JOUR, ...d.REUNIONS_2026]}
              defilement={f < 20 ? DEFIL_2017 : 0}
              haloSegmentAvancement={doux(f, [18, 24], [0, 1])}
            />
          )}
        </Plateau>
      </Decale>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={legendes.p12} duree={DUREE_K2} />
    </AbsoluteFill>
  );
};
