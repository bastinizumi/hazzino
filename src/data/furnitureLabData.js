/**
 * HAZZINO INTERIORS — ARCHITECTURAL 3D FURNITURE LABORATORY DATA
 * Master specification for the 10-product custom furniture collection:
 *
 * SEATING:
 * 01 — THE HAZZINO LOUNGE CHAIR (Approved mid-century sculpted walnut & bouclé armchair)
 * 07 — THE HAZZINO DINING CHAIR (Upholstered curved backrest & tapered solid wood legs)
 *
 * STORAGE:
 * 02 — THE HAZZINO ARCHIVE CABINET (Low architectural credenza with fluted doors & drawers)
 * 03 — THE HAZZINO GRAND WARDROBE (Floor-to-ceiling 4-door wardrobe with luxury interior storage)
 * 04 — THE HAZZINO MODULAR CUPBOARD (Medium-height open display & closed drawer storage)
 *
 * DINING:
 * 05 — THE HAZZINO TEA TABLE (Sculptural pebble stone top on asymmetric pedestal base)
 * 06 — THE HAZZINO SIGNATURE DINING TABLE (Architectural stone/timber top on fluted dual pedestals)
 *
 * BEDROOM:
 * 08 — THE HAZZINO STORAGE BED (King bed with upholstered headboard & left/right/front drawers)
 * 10 — THE HAZZINO NIGHT CONSOLE (Compact pill-curved bedside console with upper drawer)
 *
 * WORKSPACE:
 * 09 — THE HAZZINO ARCHITECT WRITING DESK (Executive desk with integrated drawer & cable management)
 */

export const LAB_OBJECTS = [
  // ---------------------------------------------------------------------------
  // 01 — LOUNGE CHAIR (SEATING)
  // ---------------------------------------------------------------------------
  {
    id: 'chair',
    num: '01',
    category: 'SEATING',
    name: 'HAZZINO LOUNGE CHAIR',
    subtitle: 'LOUNGE COLLECTION',
    tagline: 'Hand-sculpted continuous organic walnut armrests embracing channel-tufted bouclé cushions.',
    dimensions: 'W 78 × D 82 × H 84 CM',
    dimensionsMM: { w: 780, d: 820, h: 840 },
    defaultMaterial: 'fabric',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['fabric', 'leather', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [1.6, 0.85, 3.4], target: [0, 0.42, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT JOINERY',
    },
    specs: [
      { label: 'FRAME', value: 'Solid American Black Walnut with Mortise-and-Tenon Rails' },
      { label: 'UPHOLSTERY', value: 'Tactile Wool Bouclé over Multi-Density Natural Latex' },
      { label: 'ARMREST', value: 'Continuous CNC-Shaped Sculptural Ergonomic Arc' },
      { label: 'JOINERY', value: 'Exposed Hand-Chiseled Dowels & Soft Beveled Edges' },
    ],
    hotspots: [
      { id: 'armrest', label: 'SCULPTED ARMREST', text: 'INSPECT JOINERY', pos: [0.44, 0.42, 0.1] },
      { id: 'cushion', label: 'CHANNEL TUFT', text: 'VIEW MATERIAL', pos: [0, 0.65, -0.15] },
      { id: 'seat', label: 'BOUCLÉ SEAT', text: 'VIEW TEXTURE', pos: [0, 0.38, 0.12] },
      { id: 'legs', label: 'WALNUT STRETCHER', text: 'VIEW FRAME', pos: [-0.38, 0.12, 0.2] },
    ],
    explodeParts: [
      { id: 'backrest', label: 'CHANNEL BACKREST', dir: [0, 0.5, -0.7] },
      { id: 'seat', label: 'TAILORED SEAT CUSHION', dir: [0, 0.6, 0.3] },
      { id: 'armrests', label: 'SCULPTED WALNUT ARMS', dir: [0, 0.25, 0] },
      { id: 'base', label: 'JOINERY LEGS & STRETCHERS', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 02 — ARCHIVE CABINET (STORAGE)
  // ---------------------------------------------------------------------------
  {
    id: 'cabinet',
    num: '02',
    category: 'STORAGE',
    name: 'HAZZINO ARCHIVE CABINET',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Quarter-sawn architectural timber case with soft-close brass pivot doors and dovetail drawers.',
    dimensions: 'W 140 × D 48 × H 86 CM',
    dimensionsMM: { w: 1400, d: 480, h: 860 },
    defaultMaterial: 'walnut_wood',
    defaultColor: 'walnut_brown',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['walnut_wood', 'natural_wood', 'marble', 'beige_stone', 'metal'],
    cameraFocus: { pos: [1.8, 0.95, 3.8], target: [0, 0.48, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN CABINET',
    },
    specs: [
      { label: 'CASEWORK', value: '45° Mitred American Walnut Slab with Solid Core' },
      { label: 'DOORS', value: 'Acoustic CNC-Fluted Timber with 110° Concealed Soft-Close Pivots' },
      { label: 'DRAWERS', value: 'Solid Cedar Dovetail Boxes on Blum Undermount Runners' },
      { label: 'HARDWARE', value: 'Integrated Brushed Champagne Brass Edge Pulls' },
    ],
    hotspots: [
      { id: 'door_left', label: 'FLUTED PIVOT DOOR', text: 'OPEN DOOR', pos: [-0.48, 0.55, 0.25] },
      { id: 'door_right', label: 'FLUTED PIVOT DOOR', text: 'OPEN DOOR', pos: [0.48, 0.55, 0.25] },
      { id: 'drawer_top', label: 'CEDAR CUTLERY DRAWER', text: 'OPEN DRAWER', pos: [0, 0.65, 0.25] },
      { id: 'drawer_bottom', label: 'DEEP ACCESSORY DRAWER', text: 'OPEN DRAWER', pos: [0, 0.35, 0.25] },
      { id: 'plinth', label: 'BRASS SHADOW PLINTH', text: 'VIEW BASE', pos: [0, 0.08, 0.2] },
    ],
    explodeParts: [
      { id: 'top', label: 'MONOLITHIC TOP SLAB', dir: [0, 0.8, 0] },
      { id: 'door_l', label: 'LEFT PIVOT DOOR', dir: [-0.9, 0, 0.7] },
      { id: 'door_r', label: 'RIGHT PIVOT DOOR', dir: [0.9, 0, 0.7] },
      { id: 'drawer_1', label: 'UPPER DRAWER TIER', dir: [0, 0.3, 0.8] },
      { id: 'drawer_2', label: 'LOWER DRAWER TIER', dir: [0, -0.3, 0.8] },
      { id: 'plinth', label: 'RECESSED BASE PLINTH', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 03 — GRAND WARDROBE (STORAGE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'wardrobe',
    num: '03',
    category: 'STORAGE',
    name: 'HAZZINO GRAND WARDROBE',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Floor-to-ceiling 4-door architectural wardrobe with integrated bronze rails, suede drawers, and shoe gallery.',
    dimensions: 'W 220 × D 65 × H 255 CM',
    dimensionsMM: { w: 2200, d: 650, h: 2550 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'natural_oak',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'leather', 'metal'],
    cameraFocus: { pos: [2.0, 1.45, 5.0], target: [0, 1.25, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN WARDROBE',
    },
    specs: [
      { label: 'HEIGHT', value: '2550mm Full Floor-to-Ceiling Architectural Presence' },
      { label: 'DOORS', value: '4 × Full-Height Soft-Touch Lacquer Panels with Recessed J-Handles' },
      { label: 'INTERIOR', value: 'Smoked Oak Lining, Hanging Sections, Suede Drawers & Shoe Trays' },
      { label: 'ILLUMINATION', value: 'Integrated 2700K Vertical Diffused LED Grazers' },
    ],
    hotspots: [
      { id: 'doors', label: 'FULL-HEIGHT DOORS', text: 'OPEN WARDROBE', pos: [-0.55, 1.4, 0.35] },
      { id: 'interior_rail', label: 'BRONZE HANGER RAIL', text: 'VIEW INTERIOR', pos: [-0.55, 1.8, 0] },
      { id: 'drawers', label: 'SUEDE ACCESSORY DRAWERS', text: 'VIEW DRAWERS', pos: [0.55, 0.65, 0.1] },
      { id: 'shelves', label: 'UPPER COMPARTMENTS', text: 'VIEW STORAGE', pos: [0, 2.3, 0] },
    ],
    explodeParts: [
      { id: 'cornice', label: 'ARCHITECTURAL HEADER', dir: [0, 1.2, 0] },
      { id: 'door_1', label: 'OUTER LEFT DOOR', dir: [-1.4, 0, 0.8] },
      { id: 'door_2', label: 'INNER LEFT DOOR', dir: [-0.6, 0, 0.9] },
      { id: 'door_3', label: 'INNER RIGHT DOOR', dir: [0.6, 0, 0.9] },
      { id: 'door_4', label: 'OUTER RIGHT DOOR', dir: [1.4, 0, 0.8] },
      { id: 'interior_drawers', label: 'PULL-OUT SUEDE DRAWERS', dir: [0.5, -0.3, 1.1] },
      { id: 'shelves', label: 'ADJUSTABLE SHELVING', dir: [0, 0.3, 0.4] },
      { id: 'plinth', label: 'RECESSED SHADOW PLINTH', dir: [0, -0.7, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 04 — MODULAR CUPBOARD (STORAGE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'cupboard',
    num: '04',
    category: 'STORAGE',
    name: 'HAZZINO MODULAR CUPBOARD',
    subtitle: 'STORAGE COLLECTION',
    tagline: 'Multi-purpose medium-height storage system balancing open display niches with fluted glass & drawers.',
    dimensions: 'W 140 × D 46 × H 168 CM',
    dimensionsMM: { w: 1400, d: 460, h: 1680 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'forest_green',
    defaultFinish: 'matte',
    defaultWood: 'natural_oak',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'metal', 'marble'],
    cameraFocus: { pos: [1.8, 1.15, 3.9], target: [0, 0.82, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: true,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN COMPARTMENTS',
    },
    specs: [
      { label: 'SECTIONS', value: 'Dual-Zone Architecture: Open Display Niche + Enclosed Storage' },
      { label: 'GLAZING', value: 'Fluted Reeded Glass Door with Champagne Brass Frame' },
      { label: 'DRAWERS', value: '3 × Tiered Solid Timber Drawers with Concealed Underside Pulls' },
      { label: 'CARCASS', value: 'Continuous Radius Pill Corners with Floating Plinth Reveal' },
    ],
    hotspots: [
      { id: 'glass_door', label: 'FLUTED GLASS DOOR', text: 'OPEN DOOR', pos: [0.35, 1.25, 0.25] },
      { id: 'open_niche', label: 'ARCHITECTURAL NICHE', text: 'VIEW DISPLAY', pos: [-0.35, 1.25, 0.1] },
      { id: 'drawers', label: 'TIERED DRAWERS', text: 'OPEN DRAWERS', pos: [0.35, 0.5, 0.25] },
      { id: 'lower_door', label: 'CLOSED CUPBOARD', text: 'OPEN COMPARTMENT', pos: [-0.35, 0.5, 0.25] },
    ],
    explodeParts: [
      { id: 'top_panel', label: 'ROUNDED TOP SLAB', dir: [0, 0.8, 0] },
      { id: 'glass_door', label: 'FLUTED GLASS DOOR', dir: [0.8, 0.2, 0.7] },
      { id: 'lower_door', label: 'TIMBER BASE DOOR', dir: [-0.8, -0.2, 0.7] },
      { id: 'drawer_tier', label: 'TIERED WOOD DRAWERS', dir: [0.4, -0.4, 0.9] },
      { id: 'display_shelf', label: 'DISPLAY NICHE SHELF', dir: [-0.3, 0.3, 0.3] },
      { id: 'plinth', label: 'SHADOWLINE FOOTING', dir: [0, -0.6, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 05 — TEA TABLE (DINING / LIVING) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'tea_table',
    num: '05',
    category: 'DINING',
    name: 'HAZZINO TEA TABLE',
    subtitle: 'OCCASIONAL COLLECTION',
    tagline: 'Sculptural pebble-form stone top balanced upon an asymmetric fluted architectural pedestal.',
    dimensions: 'W 135 × D 82 × H 38 CM',
    dimensionsMM: { w: 1350, d: 820, h: 380 },
    defaultMaterial: 'beige_stone',
    defaultColor: 'sand_beige',
    defaultFinish: 'natural',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['beige_stone', 'white_stone', 'marble', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [1.5, 0.85, 3.2], target: [0, 0.22, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT 360°',
    },
    specs: [
      { label: 'TABLETOP', value: '50mm Honed Roman Travertine with Soft Organic Chamfer' },
      { label: 'PEDESTAL', value: 'Asymmetric Sculpted Architectural Fluted Column' },
      { label: 'SHADOW GAP', value: 'Concealed 15mm Inverted Floating Plinth Reveal' },
      { label: 'ACCENTS', value: 'Solid Brushed Brass Counter-Balance Footing' },
    ],
    hotspots: [
      { id: 'top', label: 'PEBBLE-FORM SLAB', text: 'VIEW TEXTURE', pos: [0, 0.4, 0] },
      { id: 'fluting', label: 'SCULPTED PEDESTAL', text: 'INSPECT ARCHITECTURE', pos: [-0.25, 0.18, 0] },
      { id: 'brass_foot', label: 'BRASS FOOTER', text: 'VIEW MATERIAL', pos: [0.35, 0.08, 0] },
    ],
    explodeParts: [
      { id: 'top_slab', label: '50MM STONE TABLETOP', dir: [0, 0.7, 0] },
      { id: 'subframe', label: 'STEEL STRUCTURAL DISC', dir: [0, 0.2, 0] },
      { id: 'pedestal', label: 'ASYMMETRIC FLUTED PEDESTAL', dir: [-0.6, -0.2, 0] },
      { id: 'brass_ring', label: 'BRASS ACCENT FOOTER', dir: [0.6, -0.4, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 06 — SIGNATURE DINING TABLE (DINING) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'dining_table',
    num: '06',
    category: 'DINING',
    name: 'HAZZINO SIGNATURE DINING TABLE',
    subtitle: 'DINING COLLECTION',
    tagline: 'Monolithic soft-rectangular dining table poised on sculptural fluted semi-elliptical pedestals.',
    dimensions: 'W 260 × D 115 × H 76 CM',
    dimensionsMM: { w: 2600, d: 1150, h: 760 },
    defaultMaterial: 'beige_stone',
    defaultColor: 'sand_beige',
    defaultFinish: 'natural',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['beige_stone', 'white_stone', 'marble', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [2.5, 1.2, 3.8], target: [0, 0.45, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT TABLE',
    },
    specs: [
      { label: 'TABLETOP', value: '55mm Honed Natural Stone Slab with Radius Corners & Reverse Bevel' },
      { label: 'PEDESTALS', value: 'Twin Fluted Architectural Semi-Elliptical Monoliths' },
      { label: 'COLLARS', value: 'Turned Brushed Champagne Brass Junction Rings' },
      { label: 'CAPACITY', value: 'Comfortably Accommodates 8 to 10 Diners' },
    ],
    hotspots: [
      { id: 'top', label: 'CHAMFERED TABLETOP', text: 'VIEW SLAB', pos: [0, 0.78, 0] },
      { id: 'pedestal_l', label: 'LEFT FLUTED PEDESTAL', text: 'VIEW FLUTING', pos: [-0.85, 0.35, 0] },
      { id: 'pedestal_r', label: 'RIGHT FLUTED PEDESTAL', text: 'VIEW FLUTING', pos: [0.85, 0.35, 0] },
      { id: 'tie_bar', label: 'BRASS TIE STRETCHER', text: 'VIEW JOINERY', pos: [0, 0.18, 0] },
    ],
    explodeParts: [
      { id: 'top_slab', label: '55MM HONED SLAB', dir: [0, 0.95, 0] },
      { id: 'sub_spine', label: 'HIGH-TENSILE STEEL SUB-PLATE', dir: [0, 0.35, 0] },
      { id: 'pedestal_l', label: 'LEFT FLUTED PEDESTAL', dir: [-1.1, -0.2, 0] },
      { id: 'pedestal_r', label: 'RIGHT FLUTED PEDESTAL', dir: [1.1, -0.2, 0] },
      { id: 'brass_plinths', label: 'BRASS BASE COLLARS', dir: [0, -0.7, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 07 — DINING CHAIR (SEATING) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'dining_chair',
    num: '07',
    category: 'SEATING',
    name: 'HAZZINO DINING CHAIR',
    subtitle: 'DINING COLLECTION',
    tagline: 'Steam-bent solid timber silhouette with continuous curved upholstered backrest and brass ferrules.',
    dimensions: 'W 56 × D 58 × H 82 CM',
    dimensionsMM: { w: 560, d: 580, h: 820 },
    defaultMaterial: 'fabric',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['fabric', 'leather', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [1.5, 0.85, 3.0], target: [0, 0.45, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: false,
      hasBedStorage: false,
      interactLabel: 'INSPECT 360°',
    },
    specs: [
      { label: 'BACKREST', value: 'Steam-Bent Continuous Ergonomic Wrap in Tactile Wool' },
      { label: 'SEAT', value: 'Contoured Latex Foam Core with Hand-Tailored Welt Stitching' },
      { label: 'LEGS', value: 'Tapered Solid American Walnut with Raked Rear Stance' },
      { label: 'FERRULES', value: 'Solid Machined Brushed Brass Footer Cups' },
    ],
    hotspots: [
      { id: 'back', label: 'CURVED BACKREST', text: 'VIEW ERGONOMICS', pos: [0, 0.72, -0.18] },
      { id: 'seat', label: 'TAILORED SEAT', text: 'VIEW FABRIC', pos: [0, 0.48, 0.08] },
      { id: 'legs', label: 'TAPERED TIMBER LEGS', text: 'VIEW JOINERY', pos: [-0.22, 0.15, 0.18] },
      { id: 'ferrules', label: 'BRASS FERRULES', text: 'VIEW HARDWARE', pos: [0.22, 0.03, 0.18] },
    ],
    explodeParts: [
      { id: 'backrest', label: 'CURVED UPHOLSTERED BACKREST', dir: [0, 0.6, -0.7] },
      { id: 'seat_cushion', label: 'CONTOURED SEAT CUSHION', dir: [0, 0.65, 0.2] },
      { id: 'side_rails', label: 'TIMBER APRON JOINERY', dir: [0, 0.1, 0] },
      { id: 'front_legs', label: 'FRONT TAPERED LEGS', dir: [-0.4, -0.7, 0.4] },
      { id: 'rear_legs', label: 'RAKED REAR LEGS', dir: [0.4, -0.7, -0.4] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 08 — STORAGE BED (BEDROOM) — NEW WITH UNDER-BED DRAWERS
  // ---------------------------------------------------------------------------
  {
    id: 'storage_bed',
    num: '08',
    category: 'BEDROOM',
    name: 'HAZZINO STORAGE BED',
    subtitle: 'BEDROOM COLLECTION',
    tagline: 'Architectural platform bed with channeled headboard and 3 integrated sliding storage drawers.',
    dimensions: 'W 215 × D 225 × H 105 CM',
    dimensionsMM: { w: 2150, d: 2250, h: 1050 },
    defaultMaterial: 'fabric',
    defaultColor: 'warm_ivory',
    defaultFinish: 'matte',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['fabric', 'leather', 'natural_wood', 'walnut_wood'],
    cameraFocus: { pos: [2.2, 1.35, 4.4], target: [0, 0.55, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: true,
      interactLabel: 'OPEN BED STORAGE',
    },
    specs: [
      { label: 'HEADBOARD', value: 'Generous Upholstered Headboard with Integrated Side Wings' },
      { label: 'UNDER-BED STORAGE', value: '3 × Full-Depth Cedar Drawers (Left, Right, and Front Foot)' },
      { label: 'PLATFORM', value: 'Solid American Walnut Chassis with Cantilevered Shadow Plinth' },
      { label: 'MATTRESS', value: 'Multi-Zone Pocket Spring with Belgian Quilted Linen Coverlet' },
    ],
    hotspots: [
      { id: 'headboard', label: 'CHANNEL HEADBOARD', text: 'VIEW UPHOLSTERY', pos: [0, 0.95, -1.05] },
      { id: 'drawer_left', label: 'LEFT STORAGE DRAWER', text: 'SLIDE DRAWER', pos: [-1.08, 0.22, 0.1] },
      { id: 'drawer_right', label: 'RIGHT STORAGE DRAWER', text: 'SLIDE DRAWER', pos: [1.08, 0.22, 0.1] },
      { id: 'drawer_front', label: 'FRONT STORAGE DRAWER', text: 'SLIDE DRAWER', pos: [0, 0.22, 1.1] },
      { id: 'mattress', label: 'ORGANIC LINEN MATTRESS', text: 'VIEW COMFORT', pos: [0, 0.48, 0] },
    ],
    explodeParts: [
      { id: 'headboard', label: 'UPHOLSTERED WING HEADBOARD', dir: [0, 0.8, -0.9] },
      { id: 'mattress', label: 'QUILTED LINEN MATTRESS', dir: [0, 0.85, 0.2] },
      { id: 'drawer_l', label: 'LEFT CEDAR DRAWER', dir: [-1.1, 0, 0] },
      { id: 'drawer_r', label: 'RIGHT CEDAR DRAWER', dir: [1.1, 0, 0] },
      { id: 'drawer_f', label: 'FRONT FOOT DRAWER', dir: [0, 0, 1.1] },
      { id: 'bed_chassis', label: 'SOLID WALNUT FRAME', dir: [0, 0.1, 0] },
      { id: 'plinth', label: 'RECESSED SHADOW BASE', dir: [0, -0.7, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 09 — ARCHITECT WRITING DESK (WORKSPACE) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'writing_desk',
    num: '09',
    category: 'WORKSPACE',
    name: 'HAZZINO ARCHITECT WRITING DESK',
    subtitle: 'WORKSPACE COLLECTION',
    tagline: 'Modern executive workspace with full-width soft-close organizer drawer and concealed brass cable duct.',
    dimensions: 'W 165 × D 78 × H 75 CM',
    dimensionsMM: { w: 1650, d: 780, h: 750 },
    defaultMaterial: 'natural_wood',
    defaultColor: 'walnut_brown',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['natural_wood', 'walnut_wood', 'leather', 'marble', 'metal'],
    cameraFocus: { pos: [1.8, 1.1, 3.5], target: [0, 0.52, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN DRAWER',
    },
    specs: [
      { label: 'WORKTOP', value: 'Solid American Walnut Slab with Inset Saddle Leather Blotter Pad' },
      { label: 'DRAWER', value: 'Integrated Full-Width Soft-Close Tray with Machined Brass Knife Pull' },
      { label: 'CABLE CHANNEL', value: 'Concealed Rear Raceway with Flush Brushed Brass Flip Lid' },
      { label: 'TRESTLE BASE', value: 'Architectural Tapered Angled Legs with Solid Timber Tie Rod' },
    ],
    hotspots: [
      { id: 'blotter', label: 'LEATHER DESK PAD', text: 'VIEW INLAY', pos: [0, 0.77, 0.08] },
      { id: 'drawer', label: 'INTEGRATED DRAWER', text: 'OPEN DRAWER', pos: [-0.25, 0.65, 0.38] },
      { id: 'cable_duct', label: 'BRASS CABLE DUCT', text: 'VIEW HARDWARE', pos: [0.35, 0.77, -0.32] },
      { id: 'trestle', label: 'TRESTLE LEG JOINERY', text: 'VIEW JOINERY', pos: [-0.68, 0.35, 0] },
    ],
    explodeParts: [
      { id: 'top_slab', label: 'WALNUT WORKTOP & LEATHER PAD', dir: [0, 0.7, 0] },
      { id: 'drawer', label: 'INTEGRATED ORGANIZER DRAWER', dir: [0, 0, 0.8] },
      { id: 'cable_lid', label: 'BRASS CABLE COVER', dir: [0, 0.9, -0.3] },
      { id: 'side_module', label: 'RIGHT PEDESTAL CASING', dir: [0.7, 0, 0] },
      { id: 'legs_left', label: 'LEFT TRESTLE LEG', dir: [-0.8, -0.4, 0] },
      { id: 'legs_right', label: 'RIGHT TRESTLE LEG', dir: [0.8, -0.4, 0] },
    ],
  },

  // ---------------------------------------------------------------------------
  // 10 — NIGHT CONSOLE (BEDROOM) — NEW
  // ---------------------------------------------------------------------------
  {
    id: 'night_console',
    num: '10',
    category: 'BEDROOM',
    name: 'HAZZINO NIGHT CONSOLE',
    subtitle: 'BEDROOM COLLECTION',
    tagline: 'Pill-curved architectural bedside console with upper push-release drawer and open display gallery.',
    dimensions: 'W 58 × D 42 × H 52 CM',
    dimensionsMM: { w: 580, d: 420, h: 520 },
    defaultMaterial: 'walnut_wood',
    defaultColor: 'deep_walnut',
    defaultFinish: 'satin',
    defaultWood: 'warm_walnut',
    supportedMaterials: ['walnut_wood', 'natural_wood', 'marble', 'beige_stone', 'metal'],
    cameraFocus: { pos: [1.3, 0.8, 2.5], target: [0, 0.32, 0] },
    features: {
      canRotate: true,
      hasExplode: true,
      hasDoors: false,
      hasDrawers: true,
      hasBedStorage: false,
      interactLabel: 'OPEN DRAWER',
    },
    specs: [
      { label: 'CARCASS', value: 'Mitred Solid American Walnut with Gentle Continuous Radius Corners' },
      { label: 'DRAWER', value: 'Felt-Lined Upper Storage Tray with Concealed Touch-To-Open Runner' },
      { label: 'LOWER SHELF', value: 'Open Display Niche for Architectural Monographs & Essentials' },
      { label: 'FOOTING', value: 'Recessed 20mm Shadow Base with Brushed Brass Trim Collar' },
    ],
    hotspots: [
      { id: 'drawer', label: 'FELT-LINED DRAWER', text: 'OPEN DRAWER', pos: [0, 0.42, 0.22] },
      { id: 'open_shelf', label: 'OPEN LOWER GALLERY', text: 'VIEW SHELF', pos: [0, 0.2, 0] },
      { id: 'casing', label: 'PILL-CURVED EDGES', text: 'VIEW JOINERY', pos: [-0.28, 0.35, 0] },
      { id: 'plinth', label: 'BRASS FOOTER TRIM', text: 'VIEW BASE', pos: [0, 0.05, 0.18] },
    ],
    explodeParts: [
      { id: 'top_panel', label: 'BEVELED TOP SURFACE', dir: [0, 0.6, 0] },
      { id: 'drawer', label: 'FELT-LINED SLIDING DRAWER', dir: [0, 0.1, 0.7] },
      { id: 'shelf', label: 'LOWER DISPLAY SHELF', dir: [0, -0.2, 0.2] },
      { id: 'outer_case', label: 'PILL-CURVED BODY', dir: [0, 0, 0] },
      { id: 'plinth', label: 'BRASS SHADOW BASE', dir: [0, -0.5, 0] },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLEAR MATERIAL CLASSIFICATION (UNDERSTANDABLE CUSTOMER NAMES)
// ---------------------------------------------------------------------------
export const LAB_MATERIALS = [
  { id: 'natural_wood', name: 'Natural Wood', textureDetail: 'Quarter-sawn natural timber grain', roughness: 0.72, metalness: 0.02 },
  { id: 'walnut_wood', name: 'Walnut Wood', textureDetail: 'Deep espresso linear grain patina', roughness: 0.68, metalness: 0.02 },
  { id: 'white_stone', name: 'White Stone', textureDetail: 'Honed mineral cast matte surface', roughness: 0.82, metalness: 0.02 },
  { id: 'beige_stone', name: 'Beige Stone', textureDetail: 'Roman Navona travertine open pores', roughness: 0.88, metalness: 0.02 },
  { id: 'marble', name: 'Marble', textureDetail: 'Calacatta gold organic honed veins', roughness: 0.28, metalness: 0.04 },
  { id: 'fabric', name: 'Fabric', textureDetail: 'Tactile organic loop yarn bouclé', roughness: 0.92, metalness: 0.0 },
  { id: 'leather', name: 'Leather', textureDetail: 'Full-grain vegetable-tanned aniline', roughness: 0.38, metalness: 0.05 },
  { id: 'metal', name: 'Metal', textureDetail: 'Solid brushed champagne brass', roughness: 0.32, metalness: 0.88 },
];

export const LAB_FINISHES = [
  { id: 'matte', name: 'Matte', roughnessMod: 0.2 },
  { id: 'satin', name: 'Satin', roughnessMod: 0.0 },
  { id: 'natural', name: 'Natural', roughnessMod: 0.1 },
  { id: 'polished', name: 'Polished', roughnessMod: -0.25 },
  { id: 'brushed', name: 'Brushed', roughnessMod: -0.1 },
];

export const LAB_WOOD_TYPES = [
  { id: 'natural_oak', name: 'Natural Oak', hex: '#d4ba96' },
  { id: 'warm_walnut', name: 'Warm Walnut', hex: '#5a3826' },
  { id: 'dark_walnut', name: 'Dark Walnut', hex: '#382417' },
  { id: 'teak', name: 'Teak', hex: '#7a4f2b' },
];

export const LAB_UPHOLSTERY = [
  { id: 'cream_fabric', name: 'Cream Fabric', hex: '#ede8dd' },
  { id: 'sand_fabric', name: 'Sand Fabric', hex: '#d9cdbe' },
  { id: 'olive_fabric', name: 'Olive Fabric', hex: '#30483c' },
  { id: 'charcoal_fabric', name: 'Charcoal Fabric', hex: '#222120' },
  { id: 'warm_beige_fabric', name: 'Warm Beige Fabric', hex: '#c8bba8' },
  { id: 'cognac_leather', name: 'Cognac Leather', hex: '#8a4b2a' },
];

export const LAB_METALS = [
  { id: 'brushed_brass', name: 'Brushed Brass', hex: '#b89452' },
  { id: 'matte_black', name: 'Matte Black', hex: '#1a1918' },
  { id: 'champagne_metal', name: 'Champagne Metal', hex: '#c5a878' },
];

// ---------------------------------------------------------------------------
// 10 HAZZINO LUXURY COLOR PALETTE
// ---------------------------------------------------------------------------
export const LAB_COLORS = [
  { id: 'cloud_white', num: '01', name: 'Cloud White', hex: '#f8f8f6', threeColor: 0xf8f8f6 },
  { id: 'warm_ivory', num: '02', name: 'Warm Ivory', hex: '#ede8dd', threeColor: 0xede8dd },
  { id: 'sand_beige', num: '03', name: 'Sand Beige', hex: '#d9cdbe', threeColor: 0xd9cdbe },
  { id: 'taupe', num: '04', name: 'Taupe', hex: '#9e9282', threeColor: 0x9e9282 },
  { id: 'walnut_brown', num: '05', name: 'Walnut Brown', hex: '#5a3826', threeColor: 0x5a3826 },
  { id: 'deep_walnut', num: '06', name: 'Deep Walnut', hex: '#382417', threeColor: 0x382417 },
  { id: 'forest_green', num: '07', name: 'Forest Green', hex: '#30483c', threeColor: 0x30483c },
  { id: 'terracotta', num: '08', name: 'Terracotta', hex: '#8b4a3e', threeColor: 0x8b4a3e },
  { id: 'charcoal', num: '09', name: 'Charcoal', hex: '#222120', threeColor: 0x222120 },
  { id: 'champagne_gold', num: '10', name: 'Champagne Gold', hex: '#b89452', threeColor: 0xb89452 },
];

// ---------------------------------------------------------------------------
// CATEGORIES FOR PRODUCT NAVIGATION
// ---------------------------------------------------------------------------
export const LAB_CATEGORIES = [
  { id: 'ALL', name: 'ALL PIECES' },
  { id: 'SEATING', name: 'SEATING' },
  { id: 'STORAGE', name: 'STORAGE' },
  { id: 'DINING', name: 'DINING' },
  { id: 'BEDROOM', name: 'BEDROOM' },
  { id: 'WORKSPACE', name: 'WORKSPACE' },
];

// ---------------------------------------------------------------------------
// CINEMATIC STUDIO CAMERA PRESETS
// ---------------------------------------------------------------------------
export const CAMERA_PRESETS = [
  { id: 'hero', name: 'HERO', pos: [0, 0.85, 4.4], target: [0, 0.45, 0] },
  { id: 'front', name: 'FRONT', pos: [0, 0.6, 4.2], target: [0, 0.5, 0] },
  { id: 'side', name: 'SIDE', pos: [4.4, 0.6, 0], target: [0, 0.5, 0] },
  { id: 'back', name: 'BACK', pos: [0, 0.7, -4.4], target: [0, 0.5, 0] },
  { id: 'top', name: 'TOP', pos: [0, 5.2, 0.1], target: [0, 0, 0] },
  { id: 'detail', name: 'DETAIL', pos: [0.6, 0.7, 1.8], target: [0, 0.45, 0] },
  { id: 'exploded', name: 'EXPLODED', pos: [0.8, 1.4, 5.2], target: [0, 0.5, 0] },
];
