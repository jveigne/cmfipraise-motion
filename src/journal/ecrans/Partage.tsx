import React from 'react';
import { IoClose, IoCopyOutline, IoFolderOutline, IoLogoWhatsapp, IoMail, IoChatbubble, IoPrintOutline, IoRadioOutline } from 'react-icons/io5';
import { P } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import { ECRAN } from '../../ui/Telephone';
import { useJournal } from '../langue';

/**
 * Feuille de partage du système (iOS, `UIActivityViewController`), ouverte par `Sharing.shareAsync`
 * (`utils/pdfShare.ts`) une fois le PDF composé. Interface du SYSTÈME, pas de l'app : couleurs et
 * libellés d'iOS dans la langue de la vidéo, redessinés sobrement (storyboard § 7.4). Sur Android, l'impression ne passe pas
 * forcément par cette feuille.
 */

/** Hauteur de la feuille (points) et position de l'action « Imprimer ». */
const HAUTEUR = 470;
const HAUT = ECRAN.hauteur - HAUTEUR;
export const PT_PARTAGE = {
  imprimer: { x: 195, y: HAUT + 272 },
  /** Centre de la vignette du document (d'où sortent les pages). */
  vignette: { x: 44, y: HAUT + 44 },
} as const;

/** Gris et teintes système d'iOS (feuille de partage). */
const IOS = {
  fond: '#F2F2F7',
  carte: '#FFFFFF',
  texte: '#1C1C1E',
  gris: '#8E8E93',
  filet: 'rgba(60,60,67,0.18)',
  bleu: '#0A84FF',
  vert: '#34C759',
  whatsapp: '#25D366',
};

const SANS_IOS = `-apple-system, 'SF Pro Text', ${P.sans}, sans-serif`;

export const FeuillePartage: React.FC<{
  p: number;
  fichier: string;
  dessous: React.ReactNode;
  haloImprimer?: number;
}> = ({ p, fichier, dessous, haloImprimer = 0 }) => {
  const { cartons } = useJournal();
  const apps = [
    { icone: <IoRadioOutline size={30} color="#FFFFFF" />, fond: IOS.bleu },
    { icone: <IoChatbubble size={28} color="#FFFFFF" />, fond: IOS.vert },
    { icone: <IoMail size={28} color="#FFFFFF" />, fond: IOS.bleu },
    { icone: <IoLogoWhatsapp size={32} color="#FFFFFF" />, fond: IOS.whatsapp },
  ];
  const actions = [<IoCopyOutline key="c" size={20} />, <IoPrintOutline key="p" size={20} />, <IoFolderOutline key="f" size={20} />];
  const q = p > 0.995 ? 1 : p;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {dessous}
      {q > 0.001 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.22 * q})` }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: HAUT,
              height: HAUTEUR,
              transform: `translateY(${(1 - q) * (HAUTEUR + 20)}px)`,
              background: IOS.fond,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              fontFamily: SANS_IOS,
              color: IOS.texte,
              boxShadow: '0 -6px 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* En-tête : vignette, nom du fichier, type. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 14px', borderBottom: `1px solid ${IOS.filet}` }}>
              <div
                style={{
                  width: 42,
                  height: 56,
                  borderRadius: 4,
                  background: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  padding: '7px 6px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ height: 3, width: '70%', background: '#1E3A2F', borderRadius: 1 }} />
                {[90, 80, 90, 60, 85, 75].map((l, i) => (
                  <div key={i} style={{ height: 2, width: `${l}%`, background: '#C8C2B6', borderRadius: 1 }} />
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fichier}</div>
                <div style={{ fontSize: 13, color: IOS.gris, marginTop: 2 }}>{cartons.partage.typeDocument}</div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: 'rgba(118,118,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoClose size={18} color={IOS.gris} />
              </div>
            </div>

            {/* Rangée d'apps. */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 8px 10px' }}>
              {apps.map((a, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 76 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 15, background: a.fond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {a.icone}
                  </div>
                  <div style={{ fontSize: 11 }}>{cartons.partage.apps[i]}</div>
                </div>
              ))}
            </div>

            {/* Actions. */}
            <div style={{ margin: '8px 16px 0', background: IOS.carte, borderRadius: 12, overflow: 'visible' }}>
              {cartons.partage.actions.map((a, i) => {
                const ligne = (
                  <div
                    style={{
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                      fontSize: 16,
                      borderBottom: i < 2 ? `1px solid ${IOS.filet}` : undefined,
                      background: IOS.carte,
                      borderRadius: i === 0 ? '12px 12px 0 0' : i === 2 ? '0 0 12px 12px' : 0,
                    }}
                  >
                    <span>{a}</span>
                    <span style={{ color: IOS.texte, display: 'flex' }}>{actions[i]}</span>
                  </div>
                );
                return i === 1 ? (
                  <Halo key={a} intensite={haloImprimer} rayon={6} marge={2}>
                    {ligne}
                  </Halo>
                ) : (
                  <div key={a}>{ligne}</div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
