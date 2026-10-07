import React from 'react';

const ROOM_TABS = [
  { id: 'living', num: '01', name: 'LIVING' },
  { id: 'kitchen', num: '02', name: 'KITCHEN' },
  { id: 'bedroom', num: '03', name: 'BEDROOM' },
  { id: 'dining', num: '04', name: 'DINING' },
  { id: 'bathroom', num: '05', name: 'BATHROOM' },
];

export default function RoomNavigation({ currentRoomId, onSelectRoom }) {
  return (
    <aside
      aria-label="Room Explorer Navigation"
      style={{
        position: 'absolute',
        left: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          fontSize: '9px',
          letterSpacing: '0.32em',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.4)',
          marginBottom: '4px',
          paddingLeft: '10px',
        }}
      >
        SANCTUARIES
      </div>

      {ROOM_TABS.map((tab) => {
        const isActive = tab.id === currentRoomId;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectRoom(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Active Gold Line */}
            <div
              style={{
                width: isActive ? '24px' : '6px',
                height: '2px',
                backgroundColor: isActive ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.22)',
                boxShadow: isActive ? '0 0 10px rgba(197, 160, 89, 0.6)' : 'none',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            <div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: isActive ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'color 0.25s',
                  marginBottom: '1px',
                }}
              >
                {tab.num}
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.08em',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                  transition: 'all 0.25s',
                }}
              >
                {tab.name}
              </div>
            </div>
          </button>
        );
      })}
    </aside>
  );
}
