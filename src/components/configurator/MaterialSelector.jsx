import React from 'react';
import { LAB_MATERIALS, LAB_FINISHES } from '../../data/furnitureLabData';

export default function MaterialSelector({
  selectedMaterialId,
  supportedMaterials,
  onSelectMaterial,
  selectedFinishId = 'matte',
  onSelectFinish,
}) {
  const materials = supportedMaterials
    ? LAB_MATERIALS.filter((m) => supportedMaterials.includes(m.id))
    : LAB_MATERIALS;

  const currentMat =
    LAB_MATERIALS.find((m) => m.id === selectedMaterialId) || LAB_MATERIALS[0];

  const currentFinish =
    LAB_FINISHES.find((f) => f.id === selectedFinishId) || LAB_FINISHES[0];

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* 1. MATERIAL HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          fontSize: '11px',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#121110',
          }}
        >
          MATERIAL
        </span>
        <span style={{ color: '#7a756c', fontStyle: 'italic', fontSize: '11px' }}>
          {currentMat.name}
        </span>
      </div>

      {/* Grid of Available Materials */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '18px',
        }}
      >
        {materials.map((mat) => {
          const isSelected = mat.id === selectedMaterialId;
          return (
            <button
              key={mat.id}
              onClick={() => onSelectMaterial(mat.id)}
              style={{
                padding: '9px 12px',
                textAlign: 'left',
                background: isSelected ? '#121110' : '#fcfbf8',
                color: isSelected ? '#ffffff' : '#121110',
                border: isSelected
                  ? '1px solid #121110'
                  : '1px solid rgba(20, 20, 20, 0.12)',
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '0.08em',
                transition: 'all 0.22s ease',
              }}
            >
              <div style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>
                {mat.name}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  opacity: 0.7,
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {mat.textureDetail}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. FINISH HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          fontSize: '11px',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#121110',
          }}
        >
          FINISH
        </span>
        <span style={{ color: '#7a756c', fontStyle: 'italic', fontSize: '11px' }}>
          {currentFinish.name}
        </span>
      </div>

      {/* Horizontal List of Finishes */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {LAB_FINISHES.map((fin) => {
          const isSelected = fin.id === selectedFinishId;
          return (
            <button
              key={fin.id}
              onClick={() => onSelectFinish && onSelectFinish(fin.id)}
              style={{
                flex: '1 1 auto',
                padding: '7px 10px',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: isSelected ? '#121110' : 'rgba(20, 20, 20, 0.04)',
                color: isSelected ? '#ffffff' : '#121110',
                border: '1px solid rgba(20, 20, 20, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {fin.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
