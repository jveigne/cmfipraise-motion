import React from 'react';
import { AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { DUREE_FINANCES_CH1, Entree, FONDU_PLANS, FRISE } from './frise';
import { FIN, OUVERTURE, Temps } from './textes';
import { F, PoliceF } from './theme';
import { ILLUSTRATIONS, Thermometre } from './ui/Illustrations';

/**
 * « Enseignements sur les finances » de Théodore Andoseh, chapitre 1 (YouTube, 16:9, 1920 × 1080,
 * 30 i/s, sans voix ni musique) : illustrations à gauche, phrases du livre à droite.
 * Storyboard : docs/storyboard-finances-ch1.md.
 */
const borne = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Espaces insécables de la typographie française. */
const insecables = (t: string) => t.replace(/ ([;:!?»])/g, ' $1').replace(/« /g, '« ');

const Riche: React.FC<{ texte: string }> = ({ texte }) => (
  <>
    {insecables(texte)
      .split('**')
      .map((morceau, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color: F.orFonce, fontWeight: 600 }}>
            {morceau}
          </span>
        ) : (
          <React.Fragment key={i}>{morceau}</React.Fragment>
        ),
      )}
  </>
);

const Phrase: React.FC<{ t: Temps; taille: number }> = ({ t, taille }) => (
  <div>
    <div style={{ fontFamily: PoliceF.serif, fontSize: taille, lineHeight: 1.3, color: F.encre }}>
      <Riche texte={t.texte} />
    </div>
    {t.reference ? <div style={{ fontFamily: PoliceF.sans, fontSize: 30, fontWeight: 500, color: F.orFonce, marginTop: 18 }}>{t.reference}</div> : null}
  </div>
);

const TextePile: React.FC<{ e: Entree }> = ({ e }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {e.partie!.temps.map((t, i) => {
        const a = e.debuts[i];
        const entree = interpolate(f, [a, a + 14], [0, 1], borne);
        const suivant = e.debuts[i + 1];
        const estompe = suivant === undefined ? 1 : interpolate(f, [suivant, suivant + 12], [1, 0.45], borne);
        return (
          <div key={i} style={{ opacity: entree * estompe, transform: `translateY(${(1 - entree) * 16}px)` }}>
            <Phrase t={t} taille={46} />
          </div>
        );
      })}
    </div>
  );
};

const TexteRemplace: React.FC<{ e: Entree }> = ({ e }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'relative', height: 420 }}>
      {e.partie!.temps.map((t, i) => {
        const a = e.debuts[i];
        const suivant = e.debuts[i + 1];
        const entree = interpolate(f, [a, a + 14], [0, 1], borne);
        const sortie = suivant === undefined ? 1 : interpolate(f, [suivant - 10, suivant], [1, 0], borne);
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: entree * sortie, transform: `translateY(${(1 - entree) * 16}px)` }}>
            <Phrase t={t} taille={54} />
          </div>
        );
      })}
    </div>
  );
};

const Mise: React.FC<{ e: Entree; niveau: number; children: React.ReactNode }> = ({ e, niveau, children }) => {
  const f = useCurrentFrame();
  const Illu = ILLUSTRATIONS[e.id];
  const avecFil = e.partie !== null;
  return (
    <AbsoluteFill style={{ backgroundColor: F.parchemin }}>
      {avecFil ? (
        <svg width={120} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Thermometre x={52} y={190} h={640} l={22} niveau={niveau} graduations={false} />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 130, top: 90 }}>
        <Illu f={f} d={e.debuts} duree={e.duree} />
      </div>
      <div style={{ position: 'absolute', left: 990, top: 0, width: 830, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
    </AbsoluteFill>
  );
};

const Etiquette: React.FC<{ texte: string }> = ({ texte }) => (
  <div style={{ fontFamily: PoliceF.sans, fontSize: 26, fontWeight: 600, letterSpacing: 1.5, color: F.encre2, textTransform: 'uppercase', marginBottom: 44 }}>{texte}</div>
);

const Ouverture: React.FC<{ e: Entree }> = ({ e }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [10, 34], [0, 1], borne);
  const b = interpolate(f, [70, 94], [0, 1], borne);
  return (
    <Mise e={e} niveau={0}>
      <div style={{ opacity: a }}>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 28, fontWeight: 600, letterSpacing: 1.5, color: F.encre2, textTransform: 'uppercase' }}>{OUVERTURE.livre}</div>
        <div style={{ fontFamily: PoliceF.serif, fontStyle: 'italic', fontSize: 44, color: F.orFonce, marginTop: 36 }}>{OUVERTURE.chapitre}</div>
        <div style={{ fontFamily: PoliceF.serif, fontSize: 76, fontWeight: 500, lineHeight: 1.16, color: F.encre, marginTop: 16 }}>{OUVERTURE.titre}</div>
      </div>
      <div style={{ opacity: b, marginTop: 56 }}>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 34, fontWeight: 600, color: F.encre }}>{OUVERTURE.auteur}</div>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 28, color: F.encre2, marginTop: 8 }}>{OUVERTURE.mention}</div>
      </div>
    </Mise>
  );
};

const Fin: React.FC<{ e: Entree }> = ({ e }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [12, 36], [0, 1], borne);
  const b = interpolate(f, [90, 114], [0, 1], borne);
  return (
    <Mise e={e} niveau={1}>
      <div style={{ opacity: a }}>
        <div style={{ fontFamily: PoliceF.serif, fontSize: 68, fontWeight: 500, lineHeight: 1.2, color: F.encre }}>{FIN.verset}</div>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 32, fontWeight: 500, color: F.orFonce, marginTop: 24 }}>{FIN.reference}</div>
      </div>
      <div style={{ opacity: b, marginTop: 72 }}>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 32, fontWeight: 600, color: F.encre }}>{OUVERTURE.auteur}</div>
        <div style={{ fontFamily: PoliceF.sans, fontSize: 26, color: F.encre2, marginTop: 8 }}>
          {OUVERTURE.livre} · {OUVERTURE.mention}
        </div>
      </div>
    </Mise>
  );
};

const Partie: React.FC<{ e: Entree; index: number }> = ({ e, index }) => {
  const f = useCurrentFrame();
  const parties = FRISE.length - 2;
  const niveau = interpolate(f, [0, 40], [(index - 1) / parties, index / parties], borne);
  return (
    <Mise e={e} niveau={niveau}>
      <Etiquette texte={e.partie!.etiquette} />
      {e.partie!.mode === 'pile' ? <TextePile e={e} /> : <TexteRemplace e={e} />}
    </Mise>
  );
};

const Plan: React.FC<{ e: Entree; index: number }> = ({ e, index }) => {
  const f = useCurrentFrame();
  const opacite = index === 0 ? 1 : interpolate(f, [0, FONDU_PLANS], [0, 1], borne);
  return (
    <AbsoluteFill style={{ opacity: opacite }}>
      <Freeze frame={e.duree - 1} active={(x) => x >= e.duree}>
        {e.id === 'ouverture' ? <Ouverture e={e} /> : e.id === 'fin' ? <Fin e={e} /> : <Partie e={e} index={index} />}
      </Freeze>
    </AbsoluteFill>
  );
};

export const VideoFinancesCh1: React.FC = () => {
  const f = useCurrentFrame();
  const entree = interpolate(f, [0, 12], [1, 0], borne);
  const sortie = interpolate(f, [DUREE_FINANCES_CH1 - 24, DUREE_FINANCES_CH1 - 1], [0, 1], borne);
  return (
    <AbsoluteFill style={{ backgroundColor: F.parchemin }}>
      {FRISE.map((e, i) => (
        <Sequence key={e.id} from={e.debut} durationInFrames={e.duree + (i < FRISE.length - 1 ? FONDU_PLANS : 0)} name={e.id}>
          <Plan e={e} index={i} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ backgroundColor: F.parchemin, opacity: Math.max(entree, sortie) }} />
    </AbsoluteFill>
  );
};

export { DUREE_FINANCES_CH1 };
