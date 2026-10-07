import React, { useState, useRef } from 'react';
import { Layers, Sliders, Sparkles, Check, Info } from 'lucide-react';
import {
  LAB_OBJECTS,
  LAB_MATERIALS,
  LAB_COLORS,
  LAB_FINISHES,
} from '../data/furnitureLabData';
import FurnitureViewer from './configurator/FurnitureViewer';
import ObjectSelector from './configurator/ObjectSelector';
import MaterialSelector from './configurator/MaterialSelector';
import ColorSelector from './configurator/ColorSelector';
import SpecSheetModal from './configurator/SpecSheetModal';

export default function ConfiguratorSection() {
  const sectionRef = useRef(null);

  // 1. Master Object Selection State
  const [selectedObjectId, setSelectedObjectId] = useState('chair');

  // Active object configuration
  const currentObject =
    LAB_OBJECTS.find((o) => o.id === selectedObjectId) || LAB_OBJECTS[0];

  // 2. Material, Color, and Finish States
  const [selectedMaterialId, setSelectedMaterialId] = useState(
    currentObject.defaultMaterial || 'fabric'
  );
  const [selectedColorId, setSelectedColorId] = useState(
    currentObject.defaultColor || 'warm_ivory'
  );
  const [selectedFinishId, setSelectedFinishId] = useState(
    currentObject.defaultFinish || 'matte'
  );

  // 3. 3D Interaction Modes
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isInteractMode, setIsInteractMode] = useState(false);
  const [isTechnicalView, setIsTechnicalView] = useState(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState('hero');

  // 4. Bespoke Spec Sheet Modal State
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Active material and color objects
  const activeMaterial =
    LAB_MATERIALS.find((m) => m.id === selectedMaterialId) || LAB_MATERIALS[0];
  const activeColor =
    LAB_COLORS.find((c) => c.id === selectedColorId) || LAB_COLORS[0];
  const activeFinish =
    LAB_FINISHES.find((f) => f.id === selectedFinishId) || LAB_FINISHES[0];

  // Handle Object Switch with automatic defaults
  const handleSelectObject = (newObjId) => {
    setSelectedObjectId(newObjId);
    const targetObj = LAB_OBJECTS.find((o) => o.id === newObjId);
    if (targetObj) {
      setSelectedMaterialId(targetObj.defaultMaterial || 'natural_wood');
      setSelectedColorId(targetObj.defaultColor || 'warm_ivory');
      setSelectedFinishId(targetObj.defaultFinish || 'matte');
    }
    setActiveCameraPreset('hero');
    setIsInteractMode(false);
  };

  // Reset View Handler
  const handleResetView = () => {
    setActiveCameraPreset('hero');
    setIsAutoRotate(false);
    setIsInteractMode(false);
    setIsTechnicalView(false);
  };

  return (
    <section
      id="configurator"
      ref={sectionRef}
      aria-label="Hazzino Interactive Furniture Laboratory"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0a0a09',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {/* ======================================================================= */}
      {/* LEFT: 3D INTERACTIVE PRODUCT LABORATORY VIEWPORT (~62% Desktop)        */}
      {/* ======================================================================= */}
      <div
        style={{
          flex: '1 1 58%',
          minWidth: '320px',
          minHeight: '72vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Dynamic Editorial Header */}
        <div
          style={{
            position: 'absolute',
            top: '92px',
            right: '36px',
            zIndex: 25,
            pointerEvents: 'none',
            textAlign: 'right',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            HAZZINO BESPOKE • {currentObject.category}
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 42px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#121110',
              margin: '0 0 2px 0',
              lineHeight: 1.1,
            }}
          >
            {currentObject.name}
          </h2>
          <div
            style={{
              fontSize: '11px',
              color: '#7a756c',
              letterSpacing: '0.12em',
              fontStyle: 'italic',
            }}
          >
            {currentObject.dimensions}
          </div>
        </div>

        {/* 3D Furniture Viewer Canvas */}
        <FurnitureViewer
          selectedObjectId={selectedObjectId}
          selectedMaterialId={selectedMaterialId}
          selectedColorId={selectedColorId}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
          isInteractMode={isInteractMode}
          onToggleInteractMode={() => setIsInteractMode(!isInteractMode)}
          isTechnicalView={isTechnicalView}
          onToggleTechnicalView={() => setIsTechnicalView(!isTechnicalView)}
          activeCameraPreset={activeCameraPreset}
          onSelectCameraPreset={(presetId) => setActiveCameraPreset(presetId)}
          onResetView={handleResetView}
        />
      </div>

      {/* ======================================================================= */}
      {/* RIGHT: LUXURY CONFIGURATOR PANEL (~38% Desktop, Warm Ivory)            */}
      {/* ======================================================================= */}
      <div
        style={{
          flex: '1 1 38%',
          minWidth: '320px',
          backgroundColor: '#f8f6f0',
          color: '#121110',
          position: 'relative',
          zIndex: 30,
          boxShadow: '-15px 0 45px rgba(0, 0, 0, 0.25)',
          padding: '92px 38px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        <div>
          {/* Main Panel Heading */}
          <div style={{ marginBottom: '20px' }}>
            <h3
              className="font-serif"
              style={{
                fontSize: 'clamp(26px, 2.6vw, 36px)',
                lineHeight: 1.05,
                fontWeight: 400,
                letterSpacing: '0.04em',
                margin: '0 0 6px 0',
                color: '#121110',
              }}
            >
              FURNITURE<br />LABORATORY
            </h3>
            <p
              style={{
                fontSize: '10px',
                color: '#7a756c',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Precision 360° Product Configuration
            </p>
          </div>

          {/* Workflow Badges */}
          <div
            style={{
              display: 'flex',
              gap: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(20, 20, 20, 0.1)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>
              <Layers size={13} color="var(--color-accent-gold)" />
              <span>OBJECT</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>
              <Sliders size={13} color="var(--color-accent-gold)" />
              <span>MATERIAL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 600 }}>
              <Sparkles size={13} color="var(--color-accent-gold)" />
              <span>FINISH</span>
            </div>
          </div>

          {/* 1. PRODUCT SELECTION (Categorized 10 Objects) */}
          <ObjectSelector
            selectedObjectId={selectedObjectId}
            onSelectObject={handleSelectObject}
          />

          {/* 2. MATERIAL & FINISH SPECIFICATION */}
          <MaterialSelector
            selectedMaterialId={selectedMaterialId}
            supportedMaterials={currentObject.supportedMaterials}
            onSelectMaterial={(matId) => setSelectedMaterialId(matId)}
            selectedFinishId={selectedFinishId}
            onSelectFinish={(finId) => setSelectedFinishId(finId)}
          />

          {/* 3. 10 HAZZINO LUXURY COLOR PALETTE */}
          <ColorSelector
            selectedColorId={selectedColorId}
            onSelectColor={(colId) => setSelectedColorId(colId)}
          />

          {/* 4. PRODUCT INFORMATION CARD (Requirement 24) */}
          <div
            style={{
              backgroundColor: '#efe9dc',
              padding: '16px 18px',
              borderRadius: '2px',
              marginBottom: '24px',
              border: '1px solid rgba(20, 20, 20, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '9px',
                letterSpacing: '0.2em',
                fontWeight: 700,
                color: 'var(--color-accent-gold)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              <Info size={11} />
              <span>SPECIFICATION SUMMARY</span>
            </div>

            <div
              className="font-serif"
              style={{
                fontSize: '17px',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: '#121110',
                marginBottom: '2px',
              }}
            >
              {currentObject.name}
            </div>

            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: '#7a756c',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {currentObject.category} COLLECTION • {currentObject.dimensions}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                paddingTop: '8px',
                borderTop: '1px dashed rgba(20, 20, 20, 0.12)',
                fontSize: '10px',
              }}
            >
              <div>
                <span style={{ color: '#8a8479', display: 'block', fontSize: '9px', letterSpacing: '0.1em' }}>
                  MATERIAL:
                </span>
                <strong style={{ color: '#121110', fontWeight: 600 }}>
                  {activeMaterial.name}
                </strong>
              </div>
              <div>
                <span style={{ color: '#8a8479', display: 'block', fontSize: '9px', letterSpacing: '0.1em' }}>
                  COLOR:
                </span>
                <strong style={{ color: '#121110', fontWeight: 600 }}>
                  {activeColor.name}
                </strong>
              </div>
              <div>
                <span style={{ color: '#8a8479', display: 'block', fontSize: '9px', letterSpacing: '0.1em' }}>
                  FINISH:
                </span>
                <strong style={{ color: '#121110', fontWeight: 600 }}>
                  {activeFinish.name}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bespoke Enquiry CTA */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(20, 20, 20, 0.1)' }}>
          <button
            onClick={() => setIsSpecModalOpen(true)}
            className="btn-magnetic"
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#121110',
              color: '#ffffff',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={14} color="var(--color-accent-gold)" />
            <span>REQUEST BESPOKE SPEC SHEET</span>
          </button>
        </div>
      </div>

      {/* Bespoke Specification Modal (Connected to MERN backend) */}
      <SpecSheetModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
        currentProduct={currentObject}
        currentMaterial={activeMaterial}
        currentColor={activeColor}
        currentFinish={activeFinish}
      />
    </section>
  );
}
