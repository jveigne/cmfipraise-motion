import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { Salon } from '../../etude/ui/Salon';
import { LivreOuvert, LivretOuvert } from '../../etude/ui/Livre';
import { PageLivret } from '../../etude/ui/Papier';
import { PAGE_CAHIER, PageLignee } from '../../journal/ui/Illustrations';
import { TuileEtude } from '../../etude/ecrans/Accueil';
import { useEtude } from '../../etude/langue';
import { useGuide, AvecEtude } from '../langue';
import type { IdPlan } from '../textes';
import { Accent, Fond16, PanneauTexte, PANNEAU_SEUL, entre, useEntree } from './Mise';

/**
 * Cartons sans téléphone de la vidéo « Guide » : titre, personnes, sommaire, intertitres de partie,
 * rappels de fin, phrase de fin ; et les illustrations reprises d'« Étude » (salon, livre, livret de
 * Paul, cahier d'Hélène), posées dans la zone gauche du 16:9.
 */

/** i1 — le titre de la vidéo. */
export const CartonTitre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons, plans } = useGuide();
  const e1 = useEntree(14);
  const e2 = useEntree(22);
  const e3 = useEntree(34);
  return (
    <AbsoluteFill>
      <Fond16 />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TuileLogo taille={170} echelle={spring({ frame: f - 2, fps, config: { damping: 14 } })} />
        <div style={{ marginTop: 56, textAlign: 'center', fontFamily: P.serif, fontWeight: 600, fontSize: 96, lineHeight: 1.08, letterSpacing: -2.4, color: S.ink }}>
          <div style={e1}>{cartons.titreVideo[0]}</div>
          <div style={{ ...e2, color: S.clay }}>{cartons.titreVideo[1]}</div>
        </div>
        <div style={{ ...e3, marginTop: 36, fontFamily: P.serif, fontStyle: 'italic', fontSize: 46, color: S.ink2 }}>{plans.i1.texte as string}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Le salon de « Étude », réduit et recadré dans la zone gauche (la pièce : x 40 → 1040, y 470 → 1830). */
export const SalonCadre: React.FC<{ etiquettes?: boolean; telephones?: number; enfant?: React.ReactNode }> = ({ etiquettes = true, telephones = 0, enfant }) => {
  const f = useCurrentFrame();
  const p = (a: number) => entre(f, [a, a + 12], [0, 1]);
  const echelle = 0.74;
  return (
    <div style={{ position: 'absolute', left: 60 - 40 * echelle, top: 40 - 470 * echelle, width: 1080, height: 1920, transform: `scale(${echelle})`, transformOrigin: '0 0' }}>
      <AvecEtude>
        <Salon
          etiquettes={etiquettes ? { samuel: p(10), marie: p(16), jean: p(20), esther: p(24), paul: p(28), helene: p(32) } : {}}
          telephones={telephones}
        />
      </AvecEtude>
      {enfant}
    </div>
  );
};

/** i3 — les personnes de la vidéo : un médaillon par personne, son rôle dessous. */
export const CartonPersonnes: React.FC<{ id: IdPlan }> = ({ id }) => {
  const f = useCurrentFrame();
  const { cartons } = useGuide();
  const couleurs = [S.moss, S.mossSoft, S.mossSoft, S.mossSoft, S.earthDeep, S.earthDeep, S.sauge, S.clay];
  return (
    <AbsoluteFill>
      <Fond16 />
      <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 720, display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: 24 }}>
        {cartons.personnes.map((p, i) => {
          const a = entre(f, [6 + i * 5, 18 + i * 5], [0, 1]);
          return (
            <div
              key={p.nom}
              style={{
                width: 162,
                height: 300,
                boxSizing: 'border-box',
                borderRadius: 28,
                background: S.paper,
                border: '1px solid rgba(42,38,32,0.07)',
                boxShadow: '0 12px 26px rgba(42,38,32,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                opacity: a,
                transform: `translateY(${(1 - a) * 30}px)`,
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  background: couleurs[i],
                  color: S.white,
                  fontFamily: P.serif,
                  fontSize: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {p.nom.charAt(0)}
              </div>
              <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 32, color: S.ink }}>{p.nom}</div>
              <div style={{ fontFamily: P.sans, fontSize: 24, color: S.ink3, textAlign: 'center', lineHeight: 1.2 }}>{p.role}</div>
            </div>
          );
        })}
      </div>
      <PanneauTexte id={id} {...PANNEAU_SEUL} />
    </AbsoluteFill>
  );
};

/** i4 — le sommaire : trois lignes numérotées. */
export const CartonSommaire: React.FC = () => {
  const { plans, cartons } = useGuide();
  const lignes = plans.i4.texte as readonly string[];
  const numeros = [cartons.numeros.t1, cartons.numeros.t2, cartons.numeros.t3];
  const couleurs = [S.moss, S.clay, S.sauge];
  const e0 = useEntree(4);
  const es = [useEntree(14), useEntree(24), useEntree(34)];
  return (
    <AbsoluteFill>
      <Fond16 />
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 260 }}>
        <div style={{ ...e0, fontFamily: P.serif, fontWeight: 600, fontSize: 84, letterSpacing: -2, color: S.ink, marginBottom: 60 }}>
          <Accent texte={plans.i4.titre} />
        </div>
        {lignes.map((l, i) => (
          <div key={l} style={{ ...es[i], display: 'flex', alignItems: 'center', gap: 44, marginBottom: 40 }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                background: couleurs[i],
                color: S.white,
                fontFamily: P.serif,
                fontSize: 58,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {numeros[i]}
            </div>
            <div style={{ fontFamily: P.serif, fontSize: 64, color: S.ink, letterSpacing: -1 }}>{l}</div>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** t1–t3 — intertitre plein cadre de la couleur de la partie. */
export const Intertitre16: React.FC<{ id: 't1' | 't2' | 't3' }> = ({ id }) => {
  const { plans, cartons } = useGuide();
  const couleur = id === 't1' ? S.moss : id === 't2' ? S.clay : S.sauge;
  const e0 = useEntree(4, 40);
  const e1 = useEntree(10, 40);
  const e2 = useEntree(18, 40);
  return (
    <AbsoluteFill style={{ background: couleur, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...e0, fontFamily: P.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 260, lineHeight: 1, color: 'rgba(232,220,196,0.55)' }}>{cartons.numeros[id]}</div>
      <div style={{ ...e1, marginTop: 10, fontFamily: P.serif, fontWeight: 600, fontSize: 110, letterSpacing: -2.5, color: S.white, textAlign: 'center' }}>{plans[id].titre}</div>
      <div style={{ ...e2, marginTop: 30, fontFamily: P.serif, fontStyle: 'italic', fontSize: 52, color: S.parchment, textAlign: 'center' }}>{plans[id].texte as string}</div>
    </AbsoluteFill>
  );
};

/** c1 / c2 — rappel des étapes : titre à gauche, étapes numérotées à droite. */
export const CartonRappel: React.FC<{ id: 'c1' | 'c2' }> = ({ id }) => {
  const f = useCurrentFrame();
  const { plans } = useGuide();
  const lignes = plans[id].texte as readonly string[];
  const couleur = id === 'c1' ? S.moss : S.clay;
  const e0 = useEntree(4);
  return (
    <AbsoluteFill>
      <Fond16 />
      <div style={{ position: 'absolute', left: 150, top: 0, bottom: 0, width: 640, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ ...e0, fontFamily: P.serif, fontWeight: 600, fontSize: 86, lineHeight: 1.08, letterSpacing: -2, color: S.ink }}>
          {/* « En résumé : » sur une ligne, l'objet sur la suivante. */}
          {plans[id].titre.split(/(?<=:) /).map((l) => (
            <div key={l}>
              <Accent texte={l} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 900, top: 0, bottom: 0, width: 900, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
        {lignes.map((l, i) => {
          const a = entre(f, [12 + i * 8, 24 + i * 8], [0, 1]);
          return (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: a, transform: `translateX(${(1 - a) * 40}px)` }}>
              <div
                style={{
                  width: 76,
                  height: 76,
                  flexShrink: 0,
                  borderRadius: 38,
                  border: `3px solid ${couleur}`,
                  color: couleur,
                  fontFamily: P.mono,
                  fontWeight: 500,
                  fontSize: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontFamily: P.sans, fontSize: 50, color: S.ink, lineHeight: 1.2 }}>{l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** c3 — « Le Message de Bertoua, simplement. », la tuile, le logotype. */
export const CartonFin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons } = useGuide();
  const [l1, mot, point] = cartons.fin;
  const e0 = useEntree(6, 40);
  const e1 = useEntree(40);
  return (
    <AbsoluteFill>
      <Fond16 />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...e0, fontFamily: P.serif, fontWeight: 600, fontSize: 104, letterSpacing: -2.5, color: S.ink, textAlign: 'center', lineHeight: 1.1 }}>
          {l1} <span style={{ color: S.clay }}>{mot}</span>
          {point}
        </div>
        <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 60 }}>
          <div style={{ transform: `scale(${1.35 * spring({ frame: f - 22, fps, config: { damping: 14 } })})`, fontFamily: P.sans, color: S.ink }}>
            <AvecEtude>
              <TuileEtude />
            </AvecEtude>
          </div>
          <TuileLogo taille={190} echelle={spring({ frame: f - 30, fps, config: { damping: 14 } })} />
        </div>
        <Logotype taille={60} style={{ marginTop: 56, ...e1 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** e6 — le livre ouvert sur la portion du jour, deux livrets autour (illustrations d'« Étude »). */
export const IllustrationLecture: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude>
      <div style={{ position: 'absolute', left: 70, top: 250 }}>
        <LivreOuvert largeur={720} lecture={entre(f, [10, 160], [0, 0.9])} />
      </div>
      <LivretOuvert largeur={250} style={{ position: 'absolute', left: 80, top: 790, transform: 'rotate(-5deg)' }} />
      <LivretOuvert largeur={250} style={{ position: 'absolute', left: 520, top: 800, transform: 'rotate(4deg)' }} />
    </AvecEtude>
  );
};

/** e10 — le livret de Paul et le cahier d'Hélène, côte à côte. */
export const IllustrationPapier: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude>
      <IllustrationPapierCoeur f={f} />
    </AvecEtude>
  );
};

const IllustrationPapierCoeur: React.FC<{ f: number }> = ({ f }) => {
  const { cartons } = useEtude();
  const { cartons: c } = useGuide();
  const echelle = 0.72;
  const page = (x: number, r: number, contenu: React.ReactNode, legende: string) => (
    <div style={{ position: 'absolute', left: x, top: 190 }}>
      <div style={{ width: PAGE_CAHIER.largeur * echelle, height: PAGE_CAHIER.hauteur * echelle, transform: `rotate(${r}deg)`, boxShadow: '0 24px 50px rgba(42,38,32,0.18)', borderRadius: 14 }}>
        <div style={{ position: 'relative', width: PAGE_CAHIER.largeur, height: PAGE_CAHIER.hauteur, transform: `scale(${echelle})`, transformOrigin: '0 0' }}>{contenu}</div>
      </div>
      <div style={{ marginTop: 44, textAlign: 'center', fontFamily: P.mono, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: S.earthDeep }}>{legende}</div>
    </div>
  );
  return (
    <>
      {page(50, -3, <PageLivret ecrites={entre(f, [8, 110], [0, 4])} />, c.supports[0])}
      {page(440, 3, <PageLignee lignes={cartons.cahierHelene} ecrites={entre(f, [20, 120], [0, 5])} />, c.supports[1])}
    </>
  );
};
