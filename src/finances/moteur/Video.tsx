import React from 'react';
import { AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { F, PoliceF } from '../theme';
import { Entree, FONDU_PLANS, Partie as PartieDef, Temps, construireFrise, dureeTotale, paginer } from './frise';
import { PropsIllustration, Thermometre } from './primitives';

/**
 * Moteur de la série « Enseignements sur les finances » de Théodore Andoseh (YouTube, 16:9,
 * 1920 × 1080, 30 i/s, sans voix ni musique) : illustrations à gauche, phrases du livre à droite.
 * Chaque chapitre fournit ses textes et ses illustrations (`Chapitre`).
 */
export type Chapitre = {
  ouverture: { livre: string; chapitre: string; titre: string; auteur: string; mention: string };
  fin: { verset: string; reference?: string };
  parties: PartieDef[];
  illustrations: Record<string, React.FC<PropsIllustration>>;
};

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

const Pile: React.FC<{ e: Entree; indices: number[]; taille: number }> = ({ e, indices, taille }) => {
  const f = useCurrentFrame();
  const temps = e.partie!.temps;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {indices.map((i) => {
        const a = e.debuts[i];
        const entree = interpolate(f, [a, a + 14], [0, 1], borne);
        const suivant = indices.includes(i + 1) ? e.debuts[i + 1] : undefined;
        const estompe = suivant === undefined ? 1 : interpolate(f, [suivant, suivant + 12], [1, 0.45], borne);
        return (
          <div key={i} style={{ opacity: entree * estompe, transform: `translateY(${(1 - entree) * 16}px)` }}>
            <Phrase t={temps[i]} taille={taille} />
          </div>
        );
      })}
    </div>
  );
};

const Remplace: React.FC<{ e: Entree; taille: number }> = ({ e, taille }) => {
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
            <Phrase t={t} taille={taille} />
          </div>
        );
      })}
    </div>
  );
};

/** Mode `auto` : une ou plusieurs pages ; chaque page empile ses phrases, puis laisse place à la suivante. */
const Pages: React.FC<{ e: Entree; taille: number }> = ({ e, taille }) => {
  const f = useCurrentFrame();
  const debuts = paginer(e.partie!);
  const total = e.partie!.temps.length;
  const groupes = debuts.map((d, k) => Array.from({ length: (debuts[k + 1] ?? total) - d }, (_, j) => d + j));
  if (groupes.length === 1) return <Pile e={e} indices={groupes[0]} taille={taille} />;
  return (
    <div style={{ position: 'relative', height: 760 }}>
      {groupes.map((indices, k) => {
        const suivante = groupes[k + 1];
        const sortie = suivante ? interpolate(f, [e.debuts[suivante[0]] - 10, e.debuts[suivante[0]]], [1, 0], borne) : 1;
        return (
          <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: sortie, visibility: sortie === 0 ? 'hidden' : 'visible' }}>
            <Pile e={e} indices={indices} taille={taille} />
          </div>
        );
      })}
    </div>
  );
};

const Etiquette: React.FC<{ texte: string }> = ({ texte }) => (
  <div style={{ fontFamily: PoliceF.sans, fontSize: 26, fontWeight: 600, letterSpacing: 1.5, color: F.encre2, textTransform: 'uppercase', marginBottom: 44 }}>{texte}</div>
);

export const creerVideo = (c: Chapitre) => {
  const frise = construireFrise(c.parties);
  const duree = dureeTotale(frise);

  const Mise: React.FC<{ e: Entree; niveau: number; children: React.ReactNode }> = ({ e, niveau, children }) => {
    const f = useCurrentFrame();
    const Illu = c.illustrations[e.id];
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

  const Ouverture: React.FC<{ e: Entree }> = ({ e }) => {
    const f = useCurrentFrame();
    const a = interpolate(f, [10, 34], [0, 1], borne);
    const b = interpolate(f, [70, 94], [0, 1], borne);
    const o = c.ouverture;
    return (
      <Mise e={e} niveau={0}>
        <div style={{ opacity: a }}>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 28, fontWeight: 600, letterSpacing: 1.5, color: F.encre2, textTransform: 'uppercase' }}>{o.livre}</div>
          <div style={{ fontFamily: PoliceF.serif, fontStyle: 'italic', fontSize: 44, color: F.orFonce, marginTop: 36 }}>{o.chapitre}</div>
          <div style={{ fontFamily: PoliceF.serif, fontSize: 76, fontWeight: 500, lineHeight: 1.16, color: F.encre, marginTop: 16 }}>{insecables(o.titre)}</div>
        </div>
        <div style={{ opacity: b, marginTop: 56 }}>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 34, fontWeight: 600, color: F.encre }}>{o.auteur}</div>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 28, color: F.encre2, marginTop: 8 }}>{o.mention}</div>
        </div>
      </Mise>
    );
  };

  const Fin: React.FC<{ e: Entree }> = ({ e }) => {
    const f = useCurrentFrame();
    const a = interpolate(f, [12, 36], [0, 1], borne);
    const b = interpolate(f, [90, 114], [0, 1], borne);
    const o = c.ouverture;
    return (
      <Mise e={e} niveau={1}>
        <div style={{ opacity: a }}>
          <div style={{ fontFamily: PoliceF.serif, fontSize: c.fin.verset.length > 75 ? 58 : 68, fontWeight: 500, lineHeight: 1.2, color: F.encre }}>
            <Riche texte={c.fin.verset} />
          </div>
          {c.fin.reference ? <div style={{ fontFamily: PoliceF.sans, fontSize: 32, fontWeight: 500, color: F.orFonce, marginTop: 24 }}>{c.fin.reference}</div> : null}
        </div>
        <div style={{ opacity: b, marginTop: 72 }}>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 32, fontWeight: 600, color: F.encre }}>{o.auteur}</div>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 26, color: F.encre2, marginTop: 8 }}>
            {o.livre} · {o.mention}
          </div>
        </div>
      </Mise>
    );
  };

  const Partie: React.FC<{ e: Entree; index: number }> = ({ e, index }) => {
    const f = useCurrentFrame();
    const parties = frise.length - 2;
    const niveau = interpolate(f, [0, 40], [(index - 1) / parties, index / parties], borne);
    const def = e.partie!;
    const tous = def.temps.map((_, i) => i);
    return (
      <Mise e={e} niveau={niveau}>
        <Etiquette texte={def.etiquette} />
        {def.mode === 'remplace' ? <Remplace e={e} taille={def.taille ?? 54} /> : def.mode === 'pile' ? <Pile e={e} indices={tous} taille={def.taille ?? 46} /> : <Pages e={e} taille={def.taille ?? 46} />}
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

  const Composant: React.FC = () => {
    const f = useCurrentFrame();
    const entree = interpolate(f, [0, 12], [1, 0], borne);
    const sortie = interpolate(f, [duree - 24, duree - 1], [0, 1], borne);
    return (
      <AbsoluteFill style={{ backgroundColor: F.parchemin }}>
        {frise.map((e, i) => (
          <Sequence key={e.id} from={e.debut} durationInFrames={e.duree + (i < frise.length - 1 ? FONDU_PLANS : 0)} name={e.id}>
            <Plan e={e} index={i} />
          </Sequence>
        ))}
        <AbsoluteFill style={{ backgroundColor: F.parchemin, opacity: Math.max(entree, sortie) }} />
      </AbsoluteFill>
    );
  };

  /** Vignette YouTube (1920 × 1080, réduite ensuite à 1280 × 720) : l'illustration d'ouverture à sa dernière image, le titre en grand. */
  const Vignette: React.FC = () => {
    const Illu = c.illustrations.ouverture;
    const o = c.ouverture;
    const titre = insecables(o.titre);
    const corps = o.titre.length > 52 ? 78 : o.titre.length > 34 ? 90 : 104;
    return (
      <AbsoluteFill style={{ backgroundColor: F.parchemin }}>
        <div style={{ position: 'absolute', left: 70, top: 90 }}>
          <Illu f={frise[0].duree - 1} d={[]} duree={frise[0].duree} />
        </div>
        <div style={{ position: 'absolute', left: 930, top: 0, width: 920, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: PoliceF.sans, fontSize: 34, fontWeight: 600, letterSpacing: 2, color: F.encre2, textTransform: 'uppercase' }}>{o.livre}</div>
          <div style={{ fontFamily: PoliceF.serif, fontStyle: 'italic', fontSize: 72, fontWeight: 400, color: F.orFonce, marginTop: 28 }}>{o.chapitre}</div>
          <div style={{ fontFamily: PoliceF.serif, fontSize: corps, fontWeight: 600, lineHeight: 1.08, color: F.encre, marginTop: 14 }}>{titre}</div>
          <div style={{ width: 120, height: 8, backgroundColor: F.or, marginTop: 44, borderRadius: 4 }} />
          <div style={{ fontFamily: PoliceF.sans, fontSize: 40, fontWeight: 600, color: F.encre, marginTop: 30 }}>{o.auteur}</div>
        </div>
      </AbsoluteFill>
    );
  };

  return { Composant, duree, frise, Vignette };
};
