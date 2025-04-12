// Stadiums data with real images and coordinates
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
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.047007387643!2d49.919602!3d40.429958000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4030627c47e21ca3%3A0x97d2c86651bfc5b!2sBak%C4%B1%20Olimpiya%20Stadionu!5e0!3m2!1str!2saz!4v1744461983629!5m2!1str!2saz",
    mapUrl:
      "https://maps.google.com/maps?q=Bakı+Olimpiya+Stadionu&t=&z=15&ie=UTF8&iwloc=&output=embed",
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
    coordinates: [40.4301, 49.9019], // Actual coordinates for Baku Olympic Stadium
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
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12440.476840616338!2d49.88637423434274!3d40.406837964467705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403062b925a4172f%3A0x2f12045b9d07b467!2s%C5%9Eefa%20Stadyumu!5e0!3m2!1str!2saz!4v1744462355585!5m2!1str!2saz",
    mapUrl:
      "https://maps.google.com/maps?q=Şefa+Stadyumu&t=&z=15&ie=UTF8&iwloc=&output=embed",
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
    coordinates: [40.37, 49.95], // Coordinates for Nizami district
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
    coordinates: [40.47, 49.75], // Coordinates for Masazir area
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
    coordinates: [40.58, 49.65], // Coordinates for Khazar district in Sumqayit
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
    coordinates: [40.63, 48.64], // Coordinates for Shamakhi
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
    coordinates: [40.09, 49.38], // Coordinates for Gobustan area
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
    coordinates: [40.77, 47.05], // Coordinates for Mingachevir
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
    coordinates: [41.19, 47.17], // Coordinates for Sheki
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
    coordinates: [40.4258, 49.8679], // Actual coordinates for Tofiq Bahramov Stadium
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
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/Dalga_Arena.jpg",
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
    coordinates: [40.4897, 50.1425], // Coordinates for Mardakan area
  },
  {
    id: "4",
    name: "Azal Arena",
    city: "Bakı",
    address: "Shuvalan, Baku",
    description:
      "Compact stadium with a capacity of 3,200 spectators. Home to AZAL PFK.",
    hourlyRate: 90,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/AZAL_Arena.jpg",
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
    coordinates: [40.5033, 50.1144], // Coordinates for Shuvalan area
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
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Sumgayit_City_Stadium.jpg",
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
    coordinates: [40.5892, 49.6326], // Coordinates for Sumgayit
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
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Ganja_City_Stadium.jpg",
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
    coordinates: [40.6828, 46.3606], // Coordinates for Ganja
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
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Lankaran_City_Stadium.jpg",
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
    coordinates: [38.7546, 48.8512], // Coordinates for Lankaran
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
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Gabala_City_Stadium.jpg",
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
    coordinates: [40.98, 47.85], // Coordinates for Gabala
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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Bayil_Arena.jpg/1200px-Bayil_Arena.jpg",
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
    coordinates: [40.34, 49.82], // Coordinates for Bayil district
  },
];

export default stadiumsData;
