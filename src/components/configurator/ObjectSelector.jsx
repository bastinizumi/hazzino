import React, { useState } from 'react';
import { LAB_OBJECTS, LAB_CATEGORIES } from '../../data/furnitureLabData';
import { Sparkles, ChevronRight, X } from 'lucide-react';

export default function ObjectSelector({
  selectedObjectId,
  onSelectObject,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter items by category tab
  const displayedObjects =
    selectedCategory === 'ALL'
      ? LAB_OBJECTS
      : LAB_OBJECTS.filter((obj) => obj.category === selectedCategory);

  // Canonical display name matching requirement 23
  const getDisplayName = (obj) => {
    const map = {
      chair: 'LOUNGE CHAIR',
      cabinet: 'ARCHIVE CABINET',
      wardrobe: 'GRAND WARDROBE',
      cupboard: 'MODULAR CUPBOARD',
      tea_table: 'TEA TABLE',
      dining_table: 'DINING TABLE',
      dining_chair: 'DINING CHAIR',
      storage_bed: 'STORAGE BED',
      writing_desk: 'WRITING DESK',
      night_console: 'NIGHT CONSOLE',
    };
    return map[obj.id] || obj.name.replace(/^HAZZINO\s+/i, '');
  };

  return (
    <div style={{ marginBottom: '26px' }}>
      {/* Header with Title and "OBJECT LAB" Drawer Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
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
          PRODUCT SELECTION
        </span>
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: 'var(--color-accent-gold)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '2px 0',
          }}
        >
          <Sparkles size={11} />
          <span>OBJECT LAB</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '10px',
          scrollbarWidth: 'none',
        }}
      >
        {LAB_CATEGORIES.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '4px 10px',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: isCatActive ? '1px solid #121110' : '1px solid rgba(20, 20, 20, 0.1)',
                backgroundColor: isCatActive ? '#121110' : 'rgba(20, 20, 20, 0.03)',
                color: isCatActive ? '#ffffff' : '#5a554c',
                cursor: 'pointer',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Grid of Product Buttons (2 columns on mobile/tablet, 2-5 on desktop) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '7px',
        }}
      >
        {displayedObjects.map((obj) => {
          const isSelected = obj.id === selectedObjectId;
          const displayName = getDisplayName(obj);

          return (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              style={{
                padding: '10px 10px',
                textAlign: 'left',
                background: isSelected ? '#121110' : '#fcfbf8',
                color: isSelected ? '#ffffff' : '#121110',
                border: isSelected
                  ? '1px solid #121110'
                  : '1px solid rgba(20, 20, 20, 0.12)',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '52px',
                boxShadow: isSelected
                  ? '0 4px 14px rgba(18, 17, 16, 0.18)'
                  : '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.borderColor = 'rgba(20, 20, 20, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#fcfbf8';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(20, 20, 20, 0.12)';
                }
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                  color: isSelected ? 'var(--color-accent-gold)' : '#8a8479',
                  marginBottom: '2px',
                  display: 'block',
                }}
              >
                {obj.num}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.25,
                }}
              >
                {displayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expandable OBJECT LAB Side Drawer */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-label="Object Lab Drawer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '400px',
              maxWidth: '88vw',
              height: '100%',
              backgroundColor: '#faf8f5',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
              animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(20, 20, 20, 0.1)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-gold)',
                    marginBottom: '4px',
                  }}
                >
                  HAZZINO INTERIORS
                </div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#121110',
                    margin: 0,
                  }}
                >
                  Furniture Laboratory Catalog
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close Object Lab"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#121110',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Object Lab Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {LAB_OBJECTS.map((obj) => {
                const isSelected = obj.id === selectedObjectId;
                return (
                  <button
                    key={obj.id}
                    onClick={() => {
                      onSelectObject(obj.id);
                      setIsDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: isSelected ? '#121110' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#121110',
                      border: isSelected
                        ? '1px solid #121110'
                        : '1px solid rgba(20, 20, 20, 0.08)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: '4px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.2em',
                          fontWeight: 600,
                          color: isSelected
                            ? 'var(--color-accent-gold)'
                            : '#7a756c',
                          marginBottom: '2px',
                        }}
                      >
                        {obj.num} • {obj.category} • {obj.subtitle}
                      </div>
                      <div
                        className="font-serif"
                        style={{
                          fontSize: '15px',
                          fontWeight: 400,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {obj.name}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          opacity: 0.65,
                          marginTop: '2px',
                        }}
                      >
                        {obj.dimensions}
                      </div>
                    </div>
                    <ChevronRight
                      size={15}
                      style={{
                        opacity: isSelected ? 1 : 0.4,
                        color: isSelected ? 'var(--color-accent-gold)' : 'inherit',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
