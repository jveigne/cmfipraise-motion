import React from 'react';
import {
  IoCalendarOutline,
  IoCheckbox,
  IoCheckmarkCircle,
  IoChevronDown,
  IoCopyOutline,
  IoShareSocialOutline,
  IoSquareOutline,
} from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { BarreOnglets, Bouton, Ecran, Etiquette, Halo, ONGLETS, Pastille } from '../../evenements/ui/app';
import { Journal, useJournal } from '../langue';
import { CarteForm, Interrupteur, Retour } from '../ui/elements';

/**
 * Formulaire « Nouveau compte rendu » (`app/(tabs)/assembly/form.tsx`) et carte « Aperçu du CR »
 * (`components/MeetingReportCard.tsx`). L'aperçu suit chaque geste, comme dans l'app.
 */

/** Positions d'appui (points, défilement nul). Relevées sur l'écran redessiné. */
export const PT_FORM = {
  date: { x: 195, y: 245 },
  toutCocher: { x: 318, y: 314 },
  /** Centre de la ligne de la personne `i` (ordre de `d.ROSTER`). */
  personne: (i: number) => ({ x: 130, y: 346 + 38 * i }),
  interrupteurPain: { x: 328, y: 806 },
  /** Haut de la carte « Lecture ». */
  lecture: 852,
} as const;

/**
 * Texte du CR (`buildMeetingReport`, modèle § 5.4 du plan), au caractère près, dans la langue de
 * la vidéo (`assemblyLife.report.*` de fr.json / en.json). `chapitres` : déjà mis en forme
 * (`formatChapitres`) ; vide = pas de ligne « Lecture ».
 */
export const texteCR = (
  { app, d }: Journal,
  o: { date: string; presents: readonly string[]; pain: boolean; livre: string | null; chapitres: string; avecNoms: boolean },
) =>
  [
    app.report.header(o.date),
    app.report.unitLine(d.ASSEMBLEE),
    '',
    app.report.attendeeCount(o.presents.length),
    ...(o.avecNoms ? o.presents.map((n) => `* ${n}`) : []),
    '',
    '',
    app.report.done,
    '',
    app.report.breadBreaking(o.pain ? app.report.yes : app.report.no),
    ...(o.livre && o.chapitres ? [app.report.reading(o.livre, o.chapitres)] : []),
  ].join('\n');

/** Carte « Aperçu du CR » : interrupteur, texte mono, Copier / Partager, ligne « copié ». */
export const CarteApercu: React.FC<{
  texte: string;
  haloLignes?: number;
  copie?: number;
  haloCopie?: number;
}> = ({ texte, haloLignes = 0, copie = 0, haloCopie = 0 }) => {
  const { app } = useJournal();
  /** Ligne du texte du CR à éclairer (annotation vidéo) : fraction de pain + lecture. */
  const estLigneCle = (l: string) => app.report.lignesCles.some((debut) => l.startsWith(debut));
  return (
    <CarteForm haut={16}>
      <Etiquette style={{ marginBottom: 10 }}>{app.reportUi.preview}</Etiquette>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, fontSize: 13.5, color: S.ink2 }}>{app.reportUi.includeAttendees}</div>
        <Interrupteur p={1} />
      </div>
      <div style={{ marginTop: 12, padding: 12, borderRadius: R.sm, background: S.paper2, border: `1px solid ${S.hair}` }}>
        {texte.split('\n').map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: P.mono,
              fontSize: 12,
              lineHeight: '18px',
              color: S.ink,
              whiteSpace: 'pre-wrap',
              minHeight: 18,
              background: estLigneCle(l) && haloLignes > 0 ? `rgba(184,106,74,${0.22 * haloLignes})` : undefined,
              boxShadow: estLigneCle(l) && haloLignes > 0 ? `0 0 0 2px rgba(184,106,74,${0.8 * haloLignes})` : undefined,
              borderRadius: 3,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <Bouton
          label={app.reportUi.copy}
          variante="ghost"
          hauteur={46}
          style={{ flex: 1 }}
          icone={<IoCopyOutline size={17} color={S.moss} />}
        />
        <Bouton label={app.reportUi.share} hauteur={46} style={{ flex: 1 }} icone={<IoShareSocialOutline size={17} color={S.white} />} />
      </div>
      {copie > 0.001 ? (
        <div style={{ marginTop: 10, opacity: copie }}>
          <Halo intensite={haloCopie} rayon={8} marge={6} margeY={4} etalement={3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IoCheckmarkCircle size={16} color={S.mossSoft} />
              <div style={{ fontSize: 12.5, color: S.mossSoft }}>{app.reportUi.copied}</div>
            </div>
          </Halo>
        </div>
      ) : null}
    </CarteForm>
  );
};

/** Numéros des chapitres déjà lus par Paris Nord dans le livre en cours (point terre). */
const DEJA_LUS = 12;

export const EcranFormulaire: React.FC<{
  defilement?: number;
  /** Personnes cochées (noms). */
  coches: readonly string[];
  /** Interrupteur « Fraction de pain » (0 → 1). */
  pain: number;
  livreChoisi: boolean;
  /** Apparition de la grille des chapitres (0 → 1). */
  grille?: number;
  chapitres: readonly number[];
  texte: string;
  haloDate?: number;
  haloPresents?: number;
  haloPain?: number;
  haloPoints?: number;
  haloLignes?: number;
  haloEnregistrer?: number;
}> = ({
  defilement = 0,
  coches,
  pain,
  livreChoisi,
  grille = 1,
  chapitres,
  texte,
  haloDate = 0,
  haloPresents = 0,
  haloPain = 0,
  haloPoints = 0,
  haloLignes = 0,
  haloEnregistrer = 0,
}) => {
  const { app, d } = useJournal();
  const tous = coches.length === d.ROSTER.length;
  return (
    <>
      <Ecran defilement={defilement}>
        <Retour />
        <div style={{ marginTop: 8, fontFamily: P.serif, fontSize: 26, lineHeight: '32px', letterSpacing: -0.4 }}>{app.form.titleNew}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '17px' }}>{d.ASSEMBLEE}</div>

        {/* Date de la réunion : préremplie au jour même. */}
        <Halo intensite={haloDate} rayon={22}>
          <CarteForm>
            <Etiquette style={{ marginBottom: 10, lineHeight: '15px' }}>{app.form.date}</Etiquette>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                height: 48,
                boxSizing: 'border-box',
                padding: '0 14px',
                background: S.paper2,
                border: `1px solid ${S.hair}`,
                borderRadius: 14,
              }}
            >
              <IoCalendarOutline size={18} color={S.mossSoft} />
              <div style={{ flex: 1, fontSize: 15, color: S.ink }}>{d.REUNION_DU_JOUR.date}</div>
              <IoChevronDown size={16} color={S.ink3} />
            </div>
          </CarteForm>
        </Halo>

        {/* Présents : membres + dirigeant, ordre alphabétique. */}
        <Halo intensite={haloPresents} rayon={22}>
          <CarteForm>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 18, marginBottom: 6 }}>
              <Etiquette>
                {app.form.attendees} · {coches.length}
              </Etiquette>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: S.moss }}>{tous ? app.form.uncheckAll : app.form.checkAll}</div>
            </div>
            {d.ROSTER.map((p) => {
              const on = coches.includes(p.nom);
              return (
                <div key={p.nom} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38 }}>
                  {on ? <IoCheckbox size={20} color={S.moss} /> : <IoSquareOutline size={20} color={S.ink3} />}
                  <div style={{ flex: 1, fontSize: 14.5, color: S.ink }}>{p.nom}</div>
                  {p.dirigeant ? (
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: S.earthDeep, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {app.form.leaderTag}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </CarteForm>
        </Halo>

        {/* Fraction de pain. */}
        <Halo intensite={haloPain} rayon={22}>
          <CarteForm>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 31 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{app.breadBreaking}</div>
              <Interrupteur p={pain} />
            </div>
          </CarteForm>
        </Halo>

        {/* Lecture : pastilles des livres, puis la grille des chapitres. */}
        <CarteForm>
          <Etiquette style={{ marginBottom: 10, lineHeight: '15px' }}>{app.form.reading}</Etiquette>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Pastille label={app.form.noModule} choisie={!livreChoisi} />
            {d.MODULES.map((m) => (
              <Pastille key={m} label={m} choisie={livreChoisi && m === d.LIVRES.eglise} />
            ))}
          </div>
          {livreChoisi ? (
            <div style={{ opacity: grille }}>
              <Etiquette style={{ marginTop: 16, marginBottom: 10, lineHeight: '15px' }}>{app.form.chapters}</Etiquette>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
                  const on = chapitres.includes(n);
                  const lu = n <= DEJA_LUS;
                  return (
                    <div
                      key={n}
                      style={{
                        width: 44,
                        height: 44,
                        boxSizing: 'border-box',
                        borderRadius: R.sm,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: on ? S.moss : S.mossTint,
                        border: `1px solid ${on ? S.mossDeep : 'transparent'}`,
                        fontFamily: P.mono,
                        fontSize: 14,
                        color: on ? S.white : S.ink2,
                      }}
                    >
                      {n}
                      {lu ? (
                        <div
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            background: on ? S.white : S.earth,
                            boxShadow: haloPoints > 0 ? `0 0 0 ${3 * haloPoints}px rgba(184,106,74,${0.35 * haloPoints})` : undefined,
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <Halo intensite={haloPoints} rayon={8} marge={6} margeY={3} etalement={3}>
                <div style={{ marginTop: 10, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{app.form.alreadyReadHint}</div>
              </Halo>
            </div>
          ) : null}
        </CarteForm>

        <CarteApercu texte={texte} haloLignes={haloLignes} />

        <div style={{ marginTop: 18 }}>
          <Halo intensite={haloEnregistrer} rayon={18}>
            <Bouton label={app.form.save} hauteur={52} />
          </Halo>
        </div>
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} libelles={app.onglets} />
    </>
  );
};
