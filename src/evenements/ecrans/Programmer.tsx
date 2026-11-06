import React from 'react';
import {
  IoCalendar,
  IoCalendarNumberOutline,
  IoCalendarOutline,
  IoCheckmark,
  IoChevronDown,
  IoClose,
  IoLocationOutline,
} from 'react-icons/io5';
import { APP } from '../textes';
import { TYPES } from '../donnees';
import { P, S } from '../theme';
import { Bandeau, Bouton, Carte, Champ, ChampPredicateur, Ecran, Etiquette, Halo, Intro, Pastille, Surtitre, Titre } from '../ui/app';

/**
 * « Programmer un évènement » (`app/events/plan.tsx` + `components/EventForm.tsx`, mode `plan`),
 * dans la feuille modale. Ordre de l'app : type, intitulé, date / fin, prédicateur (type
 * évangélique, D-EVT-16 : on le connaît souvent dès la programmation), rattachement (seulement s'il
 * y a un choix : un dirigeant), bandeau, lieu, note, « Programmer ». Aucun compteur (participants,
 * invités, conversions, restaurations, baptêmes) : ils se saisissent à la clôture (D-EVT-02,
 * D-EVT-15, D-EVT-17) — c'est ce que dit l'intro.
 */
export const EcranProgrammer: React.FC<{
  type: string | null;
  intitule: string;
  curseur?: boolean;
  date: React.ReactNode;
  /** Rattachement affiché (dirigeant) ; absent pour un membre, qui n'a qu'une assemblée. */
  rattachement?: string;
  /** Texte du bandeau (« l'assemblée Paris Nord », « la ville Paris »). */
  noeud: string;
  haloDate?: number;
  /** D-EVT-16 : saisie du prédicateur (présent dès qu'un type est choisi, tous évangéliques). */
  predicateur?: string;
  curseurPredicateur?: boolean;
  haloPredicateur?: number;
  haloRattachement?: number;
  haloBandeau?: number;
  defilement?: number;
}> = ({
  type,
  intitule,
  curseur,
  date,
  rattachement,
  noeud,
  haloDate = 0,
  predicateur,
  curseurPredicateur,
  haloPredicateur = 0,
  haloRattachement = 0,
  haloBandeau = 0,
  defilement = 0,
}) => (
  <Ecran haut={16} defilement={defilement}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
      <IoClose size={26} color={S.ink2} />
    </div>
    <Surtitre>{APP.mine.kicker}</Surtitre>
    <Titre taille={30}>{APP.plan.title}</Titre>
    <Intro largeur={330}>{APP.plan.intro}</Intro>

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.form.type}</Etiquette>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TYPES.map((t) => (
          <Pastille key={t} label={t} choisie={t === type} />
        ))}
      </div>
    </div>

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.form.title}</Etiquette>
      <Champ valeur={intitule} indication={APP.form.titlePlaceholder} curseur={curseur} />
    </div>

    <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <Etiquette style={{ marginBottom: 8 }}>{APP.form.date}</Etiquette>
        <Halo intensite={haloDate} rayon={22}>
          <Carte style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IoCalendarOutline size={18} color={S.mossSoft} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: '20px', whiteSpace: 'nowrap' }}>{date}</div>
          </Carte>
        </Halo>
      </div>
      <div style={{ flex: 1 }}>
        <Etiquette style={{ marginBottom: 8 }}>{APP.form.endDate}</Etiquette>
        <Carte style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IoCalendarNumberOutline size={18} color={S.mossSoft} />
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: '20px', color: S.ink3 }}>{APP.form.endDateNone}</div>
        </Carte>
      </div>
    </div>

    {type != null ? <ChampPredicateur valeur={predicateur} curseur={curseurPredicateur} halo={haloPredicateur} /> : null}

    {rattachement ? (
      <div style={{ marginTop: 10 }}>
        <Etiquette style={{ marginBottom: 6 }}>{APP.form.scope}</Etiquette>
        <Halo intensite={haloRattachement} rayon={12}>
          <ChampSelection valeur={rattachement} />
        </Halo>
      </div>
    ) : null}
    <Halo intensite={haloBandeau} rayon={16}>
      <Bandeau haut={14} icone={<IoLocationOutline size={16} color={S.mossSoft} />}>
        {APP.form.plannedFor(noeud)}
      </Bandeau>
    </Halo>

    <div style={{ marginTop: 18 }}>
      <Etiquette style={{ marginBottom: 8 }}>{APP.declare.place}</Etiquette>
      <Champ indication={APP.declare.placePlaceholder} />
    </div>

    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Etiquette>{APP.declare.note}</Etiquette>
        <div style={{ fontFamily: P.mono, fontSize: 11, color: S.ink3 }}>0/280</div>
      </div>
      <Champ indication={APP.declare.notePlaceholder} hauteur={72} />
    </div>

    <Bouton
      label={APP.plan.submit}
      hauteur={56}
      inactif={type ? 0 : 1}
      style={{ marginTop: 18 }}
      icone={<IoCalendar size={19} />}
    />
  </Ecran>
);

/** `SelectField` fermé : la valeur choisie et un chevron. */
export const ChampSelection: React.FC<{ valeur: string }> = ({ valeur }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      height: 50,
      padding: '0 14px',
      borderRadius: 12,
      border: '1px solid rgba(42,38,32,0.15)',
      background: S.paper,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ flex: 1, fontSize: 14.5, color: S.ink }}>{valeur}</div>
    <IoChevronDown size={16} color={S.ink3} />
  </div>
);

/**
 * Liste du `SelectField` ouverte (modale centrée qui glisse du bas, fond mousse voilé) : une
 * ligne par niveau possible, la valeur courante en gras avec une coche.
 */
export const ListeSelection: React.FC<{ p: number; titre: string; options: string[]; choisie: string; haloOption?: number }> = ({
  p,
  titre,
  options,
  choisie,
  haloOption = 0,
}) => {
  if (p <= 0.005) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(22,41,31,${0.45 * Math.min(1, p)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: P.sans,
      }}
    >
      <Carte style={{ width: '100%', padding: 18, boxSizing: 'border-box', transform: `translateY(${(1 - p) * 600}px)` }}>
        <Etiquette style={{ marginBottom: 8 }}>{titre}</Etiquette>
        <div style={{ marginTop: 8 }}>
          {options.map((o) => {
            const active = o === choisie;
            return (
              <Halo key={o} intensite={active ? haloOption : 0} rayon={8} marge={0}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 6px',
                    borderBottom: '1px solid rgba(42,38,32,0.06)',
                  }}
                >
                  <div style={{ flex: 1, fontSize: 14.5, color: active ? S.mossDeep : S.ink2, fontWeight: active ? 600 : 400 }}>{o}</div>
                  {active ? <IoCheckmark size={16} color={S.moss} /> : null}
                </div>
              </Halo>
            );
          })}
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13.5, color: S.ink3, fontWeight: 600 }}>{APP.cancel}</div>
      </Carte>
    </div>
  );
};
