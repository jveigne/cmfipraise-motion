import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoBusinessOutline, IoChevronForward, IoFlagOutline, IoHomeOutline, IoMapOutline, IoMegaphoneOutline } from 'react-icons/io5';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { versVideo } from '../../ui/Scene';
import { CARTONS, LEGENDES } from '../textes';
import { ECHELLE_TOTAUX, NiveauStats, STATS } from '../donnees';
import { P, S } from '../theme';
import { EcranStats } from '../ecrans/Stats';
import { Bascule } from '../ui/Bascule';
import { Appui, Decale, LegendeShephr, Voile, lisse, montee, voilePour } from './commun';

/**
 * Chapitre 4 — la géographie. P14 : les totaux remontent d'eux-mêmes (RG-ACT-05). P15 : la
 * descente nation → région → ville → assemblée. P16 : un évènement de ville compte une fois, à
 * la ville (D-EVT-04). P17 : par type et par mois.
 */
export const DUREE_P14 = 218;
export const DUREE_P15 = 176;
export const DUREE_P16 = 198;
export const DUREE_P17 = 158;

/**
 * Retour JP 14/10 (« ça avance trop vite ») : aucun geste n'est ralenti (montée du jeton, appuis,
 * fondus de niveau, défilements gardent leur durée) ; ce sont les poses qui s'allongent — arrêt du
 * jeton sur chaque carte, niveau lu avant l'appui suivant, addition et « octobre 2026 » tenues
 * ≈ 1,3 à 1,5 s (resserrées après un premier passage à ≈ 2 s, pour tenir ≈ 2 min au total).
 * Revue du 14/10 : P14 porté de 192 à 218 images, le total France (106) est tenu ≈ 1,3 s.
 * Les légendes reçoivent `DUREE_Pxx - 7` (= DUREE - 1 - `debut`) : le fondu s'achève sur la
 * dernière image du plan, jamais coupé à mi-fondu.
 */

/**
 * Centres des trois cartes de sous-niveau, page non défilée (points). D-EVT-15 : la grille des KPI
 * a une rangée de plus (conversions, restaurations, baptêmes : + 86,5 pt) et la ligne de chiffres
 * de chaque carte passe sur deux lignes (« … · 9 baptêmes », + 14,5 pt par carte) ; les
 * défilements suivent pour garder le même cadrage qu'avant. D-EVT-17 : la tuile « Invités » fait
 * passer la grille à quatre rangées (relevé à l'écran : + 70 pt) ; « dont N invités » tient dans
 * les deux lignes de chiffres de chaque carte.
 */
const CARTES = [923, 1053, 1183];
/** Centre de la phrase « Dont N actions rattachées directement à … », page non défilée. */
const PHRASE = 1270;
const DEFILEMENT_DESCENTE = -560;
const DEFILEMENT_VILLE = -620;
/**
 * Défilement de Paris Nord qui amène la ligne « octobre 2026 » vers le milieu de l'écran : + 86,5
 * (KPI) + 14,5 par ligne chiffrée au-dessus (4 types, 5 mois) + 7 (la sienne) depuis D-EVT-15 ;
 * + 70 (tuile « Invités », D-EVT-17 — les lignes chiffrées restent sur deux lignes).
 */
const DEFILEMENT_MOIS = -1304;

// ---------------------------------------------------------------------------------------------
// P14 — Les totaux remontent tout seuls (schéma)

const ICONES_ECHELLE = { maison: IoHomeOutline, immeuble: IoBusinessOutline, carte: IoMapOutline, drapeau: IoFlagOutline } as const;
/** Hauts des quatre cartes, de l'assemblée (en bas) à la nation (en haut). */
const HAUTS = [1600, 1320, 1040, 760];
const HAUTEUR_CARTE = 180;
/** Image où le jeton atteint chaque carte (le nombre de la carte bascule à cette image). */
const PASSAGES = [38, 80, 116, 152];
/** Image où le jeton repart de chaque carte (arrêt ≈ 0,5 s pour lire la bascule). */
const DEPARTS = [52, 94, 130];

export const P14Remontee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const centres = HAUTS.map((h) => h + HAUTEUR_CARTE / 2);
  const jetonY = doux(
    f,
    [PASSAGES[0], DEPARTS[0], PASSAGES[1], DEPARTS[1], PASSAGES[2], DEPARTS[2], PASSAGES[3]],
    [centres[0], centres[0], centres[1], centres[1], centres[2], centres[2], centres[3]],
  );
  const jeton = spring({ frame: f - 32, fps, config: { damping: 12 } }) * (1 - doux(f, [154, 164], [0, 1]));
  // France à 106 tenue avec son halo (i 166 → 204, ≈ 1,3 s : c'est l'aboutissement du plan — revue
  // du 14/10, au lieu de 0,4 s), puis le schéma s'efface (i 204 → 218).
  const sortie = doux(f, [204, 218], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={1920}>
        <line x1={120} x2={120} y1={centres[3]} y2={centres[0]} stroke={S.mossTint2} strokeWidth={6} strokeLinecap="round" />
        <line
          x1={120}
          x2={120}
          y1={jetonY}
          y2={centres[0]}
          stroke={S.moss}
          strokeOpacity={0.5 * Math.min(1, jeton * 2) * (f > 36 ? 1 : 0)}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {centres.map((c, i) => (
          <circle key={i} cx={120} cy={c} r={12} fill={f >= PASSAGES[i] && f > 36 ? S.moss : S.parchmentDeep} />
        ))}
      </svg>
      {ECHELLE_TOTAUX.map((n, i) => {
        const pose = spring({ frame: f - i * 5, fps, config: { damping: 200 }, durationInFrames: 18 });
        const Icone = ICONES_ECHELLE[n.icone];
        const bascule = doux(f, [PASSAGES[i], PASSAGES[i] + 8], [0, 1]);
        const eclat = doux(f, [PASSAGES[i], PASSAGES[i] + 14], [0, 1]);
        const france = i === 3 ? doux(f, [154, 166], [0, 1]) : 0;
        return (
          <div
            key={n.nom}
            style={{
              position: 'absolute',
              left: 180,
              width: 780,
              top: HAUTS[i],
              height: HAUTEUR_CARTE,
              boxSizing: 'border-box',
              padding: '0 40px',
              borderRadius: 40,
              background: S.paper,
              border: `2px solid ${france > 0 ? `rgba(184,106,74,${0.8 * france})` : 'rgba(42,38,32,0.07)'}`,
              boxShadow: `0 18px 40px rgba(42,38,32,0.08), 0 0 0 ${10 * france}px rgba(184,106,74,${0.16 * france})`,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              opacity: pose,
              transform: `translateY(${(1 - pose) * 50}px)`,
            }}
          >
            <div style={{ width: 84, height: 84, borderRadius: 26, background: S.mossTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icone size={42} color={S.mossSoft} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: P.mono, fontSize: 24, letterSpacing: 2, color: S.ink3, textTransform: 'uppercase' }}>{n.niveau}</div>
              <div style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 44, color: S.ink, marginTop: 4 }}>{n.nom}</div>
            </div>
            <div
              style={{
                fontFamily: P.serif,
                fontSize: 84,
                color: S.ink,
                lineHeight: '96px',
                textShadow: eclat > 0 && eclat < 1 ? `0 0 ${24 * (1 - eclat)}px rgba(30,58,47,0.5)` : undefined,
              }}
            >
              <Bascule de={n.avant} a={n.apres} p={f > 36 ? bascule : 0} hauteur={96} />
            </div>
          </div>
        );
      })}
      {/* Jeton « +1 » : une action déclarée à Paris Nord, qui remonte le long de l'échelle. */}
      {jeton > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 120 - 52,
            top: jetonY - 52,
            width: 104,
            height: 104,
            borderRadius: 52,
            background: S.moss,
            color: S.white,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(30,58,47,0.35)',
            transform: `scale(${jeton})`,
          }}
        >
          <IoMegaphoneOutline size={34} />
          <div style={{ fontFamily: P.sans, fontWeight: 700, fontSize: 28, lineHeight: 1 }}>+1</div>
        </div>
      ) : null}
      <LegendeShephr lignes={LEGENDES.p14} duree={DUREE_P14 - 7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Fil d'Ariane agrandi (annotation vidéo)

/**
 * Le fil d'Ariane de `EventStatsDrill`, agrandi sous la légende : dans l'app il est en haut de
 * page, hors du cadre une fois la page défilée jusqu'aux cartes. Même style (maillons passés
 * soulignés en mousse, maillon courant en encre), à l'échelle de l'image.
 */
const FilAnnote: React.FC<{ fil: string[]; maillon: number; opacite: number }> = ({ fil, maillon, opacite }) => (
  <div style={{ position: 'absolute', top: 334, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: opacite }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 30px',
        borderRadius: 99,
        background: S.paper,
        border: `2px solid ${S.hair}`,
        boxShadow: '0 10px 26px rgba(42,38,32,0.08)',
        fontFamily: P.sans,
        fontSize: 34,
        lineHeight: '42px',
        whiteSpace: 'nowrap',
      }}
    >
      {fil.map((nom, i) => {
        const dernier = i === fil.length - 1;
        const p = dernier && i > 0 ? maillon : 1;
        return (
          <React.Fragment key={nom}>
            {i > 0 ? <IoChevronForward size={26} color={S.ink3} style={{ opacity: p }} /> : null}
            <span
              style={{
                opacity: p,
                fontWeight: dernier ? 700 : 600,
                color: dernier ? S.ink : S.moss,
                textDecoration: dernier ? undefined : 'underline',
                textUnderlineOffset: 6,
              }}
            >
              {nom}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------------------------
// P15 — De la nation jusqu'à l'assemblée

/**
 * Niveau affiché pendant une descente : l'ancien s'estompe (opacité 0,6, comme dans l'app pendant
 * le chargement), puis le nouveau arrive en fondu, le fil d'Ariane s'allonge.
 */
const etatDescente = (f: number, etapes: { a: number; niveau: NiveauStats }[]) => {
  let courant = etapes[0];
  for (const e of etapes) if (f >= e.a) courant = e;
  const suivante = etapes.find((e) => e.a > f);
  const estompeAvant = suivante ? doux(f, [suivante.a - 9, suivante.a - 3], [0, 1]) : 0;
  const arrivee = courant === etapes[0] ? 1 : doux(f, [courant.a, courant.a + 8], [0, 1]);
  return {
    niveau: courant.niveau,
    estompe: Math.max(estompeAvant, 1 - arrivee),
    maillon: arrivee,
    haloMaillon: courant === etapes[0] ? 0 : doux(f, [courant.a + 4, courant.a + 10, courant.a + 30, courant.a + 38], [0, 1, 1, 0]),
  };
};

export const P15Descente: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const etat = etatDescente(f, [
    { a: 0, niveau: STATS.france },
    { a: 68, niveau: STATS.idf },
    { a: 142, niveau: STATS.paris },
  ]);
  // Chaque niveau est lu ≈ 1 à 1,3 s avant l'appui suivant ; Paris est tenu i 150 → 176 (enchaîné
  // en P16, qui reste sur Paris).
  const y = (i: number) => CARTES[i] + DEFILEMENT_DESCENTE;
  return (
    <AbsoluteFill>
      <Plateau
        zoom={1.2}
        foyer={{ x: 195, y: 470 }}
        decalageY={montee(f, fps)}
        dessus={
          <>
            {/* Les ondes s'effacent (i 65 → 68, 139 → 142) avant le niveau suivant : ni sur les villes, ni sur les assemblées. */}
            <Appui x={195} y={y(2)} a={58} coupe={65} />
            <Appui x={195} y={y(1)} a={132} coupe={139} />
          </>
        }
      >
        <EcranStats
          niveau={etat.niveau}
          estompe={etat.estompe}
          maillon={etat.maillon}
          haloMaillon={etat.haloMaillon}
          defilement={DEFILEMENT_DESCENTE}
          haloEnfant={
            f < 68 ? { index: 2, intensite: doux(f, [42, 50], [0, 1]) } : { index: 1, intensite: doux(f, [118, 126, 136, 142], [0, 1, 1, 0]) }
          }
        />
      </Plateau>
      <Voile force={1} />
      <FilAnnote fil={etat.niveau.fil} maillon={etat.maillon} opacite={doux(f, [12, 22], [0, 1])} />
      <LegendeShephr lignes={LEGENDES.p15} duree={DUREE_P15 - 7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P16 — Un évènement de ville compte une seule fois

export const P16UneFois: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defilement = doux(f, [0, 15], [DEFILEMENT_DESCENTE, DEFILEMENT_VILLE]);
  const phrase = PHRASE + DEFILEMENT_VILLE;
  // Zoom sur la phrase, l'étiquette s'y pose (i 38 → 58) et reste lue ≈ 1 s ; recul (i 88 → 102)
  // pour l'addition, tenue de l'addition entière (i 132 → 174, 1,4 s), puis retour au cadrage de
  // P17 (zoom 1,2) une fois l'addition éteinte.
  const zoom = doux(f, [0, 15, 18, 45, 88, 102, 183, 193], [1.2, 1.2, 1.2, 1.5, 1.5, 1, 1, 1.2]);
  const foyerY = doux(f, [0, 18, 45, 88, 102], [470, 470, phrase, phrase, 470]);
  const decalage = doux(f, [88, 102, 183, 193], [0, 1, 1, 0]);
  const etiquette = lisse(f, fps, 38, 20);
  const p = versVideo(195, phrase);
  const termes = [
    { nom: 'Paris Est', n: 7 },
    { nom: 'Paris Nord', n: 11 },
    { nom: 'Paris Sud', n: 8 },
    { nom: CARTONS.etiquetteVille.charAt(0).toUpperCase() + CARTONS.etiquetteVille.slice(1), n: 2, ville: true },
  ];
  // L'addition s'éteint (i 174 → 182) avant que le téléphone ne revienne sur la droite (i 183).
  const addition = 1 - doux(f, [174, 182], [0, 1]);
  return (
    <AbsoluteFill>
      <Decale dx={-175 * decalage} reduction={1 - 0.14 * decalage}>
        <Plateau
          zoom={zoom}
          foyer={{ x: 195, y: foyerY }}
          dessus={
            // Étiquette (annotation vidéo) : le « Concert de louange », rattaché à la ville, se pose
            // juste sous la phrase, avec une pointe vers elle — dans l'espace libre au-dessus de la
            // barre d'onglets, sur aucune carte d'assemblée.
            <div
              style={{
                position: 'absolute',
                left: p.x - 250,
                top: p.y + 54,
                transform: `translateX(${(1 - etiquette) * 700}px)`,
                opacity: Math.min(1, etiquette * 1.5),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 40,
                  top: -9,
                  width: 20,
                  height: 20,
                  background: S.clay,
                  transform: 'rotate(45deg)',
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  borderRadius: 18,
                  background: S.clay,
                  color: S.white,
                  fontFamily: P.sans,
                  fontWeight: 600,
                  fontSize: 24,
                  boxShadow: '0 12px 28px rgba(184,106,74,0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                <IoMegaphoneOutline size={24} />
                {CARTONS.etiquetteConcert} · {CARTONS.etiquetteVille}
              </div>
            </div>
          }
        >
          <EcranStats
            niveau={STATS.paris}
            defilement={defilement}
            haloPropres={doux(f, [22, 32, 178, 188], [0, 1, 1, 0])}
          />
        </Plateau>
      </Decale>
      <Voile force={voilePour(zoom)} />
      <FilAnnote fil={STATS.paris.fil} maillon={1} opacite={1} />

      {/* Addition (annotation vidéo) : contrôle de cohérence du guide secrétariat, § 3. */}
      <div style={{ position: 'absolute', left: 690, top: 760, width: 360, opacity: addition }}>
        {termes.map((t, i) => {
          const q = lisse(f, fps, 98 + i * 6, 12);
          return (
            <div
              key={t.nom}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '14px 4px',
                borderBottom: `2px solid ${S.hair}`,
                opacity: q,
                transform: `translateX(${(1 - q) * 40}px)`,
              }}
            >
              <div style={{ fontFamily: P.sans, fontWeight: 600, fontSize: 34, color: t.ville ? S.clay : S.ink2 }}>
                {i > 0 ? '+ ' : ''}
                {t.nom}
              </div>
              <div style={{ fontFamily: P.serif, fontSize: 52, color: t.ville ? S.clay : S.ink }}>{t.n}</div>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: '18px 4px',
            opacity: lisse(f, fps, 122, 10),
          }}
        >
          <div style={{ fontFamily: P.sans, fontWeight: 700, fontSize: 38, color: S.ink }}>= Paris</div>
          <div style={{ fontFamily: P.serif, fontSize: 84, color: S.moss, lineHeight: 1 }}>28</div>
        </div>
      </div>
      <LegendeShephr lignes={LEGENDES.p16} duree={DUREE_P16 - 7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P17 — Par type, par mois

export const P17TypeMois: React.FC = () => {
  const f = useCurrentFrame();
  const etat = etatDescente(f, [
    { a: 0, niveau: STATS.paris },
    { a: 14, niveau: STATS.parisNord },
  ]);
  // « Par type » tenu i 42 → 76, défilement (i 82 → 102, même vitesse), « octobre 2026 · 4 » tenu
  // i 110 → 144 (≈ 1,1 s, ≈ 1,5 s avec le halo), puis sortie.
  const defilement = doux(f, [82, 102], [DEFILEMENT_VILLE, DEFILEMENT_MOIS]);
  const sortie = doux(f, [144, 158], [0, 1]);
  const zoom = 1.2 * (1 - sortie) + sortie;
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 470 }}
        decalageY={sortie * 1400}
        opacite={1 - doux(f, [148, 158], [0, 1])}
        dessus={<Appui x={195} y={CARTES[1] + DEFILEMENT_VILLE} a={6} />}
      >
        <EcranStats
          niveau={etat.niveau}
          estompe={etat.estompe}
          maillon={etat.maillon}
          haloMaillon={etat.haloMaillon}
          defilement={defilement}
          haloEnfant={{ index: 1, intensite: doux(f, [0, 4, 8, 12], [0, 1, 1, 0]) }}
          haloParType={doux(f, [36, 42, 76, 84], [0, 1, 1, 0])}
          haloOctobre={doux(f, [104, 110], [0, 1])}
        />
      </Plateau>
      <Voile force={1 - sortie} />
      <FilAnnote fil={etat.niveau.fil} maillon={etat.maillon} opacite={1 - sortie} />
      <LegendeShephr lignes={LEGENDES.p17} duree={DUREE_P17 - 7} />
    </AbsoluteFill>
  );
};
