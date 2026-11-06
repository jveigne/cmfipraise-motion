import React from 'react';
import { IoArrowBack, IoArrowUp, IoChevronDown, IoChevronForward, IoHomeOutline, IoPeopleCircleOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Carte, Ecran, Halo } from '../../evenements/ui/app';
import { APP } from '../textes';
import { ARBRE, BERNARD, EtatObjectifs, MEMBRES_ARBRE } from '../donnees';

/**
 * Hiérarchie de Daniel, dirigeant de la ville (`app/hierarchie.tsx`, vue « Dirigeants », mode
 * SUBTREE) : retour, titre, introduction, « Vous rendez compte à », « Mon superviseur », segments
 * Dirigeants | Assemblées, puis l'arbre — Daniel (« Vous »), ses trois dirigeants d'assemblée
 * (dépliés : `depth < 2`), leurs assemblées, et les membres d'une assemblée dépliée. Sur chaque
 * personne, la pastille de soumission du But Quinquennal (`GoalPill`, RG-BQ-06/11) : Soumis,
 * Brouillon, Rien déclaré. Écran poussé sur la pile racine : pas de barre d'onglets.
 *
 * Ni le bloc « Ce que porte mon leadership » (sommes en euros, plan § 9 : aucun montant), ni les
 * blocs de statistiques au-dessus de l'arbre ne sont dessinés : la vidéo montre l'arbre et l'état
 * des objectifs.
 */

/** `goalPill` : JetBrains Mono 9, majuscules ; soumis mousse, brouillon / rien déclaré terre. */
const PastilleObjectifs: React.FC<{ etat: EtatObjectifs; halo?: number }> = ({ etat, halo = 0 }) => {
  const style =
    etat === 'soumis'
      ? { color: S.mossDeep, background: S.mossTint2 }
      : { color: S.earthDeep, background: 'rgba(201,149,107,0.22)' };
  const texte = etat === 'soumis' ? APP.hierarchy.goalSubmitted : etat === 'brouillon' ? APP.hierarchy.goalDraft : APP.hierarchy.goalNothing;
  return (
    <Halo intensite={halo} rayon={99} marge={3} etalement={3}>
      <div
        style={{
          fontFamily: P.mono,
          fontSize: 9,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          padding: '2px 7px',
          borderRadius: 99,
          lineHeight: '13px',
          whiteSpace: 'nowrap',
          ...style,
        }}
      >
        {texte}
      </div>
    </Halo>
  );
};

const PastilleVous: React.FC = () => (
  <div
    style={{
      fontFamily: P.mono,
      fontSize: 9,
      color: S.white,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      padding: '2px 7px',
      borderRadius: 99,
      background: S.moss,
      lineHeight: '13px',
    }}
  >
    {APP.hierarchy.you}
  </div>
);

/** Apparition d'une ligne de l'arbre (0 → 1) : elle glisse de 12 points. */
const Entree: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <div style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{children}</div>
);

/** Hauteur dépliée de la liste des membres (15 lignes de 22, écarts de 4, marges 6). */
const H_MEMBRES = 6 + MEMBRES_ARBRE.length * 22 + (MEMBRES_ARBRE.length - 1) * 4;

export const EcranArbre: React.FC<{
  /** Entrée des lignes de l'arbre, dans l'ordre : Daniel, puis chaque dirigeant et son assemblée. */
  entrees?: readonly number[];
  /** Index (dans `ARBRE.dirigeants`) de l'assemblée dont les membres sont dépliés, et le dépliement (0 → 1). */
  deplie?: { index: number; p: number };
  haloDirigeants?: number;
  haloAssemblee?: number;
  haloMembres?: number;
  defilement?: number;
}> = ({ entrees = [], deplie, haloDirigeants = 0, haloAssemblee = 0, haloMembres = 0, defilement = 0 }) => {
  const e = (i: number) => entrees[i] ?? 1;
  return (
    <Ecran defilement={defilement} haut={59 + 4}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
        <IoArrowBack size={24} color={S.ink2} />
        <div style={{ fontFamily: P.serif, fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>{APP.hierarchy.title}</div>
      </div>
      <div style={{ marginTop: 4, fontSize: 12.5, color: S.ink3, lineHeight: '18px' }}>{APP.hierarchy.introSubtree}</div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(201,149,107,0.14)' }}>
        <IoArrowUp size={14} color={S.earthDeep} />
        <div style={{ flex: 1, fontSize: 13, color: S.ink2 }}>
          {APP.hierarchy.reportsTo} <span style={{ fontWeight: 700, color: S.ink }}>{BERNARD}</span>
        </div>
      </div>

      <Carte variante="paper2" style={{ marginTop: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IoPeopleCircleOutline size={18} color={S.mossDeep} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: S.earthDeep }}>{APP.hierarchy.supervisorTitle}</div>
          <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{APP.hierarchy.supervisorHint}</div>
        </div>
        <IoChevronForward size={16} color={S.ink3} />
      </Carte>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {[APP.hierarchy.viewLeaders, APP.hierarchy.viewUnits].map((v, i) => (
          <div
            key={v}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 99,
              textAlign: 'center',
              background: i === 0 ? S.moss : 'rgba(42,38,32,0.06)',
              fontSize: 13,
              fontWeight: 600,
              color: i === 0 ? S.white : S.ink2,
            }}
          >
            {v}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {/* Daniel (« Vous »), dirigeant de la ville, ouvert. */}
        <Entree p={e(0)}>
          <Carte style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <IoChevronDown size={15} color={S.ink3} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{ARBRE.daniel.nom}</div>
                <PastilleVous />
                <PastilleObjectifs etat={ARBRE.daniel.etat} />
              </div>
              <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{APP.hierarchy.roleDirigeant}</div>
            </div>
          </Carte>
        </Entree>

        {ARBRE.dirigeants.map((d, i) => {
          const ouvert = deplie?.index === i ? deplie.p : 0;
          return (
            <React.Fragment key={d.nom}>
              <Entree p={e(1 + 2 * i)}>
                <Carte style={{ marginLeft: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IoChevronDown size={15} color={S.ink3} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: S.ink }}>{d.nom}</div>
                      <PastilleObjectifs etat={d.etat} halo={haloDirigeants} />
                    </div>
                    <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>
                      {APP.hierarchy.roleDirigeantUnite} · {APP.hierarchy.unitsCount(1)}
                    </div>
                  </div>
                </Carte>
              </Entree>
              <Entree p={e(2 + 2 * i)}>
                <div style={{ marginLeft: 28 }}>
                  <Halo intensite={deplie?.index === i ? haloAssemblee : 0} rayon={22}>
                    <Carte variante="paper2" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <IoHomeOutline size={14} color={S.earthDeep} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: S.earthDeep }}>{d.assemblee}</div>
                        <div style={{ fontSize: 11.5, color: S.ink3, marginTop: 2 }}>{APP.hierarchy.membersCount(d.membres)}</div>
                      </div>
                      {ouvert > 0.5 ? <IoChevronDown size={14} color={S.ink3} /> : <IoChevronForward size={14} color={S.ink3} />}
                    </Carte>
                  </Halo>
                </div>
                {deplie?.index === i ? (
                  <div style={{ height: H_MEMBRES * ouvert, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, marginLeft: 3 * 14 + 6, opacity: Math.min(1, ouvert * 1.5) }}>
                      {MEMBRES_ARBRE.map((m) => (
                        <div key={m.nom} style={{ height: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: 13, color: S.ink2 }}>{m.nom}</div>
                          <PastilleObjectifs etat={m.etat} halo={haloMembres} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Entree>
            </React.Fragment>
          );
        })}
      </div>
    </Ecran>
  );
};
