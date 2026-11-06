import React from 'react';
import { IoCheckmarkCircleOutline, IoCheckmarkDone, IoChevronBack, IoMicOutline } from 'react-icons/io5';
import { APP } from '../textes';
import { P, S } from '../theme';
import { Bouton, Carte, Champ, ChampPredicateur, ChampsCompteurs, CleCompteur, Ecran, Etiquette, Halo, LigneDetail, Surtitre, Titre } from '../ui/app';

/** Valeurs de la carte de détail, dans l'ordre de l'app. */
export interface DetailEvt {
  type: string;
  titre?: string;
  date: string;
  /** « Paris Nord · Assemblée », « Paris · Ville ». */
  rattachement: string;
  lieu?: string;
  participants?: number;
  /** D-EVT-17 : invités, inclus dans les participants (ligne « Invités », tout type). */
  invites?: number;
  /** D-EVT-16 : prédicateur, mis en évidence sous les pastilles quand il est renseigné. */
  predicateur?: string;
  /** D-EVT-15 : lignes affichées pour un type évangélique (tous ceux de la vidéo). */
  conversions?: number;
  restaurations?: number;
  baptemes?: number;
  auteur: string;
}

/**
 * Détail d'un évènement (`app/events/[id].tsx`) : surtitre, type, intitulé, pastilles de
 * statut, prédicateur en évidence (D-EVT-16 : carte teintée, micro mousse, nom en Fraunces 18 —
 * seulement s'il est renseigné), confirmation de la dernière opération (`flash`), carte de détail
 * (dont « Invités » après « Participants », D-EVT-17), phrase de comptage,
 * puis les gestes permis par le serveur (`canEdit`, `canFlag`) — passés par `boutons`.
 */
export const EcranDetail: React.FC<{
  evt: DetailEvt;
  pastilles: React.ReactNode;
  flash?: string;
  /** 0 → 1 : apparition de la confirmation. */
  flashP?: number;
  indication: React.ReactNode;
  boutons: React.ReactNode;
  haloPastilles?: number;
  haloIndication?: number;
  /** Halo sur la ligne « Rattachement » (P9 : le niveau où le dirigeant a programmé). */
  haloRattachement?: number;
  /** Halo sur la carte du prédicateur (D-EVT-16) et sur les lignes « Participants » / « Invités ». */
  haloPredicateur?: number;
  haloInvites?: number;
  /** Défilement (points, négatif = vers le bas) : depuis D-EVT-15, la carte a deux lignes de plus. */
  defilement?: number;
}> = ({
  evt,
  pastilles,
  flash,
  flashP = 1,
  indication,
  boutons,
  haloPastilles = 0,
  haloIndication = 0,
  haloRattachement = 0,
  haloPredicateur = 0,
  haloInvites = 0,
  defilement = 0,
}) => (
  <Ecran defilement={defilement}>
    <IoChevronBack size={22} color={S.ink2} />
    <Surtitre haut={10}>{APP.detail.kickerEvangelism}</Surtitre>
    <Titre>{evt.type}</Titre>
    {evt.titre ? <div style={{ fontSize: 14, color: S.ink2, marginTop: 4 }}>{evt.titre}</div> : null}
    <div style={{ marginTop: 10, display: 'flex' }}>
      <Halo intensite={haloPastilles} rayon={12} marge={5}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>{pastilles}</div>
      </Halo>
    </div>

    {/* D-EVT-16 (JP 14/10) : le prédicateur en évidence, toujours absent hors type évangélique. */}
    {evt.predicateur ? (
      <Halo intensite={haloPredicateur} rayon={22} marge={5}>
        <Carte variante="tinted" style={{ marginTop: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IoMicOutline size={20} color={S.moss} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, color: S.ink3, lineHeight: '15px' }}>{APP.declare.preacher}</div>
            <div style={{ fontFamily: P.serif, fontSize: 18, color: S.ink, letterSpacing: -0.2, marginTop: 1, lineHeight: '23px' }}>
              {evt.predicateur}
            </div>
          </div>
        </Carte>
      </Halo>
    ) : null}

    {flash && flashP > 0 ? (
      <div style={{ maxHeight: 60 * flashP, opacity: flashP, overflow: 'hidden' }}>
        <Carte variante="tinted" style={{ marginTop: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IoCheckmarkCircleOutline size={18} color={S.moss} />
          <div style={{ flex: 1, fontSize: 13, color: S.ink2 }}>{flash}</div>
        </Carte>
      </div>
    ) : null}

    <Carte style={{ marginTop: 16, padding: '4px 16px' }}>
      <LigneDetail label={APP.detail.date} valeur={evt.date} />
      <Halo intensite={haloRattachement} rayon={8} marge={8} margeY={0} etalement={3}>
        <LigneDetail label={APP.detail.scope} valeur={evt.rattachement} />
      </Halo>
      <LigneDetail label={APP.declare.place} valeur={evt.lieu} />
      <Halo intensite={haloInvites} rayon={8} marge={8} margeY={0} etalement={3}>
        <LigneDetail label={APP.declare.participants} valeur={evt.participants} />
        {/* D-EVT-17 (JP 14/10) : invités, inclus dans les participants ; tout type. */}
        <LigneDetail label={APP.declare.guests} valeur={evt.invites} />
      </Halo>
      {/* D-EVT-15 (JP 14/10) : compteurs d'un type évangélique, « — » s'ils ne sont pas saisis. */}
      <LigneDetail label={APP.declare.conversions} valeur={evt.conversions} />
      <LigneDetail label={APP.declare.restorations} valeur={evt.restaurations} />
      <LigneDetail label={APP.declare.baptisms} valeur={evt.baptemes} />
      <LigneDetail label={APP.declare.note} valeur={null} />
      <LigneDetail label={APP.detail.author} valeur={evt.auteur} derniere />
    </Carte>

    <Halo intensite={haloIndication} rayon={8} marge={6}>
      <div style={{ marginTop: 10, fontSize: 12, color: S.ink3, lineHeight: '17px' }}>{indication}</div>
    </Halo>

    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>{boutons}</div>
  </Ecran>
);

/** « Marquer comme réalisé » d'un programmé, avec sa phrase d'attente si la date n'est pas venue. */
export const BoutonRealise: React.FC<{ inactif?: number; attente?: boolean }> = ({ inactif = 0, attente }) => (
  <>
    <Bouton label={APP.detail.markDone} hauteur={52} inactif={inactif} icone={<IoCheckmarkDone size={19} />} />
    {attente ? (
      <div style={{ marginTop: -4, fontSize: 12, color: S.ink3, textAlign: 'center' }}>{APP.detail.notYetHeld}</div>
    ) : null}
  </>
);

/**
 * Formulaire de clôture (`DoneForm` de [id].tsx) : prédicateur d'un type évangélique (D-EVT-16,
 * prérempli s'il était connu, saisissable sinon), `EventCounterFields` — participants, invités
 * (D-EVT-17), puis conversions, restaurations, baptêmes pour un type évangélique (D-EVT-15) — et
 * note ; tout est facultatif.
 */
export const EcranCloture: React.FC<{
  type: string;
  valeurs: Partial<Record<CleCompteur, string>>;
  curseur?: CleCompteur | null;
  predicateur?: string;
  curseurPredicateur?: boolean;
  haloPredicateur?: number;
}> = ({ type, valeurs, curseur, predicateur, curseurPredicateur, haloPredicateur }) => (
  <Ecran>
    <IoChevronBack size={22} color={S.ink2} />
    <Surtitre haut={10}>{APP.detail.markDone}</Surtitre>
    <Titre>{type}</Titre>
    <div style={{ fontSize: 13, color: S.ink3, marginTop: 8, lineHeight: '20px' }}>{APP.detail.markDoneIntro}</div>
    <ChampPredicateur valeur={predicateur} curseur={curseurPredicateur} halo={haloPredicateur} />
    <ChampsCompteurs evangelique valeurs={valeurs} curseur={curseur} />
    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Etiquette>{APP.declare.note}</Etiquette>
        <div style={{ fontFamily: P.mono, fontSize: 11, color: S.ink3 }}>0/280</div>
      </div>
      <Champ indication={APP.declare.notePlaceholder} hauteur={72} />
    </div>
    <Bouton label={APP.detail.markDone} hauteur={54} style={{ marginTop: 18 }} icone={<IoCheckmarkDone size={19} />} />
    <Bouton label={APP.cancel} variante="ghost" hauteur={46} style={{ marginTop: 10 }} />
  </Ecran>
);
