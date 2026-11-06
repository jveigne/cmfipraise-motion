import React from 'react';
import { IoCheckmark, IoChevronDown, IoChevronForward, IoChevronUp, IoDocumentTextOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { Bouton, Ecran, Etiquette, Halo } from '../../evenements/ui/app';
import { useEtude } from '../langue';
import { LigneCopie, noteSur } from '../donnees';
import { Rangee, TeteEtude } from './AccueilEtude';

/**
 * Résultats d'une séance (`app/study/results/[id].tsx`, RG-ETU-14), vus par le dirigeant : leçon,
 * « assemblée · date · état », « code · nom — note sur 13 », « Ajouter une copie papier » (D-ETU-13),
 * « n copies » triées par nom ; une copie papier porte la pastille « papier » (contour terre) et pas
 * de nombre de réponses. Modale `PaperModal` : membre choisi dans la liste déroulée sous le champ
 * (`SelectField inline`), « Note (sur 13) », « Enregistrer », « Annuler ». En P16, deux copies papier
 * l'une après l'autre : Paul (son livret), puis Hélène (son cahier).
 */

/** Haut de la liste des copies (points, défilement nul) ; une rangée fait 65 (papier : 46), écart 8. */
const HAUT_LISTE = 321;
const H_COPIE = 65;
const H_PAPIER = 46;

/** Centre vertical de la copie `i` d'une liste (points, défilement nul). */
export const centreCopie = (copies: readonly LigneCopie[], i: number) => {
  let y = HAUT_LISTE;
  for (let k = 0; k < i; k++) y += (copies[k].papier ? H_PAPIER : H_COPIE) + 8;
  return y + (copies[i].papier ? H_PAPIER : H_COPIE) / 2;
};

export const PT_RESULTATS = {
  ajouterPapier: { x: 195, y: 253 },
} as const;

export const EcranResultats: React.FC<{
  copies: readonly LigneCopie[];
  defilement?: number;
  /** Surbrillance par nom de copie. */
  halos?: Partial<Record<string, number>>;
  haloEtiquette?: number;
  /** Ligne « questions 1 à 11 » sous le sous-titre (avenant 05), facultative : vidéo « Guide ». */
  plage?: string;
}> = ({ copies, defilement = 0, halos = {}, haloEtiquette = 0, plage }) => {
  const { app: APP, d } = useEtude();
  const { ASSEMBLEE, DATE_SEANCE, QUESTIONS, UNITE, UNITE_LIBELLE } = d;
  const fmtPoints = APP.fmtPoints;
  const NOTE_SUR = noteSur(QUESTIONS);
  return (
  <Ecran defilement={defilement}>
    <TeteEtude kicker={APP.results.kicker} titre={APP.lessonTitled(1, UNITE.lecons[0].titre ?? '')} taille={26} />
    <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: '19px', color: S.ink2 }}>{[ASSEMBLEE, DATE_SEANCE, APP.status.TERMINEE].join(' · ')}</div>
    <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3, height: 34 }}>
      {UNITE_LIBELLE} — {APP.results.outOf(fmtPoints(NOTE_SUR))}
    </div>
    {plage ? <div style={{ marginTop: 4, fontFamily: P.mono, fontSize: 12, lineHeight: '17px', color: S.moss, letterSpacing: 0.4 }}>{plage}</div> : null}
    <Bouton
      label={APP.results.addPaper}
      variante="soft"
      hauteur={46}
      style={{ marginTop: 16 }}
      icone={<IoDocumentTextOutline size={18} color={S.mossDeep} />}
    />
    <div style={{ marginTop: 22, marginBottom: 8, height: 15, display: 'flex' }}>
      <Halo intensite={haloEtiquette} rayon={6} marge={6} margeY={3} etalement={3}>
        <Etiquette style={{ lineHeight: '15px' }}>{APP.results.copies(copies.length)}</Etiquette>
      </Halo>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {copies.map((c) => (
        <Halo key={c.nom} intensite={halos[c.nom] ?? 0} rayon={R.md}>
          <Rangee hauteur={c.papier ? H_PAPIER : H_COPIE} style={{ gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: P.serif, fontSize: 16, lineHeight: '20px', color: S.ink }}>{c.nom}</div>
                {c.papier ? (
                  <div
                    style={{
                      fontFamily: P.mono,
                      fontSize: 9.5,
                      lineHeight: '12px',
                      color: S.earthDeep,
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 99,
                      border: `1px solid ${S.earth}`,
                    }}
                  >
                    {APP.results.paper}
                  </div>
                ) : null}
              </div>
              {!c.papier ? <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: '17px', color: S.ink3 }}>{APP.results.answeredCount(c.reponses)}</div> : null}
            </div>
            <div style={{ fontFamily: P.mono, fontSize: 14, color: S.moss }}>{APP.score(fmtPoints(c.note), fmtPoints(NOTE_SUR))}</div>
            <IoChevronForward size={18} color={S.ink3} />
          </Rangee>
        </Halo>
      ))}
    </div>
  </Ecran>
  );
};

// ---------------------------------------------------------------------------------------------
// Modale « Ajouter une copie papier » (D-ETU-13)

/** Hauteur de la carte de la modale, liste fermée ; la liste déroulée de `n` noms l'allonge de `hListe(n)`. */
const H_MODALE = 404;
const hListe = (n: number) => 6 + 8 + n * 43 + 8 + 2;

/** Haut de la carte (centrée verticalement, `justifyContent: center`). */
const hautModale = (n: number, ouverte: number) => (844 - (H_MODALE + hListe(n) * ouverte)) / 2;

/** Points d'appui de la modale pour une liste de `n` membres sans copie. */
export const ptModale = (n: number) => ({
  /** Champ « Choisir… » (liste fermée). */
  choisir: { x: 195, y: hautModale(n, 0) + 161 },
  /** Ligne `i` de la liste déroulée. */
  ligne: (i: number) => ({ x: 160, y: hautModale(n, 1) + 200 + 21.5 + i * 43 }),
  note: { x: 195, y: hautModale(n, 0) + 244 },
  enregistrer: { x: 195, y: hautModale(n, 0) + 309 },
});

export const ModalePapier: React.FC<{
  /** Membres sans copie (`withoutCopy`), dans l'ordre de la liste. */
  liste: readonly string[];
  /** Apparition de la modale (fondu, 0 → 1). */
  p: number;
  /** Liste déroulée (0 → 1). */
  ouverte?: number;
  membre?: string | null;
  note?: string;
  curseurNote?: boolean;
}> = ({ liste, p, ouverte = 0, membre = null, note = '', curseurNote = false }) => {
  const { app: APP, d } = useEtude();
  if (p <= 0.001) return null;
  const fmtPoints = APP.fmtPoints;
  const NOTE_SUR = noteSur(d.QUESTIONS);
  const valide = !!membre && note !== '';
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,41,31,0.70)', opacity: p }}>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: hautModale(liste.length, ouverte),
          boxSizing: 'border-box',
          background: S.paper,
          borderRadius: R.lg,
          padding: '22px 20px 18px',
          border: `1px solid ${S.hair}`,
          fontFamily: P.sans,
          color: S.ink,
        }}
      >
        <div style={{ fontFamily: P.serif, fontSize: 22, lineHeight: '28px', letterSpacing: -0.3 }}>{APP.results.addPaper}</div>
        <div style={{ marginTop: 4, marginBottom: 12, fontSize: 13, lineHeight: '19px', color: S.ink2, height: 38 }}>{APP.results.addPaperHint}</div>
        <div style={{ marginTop: 10 }}>
          <Etiquette style={{ marginBottom: 6, lineHeight: '15px' }}>{APP.results.member}</Etiquette>
          <div
            style={{
              height: 50,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              padding: '0 14px',
              borderRadius: 12,
              border: '1px solid rgba(42,38,32,0.15)',
              background: S.paper,
            }}
          >
            <div style={{ fontSize: 14.5, color: membre ? S.ink : S.ink3 }}>{membre ?? APP.common.choose}</div>
            {ouverte > 0.5 ? <IoChevronUp size={16} color={S.ink3} /> : <IoChevronDown size={16} color={S.ink3} />}
          </div>
          {ouverte > 0.001 ? (
            <div style={{ height: hListe(liste.length) * ouverte, overflow: 'hidden' }}>
              <div
                style={{
                  marginTop: 6,
                  padding: '8px 12px 8px',
                  borderRadius: 12,
                  border: '1px solid rgba(42,38,32,0.12)',
                  background: S.paper2,
                }}
              >
                {liste.map((nom) => (
                  <div
                    key={nom}
                    style={{
                      height: 43,
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '0 6px',
                      borderBottom: '1px solid rgba(42,38,32,0.06)',
                      fontSize: 14.5,
                      color: membre === nom ? S.mossDeep : S.ink2,
                      fontWeight: membre === nom ? 600 : 400,
                    }}
                  >
                    <div style={{ flex: 1 }}>{nom}</div>
                    {membre === nom ? <IoCheckmark size={16} color={S.moss} /> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <Etiquette style={{ marginTop: 12, marginBottom: 6, lineHeight: '15px' }}>{APP.results.scoreOutOf(fmtPoints(NOTE_SUR))}</Etiquette>
        <div
          style={{
            height: 50,
            boxSizing: 'border-box',
            padding: '14px 16px',
            borderRadius: 14,
            border: `1px solid ${S.hair}`,
            background: S.paper2,
            fontSize: 16,
            lineHeight: '20px',
            color: note ? S.ink : S.ink3,
          }}
        >
          {note || (curseurNote ? '' : '0')}
          {curseurNote ? <span style={{ display: 'inline-block', width: 2, height: 19, marginLeft: 1, background: S.moss, verticalAlign: -3 }} /> : null}
        </div>
        <Bouton label={APP.common.save} hauteur={48} style={{ marginTop: 16 }} inactif={valide ? 0 : 1} />
        <Bouton label={APP.common.cancel} variante="ghost" hauteur={44} style={{ marginTop: 8 }} />
      </div>
    </div>
  );
};
