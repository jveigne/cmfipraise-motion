import React from 'react';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const COEUR = 'M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z';

/** Surface ondulée d'un liquide, fermée vers le bas (y `bas`). */
const surface = (x0: number, x1: number, y: number, bas: number, amp: number, phase: number) => {
  const pts = Array.from({ length: 25 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 24;
    return `${x.toFixed(1)} ${(y + Math.sin(i * 0.75 + phase) * amp).toFixed(1)}`;
  });
  return `M${pts.join(' L')} L${x1} ${bas} L${x0} ${bas} Z`;
};

/** Un cœur dont le niveau doré monte (0 → 1 : du bas au bord). */
const CoeurNiveau: React.FC<{ id: string; x: number; y: number; s: number; niveau: number; f: number }> = ({ id, x, y, s, niveau, f }) => {
  const haut = y - 50 * s;
  const bas = y + 42 * s;
  const yN = bas - (bas - haut) * niveau;
  const amp = 5 * (1 - p(niveau, 0.92, 1));
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path transform={`translate(${x} ${y}) scale(${s})`} d={COEUR} />
        </clipPath>
      </defs>
      <path transform={`translate(${x} ${y}) scale(${s})`} d={COEUR} fill={F.papier} />
      <g clipPath={`url(#${id})`}>
        <path d={surface(x - 60 * s, x + 60 * s, yN, bas + 4, amp, f / 7)} fill={F.or} />
        <path d={surface(x - 60 * s, x + 60 * s, yN, yN + 14, amp, f / 7)} fill={F.orClair} />
      </g>
      <path transform={`translate(${x} ${y}) scale(${s})`} d={COEUR} fill="none" stroke={F.encre} strokeWidth={5 / s} />
    </g>
  );
};

/** Ouverture : le niveau doré du cœur monte jusqu'au bord, à côté du thermomètre. */
const IlluOuvertureCoeur: React.FC<PropsIllustration> = ({ f }) => {
  const monte = p(f, 25, 190);
  const X = 300;
  const Y = 480;
  const S = 4.6;
  const yN = Y + 42 * S - 92 * S * monte;
  const filet = p(f, 12, 30) * (1 - p(f, 182, 198));
  return (
    <Scene>
      {filet > 0 ? <line x1={X} x2={X} y1={40} y2={yN} stroke={F.or} strokeWidth={10 * filet} strokeLinecap="round" /> : null}
      <CoeurNiveau id="ch04-ouv" x={X} y={Y} s={S} niveau={monte} f={f} />
      <Thermometre x={690} y={180} h={520} l={50} niveau={monte} />
    </Scene>
  );
};

/** Le haut du cœur (moitié droite, du creux au flanc), en unités du cœur : y du contour pour un x donné. */
const HAUT_COEUR = (() => {
  const courbe = (a: number[], b: number[], c: number[], e: number[], t: number) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * e[k]);
  };
  const pts: number[][] = [];
  for (let i = 0; i <= 40; i++) pts.push(courbe([0, -30], [0, -40], [10, -51], [24, -50], i / 40));
  for (let i = 1; i <= 40; i++) pts.push(courbe([24, -50], [37.5, -49.1], [46.95, -38.5], [47.4, -23.4], i / 40));
  return pts;
})();
const yHautCoeur = (x: number) => {
  const a = Math.abs(x);
  const i = HAUT_COEUR.findIndex((pt) => pt[0] >= a);
  if (i <= 0) return i === 0 ? HAUT_COEUR[0][1] : HAUT_COEUR[HAUT_COEUR.length - 1][1];
  const [x0, y0] = HAUT_COEUR[i - 1];
  const [x1, y1] = HAUT_COEUR[i];
  return x1 === x0 ? y1 : y0 + ((y1 - y0) * (a - x0)) / (x1 - x0);
};

/** Fin : thermomètre plein ; le cœur, posé sur le sol, déborde : l'or passe ses lobes, coule lentement sur lui et goutte de ses flancs. */
const IlluFinCoeur: React.FC<PropsIllustration> = ({ f }) => {
  const SOL = 790;
  const S = 5;
  const X = 300;
  const Y = SOL - 42 * S;
  const FLANC = 48.2;
  const plein = 0.84 + 0.16 * p(f, 0, 40);
  const nappe = p(f, 36, 92);
  const flaque = p(f, 120, 225);
  // Les coulures : (x, demi-largeur, longueur), toutes différentes, en unités du cœur.
  const COULURES = [
    [-38, 2.5, 19],
    [-25, 3.7, 45],
    [-11, 2.1, 17],
    [7, 3.1, 33],
    [21, 2.3, 15],
    [34, 3.4, 29],
  ];
  const long = COULURES.map(([, , l], i) => l * p(f, 72 + i * 13, 170 + i * 13));
  const ondule = (y: number, x: number) => {
    const s = Math.min(1, Math.max(0, (y - yHautCoeur(x) - 6) / 14));
    return Math.sin(y * 0.2 + x) * 0.8 * s * s * (3 - 2 * s);
  };
  // Le dessous de la nappe : épaisseur irrégulière, plus les coulures qui s'y accrochent.
  const dessous: string[] = [];
  for (let x = -47.4; x <= 47.4; x += 0.4) {
    const pince = Math.min(1, (47.4 - Math.abs(x)) / 5);
    const y = yHautCoeur(x) + (4.5 + 2.5 * Math.sin(x * 0.33 + 1)) * nappe * pince + COULURES.reduce((s, [cx, w], i) => s + long[i] * Math.exp(-(Math.abs((x - cx) / w) ** 2.5)), 0);
    dessous.push(`${(x + ondule(y, x)).toFixed(2)} ${y.toFixed(2)}`);
  }
  // Le dessus suit le contour du cœur, à peine au-dehors : l'or a passé le bord.
  const dessus = HAUT_COEUR.map(([x, y]) => `${x.toFixed(2)} ${(y - 1.2 * nappe).toFixed(2)}`);
  const nappeD = `M${[...[...dessus].reverse().map((t) => `-${t}`.replace('--', '')), ...dessus].join(' L')} L${[...dessous].reverse().join(' L')} Z`;
  const perles = COULURES.map(([cx, w], i) => {
    const y = yHautCoeur(cx) + (4.5 + 2.5 * Math.sin(cx * 0.33 + 1)) + long[i];
    return { x: cx + ondule(y, cx), y, r: w * 0.5 * Math.min(1, (long[i] / COULURES[i][2]) * 3) };
  });
  const coulee = (fond: string, trait: number) => (
    <g fill={fond} stroke={fond} strokeWidth={trait} strokeLinejoin="round">
      <path d={nappeD} />
      {perles.map((e) => (e.r > 0 ? <circle key={e.x} cx={e.x} cy={e.y} r={e.r} /> : null))}
      {[-1, 1].map((sens) => (
        <circle key={sens} cx={sens * 47.6} cy={-21.5} r={1.3 * nappe} />
      ))}
    </g>
  );
  return (
    <Scene>
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {[-1, 1].map((sens) => (
        <ellipse key={sens} cx={X + sens * FLANC * S} cy={SOL} rx={56 * flaque} ry={10 * flaque} fill={F.orClair} stroke={F.or} strokeWidth={flaque > 0 ? 3 : 0} />
      ))}
      {/* Les gouttes qui quittent les flancs du cœur. */}
      {[-1, 1].flatMap((sens) =>
        [0, 1, 2, 3].map((i) => {
          const periode = 64;
          const t = f - 100 - i * periode - (sens > 0 ? 26 : 0);
          if (t <= 0) return null;
          const u = (t % (periode * 4)) / 44;
          if (u >= 1) return null;
          const y = Y - 19 * S + (SOL - (Y - 19 * S)) * u * u;
          return <path key={`${sens}-${i}`} transform={`translate(${X + sens * FLANC * S} ${y}) scale(${Math.min(1, u * 6)})`} d="M0 -19 C5 -9 12 -2 12 6 C12 13 7 18 0 18 C-7 18 -12 13 -12 6 C-12 -2 -5 -9 0 -19 Z" fill={F.orClair} stroke={F.or} strokeWidth={2.5} />;
        }),
      )}
      <CoeurNiveau id="ch04-fin" x={X} y={Y} s={S} niveau={plein} f={f} />
      {nappe > 0 ? (
        <g transform={`translate(${X} ${Y}) scale(${S})`}>
          {coulee(F.orFonce, 1)}
          {coulee(F.orClair, 0)}
        </g>
      ) : null}
      <Thermometre x={690} y={180} h={520} l={50} niveau={1} />
    </Scene>
  );
};

/** Le corps de la bourse : ventre posé au sol, épaules resserrées vers le col. */
const corpsBourse = (w: number, haut: number, bas: number, cou: number) => {
  const h = bas - haut;
  const m = haut + h * 0.56;
  return `M${400 - cou} ${haut} C${400 - cou - 6} ${haut + h * 0.18} ${400 - w} ${haut + h * 0.2} ${400 - w} ${m} C${400 - w} ${bas - h * 0.1} ${400 - w + 36} ${bas} ${400 - w * 0.45} ${bas} L${400 + w * 0.45} ${bas} C${400 + w - 36} ${bas} ${400 + w} ${bas - h * 0.1} ${400 + w} ${m} C${400 + w} ${haut + h * 0.2} ${400 + cou + 6} ${haut + h * 0.18} ${400 + cou} ${haut} Z`;
};

/** Plan 2 : la bourse plate et usée se gonfle à mesure que la joie monte, s'ouvre et se répand. */
const IlluBourse: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 750;
  const [d0, d1] = d;
  // Repères de lecture dans la première phrase (2,5 images par caractère).
  const joie = d0 + 150;
  const pauvre = d0 + 202;
  const produit = d0 + 267;
  const gonfle = p(f, joie, joie + 115);
  const ouvre = p(f, produit, produit + 45);
  const tremble = 1 - p(f, joie - 15, joie + 5);
  const angle = (Math.sin(f / 6) * 1.6 + Math.sin(f / 2.7) * 0.8) * tremble;
  // Vide, elle est aplatie et large ; pleine, elle prend du volume en se resserrant.
  const H = 110 + 240 * gonfle;
  const haut = SOL - H;
  const W = 235 - 57 * gonfle;
  const cou = 30 + 10 * gonfle + 26 * ouvre;
  const rimY = haut - 30 - 28 * gonfle;
  const rx = cou + 10 + 30 * ouvre;
  const ry = 5 + 17 * ouvre;
  const milieu = (haut + SOL) / 2 + 10;
  const corps = corpsBourse(W, haut, SOL, cou);
  // L'or reste dans une poche intérieure : le cuir garde son épaisseur tout autour.
  const POCHE_H = haut + 22 + H * 0.16;
  const POCHE_B = SOL - 28;
  const poche = corpsBourse(W - 40, POCHE_H, POCHE_B, (W - 40) * 0.6);
  const yNiveau = POCHE_B - (POCHE_B - POCHE_H) * gonfle;
  const etat = p(f, d1 + 165, d1 + 195);
  const battement = 1 + Math.sin(f / 10) * 0.03;
  // Les pièces qui sortent : une à une, en deux tas.
  const RANGS = [4, 3, 2, 1];
  const places: { x: number; y: number }[] = [];
  RANGS.forEach((n, rang) => {
    for (let j = 0; j < n; j++) {
      for (const cx of [118, 682]) places.push({ x: cx + (j - (n - 1) / 2) * 48, y: SOL - 24 - rang * 38 });
    }
  });
  const pieces = places.map((pl, i) => {
    const t = (f - (produit + 40 + i * 9)) / 36;
    if (t <= 0) return null;
    const u = Math.min(1, t);
    const x = 400 + (pl.x - 400) * u;
    const y = rimY + 12 + (pl.y - rimY - 12) * u * u * 0.4 + (pl.y - rimY - 12) * u * 0.6 - 190 * 4 * u * (1 - u) * 0.75;
    return <Piece key={i} x={x} y={y} r={24} />;
  });
  return (
    <Scene>
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <defs>
        <clipPath id="ch04-bourse">
          <path d={corps} />
        </clipPath>
      </defs>
      {/* Lueur au-dessus de la bourse ouverte. */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((-90 + (i - 4) * 18) * Math.PI) / 180;
        const r0 = 44 + rx * 0.5;
        const r1 = r0 + (46 + Math.sin(f / 12 + i) * 10) * ouvre;
        return <line key={i} x1={400 + Math.cos(a) * r0} y1={rimY + Math.sin(a) * r0 * 0.6} x2={400 + Math.cos(a) * r1} y2={rimY + Math.sin(a) * r1 * 0.75} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={ouvre * 0.8} />;
      })}
      <g transform={`rotate(${angle} 400 ${SOL})`}>
        {/* Fond de l'ouverture, derrière les pièces. */}
        <ellipse cx={400} cy={rimY} rx={rx} ry={ry} fill={ouvre > 0.25 ? F.orClair : F.cuir} stroke={F.encre} strokeWidth={4} />
      </g>
      {pieces}
      <g transform={`rotate(${angle} 400 ${SOL})`}>
        <path d={corps} fill={F.cuir} />
        <g clipPath="url(#ch04-bourse)">
          {/* Plis de la bourse vide, et son accroc recousu. */}
          <g opacity={1 - gonfle} stroke={F.encre} strokeWidth={3} fill="none" strokeLinecap="round">
            {[-0.82, -0.56, -0.22, 0.14, 0.44, 0.74].map((k, i) => (
              <path key={k} d={`M${400 + k * W} ${haut + 34 + (i % 2) * 8 + Math.abs(k) * 18} q${i % 2 ? 12 : -10} ${16} ${i % 2 ? -4 : 6} ${30 + (i % 3) * 8}`} />
            ))}
            <path d={`M${400 + W * 0.3} ${SOL - 30} q24 -12 52 -4`} strokeWidth={5} />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={400 + W * 0.3 + 10 + i * 15} x2={400 + W * 0.3 + 15 + i * 15} y1={SOL - 44} y2={SOL - 22} stroke={F.papier} strokeWidth={2.5} />
            ))}
          </g>
          {/* La poche où monte la joie. */}
          {gonfle > 0 ? (
            <g>
              <clipPath id="ch04-poche">
                <path d={poche} />
              </clipPath>
              <path d={poche} fill={F.papier} opacity={Math.min(1, gonfle * 6)} />
              <g clipPath="url(#ch04-poche)">
                <path d={surface(400 - W, 400 + W, yNiveau, SOL + 4, 5 * gonfle, f / 8)} fill={F.or} />
                <path d={surface(400 - W, 400 + W, yNiveau, yNiveau + 16, 5 * gonfle, f / 8)} fill={F.orClair} />
              </g>
              <path d={poche} fill="none" stroke={F.encre} strokeWidth={3} opacity={Math.min(1, gonfle * 6)} />
            </g>
          ) : null}
          {/* Les fronces sous le cordon : c'est une bourse, pas un pot. */}
          <g stroke={F.encre} strokeWidth={3} strokeLinecap="round" opacity={0.7}>
            {[-0.9, -0.45, 0.45, 0.9].map((k) => (
              <line key={k} x1={400 + k * cou} y1={haut + 5} x2={400 + k * (cou + W * 0.12)} y2={haut + 10 + H * 0.1} />
            ))}
          </g>
          {/* L'usure : deux pièces de cuir recousues, au bord, qui suivent la forme. */}
          <g transform={`rotate(-7 ${400 - W * 0.79} ${SOL - 34 - H * 0.06})`}>
            <rect x={400 - W * 0.79 - 32} y={SOL - 34 - H * 0.06 - 24} width={64} height={48} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
            <rect x={400 - W * 0.79 - 26} y={SOL - 34 - H * 0.06 - 18} width={52} height={36} fill="none" stroke={F.papier} strokeWidth={2.5} strokeDasharray="7 6" />
          </g>
          <g transform={`rotate(9 ${400 + W * 0.83} ${SOL - 22 - H * 0.2})`}>
            <rect x={400 + W * 0.83 - 25} y={SOL - 22 - H * 0.2 - 20} width={50} height={40} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
            <rect x={400 + W * 0.83 - 20} y={SOL - 22 - H * 0.2 - 15} width={40} height={30} fill="none" stroke={F.papier} strokeWidth={2.5} strokeDasharray="6 5" />
          </g>
        </g>
        <path d={corps} fill="none" stroke={F.encre} strokeWidth={5} />
        {/* Le col. */}
        <path d={`M${400 - cou} ${haut} L${400 - rx} ${rimY} A${rx} ${ry} 0 0 0 ${400 + rx} ${rimY} L${400 + cou} ${haut} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {[-0.5, 0, 0.5].map((k) => (
          <line key={k} x1={400 + k * cou} y1={haut - 4} x2={400 + k * rx} y2={rimY + ry + 2} stroke={F.encre} strokeWidth={2.5} opacity={0.6} />
        ))}
        {/* Le cordon se relâche sans se défaire. */}
        <g>
          <line x1={400 - cou - 6} x2={400 + cou + 6} y1={haut} y2={haut} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
          <path d={`M400 ${haut} q-22 ${18 + gonfle * 14 + ouvre * 20} -36 ${34 + gonfle * 26 + ouvre * 34} M400 ${haut} q22 ${18 + gonfle * 14 + ouvre * 20} 36 ${34 + gonfle * 26 + ouvre * 34}`} fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
          <circle cx={400} cy={haut} r={9} fill={F.encre} />
        </g>
        {/* L'étiquette cousue, puis le cœur à sa place. */}
        <g opacity={p(f, joie, joie + 22) * (1 - etat)}>
          <rect x={268} y={milieu - 30} width={264} height={60} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={3} />
          <Libelle x={400} y={milieu + 10} taille={29} graisse={600}>{LIBELLES.joieDebordante}</Libelle>
        </g>
        {etat > 0 ? <Coeur x={400} y={milieu + 4} s={2.1 * etat * battement} /> : null}
      </g>
      <Libelle x={400} y={812} taille={30} opacite={p(f, pauvre, pauvre + 18) * (1 - p(f, produit + 30, produit + 48))}>{LIBELLES.pauvrete}</Libelle>
      <Libelle x={400} y={812} taille={30} graisse={600} couleur={F.orFonce} opacite={p(f, produit + 60, produit + 80) * (1 - p(f, d1 - 14, d1))}>{LIBELLES.liberalites}</Libelle>
      {/* « ni à cause des quantités, ni à cause du revenu » : chaque mot est barré à sa lecture. */}
      {[
        { x: 118, m: LIBELLES.quantites, l: 66, t: d1 + 82 },
        { x: 682, m: LIBELLES.revenu, l: 48, t: d1 + 134 },
      ].map((e) => {
        const barre = p(f, e.t, e.t + 24);
        return (
          <g key={e.x} opacity={p(f, d1, d1 + 18) * (1 - p(f, d1 + 165, d1 + 180))}>
            <Libelle x={e.x} y={812} taille={28}>{e.m}</Libelle>
            <line x1={e.x - e.l} x2={e.x - e.l + 2 * e.l * barre} y1={802} y2={802} stroke={F.argile} strokeWidth={5} strokeLinecap="round" opacity={barre > 0 ? 1 : 0} />
          </g>
        );
      })}
      <Libelle x={400} y={812} taille={31} graisse={600} couleur={F.orFonce} opacite={etat}>{LIBELLES.etat}</Libelle>
    </Scene>
  );
};

const Voiture: React.FC<{ x: number; y: number; roue: number; opacite: number }> = ({ x, y, roue, opacite }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <path d="M-108 26 L-108 -2 Q-104 -16 -74 -20 L-48 -52 Q-40 -60 -26 -60 H34 Q48 -60 56 -50 L80 -21 Q104 -17 108 0 L108 26 Q108 30 104 30 H-104 Q-108 30 -108 26 Z" fill={F.encre} />
    <path d="M-60 -20 L-40 -46 Q-36 -50 -28 -50 H-6 V-20 Z M6 -20 V-50 H34 Q42 -50 46 -44 L65 -20 Z" fill={F.papier} />
    {[-62, 62].map((rx) => (
      <g key={rx} transform={`translate(${rx} 30) rotate(${roue})`}>
        <circle r={22} fill={F.encre} stroke={F.parchemin} strokeWidth={3} />
        <circle r={10} fill={F.filet} />
        <line x1={-10} x2={10} y1={0} y2={0} stroke={F.encre} strokeWidth={3} />
      </g>
    ))}
  </g>
);

const Cle: React.FC<{ x: number; y: number; angle: number; opacite: number }> = ({ x, y, angle, opacite }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacite}>
    <circle cx={0} cy={-26} r={15} fill="none" stroke={F.orFonce} strokeWidth={7} />
    <path d="M0 -11 V34 M0 18 H14 M0 30 H14" fill="none" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** Plan 3 : tout traverse le cœur ouvert en pointillés, et il reste vide jusqu'au tombeau. */
const IlluCoeurVide: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const X = 400;
  const Y = 520;
  const S = 4.6;
  const trace = p(f, 4, 30);
  const avance = p(f, d1 + 100, d1 + 132) - p(f, d1 + 150, d1 + 182);
  const tombe = p(f, d1 + 196, d1 + 245);
  const OUVERT = 'M-24 23.5 C-60.55 -11.9 -49.5 -48.3 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C49.5 -48.3 60.55 -11.9 24 23.5';
  const objets = [
    { t: d0 + 8, sorte: 'piece', dx: -24, ys: 30, duree: 66 },
    { t: d0 + 32, sorte: 'cle', dx: 22, ys: 30, duree: 66 },
    { t: d0 + 56, sorte: 'piece', dx: 4, ys: 30, duree: 66 },
    { t: d1 + 96, sorte: 'piece', dx: -28, ys: 205, duree: 56 },
    { t: d1 + 112, sorte: 'cle', dx: 16, ys: 205, duree: 56 },
    { t: d1 + 128, sorte: 'piece', dx: 30, ys: 205, duree: 56 },
    { t: d1 + 144, sorte: 'piece', dx: -6, ys: 205, duree: 56 },
  ];
  return (
    <Scene>
      {/* Le cœur s'assombrit quand il devient tombeau. */}
      <path transform={`translate(${X} ${Y}) scale(${S})`} d={`${OUVERT} Z`} fill={F.encre} opacity={0.14 * tombe} />
      {objets.map((o, i) => {
        const u = (f - o.t) / o.duree;
        if (u <= 0 || u >= 1) return null;
        const y = o.ys + (800 - o.ys) * u * u;
        const op = Math.min(1, u * 8) * Math.min(1, (1 - u) * 6);
        return o.sorte === 'piece' ? <Piece key={i} x={X + o.dx} y={y} r={24} opacite={op} /> : <Cle key={i} x={X + o.dx} y={y} angle={f * 2.2 + i * 40} opacite={op} />;
      })}
      <path
        transform={`translate(${X} ${Y}) scale(${S})`}
        d={OUVERT}
        fill="none"
        stroke={F.encre}
        strokeWidth={6 / S}
        strokeLinecap="round"
        strokeDasharray={`${15 / S} ${17 / S}`}
        strokeDashoffset={-f * 0.05}
        opacity={trace}
      />
      {/* La stèle monte à l'intérieur. */}
      {tombe > 0 ? (
        <g>
          <defs>
            <clipPath id="ch04-tombe">
              <rect x={200} y={300} width={400} height={332} />
            </clipPath>
          </defs>
          <g clipPath="url(#ch04-tombe)">
            <g transform={`translate(0 ${(1 - tombe) * 240})`}>
              <path d="M290 632 V480 Q290 395 400 395 Q510 395 510 480 V632 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} />
              <path d="M322 470 Q322 417 400 417 Q478 417 478 470" fill="none" stroke={F.encre2} strokeWidth={3} strokeLinecap="round" />
              <line x1={330} x2={470} y1={572} y2={572} stroke={F.encre2} strokeWidth={3} strokeLinecap="round" />
              <Libelle x={400} y={528} taille={31} graisse={600}>{LIBELLES.tombeau}</Libelle>
            </g>
          </g>
          <line x1={270} x2={530} y1={632} y2={632} stroke={F.encre} strokeWidth={6} strokeLinecap="round" opacity={tombe} />
        </g>
      ) : null}
      <Libelle x={400} y={40} taille={28} opacite={p(f, d1 + 20, d1 + 45)}>{LIBELLES.voitures}</Libelle>
      {[150, 400, 650].map((x, i) => {
        const a = p(f, d1 + i * 26, d1 + 28 + i * 26);
        const dx = (1 - a) * -70 + (i === 1 ? avance * 18 : 0);
        return <Voiture key={x} x={x + dx} y={120} roue={(dx * 180) / 70} opacite={a} />;
      })}
      <Libelle x={400} y={868} taille={30} graisse={600} opacite={p(f, d0, d0 + 20)}>{LIBELLES.coeurVide}</Libelle>
    </Scene>
  );
};

/** Un filet d'eau : tracé libre, large au bord et qui s'affine en tombant, sans contour. */
const filetEau = (cx: (y: number) => number, y0: number, y1: number, l0: number, l1: number, retrait = 0) => {
  const gauche: string[] = [];
  const droite: string[] = [];
  const total = Math.max(1, y1 - y0);
  for (let y = y0; ; y = Math.min(y1, y + 10)) {
    const t = (y - y0) / 730;
    const demi = Math.max(0.5, l1 + (l0 - l1) * (1 - Math.min(1, t * 1.2)) ** 1.6 + 5 * Math.exp(-(y - y0) / 13) + Math.sin(y / 37) * 0.8 - retrait);
    gauche.push(`${(cx(y) - demi).toFixed(1)} ${y.toFixed(1)}`);
    droite.unshift(`${(cx(y) + demi).toFixed(1)} ${y.toFixed(1)}`);
    if (y >= y1 || total <= 0) break;
  }
  return `M${gauche.join(' L')} L${droite.join(' L')} Z`;
};

/** Plan 4 : le gobelet se remplit à ras bord, une goutte, et tout coule sur lui en quatre filets. */
const IlluVerre: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const RIM = 190;
  const BASE = 740;
  const plein = p(f, d0, d0 + 118);
  const impact = d0 + 165;
  const gonfle = p(f, d0 + 45, d0 + 112);
  const chute = Math.min(1, Math.max(0, (f - (d0 + 118)) / 47));
  const yGoutte = 36 + (RIM - 36) * chute * chute;
  const deborde = p(f, impact, impact + 25);
  const rond = p(f, impact, impact + 34);
  const yN = RIM + 56 * (1 - plein);
  const dome = 5 * plein + 7 * deborde;
  const coeur = p(f, d1, d1 + 26);
  const bat = 1 + Math.sin(f / 10) * 0.03;
  const GOBELET = `M225 ${RIM} L283 726 Q285 ${BASE} 300 ${BASE} H500 Q515 ${BASE} 517 726 L575 ${RIM} Z`;
  const INTERIEUR = `M232 ${RIM} L287 708 Q289 718 300 718 H500 Q511 718 513 708 L568 ${RIM} Z`;
  const paroiG = (y: number) => 225 + (58 * (y - RIM)) / (BASE - RIM);
  const paroiD = (y: number) => 575 - (58 * (y - RIM)) / (BASE - RIM);
  // Chaque filet suit le verre : deux sur les parois, deux sur sa face, de part et d'autre du cœur.
  const FILETS = [
    { cx: (y: number) => paroiG(y) - 1 + Math.sin(y / 47) * 2.5, py: 380, t: d1 + 87, s: impact + 14 },
    { cx: (y: number) => 318 + (y - RIM) * 0.03 + Math.sin(y / 61 + 1) * 7, py: 505, t: d1 + 107, s: impact + 2 },
    { cx: (y: number) => 490 - (y - RIM) * 0.1 + Math.sin(y / 53) * 6, py: 640, t: d1 + 128, s: impact + 8 },
    { cx: (y: number) => paroiD(y) + 1 + Math.sin(y / 43 + 2) * 2.5, py: 440, t: d1 + 242, s: impact + 20 },
  ];
  const flaque = p(f, impact + 50, d1 + 80);
  return (
    <Scene>
      <line x1={0} x2={800} y1={BASE + 2} y2={BASE + 2} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={400} cy={BASE + 6} rx={345 * flaque} ry={22 * flaque} fill={F.orClair} stroke={F.or} strokeWidth={flaque > 0 ? 3 : 0} />
      <defs>
        <clipPath id="ch04-bol">
          <path d={INTERIEUR} />
        </clipPath>
      </defs>
      <path d={GOBELET} fill={F.papier} />
      <g clipPath="url(#ch04-bol)">
        <path d={surface(225, 575, yN, BASE, 2.5 * (1 - plein) + 1, f / 6)} fill={F.orClair} opacity={0.5} />
      </g>
      {coeur > 0 ? <Coeur x={400} y={295} s={1.2 * coeur * bat} /> : null}
      <path d={GOBELET} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M262 240 L302 650" fill="none" stroke={F.papier} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <ellipse cx={400} cy={RIM} rx={175} ry={10} fill={plein > 0.98 ? F.orClair : F.papier} stroke={F.encre} strokeWidth={4} />
      {/* Le dôme d'eau au-dessus du bord. */}
      {plein > 0.98 ? <path d={`M226 ${RIM} Q400 ${RIM - dome * 3.2} 574 ${RIM} Z`} fill={F.orClair} stroke={F.or} strokeWidth={2.5} /> : null}
      {/* Les ronds de l'impact. */}
      {rond > 0 && rond < 1
        ? [0, 0.35].map((k) => {
            const r = Math.max(0, rond - k) / (1 - k);
            return <ellipse key={k} cx={400} cy={RIM - dome * 1.5} rx={20 + r * 100} ry={3 + r * 7} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={1 - r} />;
          })
        : null}
      {/* La goutte. */}
      {f < d0 + 165 + 1 && gonfle > 0 ? (
        <path
          transform={`translate(400 ${yGoutte}) scale(${gonfle})`}
          d="M0 -44 C10 -22 30 -6 30 16 C30 34 16 46 0 46 C-16 46 -30 34 -30 16 C-30 -6 -10 -22 0 -44 Z"
          fill={F.orClair}
          stroke={F.orFonce}
          strokeWidth={4 / Math.max(0.3, gonfle)}
        />
      ) : null}
      {/* Les quatre filets : l'eau descend, s'affine, et chacun reçoit son mot quand la phrase le nomme. */}
      {FILETS.map((c, i) => {
        const g = p(f, c.s, c.s + 70);
        const mot = p(f, c.t, c.t + 14);
        const y0 = RIM + 3;
        const yF = y0 + (BASE + 6 - y0) * g;
        const demiPill = LIBELLES.filets[i].length * 6.8 + 16;
        return (
          <g key={c.py}>
            {g > 0 ? (
              <g>
                <path d={filetEau(c.cx, y0, yF, 10, 3)} fill={F.or} />
                <path d={filetEau(c.cx, y0, yF, 10, 3, 2)} fill={F.orClair} />
                {g < 1 ? <circle cx={c.cx(yF)} cy={yF} r={6} fill={F.orClair} stroke={F.or} strokeWidth={2} /> : null}
                {/* Le courant : de petits reflets qui descendent. */}
                {g >= 1
                  ? [0, 1, 2].map((k) => {
                      const y = y0 + 20 + ((f * 3.2 + k * 170 + i * 53) % (BASE - y0 - 30));
                      return <ellipse key={k} cx={c.cx(y)} cy={y} rx={1.8} ry={11} fill={F.papier} opacity={0.9} />;
                    })
                  : null}
              </g>
            ) : null}
            <g opacity={mot} transform={`translate(${c.cx(c.py)} ${c.py}) scale(${0.85 + 0.15 * mot})`}>
              <rect x={-demiPill} y={-25} width={2 * demiPill} height={50} rx={25} fill={F.papier} stroke={F.encre} strokeWidth={3} />
              <Libelle x={0} y={10} taille={28} graisse={600}>{LIBELLES.filets[i]}</Libelle>
            </g>
          </g>
        );
      })}
      <Libelle x={455} y={78} taille={31} ancre="start" graisse={600} couleur={F.orFonce} opacite={p(f, d0 + 118, d0 + 136) * (1 - p(f, d1 - 12, d1))}>{LIBELLES.goutte}</Libelle>
      <Libelle x={400} y={100} taille={32} graisse={600} couleur={F.orFonce} opacite={p(f, d1 + 40, d1 + 62)}>{LIBELLES.coule}</Libelle>
    </Scene>
  );
};

const Vase: React.FC = () => (
  <g>
    <path d="M-46 0 L46 0 Q42 -20 30 -28 C92 -70 102 -170 40 -235 C25 -252 22 -268 25 -284 Q42 -300 46 -316 L-46 -316 Q-42 -300 -25 -284 C-22 -268 -25 -252 -40 -235 C-102 -170 -92 -70 -30 -28 Q-42 -20 -46 0 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={0} cy={-316} rx={46} ry={11} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
    {/* Les veines de l'albâtre. */}
    <g fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round">
      <path d="M-62 -175 C-30 -160 -35 -125 -5 -112 C18 -100 30 -80 22 -55" />
      <path d="M55 -190 C30 -180 25 -150 44 -130" />
      <path d="M-55 -100 C-40 -88 -35 -70 -22 -60" />
    </g>
    <path d="M-40 -235 Q0 -222 40 -235" fill="none" stroke={F.or} strokeWidth={5} />
    <path d="M-30 -28 Q0 -18 30 -28" fill="none" stroke={F.or} strokeWidth={5} />
  </g>
);

/** Plan 5 : le placard verrouillé se déverrouille, le vase en sort et le parfum se déploie. */
const IlluPlacard: React.FC<PropsIllustration> = ({ f, d }) => {
  const d0 = d[0];
  const pardon = [d0 + 130, d0 + 165, d0 + 195];
  const aime = d0 + 207;
  const larmes = d0 + 255;
  const sort = d0 + 315;
  const lumiere = p(f, d0 + 20, d0 + 95);
  const entrouvre = p(f, aime, aime + 45);
  const grand = p(f, larmes + 15, sort);
  const theta = ((14 * entrouvre + 66 * grand) * Math.PI) / 180;
  const avance = p(f, sort, sort + 50);
  const coule = p(f, sort + 52, sort + 88);
  const deploie = p(f, sort + 76, sort + 150);
  const X = 200;
  const W = 400;
  const H0 = 90;
  const H1 = 640;
  const baseY = 430 + (782 - 430) * avance;
  const echelle = 0.54 + 0.46 * avance;
  const VERROUS = [170, 300, 510];
  return (
    <Scene>
      {/* Le sol. */}
      <line x1={0} x2={800} y1={H1} y2={H1} stroke={F.encre} strokeWidth={4} />
      {/* La lumière d'en haut. */}
      <g opacity={lumiere * 0.85}>
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <line key={i} x1={400 + i * 34} y1={0} x2={400 + i * 58} y2={70} stroke={F.or} strokeWidth={6} strokeLinecap="round" />
        ))}
      </g>
      {/* Le meuble et son fond. */}
      <rect x={X - 18} y={H0 - 18} width={W + 36} height={H1 - H0 + 18} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={X} y={H0} width={W} height={H1 - H0 - 18} fill={F.orFonce} />
      <rect x={X} y={H0} width={W} height={H1 - H0 - 18} fill={F.orClair} opacity={0.35 * Math.max(entrouvre, grand)} />
      {[205, 430].map((y) => (
        <rect key={y} x={X} y={y} width={W} height={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      ))}
      {/* La lueur qui sort par l'entrebâillement. */}
      <rect x={X + W - 6 - 40 * entrouvre} y={H0} width={6 + 40 * entrouvre} height={H1 - H0 - 18} fill={F.orClair} opacity={entrouvre * (1 - grand)} />
      {/* Le vase, s'il est encore dans le placard : il passe derrière la porte. */}
      {avance === 0 ? (
        <g transform={`translate(400 ${baseY}) scale(${echelle})`} opacity={grand}>
          <Vase />
        </g>
      ) : null}
      {/* La porte tourne sur ses gonds, à gauche : son bord libre vient vers nous. */}
      {(() => {
        const CY = (H0 + H1 - 18) / 2;
        const px = (x: number) => X + (x - X) * Math.cos(theta);
        const py = (x: number, y: number) => CY + (y - CY) * (1 + ((x - X) / W) * Math.sin(theta) * 0.14);
        const quad = (x: number, y: number, l: number, h: number) =>
          `M${px(x)} ${py(x, y)} L${px(x + l)} ${py(x + l, y)} L${px(x + l)} ${py(x + l, y + h)} L${px(x)} ${py(x, y + h)} Z`;
        return (
          <g strokeLinejoin="round">
            <path d={quad(X, H0, W, H1 - H0 - 18)} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
            <path d={quad(X + 40, H0 + 40, W - 80, 200)} fill="none" stroke={F.encre} strokeWidth={4} />
            <path d={quad(X + 40, H0 + 280, W - 80, 190)} fill="none" stroke={F.encre} strokeWidth={4} />
            <circle cx={px(X + W - 24)} cy={py(X + W - 24, 395)} r={12 * Math.max(0.45, Math.cos(theta))} fill={F.or} stroke={F.encre} strokeWidth={3} />
            {/* Trois verrous : tirés un à un. */}
            {VERROUS.map((y, i) => {
              const tire = p(f, pardon[i], pardon[i] + 22);
              return (
                <g key={y}>
                  <path d={quad(X + W - 150 + 70 * (1 - tire), y - 9, 100, 18)} fill={F.or} stroke={F.encre} strokeWidth={3} />
                  <path d={quad(X + W - 148, y - 20, 84, 40)} fill="none" stroke={F.encre} strokeWidth={4} />
                </g>
              );
            })}
          </g>
        );
      })()}
      {/* Les gâches, sur le montant. */}
      {VERROUS.map((y) => (
        <rect key={y} x={X + W + 1} y={y - 13} width={16} height={26} fill={F.encre2} stroke={F.encre} strokeWidth={2} />
      ))}
      {/* Le parfum s'étale au sol, derrière le vase. */}
      {deploie > 0 ? <ellipse cx={400} cy={786} rx={60 + 300 * deploie} ry={10 + 18 * deploie} fill={F.orClair} stroke={F.or} strokeWidth={3} /> : null}
      {/* Le vase, qui s'avance au centre. */}
      {avance > 0 ? (
        <g transform={`translate(400 ${baseY}) scale(${echelle})`}>
          <Vase />
        </g>
      ) : null}
      {/* Le filet déborde du col et descend le long du vase. */}
      {coule > 0 ? (
        <g fill="none" stroke={F.or} strokeLinecap="round">
          <path d="M376 472 C372 500 378 520 358 552 C324 606 338 690 374 776" pathLength={1} strokeDasharray={`${coule} 2`} strokeWidth={11} />
          <path d="M426 472 C430 492 424 508 438 530" pathLength={1} strokeDasharray={`${coule} 2`} strokeWidth={8} />
        </g>
      ) : null}
      {/* Puis les volutes se déploient de chaque côté du placard. */}
      {deploie > 0
        ? [
            'M120 776 C70 720 150 670 112 610 C84 565 150 520 112 470 C95 445 110 415 128 408',
            'M60 780 C30 730 80 700 58 650 C46 625 58 600 74 592',
            'M680 776 C730 720 650 670 688 610 C716 565 650 520 688 470 C705 445 690 415 672 408',
            'M740 780 C770 730 720 700 742 650 C754 625 742 600 726 592',
          ].map((c, i) => <path key={i} d={c} pathLength={1} strokeDasharray={`${deploie} 2`} fill="none" stroke={F.or} strokeWidth={6} strokeLinecap="round" />)
        : null}
      <Libelle x={400} y={866} taille={31} graisse={600} couleur={F.orFonce} opacite={p(f, sort + 20, sort + 44)}>{LIBELLES.vase}</Libelle>
    </Scene>
  );
};

/** Plan 6 : le guichet qui fait payer la peur est barré, et un cœur s'ouvre seul. */
const IlluGuichet: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const peur = p(f, d0 + 12, d0 + 34);
  const cupidite = p(f, d0 + 150, d0 + 172);
  const af1 = p(f, d0 + 245, d0 + 262);
  const af2 = p(f, d0 + 302, d0 + 319);
  const trait = p(f, d1 + 4, d1 + 32);
  const efface = p(f, d1 + 62, d1 + 118);
  const apparait = p(f, d1 + 108, d1 + 138);
  const ouvre = p(f, d1 + 138, d1 + 215);
  const SX = 400;
  const SY = 420;
  const S = 4.4;
  const bat = 1 + Math.sin(f / 11) * 0.015;
  const VOLET = 0.5;
  const GOND = -24;
  const theta = (ouvre * 105 * Math.PI) / 180;
  const Affiche: React.FC<{ x: number; rot: number; l: readonly [string, string]; o: number }> = ({ x, rot, l, o }) => (
    <g opacity={o} transform={`translate(${x} 305) rotate(${rot}) scale(${1.3 - 0.3 * o})`}>
      <rect x={-92} y={-74} width={184} height={148} fill={F.papier} stroke={F.encre} strokeWidth={3} />
      <rect x={-22} y={-85} width={44} height={20} fill={F.orClair} stroke={F.encre2} strokeWidth={2} />
      <Libelle x={0} y={-7} taille={28} graisse={600}>{l[0]}</Libelle>
      <Libelle x={0} y={32} taille={28} graisse={600}>{l[1]}</Libelle>
    </g>
  );
  return (
    <Scene>
      {efface < 1 ? (
        <g opacity={1 - efface} transform={`translate(400 430) scale(${1 - efface * 0.1}) translate(-400 -430)`}>
          <line x1={0} x2={800} y1={760} y2={760} stroke={F.encre} strokeWidth={4} />
          <rect x={90} y={160} width={620} height={350} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <rect x={90} y={510} width={620} height={250} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          {[120, 310, 500].map((x) => (
            <rect key={x} x={x} y={540} width={180} height={190} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
          ))}
          <rect x={70} y={90} width={660} height={70} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <Libelle x={235} y={136} taille={31} graisse={600} couleur={F.papier} opacite={peur}>{LIBELLES.peur}</Libelle>
          <Libelle x={565} y={136} taille={31} graisse={600} couleur={F.papier} opacite={cupidite}>{LIBELLES.cupidite}</Libelle>
          {/* La lucarne à barreaux. */}
          <path d="M302 470 V260 Q302 190 400 190 Q498 190 498 260 V470 Z" fill={F.encre} stroke={F.encre} strokeWidth={5} />
          {/* Les pièces glissent vers la fente, l'une après l'autre. */}
          {Array.from({ length: 13 }, (_, i) => {
            const u = (f - (d0 + 34 + i * 32)) / 40;
            if (u <= 0 || u >= 1) return null;
            const x = 716 - (716 - 400) * u;
            const y = 452 + Math.sin(f * 1.6 + i) * 1.6 + Math.max(0, u - 0.86) * 300;
            return <Piece key={i} x={x} y={y} r={18} opacite={Math.min(1, u * 10)} />;
          })}
          {[334, 367, 400, 433, 466].map((x) => (
            <line key={x} x1={x} x2={x} y1={x === 400 ? 192 : 205} y2={432} stroke={F.filet} strokeWidth={5} />
          ))}
          <rect x={60} y={470} width={680} height={40} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          <rect x={362} y={480} width={76} height={12} rx={6} fill={F.encre} />
          <Affiche x={192} rot={-3} l={LIBELLES.affiche1} o={af1} />
          <Affiche x={608} rot={3} l={LIBELLES.affiche2} o={af2} />
          <line x1={70} y1={100} x2={70 + 660 * trait} y2={100 + 660 * trait} stroke={F.argile} strokeWidth={32} strokeLinecap="round" opacity={trait > 0 ? 1 : 0} />
        </g>
      ) : null}
      {apparait > 0 ? (
        <g opacity={apparait} transform={`translate(${SX} ${SY}) scale(${S * bat})`}>
          {/* La lumière qui sort du haut. */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = ((-90 + (i - 3.5) * 15) * Math.PI) / 180;
            const r1 = 72 + (10 + Math.sin(f / 13 + i) * 2) * ouvre;
            return <line key={i} x1={Math.cos(a) * 72} y1={8 + Math.sin(a) * 72} x2={Math.cos(a) * r1} y2={8 + Math.sin(a) * r1} stroke={F.or} strokeWidth={1.3} strokeLinecap="round" opacity={ouvre} />;
          })}
          {/* Le cœur reste entier ; c'est un volet, à gonds sur la gauche, qui s'ouvre sur l'or. */}
          <path d={COEUR} fill={F.argile} stroke={F.encre} strokeWidth={3 / S} strokeLinejoin="round" />
          <g transform="translate(0 -8)">
            <path d={COEUR} transform={`scale(${VOLET})`} fill={F.orClair} stroke={F.orFonce} strokeWidth={1.2} opacity={ouvre > 0 ? 1 : 0} />
            <path d={COEUR} transform={`translate(0 -2) scale(${VOLET * 0.58})`} fill={F.papier} opacity={0.8 * ouvre} />
            <g transform={`translate(${GOND} 0) scale(${Math.cos(theta)} 1) translate(${-GOND} 0)`}>
              <path d={COEUR} transform={`scale(${VOLET})`} fill={Math.cos(theta) < 0 ? F.cuirClair : F.argile} stroke={F.encre} strokeWidth={1.3} strokeLinejoin="round" />
              {Math.cos(theta) >= 0 ? <circle cx={15} cy={-4} r={1.9} fill={F.or} stroke={F.encre} strokeWidth={0.6} /> : null}
            </g>
          </g>
        </g>
      ) : null}
      {/* Ce qu'il donne sort de lui-même et s'éloigne, chaque pièce de son côté. */}
      {[-205, 140, -90, 225, 40].map((dx, i) => {
        const u = (f - (d1 + 170 + i * 24)) / 76;
        if (u <= 0 || u >= 1) return null;
        return <Piece key={i} x={SX + dx * u ** 0.8 + Math.sin(u * 6 + i) * 8} y={SY - 10 - u * (300 + (i % 2) * 40)} r={25} opacite={Math.min(1, u * 8) * Math.min(1, (1 - u) * 5)} />;
      })}
      <Libelle x={400} y={740} taille={33} graisse={600} couleur={F.orFonce} opacite={p(f, d1 + 160, d1 + 185)}>{LIBELLES.avecJoie}</Libelle>
    </Scene>
  );
};

const Plante: React.FC<{ x: number; h: number; mur: number }> = ({ x, h, mur }) => {
  const SOL = 660;
  return (
    <g>
      <line x1={x} x2={x} y1={SOL} y2={SOL - h} stroke={F.cuir} strokeWidth={5} strokeLinecap="round" />
      {[0.35, 0.65].map((k, i) => (
        <g key={k} opacity={h > 18 ? 1 : 0}>
          <path d={`M${x} ${SOL - h * k} q-${h * 0.15} -${h * 0.03} -${h * 0.18} -${h * 0.17} q${h * 0.12} ${h * 0.02} ${h * 0.18} ${h * 0.17} Z`} fill={i === 0 ? F.cuirClair : F.cuir} />
          <path d={`M${x} ${SOL - h * k} q${h * 0.15} -${h * 0.03} ${h * 0.18} -${h * 0.17} q-${h * 0.12} ${h * 0.02} -${h * 0.18} ${h * 0.17} Z`} fill={i === 0 ? F.cuirClair : F.cuir} />
        </g>
      ))}
      {mur > 0 ? <ellipse cx={x} cy={SOL - h - 20 * mur} rx={13 * mur} ry={26 * mur} fill={F.or} stroke={F.orFonce} strokeWidth={3} /> : null}
    </g>
  );
};

const Nuage: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d="M-120 40 C-160 40 -160 -10 -115 -10 C-110 -55 -45 -60 -25 -28 C-5 -70 70 -60 72 -12 C125 -18 140 40 95 40 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Plan 7 : deux champs identiques, la même pluie et le même soleil. */
const IlluChamps: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1, d2] = d;
  const SOL = 660;
  const leve1 = p(f, d0, d0 + 110);
  const pluieOn = p(f, d1, d1 + 26);
  const pluieOff = p(f, d1 + 166, d1 + 196);
  const leve2 = p(f, d1 + 170, d1 + 285);
  const ySoleil = 770 - 130 * leve1 - 470 * leve2;
  const rayons = p(f, d1 + 200, d1 + 285);
  const pousse = p(f, d1 + 30, d1 + 170) * 0.55 + p(f, d1 + 190, d2 + 20) * 0.45;
  const mur = p(f, d2, d2 + 50);
  const nuage = pluieOn * (1 - pluieOff);
  const hauteur = 6 + 128 * pousse;
  const CHAMPS = [50, 470];
  return (
    <Scene>
      {/* Le soleil, derrière le sol et la clôture : sous l'horizon, il n'existe pas encore. */}
      <defs>
        <clipPath id="ch04-horizon">
          <rect x={0} y={-200} width={800} height={SOL + 200} />
        </clipPath>
      </defs>
      <g clipPath="url(#ch04-horizon)">
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * 22.5 * Math.PI) / 180;
          const r0 = 100;
          const r1 = 100 + (28 + Math.sin(f / 12 + i) * 5) * rayons;
          return <line key={i} x1={400 + Math.cos(a) * r0} y1={ySoleil + Math.sin(a) * r0} x2={400 + Math.cos(a) * r1} y2={ySoleil + Math.sin(a) * r1} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={rayons} />;
        })}
        <circle cx={400} cy={ySoleil} r={84} fill={F.orClair} stroke={F.or} strokeWidth={5} />
      </g>
      {/* Le sol, le même partout. */}
      <rect x={30} y={SOL} width={740} height={130} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {CHAMPS.map((x0) => (
        <g key={x0}>
          {[690, 725, 760].map((y) => (
            <path key={y} d={`M${x0 - 6} ${y} Q${x0 + 140} ${y - 16} ${x0 + 286} ${y}`} fill="none" stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" />
          ))}
          {[30, 85, 140, 195, 250].map((dx) => (
            <Plante key={dx} x={x0 + dx} h={hauteur} mur={mur} />
          ))}
          {/* La pluie : le même dessin sur les deux champs. */}
          {nuage > 0
            ? Array.from({ length: 24 }, (_, i) => {
                const col = 8 + (i % 12) * 24;
                const y = 205 + ((f * 9 + i * 137) % 425);
                return <line key={i} x1={x0 + col} x2={x0 + col - 6} y1={y} y2={y + 28} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" opacity={nuage} />;
              })
            : null}
        </g>
      ))}
      {/* La clôture, au milieu. */}
      <g>
        {[372, 400, 428].map((x) => (
          <path key={x} d={`M${x - 9} 672 V540 L${x} 524 L${x + 9} 540 V672 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        ))}
        {[566, 620].map((y) => (
          <rect key={y} x={350} y={y} width={100} height={14} fill={F.papier} stroke={F.encre} strokeWidth={3.5} />
        ))}
      </g>
      {CHAMPS.map((x0) => (
        <Nuage key={x0} x={x0 + 150} y={150 - (1 - pluieOn) * 30 - pluieOff * 40} o={nuage} />
      ))}
      <Libelle x={190} y={846} taille={27} opacite={p(f, d1 + 118, d1 + 140) * (1 - p(f, d2 - 8, d2 + 6))}>{LIBELLES.neCroitPas}</Libelle>
      <Libelle x={610} y={846} taille={27} opacite={p(f, d1 + 260, d1 + 282) * (1 - p(f, d2 - 8, d2 + 6))}>{LIBELLES.aPeche}</Libelle>
      <Libelle x={400} y={848} taille={33} graisse={600} couleur={F.orFonce} opacite={p(f, d2 + 10, d2 + 32)}>{LIBELLES.bontes}</Libelle>
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureCoeur,
  p2: IlluBourse,
  p3: IlluCoeurVide,
  p4: IlluVerre,
  p5: IlluPlacard,
  p6: IlluGuichet,
  p7: IlluChamps,
  fin: IlluFinCoeur,
};
