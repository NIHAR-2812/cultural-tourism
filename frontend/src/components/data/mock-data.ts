export interface Host {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  rating: number;
  reviewsCount: number;
  joinedYear: number;
  verified: boolean;
  communityImpact: string;
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  humidity: string;
  uvIndex: string;
  bestSeason: string;
}

export interface Destination {
  id: string;
  title: string;
  tagline: string;
  location: string;
  region: string;
  coordinates: { lat: number; lng: number };
  coverImage: string;
  gallery: string[];
  price: number; // In INR ₹
  unit: string;
  rating: number;
  reviewsCount: number;
  sustainabilityScore: number;
  sustainabilityHighlights: string[];
  currentCapacity: number;
  maxCapacity: number;
  isAtCapacity?: boolean;
  category: 'Rainforest' | 'Coastal' | 'Mountain' | 'Village' | 'Wildlife';
  description: string;
  longDescription: string;
  highlights: string[];
  host: Host;
  weather: WeatherInfo;
  nearbyAttractions: { name: string; distance: string; description: string }[];
  ecoCertificateId: string;
  carbonOffsetKg: number;
}

export interface AlternativeRecommendation {
  id: string;
  title: string;
  location: string;
  distanceKm: number;
  coverImage: string;
  sustainabilityScore: number;
  currentCapacity: number;
  maxCapacity: number;
  price: number;
  reason: string;
  bonusImpactPoints: number;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'divar-island-sanctuary',
    title: 'Divar Island Eco-Estuary & Bird Sanctuary',
    tagline: 'Solar-powered mangrove stay along the Mandovi River backwaters',
    location: 'Divar Island, Tiswadi, Goa',
    region: 'Goan Hinterland & Estuaries',
    coordinates: { lat: 15.518, lng: 73.916 },
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 12500,
    unit: 'night',
    rating: 4.96,
    reviewsCount: 84,
    sustainabilityScore: 98,
    sustainabilityHighlights: [
      '100% Off-grid Solar Powered',
      'Zero Plastic Bottle Guarantee',
      '20% Revenue to Estuary Replanting',
      'Traditional Goan Clay Cooling'
    ],
    currentCapacity: 14,
    maxCapacity: 16,
    isAtCapacity: false,
    category: 'Coastal',
    description: 'Paddle silent wooden canoes through ancient tidal mangroves, reside in restored 19th-century Goan red laterite cottages, and savor organic coconut farm harvests.',
    longDescription: 'Divar Island remains one of Goa’s most serene ecological gems. Tucked away in the calm waters of the Mandovi River, this community sanctuary operates under strict carrying limits to protect endemic smooth-coated otters, white-bellied sea eagles, and migratory mudflat birds.',
    highlights: [
      'Dawn silent mangrove paddling with resident Goan ornithologist',
      'Organic coconut palm & kokum farm-to-table culinary workshop',
      'Bio-luminescent night estuarine boat safari (seasonal)',
      'Traditional Goan Poi bread-making with village master baker'
    ],
    host: {
      id: 'host-1',
      name: 'Ramesh & Maya Prabhu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Native Goan conservationists dedicated to estuarine biodiversity restoration and Portuguese-Goan heritage preservation.',
      role: 'Estuary Steward & Permaculturist',
      rating: 4.98,
      reviewsCount: 142,
      joinedYear: 2019,
      verified: true,
      communityImpact: 'Funded 4 hectares of mangrove replanting and supported 12 local fishing families.'
    },
    weather: {
      temp: '28°C',
      condition: 'Tropical Coastal Breeze',
      humidity: '68%',
      uvIndex: 'Moderate (5)',
      bestSeason: 'October – April'
    },
    nearbyAttractions: [
      { name: 'Chorão Island Dr. Salim Ali Bird Sanctuary', distance: '3.2 km', description: 'Protected estuarine wetland home to over 140 migratory bird species.' },
      { name: 'Old Goa Heritage Spice Plantation', distance: '5.8 km', description: 'Organic nutmeg and cardamon forest cultivated for over 3 centuries.' }
    ],
    ecoCertificateId: 'ECO-GOA-2026-089',
    carbonOffsetKg: 42
  },
  {
    id: 'netravali-cloud-forest',
    title: 'Netravali Sacred Grove Canopy Lodge',
    tagline: 'Elevated bamboo treehouses high in the Western Ghats UNESCO Biosphere',
    location: 'Netravali Wildlife Sanctuary, South Goa',
    region: 'Western Ghats Biosphere Corridor',
    coordinates: { lat: 15.121, lng: 74.214 },
    coverImage: 'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 15800,
    unit: 'night',
    rating: 4.98,
    reviewsCount: 62,
    sustainabilityScore: 99,
    sustainabilityHighlights: [
      'Zero Concrete Canopy Architecture',
      '100% Stream Micro-Hydro Power',
      'Sacred Forest Protection Agreement',
      'Tribal Forest Ranger Employment'
    ],
    currentCapacity: 12,
    maxCapacity: 12,
    isAtCapacity: true,
    category: 'Rainforest',
    description: 'Elevated bamboo suites built 18 meters high in the jungle canopy overlooking natural waterfalls and medicinal forest aquifers.',
    longDescription: 'Nestled inside the sacred Devrai forest corridors of South Goa, Netravali Cloud Forest Lodge strictly enforces a 12-guest daily limit to maintain forest soil integrity and prevent wildlife corridor disruption.',
    highlights: [
      'Guided trek to the mysterious bubbling Budbudyanchi Tali lake',
      'Night amphibian and bio-luminescent fungi discovery walk',
      'Medicinal herb bath prepared with local Gaonkar healers',
      'Stargazing deck high above urban light pollution'
    ],
    host: {
      id: 'host-2',
      name: 'Devendra Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Former wildlife researcher and Western Ghats ecologist dedicated to low-footprint sanctuary stays.',
      role: 'Rainforest Canopy Director',
      rating: 4.99,
      reviewsCount: 98,
      joinedYear: 2018,
      verified: true,
      communityImpact: 'Protected 120 acres of primeval cloud forest from illegal logging.'
    },
    weather: {
      temp: '24°C',
      condition: 'Canopy Mist & Sunshine',
      humidity: '78%',
      uvIndex: 'Low (3)',
      bestSeason: 'All Year Round'
    },
    nearbyAttractions: [
      { name: 'Savri Waterfall Springs', distance: '2.1 km', description: 'Crystal-clear mountain fall fed by pristine rainforest aquifers.' },
      { name: 'Bubble Lake (Budbudyanchi Tali)', distance: '4.5 km', description: 'Ancient sacred pond with mysterious rhythmic gas bubbles.' }
    ],
    ecoCertificateId: 'ECO-WGHATS-2026-004',
    carbonOffsetKg: 68
  },
  {
    id: 'spiti-high-altitude-lodge',
    title: 'Spiti Solar High-Altitude Sanctuary',
    tagline: 'Off-grid adobe mud retreat overlooking snow-capped Himalayan peaks & Kibber monastery',
    location: 'Kibber Village, Spiti Valley, Himachal',
    region: 'Trans-Himalayan Cold Desert',
    coordinates: { lat: 32.331, lng: 78.009 },
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 16500,
    unit: 'night',
    rating: 4.99,
    reviewsCount: 47,
    sustainabilityScore: 99,
    sustainabilityHighlights: [
      'Passive Solar Thermal Architecture',
      'Snow Leopard Conservation Fund',
      'Zero Wastewater Himalayan Recirculation',
      'Buddhist Monastery Eco-Pact'
    ],
    currentCapacity: 8,
    maxCapacity: 10,
    isAtCapacity: false,
    category: 'Mountain',
    description: 'Reside in hand-pressed sun-baked adobe earth homes perched 4,200 meters high in the Himalayas, guided by native snow leopard spotters.',
    longDescription: 'Perched in Kibber, one of the world’s highest inhabited villages, Spiti Solar High-Altitude Sanctuary combines ancient Himalayan ram-earth insulating techniques with modern passive solar glass traps. 30% of guest tariffs directly fund snow leopard prey base protection.',
    highlights: [
      'Snow leopard & blue sheep winter wildlife tracking trail',
      'Sunrise butter tea ceremony at 1,000-year-old Key Monastery',
      'High-altitude Himalayan botanical tea foraging',
      'Stargazing high above Himalayan mountain clouds'
    ],
    host: {
      id: 'host-spiti',
      name: 'Tenzin Norbu & Sonam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'High-altitude wildlife tracker and Spiti valley native preserving snow leopard habitat corridors.',
      role: 'Himalayan Wildlife Custodian',
      rating: 4.99,
      reviewsCount: 78,
      joinedYear: 2018,
      verified: true,
      communityImpact: 'Funded solar heating systems for 14 remote Kibber village households.'
    },
    weather: {
      temp: '14°C',
      condition: 'Crisp Mountain Sunshine',
      humidity: '32%',
      uvIndex: 'High (8)',
      bestSeason: 'May – October'
    },
    nearbyAttractions: [
      { name: 'Key Monastery Citadel', distance: '6.4 km', description: 'Ancient 11th-century Tibetan Buddhist monastic retreat.' },
      { name: 'Chicham High Suspension Bridge', distance: '3.1 km', description: 'Highest bridge in Asia spanning a deep Himalayan gorge.' }
    ],
    ecoCertificateId: 'ECO-SPITI-2026-012',
    carbonOffsetKg: 75
  },
  {
    id: 'agonda-turtle-dunes',
    title: 'Agonda Dune Eco-Retreat & Turtle Sanctuary',
    tagline: 'Beachfront canvas pavilions protecting Olive Ridley sea turtle nesting dunes',
    location: 'Agonda Beach, Canacona, South Goa',
    region: 'South Goa Conservation Coast',
    coordinates: { lat: 15.045, lng: 73.987 },
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 11000,
    unit: 'night',
    rating: 4.92,
    reviewsCount: 110,
    sustainabilityScore: 96,
    sustainabilityHighlights: [
      'Red-Spectrum Turtle-Friendly Lights',
      'Zero Dune Structure Alteration',
      'Community Nest Guard Patrol',
      'Composting Sanitation System'
    ],
    currentCapacity: 10,
    maxCapacity: 18,
    isAtCapacity: false,
    category: 'Coastal',
    description: 'Demountable luxury canvas villas positioned behind coastal sand dunes with strict red-light protocols to shield nesting sea turtles.',
    longDescription: 'Agonda Dune Eco-Retreat operates in active partnership with the Forest Department Turtle Patrol.',
    highlights: [
      'Midnight silent sea turtle hatching guard walk (Oct-Mar)',
      'Sunset yoga overlooking untouched granite headlands',
      'Traditional Goan seafood curry cooked with coconut charcoal',
      'Stand-up paddleboarding in calm estuarine lagoons'
    ],
    host: {
      id: 'host-3',
      name: 'Ananya & Sean Patel',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Oceanographers and turtle conservation volunteers running zero-waste coastal living workshops.',
      role: 'Coastal Dune Custodians',
      rating: 4.95,
      reviewsCount: 167,
      joinedYear: 2020,
      verified: true,
      communityImpact: 'Successfully protected 450+ sea turtle hatchlings in 2025 season.'
    },
    weather: {
      temp: '29°C',
      condition: 'Clear Coastal Skies',
      humidity: '65%',
      uvIndex: 'High (7)',
      bestSeason: 'November – March'
    },
    nearbyAttractions: [
      { name: 'Cabo de Rama Fort Ruins', distance: '7.8 km', description: 'Ancient cliffside fortress commanding panoramic views of the Arabian Sea.' },
      { name: 'Butterfly Beach Cove', distance: '5.2 km', description: 'Secluded crescent bay accessible only by foot trail or wooden rowboat.' }
    ],
    ecoCertificateId: 'ECO-COAST-2026-112',
    carbonOffsetKg: 35
  },
  {
    id: 'kumarakom-backwater-sanctuary',
    title: 'Kumarakom Bamboo Estuary Stays',
    tagline: 'Handcrafted bamboo houseboats floating on Vembanad Lake',
    location: 'Kumarakom, Kottayam, Kerala',
    region: 'Kerala Backwaters & Wetlands',
    coordinates: { lat: 9.617, lng: 76.427 },
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 14200,
    unit: 'night',
    rating: 4.97,
    reviewsCount: 88,
    sustainabilityScore: 97,
    sustainabilityHighlights: [
      'Solar Electric Propulsion',
      'Zero Water Discharge Systems',
      'Kerala Sadya Organic Feast',
      'Wetland Bird Reserve Support'
    ],
    currentCapacity: 8,
    maxCapacity: 14,
    isAtCapacity: false,
    category: 'Coastal',
    description: 'Glide quietly through lotus-filled backwater channels in solar-powered bamboo Kettuvalam boats, guided by traditional Kerala boatmen.',
    longDescription: 'Floating serenely on the calm waters of Vembanad Lake, Kumarakom Estuary Stays showcase traditional Kerala wooden craftmanship (Kettuvalam) built using coir rope binding without a single iron nail.',
    highlights: [
      'Sunrise canoeing into Kumarakom Bird Reserve wetland creeks',
      'Traditional Kerala Sadya served on fresh banana leaves',
      'Ayurvedic herbal oil massage with village Vaidyar',
      'Traditional net-fishing with local estuarine fishermen'
    ],
    host: {
      id: 'host-4',
      name: 'Unnikrishnan Nair',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Master boatbuilder and backwater ecological custodian preserving Kerala water heritage.',
      role: 'Backwater Sanctuary Director',
      rating: 4.98,
      reviewsCount: 92,
      joinedYear: 2017,
      verified: true,
      communityImpact: 'Sponsors 18 local boat-making artisans and estuarine conservation.'
    },
    weather: {
      temp: '27°C',
      condition: 'Tropical Palms & Breeze',
      humidity: '75%',
      uvIndex: 'Moderate (5)',
      bestSeason: 'September – March'
    },
    nearbyAttractions: [
      { name: 'Kumarakom Bird Sanctuary', distance: '1.8 km', description: 'Sprawling 14-acre mangrove bird habitat.' },
      { name: 'Pathiramanal Island Reserve', distance: '4.2 km', description: 'Uninhabited island sanctuary reachable only by wooden rowboat.' }
    ],
    ecoCertificateId: 'ECO-KERALA-2026-055',
    carbonOffsetKg: 50
  },
  {
    id: 'cotigao-canopy-sanctuary',
    title: 'Cotigao Ancient Tree Sanctuary Lodge',
    tagline: 'Perched deep inside Goa’s primeval evergreen forest preserve',
    location: 'Cotigao Wildlife Sanctuary, Canacona',
    region: 'Western Ghats Foothills',
    coordinates: { lat: 14.962, lng: 74.135 },
    coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80'
    ],
    price: 13800,
    unit: 'night',
    rating: 4.94,
    reviewsCount: 51,
    sustainabilityScore: 97,
    sustainabilityHighlights: [
      'Solar-Kinetic Clean Power',
      '100% Organic Local Food Sourcing',
      'Wildlife Corridor Protection',
      'Velip Tribal Cultural Exchange'
    ],
    currentCapacity: 15,
    maxCapacity: 15,
    isAtCapacity: true,
    category: 'Wildlife',
    description: 'Experience 30-meter high canopy tree towers where dense forest foliage touches the sky, surrounded by rare Malabar giant squirrels.',
    longDescription: 'Cotigao Sanctuary Lodge offers a rare peek into untouched primeval evergreen forest where trees reach heights exceeding 30 meters.',
    highlights: [
      'Observation tower canopy viewing at sunrise',
      'Ethnobotanical foraging trail with tribal elder Suresh Velip',
      'Natural stream swimming in mineral-rich mountain pools',
      'Organic ragi and millet culinary masterclass'
    ],
    host: {
      id: 'host-5',
      name: 'Forest Ranger Suresh Velip',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Senior forest ranger and Velip tribal elder fostering harmony between wildlife and local villages.',
      role: 'Sanctuary Director',
      rating: 4.97,
      reviewsCount: 76,
      joinedYear: 2017,
      verified: true,
      communityImpact: 'Directly provides sustainable livelihoods for 28 indigenous families.'
    },
    weather: {
      temp: '26°C',
      condition: 'Shaded Forest Mist',
      humidity: '72%',
      uvIndex: 'Low (2)',
      bestSeason: 'October – May'
    },
    nearbyAttractions: [
      { name: 'Tree Top Watchtower Point', distance: '1.2 km', description: 'Overlooks a natural salt lick frequented by gaur (Indian bison) and panthers.' },
      { name: 'Bhamir Waterfall Trail', distance: '3.8 km', description: 'Gentle trek through dense deciduous bamboo brakes to a hidden pool.' }
    ],
    ecoCertificateId: 'ECO-COTIGAO-2026-031',
    carbonOffsetKg: 55
  }
];

export const ALTERNATIVE_RECOMMENDATIONS: Record<string, AlternativeRecommendation[]> = {
  'netravali-cloud-forest': [
    {
      id: 'cotigao-canopy-sanctuary',
      title: 'Cotigao Sacred Canopy Lodge',
      location: 'Cotigao Sanctuary (9.4 km away)',
      distanceKm: 9.4,
      coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      sustainabilityScore: 97,
      currentCapacity: 12,
      maxCapacity: 20,
      price: 13800,
      reason: 'Similar pristine high-canopy jungle atmosphere with active daily carrying quota.',
      bonusImpactPoints: 150
    },
    {
      id: 'divar-island-sanctuary',
      title: 'Divar Island Mangrove Sanctuary',
      location: 'Divar Island (14.2 km away)',
      distanceKm: 14.2,
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      sustainabilityScore: 98,
      currentCapacity: 10,
      maxCapacity: 16,
      price: 12500,
      reason: 'Off-grid water sanctuary offering quiet canoe paddling and rich birdwatching.',
      bonusImpactPoints: 200
    }
  ],
  'cotigao-canopy-sanctuary': [
    {
      id: 'agonda-turtle-dunes',
      title: 'Agonda Dune Eco-Retreat',
      location: 'Agonda Coast (11.8 km away)',
      distanceKm: 11.8,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      sustainabilityScore: 96,
      currentCapacity: 10,
      maxCapacity: 18,
      price: 11000,
      reason: 'Low-footprint canvas pavilions situated along sea turtle protection dunes.',
      bonusImpactPoints: 120
    }
  ]
};

export const HOST_ANALYTICS = {
  totalEarnings: '₹14,85,000',
  earningsGrowth: '+24.5%',
  totalGuests: 214,
  guestSatisfaction: 99.4,
  carryingCapacityHealth: 88,
  carbonOffsetTotalKg: 4250,
  communityWagesPaid: '₹7,20,000',
  treesPlantedCount: 340,
  upcomingBookings: [
    { id: 'b-101', guestName: 'Dr. Aditi Sen', guests: 2, dates: 'Aug 22 - Aug 26', status: 'Confirmed', ecoPledgeSigned: true, payout: '₹50,000' },
    { id: 'b-102', guestName: 'Rohan Sharma', guests: 1, dates: 'Sep 01 - Sep 05', status: 'Confirmed', ecoPledgeSigned: true, payout: '₹63,200' },
    { id: 'b-103', guestName: 'Meera Deshmukh', guests: 3, dates: 'Sep 12 - Sep 15', status: 'Pending Guide', ecoPledgeSigned: true, payout: '₹37,500' }
  ]
};

export const ADMIN_GOVERNANCE = {
  conservationFundCollected: '₹1,42,85,000',
  fundAllocation: [
    { category: 'Western Ghats Reforestation & Wildlife Corridors', percent: 45, amount: '₹64,28,250' },
    { category: 'Indigenous Goan Host Micro-Grants', percent: 30, amount: '₹42,85,500' },
    { category: 'Estuary Mangrove & Coral Restoration', percent: 15, amount: '₹21,42,750' },
    { category: 'Ecotourism Carrying Capacity Audits', percent: 10, amount: '₹14,28,500' }
  ],
  platformCarryingHealth: 'Optimal (84%)',
  destinationsMonitored: 48,
  activeHostsCount: 36,
  hectaresProtected: 1420,
  plasticDivertedKg: 18900,
  pendingHostApprovals: [
    {
      id: 'app-host-1',
      name: 'Sunil & Priya Naik',
      location: 'Chorão Island, Goa',
      proposalTitle: 'Estuarine Bamboo Solar Floating Cottages',
      sustainabilityScoreEst: 95,
      documentsUploaded: true,
      communityEndorsed: true,
      submissionDate: '2026-08-10',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'app-host-2',
      name: 'Dr. Kavita Menon',
      location: 'Silent Valley Buffer, Kerala',
      proposalTitle: 'Medicinal Plant Conservation Treehouse',
      sustainabilityScoreEst: 98,
      documentsUploaded: true,
      communityEndorsed: true,
      submissionDate: '2026-08-14',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    }
  ],
  pendingLocationApprovals: [
    {
      id: 'app-loc-1',
      title: 'Mollem Jungle Canopy Tree Towers',
      location: 'Mollem National Park, Goa',
      capacityProposed: 8,
      environmentalSensitivity: 'High (Strict Buffer)',
      coverImage: 'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80',
      hostName: 'Devendra Kulkarni',
      sustainabilityChecklistPassed: true
    }
  ]
};
