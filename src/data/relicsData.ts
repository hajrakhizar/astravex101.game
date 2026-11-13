import { SpaceRelic } from '../types/game';

export const SPACE_RELICS: SpaceRelic[] = [
  // --- THE MOON MISSIONS ---
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    year: 1969,
    body: 'moon',
    coordinates: { x: 380, y: 340 },
    landingSite: 'Mare Tranquillitatis (Sea of Tranquility)',
    earthLaunchDate: 'July 16, 1969',
    cutesyNickname: 'Eagle & First Moonprints',
    shortDescription: 'The historic descent stage of Lunar Module Eagle, the American flag, and the first human footprints.',
    detailedLore:
      'On July 20, 1969, humans first stepped upon another world. Astronauts Neil Armstrong and Edwin "Buzz" Aldrin landed the Lunar Module Eagle in the Sea of Tranquility while Michael Collins orbited above. Left behind on the lunar surface are the descent stage of Eagle with its golden foil legs, a commemorative plaque that reads "We came in peace for all mankind," a laser retroreflector array still pinged by Earth scientists today, and iconic lunar overshoe footprints preserved forever in the atmosphere-free vacuum.',
    primaryDiscovery: 'Proved humans can land safely on another celestial body and returned 21.5 kg of lunar rock and soil samples.',
    greeting: 'Buzzzz... Houston, Tranquility Base here! Hello little astronaut! 👋',
    speechDialogue: [
      'Welcome to the Sea of Tranquility! I am the Lunar Module Eagle descent stage. Over 50 years ago, Neil Armstrong and Buzz Aldrin stepped down my ladder right onto this silver regolith!',
      'Take a close look at the commemorative stainless-steel plaque on my leg: "Here Men From The Planet Earth First Set Foot Upon the Moon... We Came In Peace For All Mankind."',
      'I have guarded their footprints and this American flag in the silent vacuum ever since. Are you ready to see what you remember about 1969?'
    ],
    iconType: 'lunar_module',
    quizQuestions: [
      {
        id: 'a11-1',
        question: 'Who were the first two human astronauts to step onto the Moon during Apollo 11 in 1969?',
        options: [
          'Neil Armstrong & Buzz Aldrin',
          'Alan Shepard & John Glenn',
          'Yuri Gagarin & Michael Collins',
          'Gene Cernan & Pete Conrad',
        ],
        correctIndex: 0,
        explanation: 'Neil Armstrong was first to step down the ladder, followed closely by lunar module pilot Buzz Aldrin.',
        funFact: 'Their crewmate Michael Collins stayed in lunar orbit aboard the Command Module Columbia to pilot them back home!',
      },
      {
        id: 'a11-2',
        question: 'What famous words did Neil Armstrong speak as his boot touched the lunar regolith?',
        options: [
          '"Houston, the Eagle has landed."',
          '"That\'s one small step for man, one giant leap for mankind."',
          '"Look at the magnificent desolation of this world."',
          '"We came in peace for all humankind."',
        ],
        correctIndex: 1,
        explanation: 'Broadcast live to over 600 million people on Earth, Armstrong declared: "That\'s one small step for [a] man, one giant leap for mankind."',
        funFact: 'The footprints made by their boots may last for millions of years because there is no wind or rain on the Moon to erode them!',
      },
      {
        id: 'a11-3',
        question: 'What message was engraved on the plaque left behind on the leg of the Lunar Module Eagle?',
        options: [
          '"For the glory of Planet Earth and its explorers"',
          '"We came in peace for all mankind"',
          '"To boldly go where no one has gone before"',
          '"First station of the United States on the Moon"',
        ],
        correctIndex: 1,
        explanation: 'The stainless steel plaque bears two hemispheres of Earth and reads: "Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind."',
        funFact: 'It was signed by all three Apollo 11 astronauts and the US President.',
      },
    ],
  },
  {
    id: 'apollo-15',
    name: 'Apollo 15',
    year: 1971,
    body: 'moon',
    coordinates: { x: 740, y: 260 },
    landingSite: 'Hadley-Apennine Region (Hadley Rille)',
    earthLaunchDate: 'July 26, 1971',
    cutesyNickname: 'The First Moon Buggy Pioneer',
    shortDescription: 'The premier mission to deploy the Lunar Roving Vehicle, venturing across mountains and canyon rilles.',
    detailedLore:
      'Apollo 15 was the fourth crewed lunar landing and the first of the extended scientific "J-missions." Commander David Scott and Lunar Module Pilot James Irwin were the very first astronauts to drive an electric car on another world: Lunar Roving Vehicle 1 (LRV-001)! They explored the dramatic 1,000-foot-deep Hadley Rille gorge and collected the famous 4-billion-year-old "Genesis Rock." At the end of their final Moonwalk, Scott conducted Galileo\'s famous gravity experiment by dropping a heavy falcon feather and a geology hammer together.',
    primaryDiscovery: 'The Genesis Rock (anorthosite from the Moon’s original primordial crust) and proving Galileo\'s law of falling bodies.',
    greeting: 'Vroooom! Beep beep! Hello cosmic driver! 🚗✨',
    speechDialogue: [
      'Hey there! I am the very first Lunar Roving Vehicle (LRV-001)—humanity\'s original Moon Buggy! Commander Dave Scott and Jim Irwin unfolded me like an origami package and drove me across Hadley Rille gorge!',
      'My wheels aren\'t made of rubber—they are woven zinc-coated steel wire mesh so they wouldn\'t burst in the lunar vacuum! And look over there: Dave Scott dropped a falcon feather and a geology hammer simultaneously to prove Galileo\'s law of falling bodies!',
      'Hop into the driver\'s seat of history! Ready to test your driving knowledge?'
    ],
    iconType: 'moon_rover',
    quizQuestions: [
      {
        id: 'a15-1',
        question: 'Apollo 15 was the very first space mission to deploy which exciting transport device on the Moon?',
        options: [
          'A lunar jetpack hopper',
          'The Lunar Roving Vehicle (electric Moon Buggy)',
          'A pressurized sleeping camper rover',
          'A two-wheeled lunar motorbike',
        ],
        correctIndex: 1,
        explanation: 'Apollo 15 brought the first LRV, an open four-wheeled electric vehicle with wire mesh tires that allowed astronauts to travel over 17 miles!',
        funFact: 'The rover was folded up like an origami package and strapped to the outside of the lunar lander descent stage during flight.',
      },
      {
        id: 'a15-2',
        question: 'Commander David Scott dropped a falcon feather and a heavy steel hammer simultaneously on the Moon. What happened?',
        options: [
          'The hammer hit the ground much faster',
          'The feather floated away into deep space',
          'Both hit the ground at the exact same instant',
          'The feather burned up in the solar radiation',
        ],
        correctIndex: 2,
        explanation: 'In the lunar vacuum, with no atmospheric air resistance, gravity accelerates all objects at the exact same rate! Galileo was proven right.',
        funFact: 'The feather came from a peregrine falcon, the mascot of the United States Air Force Academy.',
      },
    ],
  },
  {
    id: 'apollo-17',
    name: 'Apollo 17',
    year: 1972,
    body: 'moon',
    coordinates: { x: 1080, y: 460 },
    landingSite: 'Taurus-Littrow Valley',
    earthLaunchDate: 'December 7, 1972',
    cutesyNickname: 'The Orange Soil & Last Footprints',
    shortDescription: 'The final Apollo mission to the Moon, featuring the first scientist-astronaut and the famous orange glass discovery.',
    detailedLore:
      'Apollo 17 in December 1972 marked the climax of NASA’s Apollo program. Commander Gene Cernan and Lunar Module Pilot Harrison "Jack" Schmitt (a professional PhD geologist) spent over 75 hours on the lunar surface. While exploring Shorty Crater, Schmitt gasped in wonder: "There is orange soil! It is all over!" The orange regolith turned out to be microscopic volcanic glass beads from ancient pyroclastic lunar fire fountains 3.6 billion years ago. The crew also improvised a rover fender using duct tape and lunar maps after a hammer accidentally caught on it.',
    primaryDiscovery: 'Discovery of pyroclastic orange volcanic glass beads and collecting 110.5 kg of geological samples, the most of any Apollo mission.',
    greeting: 'Orange soil alert! Greetings from Taurus-Littrow! 🟠',
    speechDialogue: [
      'Welcome! I am the Apollo 17 Rover. In December 1972, geologist-astronaut Jack Schmitt and Commander Gene Cernan drove me right up to Shorty Crater.',
      'Jack looked down at the ground and shouted: "There is orange soil! It is all over!" Those were microscopic orange volcanic glass beads from explosive lunar fire fountains 3.6 billion years ago!',
      'When my rear fender snapped off, they taped four cardboard geology maps to my wheel with gray duct tape! Ready to test your memory of the final Apollo Moon landing?'
    ],
    iconType: 'apollo_flag',
    quizQuestions: [
      {
        id: 'a17-1',
        question: 'Apollo 17 holds which momentous distinction in human space exploration history?',
        options: [
          'It was the first mission to orbit Mars',
          'It was the most recent crewed landing on the Moon',
          'It was the only mission with an all-robotic crew',
          'It was the first spaceflight to fly beyond Pluto',
        ],
        correctIndex: 1,
        explanation: 'Apollo 17 in December 1972 was the final mission of the Apollo lunar landing program. Gene Cernan was the last human to leave his footprint on the Moon in the 20th century.',
        funFact: 'Before climbing the ladder, Gene Cernan traced his daughter Tracy’s initials "TDC" into the lunar dust!',
      },
      {
        id: 'a17-2',
        question: 'What surprising colorful substance did geologist-astronaut Harrison Schmitt discover at Shorty Crater?',
        options: [
          'Deep purple space diamonds',
          'Emerald green extraterrestrial moss',
          'Vibrant orange volcanic glass beads',
          'Luminescent blue lunar ice crystals',
        ],
        correctIndex: 2,
        explanation: 'Schmitt discovered orange soil composed of tiny volcanic glass beads formed during explosive eruptions billions of years ago when the Moon was volcanically active.',
        funFact: 'When the rover fender snapped off, the astronauts repaired it using four cardboard lunar geology maps and gray duct tape!',
      },
    ],
  },

  // --- THE MARS MISSIONS ---
  {
    id: 'mars-pathfinder',
    name: 'Mars Pathfinder',
    year: 1997,
    body: 'mars',
    coordinates: { x: 360, y: 320 },
    landingSite: 'Ares Vallis (Mars Floodplain)',
    earthLaunchDate: 'December 4, 1996',
    cutesyNickname: 'Sojourner & The Airbag Station',
    shortDescription: 'The groundbreaking landing that brought Sojourner—humanity’s very first mobile wheeled rover on Mars.',
    detailedLore:
      'On July 4, 1997, Mars Pathfinder bounced onto the Martian surface inside a protective cocoon of giant inflatable airbags! After deflating and unfolding its three solar petals, it revealed the Sagan Memorial Station and deployed "Sojourner"—a cute six-wheeled microrover the size of a microwave oven (only 11.5 kg / 25 lbs). Sojourner navigated using rocker-bogie wheels, sniffed rocks like "Barnacle Bill" and "Yogi" with an Alpha Proton X-Ray Spectrometer, and proved that robotic rovers could explore other planets.',
    primaryDiscovery: 'Proved the airbag landing and mobile wheeled rover concept on Mars, returning over 17,000 photos and chemical analysis of ancient Martian flood rocks.',
    greeting: 'Boing! Boing! Squeak! Greetings from Ares Vallis! 🎈',
    speechDialogue: [
      'Phew! On the 4th of July, 1997, I bounced over 15 times inside a giant cocoon of 24 airbags before coming to rest on this rocky floodplain!',
      'I am the Sagan Memorial Station, and rolling off my ramp is tiny Sojourner—humanity\'s very first mobile wheeled rover on Mars! She is only the size of a microwave oven, but she sniffed rocks like "Barnacle Bill" with her x-ray spectrometer!',
      'We proved to the world that robotic rovers can roam other planets! Can you solve our historic landing questions?'
    ],
    iconType: 'pathfinder',
    quizQuestions: [
      {
        id: 'mp-1',
        question: 'What was the name of the tiny six-wheeled micro-rover carried by Mars Pathfinder?',
        options: ['Sojourner', 'Curiosity', 'Perseverance', 'Viking 1'],
        correctIndex: 0,
        explanation: 'Sojourner was named in honor of Sojourner Truth, the famed 19th-century abolitionist and women’s rights activist.',
        funFact: 'Sojourner weighed just 11.5 kg (25 pounds) and traveled at a top speed of 1 centimeter per second!',
      },
      {
        id: 'mp-2',
        question: 'How did the Mars Pathfinder lander safely touch down on the Martian surface without landing engines?',
        options: [
          'A giant super-spring at the base',
          'A huge cocoon of inflatable airbags that bounced over 15 times',
          'A soft water lake splashdown',
          'A rocket-powered hover crane',
        ],
        correctIndex: 1,
        explanation: 'Pathfinder entered the atmosphere with a heat shield and parachute, then inflated 24 giant airbags and bounced repeatedly across the rocky plain before coming to rest.',
        funFact: 'The lander bounced an estimated 15 times and rolled across the surface for about a kilometer before stopping!',
      },
    ],
  },
  {
    id: 'spirit-opportunity',
    name: 'Spirit and Opportunity',
    year: 2004,
    body: 'mars',
    coordinates: { x: 720, y: 440 },
    landingSite: 'Gusev Crater (Spirit) & Meridiani Planum (Opportunity)',
    earthLaunchDate: 'June & July 2003 (Landed Jan 2004)',
    cutesyNickname: 'Oppy & Spirit: The Resilient Twins',
    shortDescription: 'The beloved twin Mars Exploration Rovers that searched for past water and operated for over a decade.',
    detailedLore:
      'In January 2004, twin golf-cart-sized rovers named Spirit (MER-A) and Opportunity (MER-B, affectionately called "Oppy") landed on opposite sides of the Red Planet. Each was planned for a 90-sol (Martian day) mission. Astonishingly, Spirit explored for over 6 years, and Opportunity persevered for over 14 years, driving a marathon distance of 45.16 km (28.06 miles)! Oppy discovered hematite "blueberries" in Meridiani Planum, providing conclusive proof that liquid water once pooled and flowed on ancient Mars.',
    primaryDiscovery: 'Direct mineralogical evidence of acidic liquid water in Mars’ ancient past, including hematite "blueberry" spherules.',
    greeting: 'Beep-boop, whirrr! Hello new friend! Oppy & Spirit here! 🤖💙',
    speechDialogue: [
      'Hello there! We are the twin Mars Exploration Rovers. NASA engineers designed us for a 90-day mission, but we refused to stop exploring! Opportunity (Oppy) explored for over 14 years!',
      'Martian dust devils actually cleaned our solar panels when they blew past! And I discovered tiny round hematite "blueberries" that gave conclusive proof that liquid water once pooled right here!',
      'My battery was low and it got dark, but our discoveries shine forever. Are you ready for our twin rover quiz?'
    ],
    iconType: 'spirit',
    quizQuestions: [
      {
        id: 'so-1',
        question: 'The twin rovers Spirit and Opportunity were designed for a 90-day mission. How long did Opportunity ("Oppy") actually explore Mars?',
        options: [
          'About 6 months',
          'Exactly 2 years',
          'Over 14 years (nearly 15 years!)',
          '35 years',
        ],
        correctIndex: 2,
        explanation: 'Opportunity lasted from January 2004 until a massive global Martian dust storm in June 2018, operating for over 5,000 sols (over 14 years)!',
        funFact: 'Martian dust devils frequently blew past the rovers, unexpectedly cleaning their solar panels and restoring their power!',
      },
      {
        id: 'so-2',
        question: 'What cute nickname did scientists give the tiny gray-blue mineral spheres discovered by Opportunity that proved liquid water existed?',
        options: [
          'Martian Grapes',
          'Martian Blueberries',
          'Cosmic Marbles',
          'Space Pearls',
        ],
        correctIndex: 1,
        explanation: 'These tiny hematite concretions were dubbed "Martian Blueberries" due to their spherical shape and bluish hue in false-color rover photography.',
        funFact: 'Opportunity holds the off-world driving record of 45.16 kilometers (28.06 miles)—farther than an official Olympic marathon!',
      },
    ],
  },
  {
    id: 'curiosity',
    name: 'Curiosity',
    year: 2012,
    body: 'mars',
    coordinates: { x: 1040, y: 260 },
    landingSite: 'Gale Crater (Mount Sharp / Aeolis Mons)',
    earthLaunchDate: 'November 26, 2011',
    cutesyNickname: 'Curiosity: The Laser-Shooting Lab',
    shortDescription: 'The car-sized robotic rover with a rock-vaporizing laser and onboard wet chemistry lab studying Gale Crater.',
    detailedLore:
      'On August 6, 2012, NASA landed the Mars Science Laboratory rover, Curiosity, in Gale Crater using a revolutionary "Sky Crane" rocket platform. As large as a small SUV and powered by a nuclear radioisotope thermoelectric generator (RTG), Curiosity carries an array of sophisticated science instruments. Its ChemCam zaps rocks with an infrared laser to vaporize them and read their elemental spectra. Curiosity discovered ancient lake beds with neutral pH water, organic carbon molecules, and the essential building blocks for microbial life.',
    primaryDiscovery: 'Confirmed that ancient Mars possessed freshwater lakes, rivers, and chemical ingredients capable of supporting microbial life.',
    greeting: 'Hummm... *sings "Happy Birthday" to you* 🎶 Hello cosmic explorer! 🎂',
    speechDialogue: [
      'Greetings from Gale Crater! I am Curiosity, a car-sized mobile science laboratory! In 2012, NASA lowered me gently onto Mars using a rocket-powered Sky Crane hovering during the "Seven Minutes of Terror"!',
      'I zap rocks with my ChemCam infrared laser to vaporize them and analyze their chemical elements! And on my first Martian birthday, I vibrated my sample motor to sing "Happy Birthday" to myself all alone on Mars!',
      'I proved that ancient Mars had freshwater lakes and chemical ingredients for life. Ready to take my laser science quiz?'
    ],
    iconType: 'curiosity',
    quizQuestions: [
      {
        id: 'cur-1',
        question: 'Because Curiosity was too heavy for airbags, NASA engineered an audacious rocket-powered system to lower it on cables. What was it called?',
        options: [
          'The Sky Crane',
          'The Lunar Tether',
          'The Falcon Thruster',
          'The Orbital Trebuchet',
        ],
        correctIndex: 0,
        explanation: 'The Sky Crane hovered above Mars using eight hydrazine rockets and gently lowered Curiosity directly onto its six wheels on nylon tethers.',
        funFact: 'The Sky Crane maneuver was nicknamed "Seven Minutes of Terror" by the flight team at NASA Jet Propulsion Laboratory.',
      },
      {
        id: 'cur-2',
        question: 'On August 5, 2013, on its first anniversary on Mars, what heartwarming thing did Curiosity do all alone in Gale Crater?',
        options: [
          'Danced a six-wheel pirouette',
          'Vibrated its soil-sample motor to "sing" Happy Birthday to itself',
          'Shot a heart shape into a rock with its laser',
          'Projected a smiley face into the Martian dust',
        ],
        correctIndex: 1,
        explanation: 'Curiosity’s Sample Analysis at Mars (SAM) instrument used its vibrating powder funnel motor at different acoustic frequencies to hum "Happy Birthday" to itself!',
        funFact: 'Curiosity’s tires have holes in them that stamp "JPL" in Morse code (•--- •--. •-..) into the Martian sand as it drives!',
      },
    ],
  },
  {
    id: 'perseverance-ingenuity',
    name: 'Perseverance and Ingenuity',
    year: 2021,
    body: 'mars',
    coordinates: { x: 620, y: 640 },
    landingSite: 'Jezero Crater (Ancient River Delta)',
    earthLaunchDate: 'July 30, 2020',
    cutesyNickname: 'Percy & Ginny: The First Flight Pioneers',
    shortDescription: 'The rover caching pristine Martian rock cores and the solar rotorcraft that achieved the first powered flight on another world.',
    detailedLore:
      'On February 18, 2021, the Perseverance rover ("Percy") touched down in Jezero Crater, an ancient Martian river delta and crater lake. Percy’s mission: hunt for biosignatures of ancient life and seal pristine rock and soil cores into titanium sample tubes for future retrieval. Riding under Percy’s belly was "Ingenuity" ("Ginny"), a 1.8 kg solar-powered coaxial helicopter. On April 19, 2021, Ginny made history with the first powered, controlled flight of an aircraft on another planet! Originally planned for just 5 flights, Ingenuity completed 72 breathtaking flights over three years.',
    primaryDiscovery: 'First powered flight on another planet and the collection of hermetically sealed rock cores from an ancient habitable river delta.',
    greeting: 'Whirrrrr-buzz! Percy & Ginny reporting for duty! 🚁🔭',
    speechDialogue: [
      'Hello cosmic traveler! I am Perseverance ("Percy"), drilling and caching hermetically sealed rock cores in Jezero Crater\'s ancient river delta. And flying right above us is Ingenuity ("Ginny")!',
      'Ginny made aviation history as the very first aircraft to achieve powered, controlled flight on another planet! Under her solar panel is a piece of fabric from the 1903 Wright Brothers\' Flyer!',
      'She was only planned for 5 test flights, but completed 72 breathtaking flights through Mars\' ultra-thin air! Ready to earn our First Flight badge?'
    ],
    iconType: 'perseverance',
    quizQuestions: [
      {
        id: 'pi-1',
        question: 'Ingenuity ("Ginny"), the tiny helicopter carried by Perseverance, made aerospace history in 2021 by achieving what feat?',
        options: [
          'The first supersonic flight on Mars',
          'The first powered, controlled aerodynamic flight on another planet',
          'The first hot-air balloon ride in space',
          'The first sub-surface cave drone flight',
        ],
        correctIndex: 1,
        explanation: 'Ingenuity demonstrated that aerodynamic flight is possible in Mars’ ultra-thin atmosphere (which is less than 1% the density of Earth’s air).',
        funFact: 'Under Ingenuity\'s solar panel was a tiny piece of muslin fabric from the wing of the 1903 Wright Brothers\' Flyer from Kitty Hawk!',
      },
      {
        id: 'pi-2',
        question: 'What is Perseverance rover\'s primary scientific goal in Jezero Crater?',
        options: [
          'Building a brick dome habitat for astronauts',
          'Drilling and sealing rock core samples in titanium tubes to search for signs of ancient microbial life',
          'Searching for active active liquid volcanoes',
          'Digging a deep canal across the equator',
        ],
        correctIndex: 1,
        explanation: 'Percy is collecting and caching sealed core samples in Jezero’s ancient delta sediments, intended to be brought back to Earth by a future Mars Sample Return mission.',
        funFact: 'Percy also carries MOXIE, a test instrument that successfully generated breathable oxygen out of the Martian carbon dioxide atmosphere!',
      },
    ],
  },
];
