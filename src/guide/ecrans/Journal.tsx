import React from 'react';
import { IoCalendarOutline, IoCheckbox, IoChevronDown, IoChevronForward, IoSquareOutline } from 'react-icons/io5';
import { P, R, S } from '../../evenements/theme';
import { BarreOnglets, Carte, Ecran, Etiquette, Halo, ONGLETS, Pastille } from '../../evenements/ui/app';
import { useJournal } from '../../journal/langue';
import { CarteApercu, texteCR } from '../../journal/ecrans/Formulaire';
import { BlocAvancement, CarteForm, Interrupteur, LignePeriode, Retour, Segments, sousTitreReunion } from '../../journal/ui/elements';
import { formatChapitres } from '../../journal/textes';
import { useGuide } from '../langue';
import { vueMembre } from '../donnees';
import { DONNEES as DONNEES_ETUDE } from '../../etude/donnees';

/**
 * Écrans de la Vie d'assemblée que la vidéo « Journal » ne montre pas, redessinés d'après
 * shephr-app/mobile/app/(tabs)/assembly : la vue du **membre** (D-ASM-17 — lecture seule, présence
 * sur chaque réunion, « Mon avancement », pas de « Journal PDF ») et la carte « Lecture » d'un
 * compte rendu saisi le jour d'une séance d'étude (D-ETU-30 : chapitre pré-coché, indice).
 */

/** En-tête de l'onglet (titre, sous-titre, assemblée · ville, segments). */
const Tete: React.FC<{ onglet: 0 | 1 }> = ({ onglet }) => {
  const { app, d } = useJournal();
  return (
    <>
      <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{app.title}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '19px' }}>{app.subtitle}</div>
      <div style={{ marginTop: 16, fontFamily: P.serif, fontSize: 19, lineHeight: '24px' }}>
        {d.ASSEMBLEE}
        <span style={{ fontFamily: P.sans, fontSize: 13, color: S.ink3 }}> · {d.VILLE}</span>
      </div>
      <Segments actif={onglet} />
    </>
  );
};

/** Vue de Marie, membre : réunions avec « Présent » / « Absent », ou « Mon avancement ». */
export const EcranVieMembre: React.FC<{ onglet: 'reunions' | 'avancement'; haloPresence?: number; haloMine?: number; defilement?: number }> = ({
  onglet,
  haloPresence = 0,
  haloMine = 0,
  defilement = 0,
}) => {
  const { app } = useJournal();
  const { app: g, langue } = useGuide();
  const m = vueMembre(langue);
  const indice: React.CSSProperties = { fontSize: 12.5, color: S.ink3, marginTop: 14, lineHeight: '18px' };
  const titreSection: React.CSSProperties = { fontFamily: P.serif, fontSize: 18, lineHeight: '23px', color: S.ink, marginTop: 24 };
  return (
    <>
      <Ecran defilement={defilement}>
        <Tete onglet={onglet === 'reunions' ? 0 : 1} />
        {onglet === 'reunions' ? (
          <>
            <LignePeriode libelle={2026} suivantInactif largeur={56} />
            <div style={indice}>{g.memberHint}</div>
            <Carte style={{ marginTop: 14 }}>
              {m.reunions.map((r, i) => (
                <div
                  key={r.date}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderBottom: i < m.reunions.length - 1 ? `1px solid ${S.hair}` : undefined,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink, lineHeight: '19px' }}>{r.date}</div>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: S.ink3, lineHeight: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {sousTitreReunion(app, r)}
                    </div>
                  </div>
                  <Halo intensite={haloPresence} rayon={99} marge={3} margeY={2} etalement={3}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 99,
                        color: r.present ? S.moss : S.ink3,
                        background: r.present ? S.mossTint2 : S.hair,
                      }}
                    >
                      {r.present ? g.present : g.absent}
                    </div>
                  </Halo>
                  <IoChevronForward size={18} color={S.ink3} />
                </div>
              ))}
            </Carte>
          </>
        ) : (
          <>
            <Halo intensite={haloMine} rayon={R.lg} marge={8}>
              <div>
                <div style={{ ...titreSection, marginTop: 16 }}>{g.mineTitle}</div>
                <div style={indice}>{g.mineSub(m.presences)}</div>
                <Carte style={{ marginTop: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {m.avancement.map((a) => (
                    <BlocAvancement key={a.livre} {...a} />
                  ))}
                </Carte>
              </div>
            </Halo>
            <div style={titreSection}>{g.assemblyTitle}</div>
            <AvancementAssemblee />
          </>
        )}
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} libelles={app.onglets} />
    </>
  );
};

const AvancementAssemblee: React.FC = () => {
  const { d } = useJournal();
  return (
    <Carte style={{ marginTop: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {d.AVANCEMENT.map((a) => (
        <BlocAvancement key={a.livre} {...a} />
      ))}
    </Carte>
  );
};

/**
 * Nouveau compte rendu du dimanche 25 octobre (jour de la séance d'étude) : date, présents,
 * fraction de pain, puis la carte « Lecture » — le livre de l'unité d'étude choisi, la leçon 1
 * pré-cochée (D-ETU-30), l'indice — et l'aperçu du CR qui la reprend.
 */
export const EcranLectureLien: React.FC<{ defilement?: number; haloIndice?: number; haloLignes?: number }> = ({ defilement = 0, haloIndice = 0, haloLignes = 0 }) => {
  const j = useJournal();
  const { app, d } = j;
  const { app: g, langue } = useGuide();
  const livreEtude = DONNEES_ETUDE[langue]!.UNITE.livre;
  const date = langue === 'fr' ? '25 octobre 2026' : '25 October 2026';
  const texte = texteCR(j, { date: '25/10/2026', presents: d.PRESENTS_DU_JOUR, pain: true, livre: livreEtude, chapitres: formatChapitres(app, [1]), avecNoms: true });
  return (
    <>
      <Ecran defilement={defilement}>
        <Retour />
        <div style={{ marginTop: 8, fontFamily: P.serif, fontSize: 26, lineHeight: '32px', letterSpacing: -0.4 }}>{app.form.titleNew}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: S.ink3, lineHeight: '17px' }}>{d.ASSEMBLEE}</div>
        <CarteForm>
          <Etiquette style={{ marginBottom: 10, lineHeight: '15px' }}>{app.form.date}</Etiquette>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, boxSizing: 'border-box', padding: '0 14px', background: S.paper2, border: `1px solid ${S.hair}`, borderRadius: 14 }}>
            <IoCalendarOutline size={18} color={S.mossSoft} />
            <div style={{ flex: 1, fontSize: 15, color: S.ink }}>{date}</div>
            <IoChevronDown size={16} color={S.ink3} />
          </div>
        </CarteForm>
        <CarteForm>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 18, marginBottom: 6 }}>
            <Etiquette>
              {app.form.attendees} · {d.PRESENTS_DU_JOUR.length}
            </Etiquette>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: S.moss }}>{app.form.checkAll}</div>
          </div>
          {d.ROSTER.map((p) => {
            const on = d.PRESENTS_DU_JOUR.includes(p.nom);
            return (
              <div key={p.nom} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38 }}>
                {on ? <IoCheckbox size={20} color={S.moss} /> : <IoSquareOutline size={20} color={S.ink3} />}
                <div style={{ flex: 1, fontSize: 14.5, color: S.ink }}>{p.nom}</div>
                {p.dirigeant ? <div style={{ fontSize: 10.5, fontWeight: 700, color: S.earthDeep, textTransform: 'uppercase', letterSpacing: 0.5 }}>{app.form.leaderTag}</div> : null}
              </div>
            );
          })}
        </CarteForm>
        <CarteForm>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 31 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{app.breadBreaking}</div>
            <Interrupteur p={1} />
          </div>
        </CarteForm>
        <CarteForm>
          <Etiquette style={{ marginBottom: 10, lineHeight: '15px' }}>{app.form.reading}</Etiquette>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Pastille label={app.form.noModule} />
            {[...d.MODULES, livreEtude].map((m) => (
              <Pastille key={m} label={m} choisie={m === livreEtude} />
            ))}
          </div>
          <Etiquette style={{ marginTop: 16, marginBottom: 10, lineHeight: '15px' }}>{app.form.chapters}</Etiquette>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const on = n === 1;
              return (
                <div
                  key={n}
                  style={{
                    width: 44,
                    height: 44,
                    boxSizing: 'border-box',
                    borderRadius: R.sm,
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
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{app.form.alreadyReadHint}</div>
          <div style={{ marginTop: 6 }}>
            <Halo intensite={haloIndice} rayon={8} marge={6} margeY={4} etalement={3}>
              <div style={{ fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{g.studySuggestionHint}</div>
            </Halo>
          </div>
        </CarteForm>
        <CarteApercu texte={texte} haloLignes={haloLignes} />
      </Ecran>
      <BarreOnglets actif={ONGLETS.assemblee} libelles={app.onglets} />
    </>
  );
};
