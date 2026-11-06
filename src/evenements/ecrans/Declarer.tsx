import React from 'react';
import {
  IoAdd,
  IoCalendarOutline,
  IoCheckmark,
  IoChevronDown,
  IoClose,
  IoCloudUploadOutline,
  IoListOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import { APP } from '../textes';
import { ASSEMBLEE, TYPES } from '../donnees';
import { P, S } from '../theme';
import { Bandeau, Bouton, Carte, Champ, ChampPredicateur, ChampsCompteurs, Ecran, Etiquette, Halo, Intro, Pastille, Surtitre, Titre } from '../ui/app';

/**
 * « Déclarer une action » (`app/events/declare.tsx`), dans la feuille modale. Ordre des champs
 * de l'app : type, date (préremplie à aujourd'hui), prédicateur (type évangélique, D-EVT-16), lieu,
 * compteurs (`EventCounterFields` : participants et invités — D-EVT-17 —, puis conversions /
 * restaurations / baptêmes pour un type évangélique — D-EVT-15),
 * note, bandeau de rattachement — sans sélecteur pour un membre, qui n'a qu'une assemblée —, puis « Enregistrer »,
 * grisé tant qu'aucun type n'est choisi (RG-ACT-03).
 */
export const EcranDeclarer: React.FC<{
  type: string | null;
  defilement?: number;
  haloDate?: number;
  haloBandeau?: number;
}> = ({ type, defilement = 0, haloDate = 0, haloBandeau = 0 }) => (
  <Ecran haut={16} defilement={defilement}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: S.moss, fontSize: 13.5, fontWeight: 600 }}>
        <IoListOutline size={16} />
        {APP.mine.title}
      </div>
      <IoClose size={26} color={S.ink2} />
    </div>
    <Surtitre>{APP.declare.kicker}</Surtitre>
    <Titre taille={30}>{APP.declare.title}</Titre>
    <Intro largeur={320}>{APP.declare.intro}</Intro>

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.declare.type}</Etiquette>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TYPES.map((t) => (
          <Pastille key={t} label={t} choisie={t === type} />
        ))}
      </div>
    </div>

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.declare.date}</Etiquette>
      <Halo intensite={haloDate} rayon={22}>
        <Carte style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <IoCalendarOutline size={20} color={S.mossSoft} />
          <div style={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: '20px' }}>14 octobre 2026</div>
          <div style={{ fontSize: 12, color: S.earthDeep, fontWeight: 700 }}>{APP.today}</div>
          <IoChevronDown size={16} color={S.ink3} />
        </Carte>
      </Halo>
    </div>

    {/* D-EVT-16 : le prédicateur apparaît dès qu'un type évangélique est choisi (tous ceux du
        catalogue initial), juste après la date. Élise le laisse vide : le type et la date suffisent. */}
    {type != null ? <ChampPredicateur /> : null}

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.declare.place}</Etiquette>
      <Champ indication={APP.declare.placePlaceholder} />
    </div>

    {/* D-EVT-15 / D-EVT-17 : « Participants » et « Invités » seuls tant qu'aucun type n'est choisi ;
        les sept types du catalogue initial sont évangéliques, les trois compteurs apparaissent dès le choix. */}
    <ChampsCompteurs evangelique={type != null} />

    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Etiquette>{APP.declare.note}</Etiquette>
        <div style={{ fontFamily: P.mono, fontSize: 11, color: S.ink3 }}>0/280</div>
      </div>
      <Champ indication={APP.declare.notePlaceholder} hauteur={72} />
    </div>

    <Halo intensite={haloBandeau} rayon={16}>
      <Bandeau icone={<IoLocationOutline size={16} color={S.mossSoft} />}>
        {APP.declare.recordedFor(APP.scopeOf.UNIT(ASSEMBLEE))}
      </Bandeau>
    </Halo>

    <Bouton
      label={APP.declare.submit}
      hauteur={58}
      inactif={type ? 0 : 1}
      style={{ marginTop: 18 }}
      icone={<IoCheckmark size={20} />}
    />
    <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: S.ink3, lineHeight: '18px', padding: '0 24px' }}>
      {APP.declare.footnote}
    </div>
  </Ecran>
);

/**
 * Confirmation (`SuccessScreen` de declare.tsx) : bulle mousse et coche si le serveur a
 * enregistré ; bulle terre et nuage montant si l'action est gardée dans la file hors-ligne.
 */
export const EcranConfirmation: React.FC<{ horsLigne?: boolean; haloTexte?: number }> = ({
  horsLigne = false,
  haloTexte = 0,
}) => (
  <Ecran haut={40}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 39,
          background: horsLigne ? S.earthDeep : S.moss,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {horsLigne ? <IoCloudUploadOutline size={36} color={S.white} /> : <IoCheckmark size={36} color={S.white} />}
      </div>
      <div style={{ fontFamily: P.serif, fontSize: 26, marginTop: 18, textAlign: 'center' }}>{APP.declare.successTitle}</div>
      {/* Halo serré verticalement : le titre est à 6 pt au-dessus du texte. */}
      <Halo intensite={haloTexte} rayon={10} marge={8} margeY={0} etalement={2}>
        <div style={{ fontSize: 13, color: S.ink3, marginTop: 6, textAlign: 'center', maxWidth: 300, lineHeight: '19px' }}>
          {horsLigne ? APP.declare.successQueued : APP.declare.successFor(ASSEMBLEE)}
        </div>
      </Halo>
    </div>
    <Bouton label={APP.declare.another} variante="ghost" style={{ marginTop: 28 }} icone={<IoAdd size={18} />} />
    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
      <Bouton label={APP.mine.title} variante="soft" style={{ flex: 1 }} />
      <Bouton label={APP.declare.finish} style={{ flex: 1 }} />
    </div>
  </Ecran>
);

/** Bouton « Mes actions » de la confirmation, en points (appui du doigt, P3). */
export const BOUTON_MES_ACTIONS = { x: 107, y: 64 + 40 + 78 + 18 + 32 + 6 + 19 + 28 + 54 + 10 + 27 };
