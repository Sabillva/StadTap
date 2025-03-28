// Sample game data - replace with your own story
export const gameData = {
  intro: {
    id: "intro",
    background: "/backgrounds/morning-city.jpg",
    backgroundEffect: {
      type: "zoom",
      direction: "in",
      duration: 3,
    },
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-worried.png",
        position: "center",
        animation: "fadeIn",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Sabahın ilk ışıklarıyla uyanan şehir, beklenmedik bir sessizliğe bürünmüştü. Normalde kuş cıvıltıları ve uzaklardan gelen araba sesleri eşlik ederdi bu saatlere, ama bu sabah farklıydı.",
    textEffect: "typewriter",
    nextSceneId: "scene2",
    bgm: "/sounds/morning-ambience.mp3",
  },
  scene2: {
    id: "scene2",
    background: "/backgrounds/morning-city.jpg",
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-worried.png",
        position: "center",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Rüzgar hafifçe esiyor, çam ağaçlarının iğnelerini sürüklüyordu. Hava her zamankinden soğuktu, içimi titreten bir soğukluktu bu.",
    textEffect: "typewriter",
    nextSceneId: "scene3",
    soundEffect: "/sounds/wind.mp3",
  },
  scene3: {
    id: "scene3",
    background: "/backgrounds/street.jpg",
    backgroundEffect: {
      type: "pan",
      direction: "right",
      duration: 4,
    },
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-thoughtful.png",
        position: "center",
        animation: "slideIn",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Çocukluğumun geçtiği sokaklar hala aynıydı; rüzgarın taşıdığı yasemin kokusunu bile hatırlıyordum. Ama bugün bu sokaklar, eskisi kadar sıcak gelmiyordu.",
    textEffect: "typewriter",
    nextSceneId: "scene4",
    isPageTurn: true,
  },
  scene4: {
    id: "scene4",
    background: "/backgrounds/door.jpg",
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-worried.png",
        position: "center",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Kapıdan çıktığımda, içimde bir ağırlık vardı. Ne olduğunu tam olarak bilmiyordum, ama bir şeylerin değişmek üzere olduğunu hissediyordum.",
    textEffect: "typewriter",
    nextSceneId: "scene5",
  },
  scene5: {
    id: "scene5",
    background: "/backgrounds/street.jpg",
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-scared.png",
        position: "center",
        animation: "shake",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Bir yerlerde bir şeyler kopmak üzereydi. Ama ne? Dün gece yaşadığım o garip olayı düşünmeden edemiyordum.",
    textEffect: "typewriter",
    choices: [
      {
        text: "Telefon konuşmasını hatırla",
        nextSceneId: "phone_memory",
      },
      {
        text: "Yürümeye devam et",
        nextSceneId: "continue_walking",
      },
    ],
    soundEffect: "/sounds/heartbeat.mp3",
  },
  phone_memory: {
    id: "phone_memory",
    background: "/backgrounds/night-room.jpg",
    panelStyle: "manga",
    mangaPanels: [
      {
        image: "/panels/phone-closeup.jpg",
        position: "topLeft",
        size: "medium",
      },
      {
        image: "/panels/luna-shocked-face.jpg",
        position: "topRight",
        size: "medium",
      },
      {
        image: "/panels/night-room-wide.jpg",
        position: "bottomLeft",
        size: "large",
      },
    ],
    characters: [],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Telefonun ucundaki ses o kadar tanıdıktı ki, bir an nefesim kesilmişti. Ama bu imkansızdı. Onunla son kez konuştuğumda, artık hayatta olmadığını biliyordum.",
    textEffect: "typewriter",
    nextSceneId: "phone_memory2",
    soundEffect: "/sounds/phone-ring.mp3",
  },
  phone_memory2: {
    id: "phone_memory2",
    background: "/backgrounds/night-room.jpg",
    backgroundEffect: {
      type: "shake",
      duration: 1,
    },
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-scared.png",
        position: "center",
        animation: "shake",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Bir insanın sesi böyle berrak, böyle canlı olabilir miydi? Telefonu elimde sıkı sıkıya tutarken, içimdeki korku ve merak birbirine karışıyordu.",
    textEffect: "typewriter",
    nextSceneId: "phone_memory3",
  },
  phone_memory3: {
    id: "phone_memory3",
    background: "/backgrounds/night-room.jpg",
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-scared.png",
        position: "center",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: 'O tanıdık ama bir o kadar yabancı ses kulaklarımda çınlamaya devam ediyordu. "Sana daha önce söylemiştim, değil mi?" demişti. Söylemişti.',
    textEffect: "typewriter",
    nextSceneId: "phone_memory4",
    soundEffect: "/sounds/eerie-voice.mp3",
  },
  phone_memory4: {
    id: "phone_memory4",
    background: "/backgrounds/night-room.jpg",
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-shocked.png",
        position: "center",
        animation: "bounce",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: 'Cevap arıyordum, ama bulduğum her cevap beni daha da derin bir bilinmeze itiyordu. Kafamda yankılanan tek bir cümle vardı: "Bunu bana neden yaptın?"',
    textEffect: "typewriter",
    nextSceneId: "continue_walking",
    isPageTurn: true,
  },
  continue_walking: {
    id: "continue_walking",
    background: "/backgrounds/street.jpg",
    backgroundEffect: {
      type: "pan",
      direction: "left",
      duration: 3,
    },
    characters: [
      {
        name: "Luna",
        image: "/characters/luna-determined.png",
        position: "center",
        animation: "fadeIn",
      },
    ],
    speaker: "Luna",
    speakerColor: "#8a2be2",
    text: "Düşüncelerimi bir kenara bırakıp yürümeye devam ettim. Cevapları bulacaktım, ama önce nereye gittiğimi bilmem gerekiyordu.",
    textEffect: "typewriter",
    nextSceneId: "end",
  },
  end: {
    id: "end",
    background: "/backgrounds/street-distant.jpg",
    backgroundEffect: {
      type: "zoom",
      direction: "out",
      duration: 5,
    },
    text: "Luna'nın hikayesi burada devam edecek...",
    textEffect: "typewriter",
    choices: [
      {
        text: "Baştan başla",
        nextSceneId: "intro",
      },
    ],
  },
};
