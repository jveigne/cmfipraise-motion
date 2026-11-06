import React from 'react';
import { useCurrentFrame } from 'remotion';
import { doux } from '../../anim';
import { centreOnglet, ONGLETS } from '../../evenements/ui/app';
import { Fondu } from '../../evenements/plans/commun';
import { useJournal } from '../../journal/langue';
import { EcranVieAssemblee, PT_VIE } from '../../journal/ecrans/VieAssemblee';
import { EcranFormulaire, texteCR } from '../../journal/ecrans/Formulaire';
import { EcranCompteRendu } from '../../journal/ecrans/CompteRendu';
import { EcranJournalPdf, ptJournal } from '../../journal/ecrans/JournalPdf';
import { EcranHierarchie } from '../../journal/ecrans/Hierarchie';
import { formatChapitres } from '../../journal/textes';
import { useEtude } from '../../etude/langue';
import { EcranAccueil, TUILE_ETUDE } from '../../etude/ecrans/Accueil';
import { EcranAccueilDirigeant, EcranAccueilRepondant, EcranVueEnsemble, PT_ACCUEIL_ETUDE } from '../../etude/ecrans/AccueilEtude';
import { EcranSeance, positionsSeance } from '../../etude/ecrans/Seance';
import { EcranResultats, ModalePapier } from '../../etude/ecrans/Resultats';
import type { IdPlan } from '../textes';
import { AvecEtude, AvecJournal, useGuide } from '../langue';
import { copiesMarie, copieRose } from '../donnees';
import { Scene, entre } from '../ui/Mise';
import {
  CartonFin,
  CartonPersonnes,
  CartonRappel,
  CartonSommaire,
  CartonTitre,
  IllustrationLecture,
  IllustrationPapier,
  Intertitre16,
  SalonCadre,
} from '../ui/Cartons';
import {
  CarteActions,
  EcranAccueilRose,
  EcranAccueilSuite,
  EcranArret,
  EcranAvancementGuide,
  EcranBriefing,
  EcranProgressionPartielle,
  EcranRattrapage,
} from '../ecrans/Etude';
import { EcranLectureLien, EcranVieMembre } from '../ecrans/Journal';

/**
 * Les plans de la vidéo « Guide », un composant par plan (images locales au plan). Chaque écran est
 * celui de l'app, redessiné (vidéos « Journal » et « Étude », ou `../ecrans/`) ; les halos et les
 * appuis du doigt sont des annotations vidéo. Défilements relevés sur les captures.
 */

/** Halo qui monte en 12 images à partir de `a`, puis reste. */
const h = (f: number, a: number) => entre(f, [a, a + 12], [0, 1]);

// --------------------------------------------------------------------------------------------
// Partie 1 — le journal

/** Défilements du formulaire (15 personnes dans l'assemblée). */
const DEF = { presents: -110, pain: -382, lecture: -852, apercu: -1590, bouton: -1890 };
const DEF_EN_AIDE = 18;

const useTexteDuJour = (presents: readonly string[], pain: boolean, chapitres: readonly number[]) => {
  const j = useJournal();
  return texteCR(j, {
    date: j.d.DATE_CR,
    presents,
    pain,
    livre: chapitres.length === 0 ? null : j.d.LIVRES.eglise,
    chapitres: formatChapitres(j.app, chapitres),
    avecNoms: true,
  });
};

const Formulaire: React.FC<{
  etat: 'vide' | 'coches' | 'complet';
  defilement: number;
  coches?: readonly string[];
  pain?: number;
  halos?: { date?: number; presents?: number; pain?: number; points?: number; lignes?: number; enregistrer?: number };
}> = ({ etat, defilement, coches, pain, halos = {} }) => {
  const { d } = useJournal();
  const tous = d.ROSTER.map((p) => p.nom);
  const c = coches ?? (etat === 'vide' ? [] : d.PRESENTS_DU_JOUR);
  const chapitres = etat === 'complet' ? [13, 14] : [];
  const p = pain ?? (etat === 'complet' ? 1 : 0);
  const texte = useTexteDuJour(
    tous.filter((n) => c.includes(n)),
    p > 0.5,
    chapitres,
  );
  return (
    <EcranFormulaire
      defilement={defilement}
      coches={c}
      pain={p}
      livreChoisi={etat === 'complet'}
      chapitres={chapitres}
      texte={texte}
      haloDate={halos.date}
      haloPresents={halos.presents}
      haloPain={halos.pain}
      haloPoints={halos.points}
      haloLignes={halos.lignes}
      haloEnregistrer={halos.enregistrer}
    />
  );
};

const J1: React.FC = () => {
  const f = useCurrentFrame();
  const { d } = useJournal();
  const onglet = centreOnglet(ONGLETS.assemblee);
  return (
    <Scene
      id="j1"
      appuis={[
        { ...onglet, a: 16 },
        { ...PT_VIE.nouveauCr, a: 70 },
      ]}
      tel={<EcranVieAssemblee onglet="reunions" reunions={d.REUNIONS_2026} haloOnglet={entre(f, [0, 12, 40, 52], [0, 1, 1, 0])} haloNouveau={h(f, 56)} />}
    />
  );
};

const J2: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="j2" zoom={{ z: 1.25, x: 195, y: 260 }} tel={<Formulaire etat="vide" defilement={0} halos={{ date: h(f, 10) }} />} />;
};

const J3: React.FC = () => {
  const f = useCurrentFrame();
  const { d } = useJournal();
  const tous = d.ROSTER.map((p) => p.nom);
  const [a1, a2] = d.ABSENTS_DU_JOUR;
  const coches = f < 40 ? [] : tous.filter((n) => !(f >= 80 && n === a1) && !(f >= 110 && n === a2));
  const defilement = doux(f, [0, 20], [0, DEF.presents]);
  const y = (nom: string) => 346 + 38 * tous.indexOf(nom) + DEF.presents;
  return (
    <Scene
      id="j3"
      appuis={[
        { x: 318, y: 314 + DEF.presents, a: 40 },
        { x: 130, y: y(a1), a: 80 },
        { x: 130, y: y(a2), a: 110 },
      ]}
      tel={<Formulaire etat="coches" defilement={defilement} coches={coches} halos={{ presents: h(f, 24) }} />}
    />
  );
};

const J4: React.FC = () => {
  const f = useCurrentFrame();
  const defilement = doux(f, [0, 20], [DEF.presents, DEF.pain]);
  const pain = doux(f, [44, 50], [0, 1]);
  return (
    <Scene
      id="j4"
      zoom={{ z: 1.2, x: 195, y: 958 + DEF.pain }}
      appuis={[{ x: 328, y: 958 + DEF.pain, a: 44 }]}
      tel={<Formulaire etat="coches" defilement={defilement} pain={pain} halos={{ pain: h(f, 24) }} />}
    />
  );
};

const J5: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  const defilement = doux(f, [0, 20], [DEF.pain, DEF.lecture]);
  return (
    <Scene
      id="j5"
      zoom={{ z: 1.15, x: 195, y: 470 }}
      tel={<Formulaire etat="complet" defilement={defilement - (langue === 'en' ? 0 : 0)} halos={{ points: h(f, 30) }} />}
    />
  );
};

const J6: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  const da = langue === 'en' ? -DEF_EN_AIDE : 0;
  const defilement = doux(f, [0, 20], [DEF.lecture, DEF.apercu + da]);
  return <Scene id="j6" zoom={{ z: 1.15, x: 195, y: 470 }} tel={<Formulaire etat="complet" defilement={defilement} halos={{ lignes: h(f, 26) }} />} />;
};

const J7: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  const da = langue === 'en' ? -DEF_EN_AIDE : 0;
  const coupe = 70;
  return (
    <Scene
      id="j7"
      appuis={f < coupe ? [{ x: 195, y: 740, a: 30 }] : [{ x: 103, y: 1407 + DEF_CR, a: 100 }]}
      tel={
        <Fondu
          p={entre(f, [coupe - 6, coupe], [0, 1])}
          avant={<Formulaire etat="complet" defilement={doux(f, [0, 20], [DEF.apercu + da, DEF.bouton + da])} halos={{ enregistrer: h(f, 16) }} />}
          apres={<EcranCompteRendu defilement={DEF_CR} copie={entre(f, [104, 110], [0, 1])} haloCopie={h(f, 112)} />}
        />
      }
    />
  );
};
/** Compte rendu enregistré défilé jusqu'à « Copier » (13 présents). */
const DEF_CR = -760;

const J8: React.FC = () => {
  const f = useCurrentFrame();
  const { d } = useJournal();
  return (
    <Scene
      id="j8"
      tel={
        <EcranVieAssemblee
          onglet="reunions"
          reunions={[d.REUNION_DU_JOUR, ...d.REUNIONS_2026]}
          entreePremiere={doux(f, [8, 22], [0, 1])}
          haloPremiere={entre(f, [22, 34], [0, 1])}
        />
      }
    />
  );
};

const J9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      id="j9"
      appuis={[{ ...PT_VIE.segmentAvancement, a: 10 }]}
      tel={<EcranVieAssemblee onglet="avancement" remplissage={doux(f, [20, 50], [0, 1])} haloAvancement={h(f, 50)} haloSegmentAvancement={entre(f, [0, 8, 20, 30], [0, 1, 1, 0])} />}
    />
  );
};

const J10: React.FC = () => {
  const f = useCurrentFrame();
  const j = useJournal();
  const pt = ptJournal(j.langue);
  return (
    <Scene
      id="j10"
      appuis={[{ ...pt.generer, a: 96 }]}
      tel={
        <EcranJournalPdf
          periodicite={0}
          periode={j.d.PERIODE_MOIS}
          suivantInactif
          compte={j.app.journal.reportCount(3)}
          haloPastilles={entre(f, [10, 22, 60, 70], [0, 1, 1, 0])}
          haloGenerer={h(f, 76)}
        />
      }
    />
  );
};

const J11: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="j11" tel={<EcranVieMembre onglet="reunions" haloPresence={h(f, 24)} />} />;
};

const J12: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="j12" appuis={[{ ...PT_VIE.segmentAvancement, a: 10 }]} tel={<EcranVieMembre onglet="avancement" haloMine={h(f, 26)} />} />;
};

const J13: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="j13" zoom={{ z: 1.18, x: 195, y: 470 }} tel={<EcranHierarchie haloCases={entre(f, [10, 22, 80, 92], [0, 1, 1, 0])} haloAlerte={h(f, 96)} />} />;
};

// --------------------------------------------------------------------------------------------
// Partie 2 — le Message de Bertoua

const E2: React.FC = () => {
  const f = useCurrentFrame();
  const { app, d } = useEtude();
  return (
    <Scene
      id="e2"
      appuis={[{ ...TUILE_ETUDE, a: 120 }]}
      tel={<EcranAccueil date={app.dateSamuel} prenom={d.PERSONNES.samuel.prenom} initiales={d.PERSONNES.samuel.initiales} dirigeant haloTuile={h(f, 16)} />}
    />
  );
};

const E3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      id="e3"
      appuis={[
        { ...PT_ACCUEIL_ETUDE.unite, a: 14 },
        { ...PT_ACCUEIL_ETUDE.commencer1, a: 100 },
      ]}
      tel={<EcranAccueilDirigeant ouverture={doux(f, [16, 32], [0, 1])} haloLecon1={h(f, 50)} />}
    />
  );
};

const E4: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="e4" tel={<SousBriefing f={f} depart="1" defilement={0} haloNotes={h(f, 20)} />} />;
};

/** Feuille « À lire avant la leçon » posée sur l'accueil de l'étude (leçon 1 dépliée). */
const SousBriefing: React.FC<{ f: number; depart: string; defilement: number; haloNotes?: number; haloPlage?: number; couvertes?: string | null; suite?: boolean }> = ({
  f,
  depart,
  defilement,
  haloNotes,
  haloPlage,
  couvertes,
  suite,
}) => (
  <>
    {suite ? <EcranAccueilSuite /> : <EcranAccueilDirigeant ouverture={1} />}
    <div style={{ position: 'absolute', inset: 0, opacity: entre(f, [0, 8], [0, 1]) }}>
      <EcranBriefing depart={depart} defilement={defilement} haloNotes={haloNotes} haloPlage={haloPlage} couvertes={couvertes} />
    </div>
  </>
);

const E5: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="e5" tel={<SousBriefing f={8} depart="1" defilement={doux(f, [6, 26], [0, -150])} haloPlage={h(f, 30)} />} />;
};

const E6: React.FC = () => {
  const f = useCurrentFrame();
  const pos = positionsSeance(useEtude().d.QUESTIONS, { statut: 'REPONSES_OUVERTES', dirigeant: true });
  return (
    <Scene
      id="e6"
      tel={
        <Fondu
          p={entre(f, [14, 20], [0, 1])}
          avant={<SousBriefing f={8} depart="1" defilement={-150} />}
          apres={<EcranSeance statut="REPONSES_OUVERTES" dirigeant repondants={0} halos={{ pastille: h(f, 30) }} />}
        />
      }
      appuis={[{ x: 195, y: 702, a: 8 }]}
      zoom={{ z: 1.1, x: 195, y: pos.hautPanneau }}
    />
  );
};

const E1: React.FC = () => <Scene id="e1" gauche={<IllustrationLecture />} />;

const E7: React.FC = () => {
  const f = useCurrentFrame();
  const { app, d } = useEtude();
  const coupe = 80;
  return (
    <Scene
      id="e7"
      appuis={f < coupe ? [{ ...TUILE_ETUDE, a: 60 }] : [{ ...PT_ACCUEIL_ETUDE.repondre, a: 120 }]}
      tel={
        <Fondu
          p={entre(f, [coupe - 6, coupe], [0, 1])}
          avant={<EcranAccueil date={app.dateSamuel} prenom={d.PERSONNES.marie.prenom} initiales={d.PERSONNES.marie.initiales} live={doux(f, [6, 16], [0, 1])} haloLive={h(f, 18)} />}
          apres={<EcranAccueilRepondant halo={h(f, 96)} />}
        />
      }
    />
  );
};

const E8: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  const c = copiesMarie(langue).reponses;
  return (
    <Scene
      id="e8"
      tel={<EcranSeance statut="REPONSES_OUVERTES" copie={c} repondues={10} enregistrement="saved" defilement={doux(f, [20, 200], [0, -1500])} />}
    />
  );
};

const E9: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  const c = copiesMarie(langue).reponses;
  const horsLigne = doux(f, [60, 76], [0, 1]);
  return (
    <Scene
      id="e9"
      zoom={{ z: 1.2, x: 195, y: 240 }}
      tel={
        <EcranSeance
          statut="REPONSES_OUVERTES"
          copie={c}
          repondues={10}
          enregistrement={f < 60 ? 'saved' : 'idle'}
          horsLigne={horsLigne}
          halos={{ compteur: entre(f, [8, 20, 50, 60], [0, 1, 1, 0]), bandeau: h(f, 80) }}
        />
      }
    />
  );
};

const E10: React.FC = () => <Scene id="e10" gauche={<IllustrationPapier />} />;

const E11: React.FC = () => {
  const f = useCurrentFrame();
  const { d } = useEtude();
  const pos = positionsSeance(d.QUESTIONS, { statut: 'REPONSES_OUVERTES', dirigeant: true });
  return (
    <Scene
      id="e11"
      zoom={{ z: 1.2, x: 195, y: pos.hautPanneau + 80 }}
      appuis={[{ ...pos.passerCorrection, a: 110 }]}
      tel={<EcranSeance statut="REPONSES_OUVERTES" dirigeant repondants={d.REPONDANTS} halos={{ stat: h(f, 16) }} />}
    />
  );
};

const E12: React.FC = () => {
  const f = useCurrentFrame();
  const choix = f < 70 ? '31' : '11';
  return (
    <Scene
      id="e12"
      tel={
        <>
          <EcranSeance statut="REPONSES_OUVERTES" dirigeant repondants={useEtude().d.REPONDANTS} />
          <div style={{ position: 'absolute', inset: 0, opacity: entre(f, [0, 8], [0, 1]) }}>
            <EcranArret choix={choix} haloPied={h(f, 84)} />
          </div>
        </>
      }
    />
  );
};

/** Marie en correction (plage 1 à 11) : défilement jusqu'à la question 11. */
const useMarieCorrection = () => {
  const { langue } = useGuide();
  const { d } = useEtude();
  const c = copiesMarie(langue).correction;
  const pos = positionsSeance(d.QUESTIONS, { statut: 'CORRECTION', copie: c });
  return { c, pos };
};

const SeanceMarieCorrection: React.FC<{ f: number; cible: string; elements: string[]; appuiAvis?: boolean }> = ({ f, cible, elements, appuiAvis }) => {
  const { c, pos } = useMarieCorrection();
  const bloc = pos.liste?.blocs[cible];
  const y = bloc ? pos.hautListe + bloc.y : 0;
  const fin = pos.liste ? -(pos.hautListe + pos.liste.hauteur + 30 - 844) : 0;
  const defilement = doux(f, [10, 30], [0, Math.min(0, Math.max(fin, 300 - y))]);
  const halos = Object.fromEntries(elements.map((e) => [`${cible}:${e}`, h(f, 34)]));
  return (
    <EcranSeance
      statut="CORRECTION"
      copie={c}
      ecritesRestantes={3}
      defilement={defilement}
      halos={halos}
      appuiAvis={appuiAvis ? { id: cible, avis: 'JUSTE', p: entre(f, [90, 96], [0, 1]) } : null}
    />
  );
};

const E13: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e13" tel={<SeanceMarieCorrection f={f} cible="q11" elements={['faux', 'attendu']} />} />
    </AvecEtude>
  );
};

const E14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <E14Coeur f={f} />
    </AvecEtude>
  );
};
const E14Coeur: React.FC<{ f: number }> = ({ f }) => {
  const { pos } = useMarieCorrection();
  const bloc = pos.liste!.blocs.q1;
  const y = pos.hautListe + bloc.y;
  const def = Math.min(0, 300 - y);
  return (
    <Scene
      id="e14"
      zoom={{ z: 1.15, x: 195, y: y + def + bloc.h / 2 }}
      appuis={[{ x: bloc.x['avis:JUSTE'], y: y + def + bloc.el.avis - bloc.y, a: 90 }]}
      tel={<SeanceMarieCorrection f={f} cible="q1" elements={['donnee', 'manuel']} appuiAvis />}
    />
  );
};

const E15: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e15" tel={<SeanceMarieCorrection f={f} cible="q10" elements={['masque']} />} />
    </AvecEtude>
  );
};

const E16: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <E16Coeur f={f} />
    </AvecEtude>
  );
};
const E16Coeur: React.FC<{ f: number }> = ({ f }) => {
  const { d } = useEtude();
  const pos = positionsSeance(d.QUESTIONS, { statut: 'CORRECTION', dirigeant: true });
  return (
    <Scene
      id="e16"
      zoom={{ z: 1.2, x: 195, y: pos.hautPanneau + 70 }}
      appuis={[{ ...pos.terminer, a: 60 }]}
      tel={<EcranSeance statut="CORRECTION" dirigeant repondants={d.REPONDANTS} avisRestants={0} halos={{ stat: h(f, 12) }} />}
    />
  );
};

const E17: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  return (
    <AvecEtude variante="plage1">
      <Scene
        id="e17"
        zoom={{ z: 1.2, x: 195, y: 330 }}
        tel={<EcranSeance statut="TERMINEE" copie={copiesMarie(langue).terminee} note={8.5} apparitionNote={doux(f, [10, 24], [0, 1])} halos={{ noteFinale: h(f, 28) }} plage={undefined} />}
      />
    </AvecEtude>
  );
};

const E18: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  return (
    <AvecEtude variante="plage1">
      <Scene
        id="e18"
        tel={
          <EcranSeance
            statut="TERMINEE"
            copie={copiesMarie(langue).terminee}
            note={8.5}
            defilement={doux(f, [6, 26], [0, -200])}
            apresNote={<CarteActions halo={h(f, 30)} />}
          />
        }
      />
    </AvecEtude>
  );
};

const E19: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <E19Coeur f={f} />
    </AvecEtude>
  );
};
const E19Coeur: React.FC<{ f: number }> = ({ f }) => {
  const { d } = useEtude();
  const { app } = useGuide();
  const coupe = 130;
  const p = entre(f, [0, 8, coupe - 8, coupe], [1, 1, 1, 0]);
  const note = f < 40 ? '' : d.NOTES_PAPIER.paul;
  return (
    <Scene
      id="e19"
      tel={
        <>
          <EcranResultats
            copies={f < coupe ? d.COPIES_AVEC_PAUL.filter((c) => !c.papier) : d.COPIES_AVEC_PAPIER}
            plage={app.range('1', '11')}
            halos={f < coupe ? {} : { [d.PERSONNES.paul.nom]: h(f, coupe + 4), [d.PERSONNES.helene.nom]: h(f, coupe + 4) }}
            defilement={f < coupe ? 0 : -220}
          />
          <ModalePapier liste={d.SANS_COPIE} p={p} membre={d.PERSONNES.paul.nom} note={note} curseurNote={f >= 30 && f < 70} />
        </>
      }
    />
  );
};

const E20: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e20" zoom={{ z: 1.15, x: 195, y: 330 }} tel={<EcranProgressionPartielle halo={h(f, 16)} />} />
    </AvecEtude>
  );
};

const E21: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e21" appuis={[{ x: 330, y: 290, a: 110 }]} tel={<EcranAccueilRose halo={h(f, 20)} />} />
    </AvecEtude>
  );
};

const E22: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e22" tel={<EcranRattrapage copie={copieRose(langue)} defilement={doux(f, [10, 40], [0, -1400])} haloEnvoi={h(f, 46)} />} />
    </AvecEtude>
  );
};

const E23: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  return (
    <AvecEtude variante="plage1">
      <Scene id="e23" zoom={{ z: 1.15, x: 195, y: 300 }} tel={<EcranRattrapage copie={copieRose(langue)} haloAvis={h(f, 16)} />} />
    </AvecEtude>
  );
};

const E24: React.FC = () => {
  const f = useCurrentFrame();
  const { app } = useGuide();
  const coupe = 100;
  return (
    <AvecEtude>
      <Scene
        id="e24"
        appuis={f < coupe ? [{ x: 322, y: 395, a: 60 }] : []}
        tel={
          f < coupe ? (
            <EcranAccueilSuite haloLecon={h(f, 14)} />
          ) : (
            <SousBriefing f={f - coupe} suite depart="12" couvertes={app.range('1', '11')} defilement={-230} haloPlage={h(f, coupe + 14)} />
          )
        }
      />
    </AvecEtude>
  );
};

const E25: React.FC = () => (
  <AvecEtude variante="plage2">
    <E25Coeur />
  </AvecEtude>
);
/** Dans le contexte de l'étude : `useEtude()` doit donner la langue de la vidéo (« Lesson 1 »). */
const E25Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { langue, app } = useGuide();
  const { app: A } = useEtude();
  return (
    <Scene
      id="e25"
      tel={
        <EcranSeance
          statut="REPONSES_OUVERTES"
          copie={copiesMarie(langue).reponses}
          repondues={3}
          plage={[A.lesson(1), app.range('12', '31')].join(' · ')}
          halos={{ compteur: h(f, 14), 'q13:numero': h(f, 30), 'q31:numero': h(f, 30) }}
        />
      }
    />
  );
};

const E26: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="e26" tel={<EcranAvancementGuide haloCarte={entre(f, [10, 22, 60, 70], [0, 1, 1, 0])} haloMembres={h(f, 70)} defilement={doux(f, [70, 100], [0, -160])} />} />;
};

const E27: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene id="e27" zoom={{ z: 1.15, x: 195, y: 330 }} tel={<EcranVueEnsemble haloOuest={h(f, 16)} />} />;
};

// --------------------------------------------------------------------------------------------

const L1: React.FC = () => {
  const f = useCurrentFrame();
  const { langue } = useGuide();
  return (
    <Scene
      id="l1"
      tel={<EcranLectureLien defilement={doux(f, [0, 24, 96, 120], [-700, -860, -860, -1420])} haloIndice={h(f, 30)} haloLignes={entre(f, [124, 136], [0, 1])} />}
    />
  );
};

// --------------------------------------------------------------------------------------------

const I2: React.FC = () => <Scene id="i2" gauche={<SalonCadre />} />;
const I3: React.FC = () => <CartonPersonnes id="i3" />;

/** Chaque plan, enveloppé du contexte de l'assemblée de la vidéo. */
const avecJournal = (C: React.FC): React.FC => () => (
  <AvecJournal>
    <C />
  </AvecJournal>
);
const avecEtude = (C: React.FC): React.FC => () => (
  <AvecEtude>
    <C />
  </AvecEtude>
);

export const PLANS: Record<IdPlan, React.FC> = {
  i1: CartonTitre,
  i2: I2,
  i3: I3,
  i4: CartonSommaire,
  t1: () => <Intertitre16 id="t1" />,
  j1: avecJournal(J1),
  j2: avecJournal(J2),
  j3: avecJournal(J3),
  j4: avecJournal(J4),
  j5: avecJournal(J5),
  j6: avecJournal(J6),
  j7: avecJournal(J7),
  j8: avecJournal(J8),
  j9: avecJournal(J9),
  j10: avecJournal(J10),
  j11: avecJournal(J11),
  j12: avecJournal(J12),
  j13: avecJournal(J13),
  t2: () => <Intertitre16 id="t2" />,
  e2: avecEtude(E2),
  e3: avecEtude(E3),
  e4: avecEtude(E4),
  e5: avecEtude(E5),
  e6: avecEtude(E6),
  e1: E1,
  e7: avecEtude(E7),
  e8: avecEtude(E8),
  e9: avecEtude(E9),
  e10: E10,
  e11: avecEtude(E11),
  e12: avecEtude(E12),
  e13: E13,
  e14: E14,
  e15: E15,
  e16: E16,
  e17: E17,
  e18: E18,
  e19: E19,
  e20: E20,
  e21: E21,
  e22: E22,
  e23: E23,
  e24: E24,
  e25: E25,
  e26: avecEtude(E26),
  e27: avecEtude(E27),
  t3: () => <Intertitre16 id="t3" />,
  l1: avecJournal(L1),
  c1: () => <CartonRappel id="c1" />,
  c2: () => <CartonRappel id="c2" />,
  c3: CartonFin,
};
