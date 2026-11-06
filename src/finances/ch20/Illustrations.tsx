import React from 'react';
import { IlluFin, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

/** Progression linéaire 0 → 1 entre deux images. */
const lin = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
/** Valeur pseudo-aléatoire fixe, pour une animation déterministe. */
const hasard = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Titre : une pièce tombe dans la tirelire, le thermomètre monte d'un cran. */
const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const chute = lin(f, 18, 58) ** 2;
  const choc = lin(f, 58, 100);
  const ecrase = Math.sin(choc * Math.PI * 3) * (1 - choc) * 0.05;
  const cran = p(f, 66, 104);
  const halo = lin(f, 96, 140);
  const SOL = 820;
  const yCran = 170 + 520 - 520 * 0.25;
  return (
    <Scene>
      <line x1={40} x2={760} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <Thermometre x={590} y={170} h={520} l={72} niveau={0.125 + 0.125 * cran} />
      <circle cx={590} cy={yCran} r={46 + halo * 40} fill="none" stroke={F.or} strokeWidth={5} opacity={halo > 0 ? 1 - halo : 0} />
      {/* La pièce passe derrière le dos de la tirelire : elle entre par la fente. */}
      {chute < 1 ? <Piece x={270} y={-60 + chute * 660} r={44} /> : null}
      <g transform={`translate(270 ${SOL}) scale(${1 + ecrase} ${1 - ecrase}) translate(-270 ${-SOL})`}>
        {[130, 200, 340, 410].map((x, i) => (
          <rect key={x} x={x - 26} y={730} width={52} height={90} rx={12} fill={i % 3 === 0 ? F.argile : F.cuir} stroke={F.encre} strokeWidth={4} />
        ))}
        <path d="M458 600 C486 574 522 590 512 616 C504 636 476 626 484 604 C490 590 512 584 528 590" fill="none" stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
        <path d="M122 560 L104 492 L180 520 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={270} cy={630} rx={195} ry={135} fill={F.argile} stroke={F.encre} strokeWidth={5} />
        <path d="M150 560 Q220 516 310 522" fill="none" stroke={F.orClair} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
        <rect x={52} y={590} width={52} height={96} rx={20} fill={F.argile} stroke={F.encre} strokeWidth={5} />
        <rect x={212} y={490} width={116} height={13} rx={6.5} fill={F.encre} />
      </g>
    </Scene>
  );
};

/** Le pont : la pile soutient le tablier ; sans elle, il penche vers l'écriteau. */
const IlluPont: React.FC<PropsIllustration> = ({ f, d }) => {
  const HX = 190;
  const HY = 360;
  const L = 420;
  const N = 15;
  const EP = 31.4;
  const BAS = 850;
  const PX = 360;
  const COL = (x: number) => {
    const t = (x - 120) / 570;
    return (1 - t) ** 2 * 110 + 2 * t * (1 - t) * 340 + t ** 2 * 110;
  };
  // La pile monte une pièce après l'autre, les dernières relèvent le tablier.
  const pose = (i: number) => d[0] + 8 + i * 16;
  const retrait = (i: number) => d[1] + 20 + (N - 1 - i) * 11;
  const releve = p(f, pose(N - 3), pose(N - 1) + 12);
  const descente1 = p(f, d[1] + 20, d[1] + 180);
  const descente2 = p(f, d[2], d[2] + 55);
  const rebond = lin(f, d[2] + 55, d[2] + 130);
  const angle = 6 * (1 - releve) + 9 * descente1 + 16 * descente2 + Math.sin(rebond * Math.PI * 4) * (1 - rebond) * 1.6;
  const rad = (angle * Math.PI) / 180;
  const ouEst = (s: number) => [HX + s * Math.cos(rad), HY + s * Math.sin(rad)];
  // Le chariot se pose sur le tablier, entre le pylône et le milieu, y roule, puis dévale quand il penche.
  const pose_chariot = p(f, d[0] + 246, d[0] + 266);
  const glisse = p(f, d[2] + 28, d[2] + 88);
  const s = mix(40, 170, p(f, d[0] + 262, d[0] + 330)) + (340 - 170) * glisse ** 1.4;
  const tremble = Math.sin(f / 2.2) * 1.5 * lin(f, d[1] + 40, d[1] + 80) * (1 - lin(f, d[2] + 28, d[2] + 40));
  const [cx, cy] = ouEst(s);
  const ecriteau = p(f, d[2] + 8, d[2] + 40);
  const heurt = lin(f, d[2] + 88, d[2] + 135);
  const balance = Math.sin(heurt * Math.PI * 4) * (1 - heurt) * 5;
  const ACCROCHES = [60, 110, 160, 210, 260, 310, 360, 410];
  return (
    <Scene>
      {/* Les deux pylônes et le câble porteur. */}
      {[120, 690].map((x) => (
        <g key={x}>
          <rect x={x - 11} y={100} width={22} height={260} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <rect x={x - 26} y={90} width={52} height={18} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        </g>
      ))}
      <path d="M36 358 L120 110 Q405 340 690 110 L772 358" fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
      {/* Les suspentes cassent de droite à gauche quand le tablier part. */}
      {ACCROCHES.map((a, i) => {
        const x = HX + a;
        const y = COL(x);
        const [bx, by] = ouEst(a);
        const casse = i >= 3 ? lin(f, d[2] + (ACCROCHES.length - 1 - i) * 7, d[2] + (ACCROCHES.length - 1 - i) * 7 + 18) : 0;
        const longueur = 1 - casse * 0.72;
        return <line key={a} x1={x} y1={y} x2={mix(x, bx, longueur) + casse * Math.sin(f / 7 + i) * 7} y2={mix(y, by, longueur)} stroke={F.encre2} strokeWidth={3.5} />;
      })}
      {/* Le ravin : deux falaises, un fond, une corniche à droite. */}
      <path d="M190 850 H530 L530 880 H190 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <path d="M22 360 H190 L176 450 L198 560 L170 690 L192 850 L190 880 H22 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M610 360 H778 V880 H522 L532 790 L508 730 L520 680 H640 L622 520 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[[50, 470, 130], [40, 610, 110], [60, 760, 100], [660, 440, 90], [680, 590, 70], [600, 770, 150]].map(([x, y, l]) => (
        <line key={`${x}-${y}`} x1={x} x2={x + l} y1={y} y2={y} stroke={F.cuir} strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* La pile de pièces. */}
      {Array.from({ length: N }, (_, i) => {
        const arrivee = lin(f, pose(i), pose(i) + 16) ** 2;
        const depart = p(f, retrait(i), retrait(i) + 12);
        if (arrivee === 0 || depart === 1) return null;
        const yFinal = BAS - (i + 1) * EP;
        const y = mix(HY + 30, yFinal, arrivee);
        return (
          <g key={i} opacity={Math.min(1, arrivee * 4) * (1 - depart)} transform={`translate(${(i % 3) * 3 - 3} ${-depart * 14})`}>
            <rect x={PX - 75} y={y} width={150} height={EP} rx={7} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
            <rect x={PX - 69} y={y + 5} width={138} height={6} rx={3} fill={F.orClair} />
            {Array.from({ length: 11 }, (_, k) => (
              <line key={k} x1={PX - 60 + k * 12} x2={PX - 60 + k * 12} y1={y + 15} y2={y + EP - 5} stroke={F.orFonce} strokeWidth={2.5} />
            ))}
          </g>
        );
      })}
      <Libelle x={520} y={480} taille={28} graisse={600} couleur={F.orFonce} opacite={p(f, pose(N - 1), pose(N - 1) + 20) * (1 - p(f, d[1] + 10, d[1] + 40))}>
        {LIBELLES.epargne}
      </Libelle>
      {/* L'écriteau sort de la corniche. */}
      <g opacity={ecriteau} transform={`translate(0 ${(1 - ecriteau) * 30}) rotate(${balance} 580 680)`}>
        <rect x={572} y={590} width={16} height={92} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
        <rect x={500} y={586} width={160} height={58} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <Libelle x={580} y={625} taille={30} graisse={600} couleur={F.argile}>
          {LIBELLES.mendier}
        </Libelle>
      </g>
      {/* Le tablier, articulé sur la falaise de gauche. */}
      <g transform={`translate(${HX} ${HY}) rotate(${angle})`}>
        <rect x={0} y={0} width={L} height={18} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={30 + i * 30} x2={30 + i * 30} y1={2} y2={16} stroke={F.encre} strokeWidth={2} />
        ))}
      </g>
      <circle cx={HX} cy={HY + 9} r={11} fill={F.or} stroke={F.encre} strokeWidth={4} />
      {/* Le chariot du dirigeant, une couronne sur le toit. */}
      <g opacity={pose_chariot} transform={`translate(${cx + tremble} ${cy - (1 - pose_chariot) * 26}) rotate(${angle})`}>
        <path d="M-22 -92 L-26 -116 L-12 -104 L0 -120 L12 -104 L26 -116 L22 -92 Z" fill={F.or} stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" />
        <rect x={-62} y={-92} width={124} height={62} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <Libelle x={0} y={-53} taille={22} graisse={600}>
          {LIBELLES.dirigeant}
        </Libelle>
        {[-38, 38].map((x) => (
          <g key={x} transform={`translate(${x} -15) rotate(${s * 1.4})`}>
            <circle r={15} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <line x1={-9} x2={9} y1={0} y2={0} stroke={F.encre} strokeWidth={3} />
          </g>
        ))}
      </g>
    </Scene>
  );
};

/** Un flocon : six branches. */
const Flocon: React.FC<{ x: number; y: number; r: number; a: number; o: number }> = ({ x, y, r, a, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`} opacity={o}>
    {[0, 60, 120].map((b) => (
      <line key={b} x1={-r} x2={r} y1={0} y2={0} transform={`rotate(${b})`} stroke={F.papier} strokeWidth={Math.max(2.4, r * 0.28)} strokeLinecap="round" />
    ))}
  </g>
);

/** Le cadeau ouvert, la neige qui recouvre tout ; puis les trente pièces. */
const IlluDon: React.FC<PropsIllustration> = ({ f, d }) => {
  // Première phrase : le paquet tombe sur le sol, puis on le ferme d'un ruban et d'un nœud.
  const chute = lin(f, d[0] + 6, d[0] + 62) ** 2;
  const choc = lin(f, d[0] + 62, d[0] + 100);
  const ecrase = Math.sin(choc * Math.PI * 3) * (1 - choc) * 0.05;
  const ruban = p(f, d[0] + 74, d[0] + 125);
  const noeud = p(f, d[0] + 118, d[0] + 158);
  const etiquette = p(f, d[1] - 8, d[1] + 14);
  const ouvre = p(f, d[1], d[1] + 40);
  const couvre = p(f, d[1] + 60, d[2] + 90);
  const reduit = p(f, d[3], d[3] + 26);
  const echelle = mix(1, 0.56, reduit);
  const mots = 1 - p(f, d[3] - 8, d[3] + 10);
  const neigeMot = p(f, d[1] + 70, d[1] + 95) * mots;
  const naaman = p(f, d[2] - 6, d[2] + 12);
  const GROUND = 700;
  const COUCHE = GROUND - 38 * couvre;
  const flocons = Array.from({ length: 76 }, (_, i) => {
    const b = d[1] + 22 + i * 4.6;
    const u = (f - b) / 150;
    if (u <= 0 || u >= 1) return null;
    const cote = hasard(i, 1) * 2 - 1;
    const sommet = 120 + hasard(i, 2) * 180;
    const montee = lin(u, 0, 0.3);
    const x = 400 + cote * 300 * Math.min(1, u * 1.5) + Math.sin(u * 9 + i) * 16;
    const y = u < 0.3 ? mix(470, sommet, 1 - (1 - montee) ** 2) : mix(sommet, COUCHE + 8, (u - 0.3) / 0.7);
    return <Flocon key={i} x={x} y={y} r={7 + hasard(i, 3) * 8} a={u * 240 + i * 40} o={Math.min(1, u * 8) * (1 - lin(u, 0.92, 1))} />;
  });
  const pos = (i: number) => {
    const rang = Math.floor(i / 6);
    return {
      x: 112 + (i % 6) * 112 + (rang % 2) * 56 + (hasard(i, 4) - 0.5) * 34,
      y: 612 + rang * 54 + (hasard(i, 5) - 0.5) * 8,
    };
  };
  return (
    <Scene>
      <defs>
        <clipPath id="ch20-tableau">
          <rect x={40} y={20} width={720} height={800} rx={18} />
        </clipPath>
      </defs>
      <g transform={`translate(400 20) scale(${echelle}) translate(-400 -20)`}>
        <rect x={40} y={20} width={720} height={800} rx={18} fill={F.cuir} />
        <g clipPath="url(#ch20-tableau)">
          <rect x={40} y={GROUND} width={720} height={170} fill={F.cuirClair} />
          {/* La maison et l'arbre : ce qui entoure le don. */}
          <g>
            <rect x={92} y={560} width={140} height={140} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
            <rect x={142} y={620} width={42} height={80} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
            <path d="M70 562 L162 480 L254 562 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <rect x={92} y={560} width={140} height={140} fill={F.papier} opacity={couvre * 0.92} />
            <path d="M70 562 L162 480 L254 562 Z" fill={F.papier} opacity={couvre} />
            <path d="M70 562 L162 480 L254 562 M92 562 V700 H232 V562" fill="none" stroke={F.encre2} strokeWidth={3} opacity={couvre} />
          </g>
          <g>
            <rect x={622} y={570} width={36} height={130} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
            <path d={COURONNE} fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={COURONNE} fill={F.papier} stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" opacity={couvre} />
          </g>
          {flocons}
          {/* La couche de neige qui monte. */}
          <path
            d={`M40 ${COUCHE + 8} Q130 ${COUCHE - 14 * couvre} 220 ${COUCHE + 4} T400 ${COUCHE} T580 ${COUCHE + 6} T760 ${COUCHE} V880 H40 Z`}
            fill={F.papier}
            stroke={F.encre2}
            strokeWidth={2}
            opacity={couvre > 0 ? Math.min(1, couvre * 3) : 0}
          />
        </g>
        {/* Le paquet-cadeau : il tombe du haut du tableau, le ruban descend de haut en bas. */}
        <g clipPath="url(#ch20-tableau)">
        <g transform={`translate(0 ${-520 * (1 - chute)}) translate(400 702) scale(${1 + ecrase} ${1 - ecrase}) translate(-400 -702)`}>
          <rect x={280} y={470} width={240} height={232} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={5} />
          {ruban > 0.18 ? <rect x={382} y={470} width={36} height={232 * lin(ruban, 0.18, 1)} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
          <g transform={`rotate(${-34 * ouvre} 268 470) translate(${-14 * ouvre} ${-34 * ouvre})`}>
            <rect x={266} y={424} width={268} height={50} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={5} />
            {ruban > 0 ? <rect x={382} y={424} width={36} height={50 * lin(ruban, 0, 0.18)} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
            {noeud > 0 ? (
              <g transform={`translate(400 424) scale(${noeud}) translate(-400 -424)`}>
                <path d="M400 424 C340 370 330 420 400 424 C470 420 460 370 400 424 Z" fill={F.or} stroke={F.encre} strokeWidth={4} />
              </g>
            ) : null}
          </g>
          <g opacity={mots * etiquette}>
            <rect x={294} y={558} width={212} height={58} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <Libelle x={400} y={596} taille={30} graisse={600} opacite={1 - naaman}>
              {LIBELLES.dons}
            </Libelle>
            <Libelle x={400} y={595} taille={24} graisse={600} opacite={naaman}>
              {LIBELLES.donNaaman}
            </Libelle>
          </g>
        </g>
        </g>
        <g opacity={p(f, d[2], d[2] + 16) * mots}>
          <rect x={92} y={726} width={140} height={50} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <Libelle x={162} y={760} taille={26} graisse={600} couleur={F.papier}>
            {LIBELLES.guehazi}
          </Libelle>
        </g>
        <g opacity={neigeMot}>
          <rect x={235} y={46} width={330} height={62} rx={10} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <Libelle x={400} y={88} taille={34} graisse={600}>
            {LIBELLES.neige}
          </Libelle>
        </g>
      </g>
      {/* Le sol et les trente pièces. */}
      <g opacity={p(f, d[3] + 2, d[3] + 24)}>
        <path d="M30 582 H770 L776 874 H24 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <Libelle x={400} y={544} taille={30} graisse={600} couleur={F.orFonce}>
          {LIBELLES.trente}
        </Libelle>
      </g>
      {Array.from({ length: 30 }, (_, i) => {
        const pose30 = d[3] + 12 + i * 1.5;
        const a = lin(f, pose30, pose30 + 10);
        if (a === 0) return null;
        const xLigne = 157 + (i % 10) * 54;
        const yLigne = 640 + Math.floor(i / 10) * 54;
        const depart = d[3] + 74 + hasard(i, 6) * 12;
        const t = p(f, depart, depart + 42);
        const q = pos(i);
        return <Piece key={i} x={mix(xLigne, q.x, t)} y={mix(yLigne, q.y, t) - Math.sin(t * Math.PI) * 46 - (1 - a) * 26} r={22} opacite={a} />;
      })}
    </Scene>
  );
};

const COURONNE = 'M640 412 C680 412 708 442 708 480 C738 484 744 530 722 556 C704 580 668 580 640 568 C612 580 576 580 558 556 C536 530 542 484 572 480 C572 442 600 412 640 412 Z';
const JARRE = 'M340 195 L340 245 C270 275 240 335 245 405 C250 525 310 645 335 730 L465 730 C490 645 550 525 555 405 C560 335 530 275 460 245 L460 195 Z';

/** La jarre se remplit sous la pluie ; la saison sèche arrive, la coupe y puise encore. */
const IlluJarre: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 730;
  const plein = p(f, d[0] + 20, d[1] - 30);
  // La montée suit la phrase : « suffisamment » vers la fin, « abondance » tout à la fin.
  const remplissage = plein < 0.72 ? (plein / 0.72) * 0.55 : 0.55 + ((plein - 0.72) / 0.28) * 0.45;
  // La coupe : un arc par-dessus la jarre, on l'incline, la vasque entre la première,
  // elle se redresse sous la surface et ressort pleine, puis le même arc la ramène au sol.
  const aller = p(f, d[1] + 70, d[1] + 102);
  const incline = p(f, d[1] + 94, d[1] + 110);
  const descend = p(f, d[1] + 106, d[1] + 124);
  const redresse = p(f, d[1] + 124, d[1] + 140);
  const remonte = p(f, d[1] + 140, d[1] + 156);
  const retour = p(f, d[1] + 164, d[1] + 192);
  const puise = lin(f, d[1] + 122, d[1] + 142);
  const NIVEAU = mix(735, 212, remplissage) + puise * 9;
  const pluie = 1 - p(f, d[1] - 6, d[1] + 22);
  const soleil = p(f, d[1] + 8, d[1] + 62);
  const sec = p(f, d[1] + 22, d[1] + 75);
  const fente = p(f, d[1] + 30, d[1] + 92);
  const mot1 = p(f, d[0] + 325, d[0] + 350) * (1 - p(f, d[1] - 8, d[1] + 10));
  const mot2 = p(f, d[0] + 420, d[0] + 445) * (1 - p(f, d[1] - 8, d[1] + 10));
  const motSec = p(f, d[1] + 4, d[1] + 30);
  const remous = Math.sin(f / 2.4) * 4 * lin(f, d[1] + 112, d[1] + 120) * (1 - lin(f, d[1] + 150, d[1] + 170));
  const vague = Math.sin(f / 6) * 3 * pluie + remous;
  // L'arc reste à l'extérieur de la jarre : à droite de l'anse et de la panse, au-dessus du goulot.
  const arc = (t: number) => {
    const u = 1 - t;
    return [
      u ** 3 * 650 + 3 * u * u * t * 700 + 3 * u * t * t * 600 + t ** 3 * 400,
      u ** 3 * 684 + 3 * u * u * t * 300 + 3 * u * t * t * 30 + t ** 3 * 96,
    ];
  };
  const [ax, ay] = arc(retour > 0 ? 1 - retour : aller);
  const cx = ax;
  const cy = ay + (262 - 96) * descend * (1 - remonte);
  const angleCoupe = -135 * incline * (1 - redresse) + 10 * Math.sin(retour * Math.PI);
  const coupePleine = lin(f, d[1] + 132, d[1] + 140);
  // Ce qui s'égoutte de la coupe pleine, au-dessus du goulot, retombe dans la jarre.
  const gouttes = [
    { x: 388, a: d[1] + 150 },
    { x: 410, a: d[1] + 156 },
    { x: 398, a: d[1] + 162 },
  ];
  const SOLEIL_X = 665;
  const soleilY = mix(800, 190, soleil);
  return (
    <Scene>
      <defs>
        <clipPath id="ch20-jarre">
          <path d={JARRE} />
        </clipPath>
      </defs>
      {/* Le soleil se lève derrière la terre. */}
      {soleil > 0 ? (
        <g transform={`translate(${SOLEIL_X} ${soleilY})`}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i * 30 + f * 0.4) * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * 66} y1={Math.sin(a) * 66} x2={Math.cos(a) * 88} y2={Math.sin(a) * 88} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
          })}
          <circle r={54} fill={F.orClair} stroke={F.or} strokeWidth={5} />
        </g>
      ) : null}
      {/* La pluie. */}
      {pluie > 0
        ? Array.from({ length: 54 }, (_, i) => {
            const x = 100 + (i / 53) * 490 + (hasard(i, 7) - 0.5) * 8;
            const u = ((f * 1 + hasard(i, 8) * 46) % 46) / 46;
            const y = 130 + u * (SOL - 130);
            const naissance = lin(f, 4 + hasard(i, 9) * 24, 8 + hasard(i, 9) * 24);
            return <path key={i} d={`M${x} ${y} q-7 16 0 20 q7 -4 0 -20 Z`} fill={F.or} stroke={F.orFonce} strokeWidth={1.5} opacity={pluie * naissance} />;
          })
        : null}
      {/* La terre : mouillée, puis sèche et fendue. */}
      <path d="M26 730 H774 L780 880 H20 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M26 730 H774 L780 880 H20 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" opacity={sec} />
      {[
        'M90 738 L118 772 L96 806 L132 868',
        'M118 772 L168 790 L196 762',
        'M250 748 L232 790 L268 824 L246 872',
        'M268 824 L330 838',
        'M470 760 L510 790 L490 830 L528 872',
        'M510 790 L572 776 L600 742',
        'M640 778 L690 806 L676 872',
        'M690 806 L748 790',
      ].map((c) => (
        <path key={c} d={c} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fente} />
      ))}
      {/* Les pousses : elles grandissent sous la pluie, puis se flétrissent. */}
      {[[130, 86], [200, 62]].map(([x, h], i) => {
        const pousse = p(f, d[0] + 60 + i * 40, d[0] + 240 + i * 40);
        const fane = p(f, d[1] + 30, d[1] + 85);
        const haut = h * pousse * (1 - fane * 0.35);
        const pli = fane * 44;
        const couleur = fane > 0.5 ? F.encre2 : F.orFonce;
        return (
          <g key={x}>
            <path d={`M${x} 732 Q${x} ${732 - haut * 0.7} ${x + pli} ${732 - haut + pli * 0.5}`} fill="none" stroke={couleur} strokeWidth={5} strokeLinecap="round" />
            <path d={`M${x + pli} ${732 - haut + pli * 0.5} q${-28 * pousse} ${-16 * pousse} ${-34 * pousse} ${10 * pousse} q${22 * pousse} ${6 * pousse} ${34 * pousse} ${-10 * pousse} Z`} fill={fane > 0.5 ? F.filet : F.or} stroke={couleur} strokeWidth={2.5} />
            <path d={`M${x + pli} ${732 - haut + pli * 0.5} q${28 * pousse} ${-16 * pousse} ${34 * pousse} ${10 * pousse} q${-22 * pousse} ${6 * pousse} ${-34 * pousse} ${-10 * pousse} Z`} fill={fane > 0.5 ? F.filet : F.or} stroke={couleur} strokeWidth={2.5} />
          </g>
        );
      })}
      {/* La jarre, en coupe : on voit le niveau. */}
      <path d="M340 240 C300 200 262 226 272 300" fill="none" stroke={F.encre} strokeWidth={20} strokeLinecap="round" />
      <path d="M340 240 C300 200 262 226 272 300" fill="none" stroke={F.argile} strokeWidth={12} strokeLinecap="round" />
      <path d="M460 240 C500 200 538 226 528 300" fill="none" stroke={F.encre} strokeWidth={20} strokeLinecap="round" />
      <path d="M460 240 C500 200 538 226 528 300" fill="none" stroke={F.argile} strokeWidth={12} strokeLinecap="round" />
      <path d={JARRE} fill={F.papier} />
      <g clipPath="url(#ch20-jarre)">
        <path d={`M230 ${NIVEAU} Q315 ${NIVEAU - vague * 2} 400 ${NIVEAU} Q485 ${NIVEAU + vague * 2} 570 ${NIVEAU} V740 H230 Z`} fill={F.orClair} stroke={F.or} strokeWidth={4} />
      </g>
      {/* La coupe. */}
      <g transform={`translate(${cx} ${cy}) rotate(${angleCoupe}) scale(0.8)`}>
        <path d="M-40 -28 H40 Q36 16 6 20 V44 H20 V54 H-20 V44 H-6 V20 Q-36 16 -40 -28 Z" fill={F.or} stroke={F.orFonce} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-34 -22 H34 Q32 -8 24 2 H-24 Q-32 -8 -34 -22 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={2} opacity={coupePleine} />
      </g>
      {/* Le liquide repasse devant la coupe : ce qui est sous la surface se voit immergé. */}
      <g clipPath="url(#ch20-jarre)" opacity={0.5}>
        <rect x={230} y={NIVEAU} width={340} height={Math.max(0, 740 - NIVEAU)} fill={F.orClair} />
      </g>
      {gouttes.map((g) => {
        const t = lin(f, g.a, g.a + 12);
        if (t === 0 || t === 1) return null;
        return <path key={g.a} d={`M${g.x} ${mix(140, 190, t * t)} q-6 12 0 15 q6 -3 0 -15 Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={1.5} />;
      })}
      <path d={JARRE} fill="none" stroke={F.encre} strokeWidth={20} strokeLinejoin="round" />
      <path d={JARRE} fill="none" stroke={F.argile} strokeWidth={13} strokeLinejoin="round" />
      <rect x={322} y={172} width={156} height={30} rx={10} fill={F.argile} stroke={F.encre} strokeWidth={4} />
      <rect x={322} y={716} width={156} height={22} rx={8} fill={F.argile} stroke={F.encre} strokeWidth={4} />
      {/* Les repères du niveau. */}
      <g opacity={mot1}>
        <line x1={546} x2={604} y1={470} y2={470} stroke={F.encre} strokeWidth={3} strokeDasharray="7 6" />
        <Libelle x={612} y={479} taille={25} ancre="start" graisse={500}>
          {LIBELLES.suffisamment}
        </Libelle>
      </g>
      <g opacity={mot2}>
        <line x1={482} x2={604} y1={162} y2={162} stroke={F.encre} strokeWidth={3} strokeDasharray="7 6" />
        <Libelle x={612} y={172} taille={30} ancre="start" graisse={600} couleur={F.orFonce}>
          {LIBELLES.abondance}
        </Libelle>
      </g>
      {/* Le nuage. */}
      {pluie > 0 ? (
        <g opacity={pluie} transform={`translate(0 ${(1 - pluie) * -22})`}>
          <path d="M92 132 C50 132 50 74 100 74 C110 26 196 18 220 60 C256 16 340 22 356 66 C396 36 470 48 478 80 C540 66 590 96 578 132 Z" fill={F.encre2} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ) : null}
      <Libelle x={190} y={120} taille={36} graisse={600} couleur={F.argile} opacite={motSec}>
        {LIBELLES.saisons}
      </Libelle>
    </Scene>
  );
};

/** Le tableau : « mille » tombe dans le grand zéro et s'y efface. */
const IlluZero: React.FC<PropsIllustration> = ({ f, d }) => {
  const CX = 400;
  const CY = 462;
  const trace = p(f, d[0] - 22, d[0] + 34);
  const motAbs = p(f, d[0] + 34, d[0] + 58) * (1 - p(f, d[1] - 14, d[1] + 2));
  const COINS = [
    { x: 130, y: 300, a: d[0] + 56 },
    { x: 670, y: 340, a: d[0] + 96 },
    { x: 140, y: 640, a: d[0] + 136 },
  ];
  const chute = d[1] + 92;
  const choc = lin(f, chute + 44, chute + 74);
  const gonfle = 1 + Math.sin(choc * Math.PI) * 0.08;
  const reste = 1 - 0.68 * p(f, chute + 56, chute + 78);
  const motFont = p(f, chute + 66, chute + 92);
  const tombe = lin(f, chute, chute + 56);
  const t = tombe ** 1.7;
  const xm = mix(205, CX, t);
  const ym = mix(149, CY, t) - Math.sin(t * Math.PI) * 26;
  const mille = p(f, d[1] + 8, d[1] + 28);
  const Mot: React.FC<{ x: number; a: number; opacite?: number; children: React.ReactNode }> = ({ x, a, opacite = 1, children }) => {
    const o = p(f, a, a + 20);
    return (
      <g opacity={o * opacite} transform={`translate(0 ${(1 - o) * 10})`}>
        <Libelle x={x} y={170} taille={62} graisse={500} couleur={F.papier}>
          {children}
        </Libelle>
      </g>
    );
  };
  return (
    <Scene>
      <line x1={120} y1={790} x2={92} y2={882} stroke={F.cuir} strokeWidth={16} strokeLinecap="round" />
      <line x1={680} y1={790} x2={708} y2={882} stroke={F.cuir} strokeWidth={16} strokeLinecap="round" />
      <rect x={32} y={36} width={736} height={756} rx={12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={56} y={60} width={688} height={708} rx={4} fill={F.encre} />
      <rect x={200} y={786} width={400} height={18} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={260} y={774} width={82} height={13} rx={6} fill={F.papier} stroke={F.encre2} strokeWidth={2} />
      <rect x={470} y={764} width={78} height={23} rx={5} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      {/* Les ondes qui rentrent dans le zéro. */}
      {trace === 1
        ? [0, 1, 2, 3].map((k) => {
            const u = ((f + k * 22) % 88) / 88;
            const e = 1 - u;
            return <ellipse key={k} cx={CX} cy={CY} rx={128 * e} ry={172 * e} fill="none" stroke={F.orClair} strokeWidth={3} strokeDasharray="10 12" opacity={0.55 * Math.min(1, u * 3) * Math.min(1, e * 4)} />;
          })
        : null}
      <ellipse
        cx={CX}
        cy={CY}
        rx={150 * gonfle}
        ry={196 * gonfle}
        fill="none"
        stroke={F.orClair}
        strokeWidth={36}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - trace}
      />
      {/* Ce qu'on approche du zéro y disparaît. */}
      {COINS.map((c) => {
        const u = lin(f, c.a, c.a + 50);
        if (u === 0 || u === 1) return null;
        const e = u ** 1.6;
        const ang = e * 2.2;
        const rx = c.x - CX;
        const ry = c.y - CY;
        const x = CX + (rx * Math.cos(ang) - ry * Math.sin(ang) * 0.6) * (1 - e);
        const y = CY + (ry * Math.cos(ang) + rx * Math.sin(ang) * 0.8) * (1 - e);
        return <Piece key={c.x} x={x} y={y} r={Math.max(4, 34 * (1 - e * 0.9))} opacite={Math.min(1, u * 8) * (1 - lin(u, 0.82, 1))} />;
      })}
      <Libelle x={400} y={166} taille={46} graisse={500} couleur={F.papier} opacite={motAbs}>
        {LIBELLES.absorbant}
      </Libelle>
      {/* L'opération. */}
      <Mot x={395} a={d[1] + 34} opacite={reste}>
        {LIBELLES.fois}
      </Mot>
      <Mot x={590} a={d[1] + 58} opacite={reste}>
        {LIBELLES.zero}
      </Mot>
      {tombe < 1 ? (
        <g opacity={mille * (1 - lin(tombe, 0.72, 1))} transform={`translate(${xm} ${ym}) rotate(${t * 220}) scale(${1 - t * 0.78}) translate(${-xm} ${-ym})`}>
          <Libelle x={xm} y={ym + 21} taille={62} graisse={500} couleur={F.papier}>
            {LIBELLES.mille}
          </Libelle>
        </g>
      ) : null}
      <Libelle x={400} y={736} taille={44} graisse={600} couleur={F.orClair} opacite={motFont}>
        {LIBELLES.fontZero}
      </Libelle>
    </Scene>
  );
};

/** Une enveloppe : l'intérieur reçoit la pièce entre le fond et la poche. */
const Enveloppe: React.FC<{ x: number; y: number; ferme: number; sceau: number; brise?: number; children?: React.ReactNode }> = ({ x, y, ferme, sceau, brise = 0, children }) => {
  const W = 280;
  const H = 190;
  const g = x - W / 2;
  const dr = x + W / 2;
  const creux = y + 106;
  const pointe = y + ferme * 112;
  const rabat = <path d={`M${g} ${y} L${x} ${pointe} L${dr} ${y} Z`} fill={ferme > 0 ? F.papier : F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />;
  return (
    <g>
      <rect x={g} y={y} width={W} height={H} rx={8} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {ferme <= 0 ? rabat : null}
      {children}
      <path d={`M${g} ${y} L${x} ${creux} L${dr} ${y} V${y + H - 8} Q${dr} ${y + H} ${dr - 8} ${y + H} H${g + 8} Q${g} ${y + H} ${g} ${y + H - 8} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${g} ${y + H - 4} L${x - 26} ${creux - 12} M${dr} ${y + H - 4} L${x + 26} ${creux - 12}`} stroke={F.filet} strokeWidth={3} />
      {ferme > 0 ? rabat : null}
      {sceau > 0 && brise < 1 ? (
        <g transform={`translate(${x} ${y + 112})`} opacity={1 - brise}>
          {brise === 0 ? (
            <g transform={`scale(${(2 - sceau) * sceau})`}>
              <circle r={26} fill={F.argile} stroke={F.encre} strokeWidth={3} />
              <circle r={16} fill="none" stroke={F.orClair} strokeWidth={2.5} />
            </g>
          ) : (
            <>
          <g transform={`translate(${-brise * 18} ${brise * 12}) scale(${(2 - sceau) * sceau})`}>
            <path d="M0 -25 A25 25 0 0 0 0 25 L5 8 L-4 -6 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          </g>
          <g transform={`translate(${brise * 18} ${brise * 12}) scale(${(2 - sceau) * sceau})`}>
            <path d="M0 -25 A25 25 0 0 1 0 25 L5 8 L-4 -6 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          </g>
            </>
          )}
        </g>
      ) : null}
    </g>
  );
};

/** Le porte-monnaie, l'enveloppe rouverte, l'enveloppe qui reste fermée. */
const IlluEnveloppes: React.FC<PropsIllustration> = ({ f, d }) => {
  const YE = 400;
  const AX = 210;
  const BX = 590;
  // Trajet : sort du porte-monnaie, passe en l'air, descend dans l'enveloppe.
  const trajet = (a: number, x: number) => {
    const sort = p(f, a, a + 22);
    const vol = p(f, a + 22, a + 52);
    const entre = p(f, a + 52, a + 68);
    const yAir = mix(200, 58, sort);
    const qx = mix(400, x, vol);
    const qy = mix(yAir, 330, vol) - Math.sin(vol * Math.PI) * 24;
    return { x: qx, y: entre > 0 ? mix(330, YE + 118, entre) : qy, sort, vol, entre };
  };
  const A0 = d[0] - 14;
  const B0 = d[0] + 62;
  const a = trajet(A0, AX);
  const b = trajet(B0, BX);
  const fermeA = p(f, A0 + 66, A0 + 86);
  const fermeB = p(f, B0 + 66, B0 + 86);
  const sceauA = lin(f, A0 + 84, A0 + 96);
  const sceauB = lin(f, B0 + 84, B0 + 96);
  // L'enveloppe A est rouverte, sa pièce ressort et retourne au porte-monnaie.
  const R = d[1] + 62;
  const brise = lin(f, R, R + 14);
  const rouvre = p(f, R + 8, R + 32);
  const sortA = p(f, R + 30, R + 50);
  const retour = p(f, R + 50, R + 92);
  const rentre = p(f, R + 92, R + 108);
  const ecrit = lin(f, R + 96, R + 150);
  const pourA = -2 * rouvre;
  const fermeAv = mix(-1, 1, fermeA) + pourA;
  const ouvreBourse = Math.max(p(f, A0 - 8, A0 + 6) * (1 - p(f, A0 + 30, A0 + 44)), p(f, B0 - 8, B0 + 6) * (1 - p(f, B0 + 30, B0 + 44)), p(f, R + 78, R + 92) * (1 - p(f, R + 108, R + 122)));
  const douleurA = p(f, A0 - 8, A0 + 14) * (1 - p(f, A0 + 40, A0 + 52));
  const douleurB = p(f, B0 - 8, B0 + 14) * (1 - p(f, B0 + 40, B0 + 52));
  const douleur = Math.max(douleurA, douleurB);
  const pince = 1 - douleur * 0.05 * (1 + Math.sin(f / 2.4) * 0.5);
  const motDouleur = p(f, A0 + 4, A0 + 24) * (1 - p(f, d[1] + 30, d[1] + 52));
  // Dernière phrase : la douleur de demain est épargnée.
  const motAuj = p(f, d[2] + 6, d[2] + 28);
  const motDem = p(f, d[2] + 56, d[2] + 78);
  const barre = p(f, d[2] + 96, d[2] + 126);
  const lumiere = p(f, d[2] + 96, d[2] + 146);
  const motSag = p(f, d[2] + 160, d[2] + 184);
  const retireA = 1 - 0.5 * p(f, d[2], d[2] + 24);
  const xRetour = mix(AX, 400, retour);
  const yRetour = rentre > 0 ? mix(58, 200, rentre) : mix(mix(YE + 118, 330, sortA), 58, retour) - Math.sin(retour * Math.PI) * 18;
  const coinARetourSurFond = sortA < 0.55;
  const coinADansBourse = rentre > 0.25;
  const coinAvisible = f < R + 30 ? a.sort > 0 && a.entre < 1 : false;
  const ZIG = 'M0 0 L14 -14 L26 4 L40 -16 L52 6';
  return (
    <Scene>
      <defs>
        <clipPath id="ch20-ecrit">
          <rect x={80} y={640} width={260 * ecrit} height={50} />
        </clipPath>
      </defs>
      <g transform="translate(0 40)">
      {/* Le porte-monnaie. */}
      <g transform={`translate(400 300) scale(${2 - pince} ${pince}) translate(-400 -300)`}>
        <ellipse cx={400} cy={146} rx={112} ry={4 + 26 * ouvreBourse} fill={F.encre} />
        {a.sort > 0 && a.vol === 0 ? <Piece x={a.x} y={a.y} r={36} /> : null}
        {b.sort > 0 && b.vol === 0 ? <Piece x={b.x} y={b.y} r={36} /> : null}
        {coinADansBourse && rentre < 1 ? <Piece x={xRetour} y={yRetour} r={36} /> : null}
        <path d="M284 146 C248 214 262 312 400 318 C538 312 552 214 516 146 Q400 170 284 146 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M296 172 C272 226 288 296 400 302 C512 296 528 226 504 172" fill="none" stroke={F.orClair} strokeWidth={3} strokeDasharray="12 9" />
        <path d={`M284 146 Q400 ${170 + ouvreBourse * 8} 516 146`} fill="none" stroke={F.or} strokeWidth={11} strokeLinecap="round" />
        <path d={`M284 146 Q400 ${122 - ouvreBourse * 26} 516 146`} fill="none" stroke={F.or} strokeWidth={11} strokeLinecap="round" />
        <circle cx={400 - 12 - ouvreBourse * 30} cy={126 - ouvreBourse * 22} r={13} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
        <circle cx={400 + 12 + ouvreBourse * 30} cy={126 - ouvreBourse * 22} r={13} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
      </g>
      {/* La douleur : des éclats autour du porte-monnaie. */}
      <g stroke={F.argile} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g opacity={douleurB}>
          <path d={ZIG} transform="translate(180 200) rotate(-20)" />
          <path d={ZIG} transform="translate(166 270) rotate(10)" />
        </g>
        <g opacity={douleurA}>
          <path d={ZIG} transform="translate(558 262) rotate(-14)" />
          <path d={ZIG} transform="translate(640 272) rotate(8)" />
        </g>
      </g>
      <Libelle x={668} y={216} taille={28} graisse={600} couleur={F.argile} opacite={motDouleur}>
        {LIBELLES.douloureuse}
      </Libelle>
      {/* La lumière de l'enveloppe gardée. */}
      <g opacity={lumiere}>
        {Array.from({ length: 11 }, (_, i) => {
          const ang = (-180 + i * 18) * (Math.PI / 180);
          const r0 = 165 + Math.sin(f / 9 + i) * 3;
          return <line key={i} x1={BX + Math.cos(ang) * r0} y1={YE + 95 + Math.sin(ang) * r0 * 0.72} x2={BX + Math.cos(ang) * (r0 + 28)} y2={YE + 95 + Math.sin(ang) * (r0 + 28) * 0.72} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      {/* Les deux enveloppes. */}
      <g opacity={retireA}>
        <Enveloppe x={AX} y={YE} ferme={fermeAv} sceau={sceauA} brise={brise}>
          {coinAvisible && a.entre > 0 ? <Piece x={a.x} y={a.y} r={36} /> : null}
          {f >= R + 30 && coinARetourSurFond ? <Piece x={AX} y={yRetour} r={36} /> : null}
        </Enveloppe>
      </g>
      <Enveloppe x={BX} y={YE} ferme={mix(-1, 1, fermeB)} sceau={sceauB}>
        {b.entre > 0 && fermeB < 1 ? <Piece x={b.x} y={b.y} r={36} /> : null}
      </Enveloppe>
      {/* Les pièces en vol, par-dessus le reste. */}
      {a.vol > 0 && a.entre === 0 ? <Piece x={a.x} y={a.y} r={36} /> : null}
      {b.vol > 0 && b.entre === 0 ? <Piece x={b.x} y={b.y} r={36} /> : null}
      {f >= R + 30 && !coinARetourSurFond && !coinADansBourse ? <Piece x={xRetour} y={yRetour} r={36} /> : null}
      {/* « dépense reportée » s'inscrit sous l'enveloppe rouverte. */}
      <g clipPath="url(#ch20-ecrit)">
        <Libelle x={AX} y={672} taille={29} graisse={600} couleur={F.argile}>
          {LIBELLES.reportee}
        </Libelle>
      </g>
      {/* La douleur d'aujourd'hui sauve de celle de demain. */}
      <Libelle x={BX} y={672} taille={27} graisse={600} opacite={motAuj}>
        {LIBELLES.aujourdhui}
      </Libelle>
      <g opacity={motDem * (1 - 0.25 * barre)}>
        <Libelle x={BX} y={752} taille={27} graisse={600}>
          {LIBELLES.demain}
        </Libelle>
        <line x1={BX - 128} x2={BX - 128 + 256 * barre} y1={743} y2={743} stroke={F.argile} strokeWidth={4} strokeLinecap="round" opacity={barre > 0 ? 1 : 0} />
      </g>
      <Libelle x={BX} y={842} taille={38} graisse={600} couleur={F.orFonce} opacite={motSag}>
        {LIBELLES.sagesse}
      </Libelle>
      </g>
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluPont,
  p3: IlluDon,
  p4: IlluJarre,
  p5: IlluZero,
  p6: IlluEnveloppes,
  fin: IlluFin,
};
