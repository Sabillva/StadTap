// Stadiums data with real images
const stadiumsData = [
  {
    id: "1",
    name: "Baku Olympic Stadium",
    city: "Bakı",
    address: "Heydar Aliyev Avenue, Baku",
    description:
      "The largest stadium in Azerbaijan with a capacity of 68,700 spectators. Home to the Azerbaijan national football team and has hosted the 2019 UEFA Europa League Final.",
    hourlyRate: 150,
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.8,
    reviews: 0, // Will be updated dynamically
  },
  {
    id: "2",
    name: "Tofiq Bahramov Stadium",
    city: "Bakı",
    address: "Ahmad Rajabli Street, Baku",
    description:
      "Historic stadium named after the famous Azerbaijani linesman. Home to several local clubs and has a capacity of 31,200 spectators.",
    hourlyRate: 120,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tofik_Bakhramov_Stadium.jpg/1200px-Tofik_Bakhramov_Stadium.jpg",
    amenities: {
      recording: true,
      buffet: false,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.5,
    reviews: 0,
  },
  {
    id: "3",
    name: "Dalga Arena",
    city: "Bakı",
    address: "Mardakan, Baku",
    description:
      "Modern stadium with a capacity of 6,500 spectators. Used for training and smaller matches.",
    hourlyRate: 100,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dalga_Arena.jpg/1200px-Dalga_Arena.jpg",
    amenities: {
      recording: false,
      buffet: true,
      parking: true,
      shower: false,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking"],
    rating: 4.3,
    reviews: 0,
  },
  {
    id: "4",
    name: "Azal Arena",
    city: "Bakı",
    address: "Shuvalan, Baku",
    description:
      "Compact stadium with a capacity of 3,200 spectators. Home to AZAL PFK.",
    hourlyRate: 90,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/AZAL_Arena.jpg/1200px-AZAL_Arena.jpg",
    amenities: {
      recording: false,
      buffet: false,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking"],
    rating: 4.1,
    reviews: 0,
  },
  {
    id: "5",
    name: "Sumgayit City Stadium",
    city: "Sumqayıt",
    address: "Sumgayit",
    description:
      "Main stadium in Sumgayit with a capacity of 15,350 spectators. Home to Sumgayit FK.",
    hourlyRate: 110,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sumgayit_City_Stadium.jpg/1200px-Sumgayit_City_Stadium.jpg",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: false,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.4,
    reviews: 0,
  },
  {
    id: "6",
    name: "Ganja City Stadium",
    city: "Gəncə",
    address: "Ganja",
    description:
      "Main stadium in Ganja with a capacity of 26,120 spectators. Home to Kapaz PFK.",
    hourlyRate: 100,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ganja_City_Stadium.jpg/1200px-Ganja_City_Stadium.jpg",
    amenities: {
      recording: true,
      buffet: false,
      parking: true,
      shower: false,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.2,
    reviews: 0,
  },
  {
    id: "7",
    name: "Lankaran City Stadium",
    city: "Gəncə",
    address: "Lankaran",
    description:
      "Stadium in Lankaran with a capacity of 15,000 spectators. Home to Lankaran FK.",
    hourlyRate: 95,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lankaran_City_Stadium.jpg/1200px-Lankaran_City_Stadium.jpg",
    amenities: {
      recording: false,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking"],
    rating: 4.0,
    reviews: 0,
  },
  {
    id: "8",
    name: "Gabala City Stadium",
    city: "Gəncə",
    address: "Gabala",
    description:
      "Modern stadium in Gabala with a capacity of 4,500 spectators. Home to Gabala FK.",
    hourlyRate: 105,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Gabala_City_Stadium.jpg/1200px-Gabala_City_Stadium.jpg",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.6,
    reviews: 0,
  },
  {
    id: "9",
    name: "Bayil Arena",
    city: "Bakı",
    address: "Bayil, Baku",
    description:
      "Modern football stadium located in the Bayil district of Baku with excellent facilities for training and matches.",
    hourlyRate: 110,
    image:
      "https://images.unsplash.com/photo-1521731299294-9c42659f6878?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: [
      "Floodlights",
      "Changing Rooms",
      "Parking",
      "Training Facilities",
    ],
    rating: 4.3,
    reviews: 0,
  },
  {
    id: "10",
    name: "Shafa Stadium",
    city: "Bakı",
    address: "Nizami district, Baku",
    description:
      "Community stadium with modern facilities, perfect for local tournaments and training sessions.",
    hourlyRate: 85,
    image:
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: false,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking"],
    rating: 4.0,
    reviews: 0,
  },
  {
    id: "11",
    name: "Masazir Football Center",
    city: "Bakı",
    address: "Masazir, Baku",
    description:
      "Modern football center with multiple pitches and excellent training facilities.",
    hourlyRate: 95,
    image:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: false,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Multiple Pitches"],
    rating: 4.2,
    reviews: 0,
  },
  {
    id: "12",
    name: "Khazar Stadium",
    city: "Sumqayıt",
    address: "Khazar district, Sumqayit",
    description:
      "Stadium with a capacity of 5,000 spectators, home to local tournaments and community events.",
    hourlyRate: 100,
    image:
      "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: false,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.1,
    reviews: 0,
  },
  {
    id: "13",
    name: "Shamakhi Arena",
    city: "Gəncə",
    address: "Shamakhi",
    description:
      "Modern stadium in the historic city of Shamakhi, featuring excellent facilities for professional matches.",
    hourlyRate: 105,
    image:
      "https://images.unsplash.com/photo-1542852869-ecc293ff89c0?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.4,
    reviews: 0,
  },
  {
    id: "14",
    name: "Gobustan Training Center",
    city: "Bakı",
    address: "Gobustan, Baku",
    description:
      "Training center with multiple pitches and modern facilities for teams of all levels.",
    hourlyRate: 90,
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: false,
      buffet: false,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: [
      "Floodlights",
      "Changing Rooms",
      "Parking",
      "Training Facilities",
    ],
    rating: 4.0,
    reviews: 0,
  },
  {
    id: "15",
    name: "Mingachevir Stadium",
    city: "Gəncə",
    address: "Mingachevir",
    description:
      "Main stadium in Mingachevir with a capacity of 10,000 spectators, hosting various sporting events.",
    hourlyRate: 95,
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.3,
    reviews: 0,
  },
  {
    id: "16",
    name: "Sheki Olympic Stadium",
    city: "Gəncə",
    address: "Sheki",
    description:
      "Modern stadium in the historic city of Sheki, featuring excellent facilities for professional matches.",
    hourlyRate: 100,
    image:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop",
    amenities: {
      recording: true,
      buffet: true,
      parking: true,
      shower: true,
      lockerRoom: true,
    },
    features: ["Floodlights", "Changing Rooms", "Parking", "Spectator Seating"],
    rating: 4.5,
    reviews: 0,
  },
];

export default stadiumsData;
