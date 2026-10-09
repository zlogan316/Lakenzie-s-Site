export type DictionaryEntry = {
  word: string;
  definition: string;
  decoys: readonly [string, string];
};

export const DICTIONARY: readonly DictionaryEntry[] = [
  {
    word: 'ubiquitous',
    definition: 'Seeming to be everywhere at once',
    decoys: ['ambiguous', 'iniquitous'],
  },
  {
    word: 'ephemeral',
    definition: 'Lasting for only a very short time',
    decoys: ['ethereal', 'eternal'],
  },
  {
    word: 'serendipity',
    definition: 'Finding something wonderful by happy accident',
    decoys: ['serenity', 'sincerity'],
  },
  {
    word: 'benevolent',
    definition: 'Kind, generous, and wishing good for others',
    decoys: ['malevolent', 'belligerent'],
  },
  {
    word: 'gregarious',
    definition: 'Fond of company; very sociable',
    decoys: ['egregious', 'precarious'],
  },
  {
    word: 'loquacious',
    definition: 'Very talkative',
    decoys: ['tenacious', 'audacious'],
  },
  {
    word: 'ambivalent',
    definition: 'Having mixed feelings about something',
    decoys: ['ambidextrous', 'ambiguous'],
  },
  {
    word: 'procrastinate',
    definition: 'To keep putting off something you should do',
    decoys: ['proliferate', 'prognosticate'],
  },
  {
    word: 'capricious',
    definition: 'Prone to sudden, unpredictable changes of mood',
    decoys: ['capacious', 'precocious'],
  },
  {
    word: 'eloquent',
    definition: 'Fluent and persuasive in speaking or writing',
    decoys: ['elegant', 'evident'],
  },
  {
    word: 'resilient',
    definition: 'Able to bounce back quickly from hard times',
    decoys: ['reticent', 'resplendent'],
  },
  {
    word: 'meticulous',
    definition: 'Showing great care and attention to every detail',
    decoys: ['meretricious', 'ridiculous'],
  },
  {
    word: 'nostalgia',
    definition: 'A wistful longing for the past',
    decoys: ['neuralgia', 'analgesia'],
  },
  {
    word: 'euphoria',
    definition: 'A feeling of intense happiness and excitement',
    decoys: ['euphony', 'emporium'],
  },
  {
    word: 'quixotic',
    definition: 'Idealistic in a wildly impractical way',
    decoys: ['exotic', 'chaotic'],
  },
  {
    word: 'melancholy',
    definition: 'A deep, lingering sadness',
    decoys: ['melodrama', 'malady'],
  },
  {
    word: 'whimsical',
    definition: 'Playfully quaint or fanciful',
    decoys: ['wistful', 'mystical'],
  },
  {
    word: 'pragmatic',
    definition: 'Dealing with things sensibly and realistically',
    decoys: ['dogmatic', 'dramatic'],
  },
  {
    word: 'lethargic',
    definition: 'Sluggish and lacking energy',
    decoys: ['energetic', 'allergic'],
  },
  {
    word: 'empathy',
    definition: "The ability to understand and share someone else's feelings",
    decoys: ['apathy', 'antipathy'],
  },
  {
    word: 'candor',
    definition: 'The quality of being open, honest, and frank',
    decoys: ['clamor', 'cantor'],
  },
  {
    word: 'cacophony',
    definition: 'A harsh, jarring mixture of sounds',
    decoys: ['symphony', 'polyphony'],
  },
  {
    word: 'eclectic',
    definition: 'Drawing from a wide variety of sources or styles',
    decoys: ['electric', 'eccentric'],
  },
  {
    word: 'fastidious',
    definition: 'Very particular about details; hard to please',
    decoys: ['fractious', 'facetious'],
  },
  {
    word: 'obsequious',
    definition: 'Too eager to please or obey',
    decoys: ['obnoxious', 'oblivious'],
  },
  {
    word: 'ostentatious',
    definition: 'Showy and designed to impress',
    decoys: ['contentious', 'ostensible'],
  },
  {
    word: 'pensive',
    definition: 'Lost in deep or serious thought',
    decoys: ['passive', 'pervasive'],
  },
  {
    word: 'vivacious',
    definition: 'Lively, spirited, and full of energy',
    decoys: ['vicarious', 'voracious'],
  },
  {
    word: 'voracious',
    definition: 'Having a huge, eager appetite for food or anything else',
    decoys: ['veracious', 'vexatious'],
  },
  {
    word: 'tenacious',
    definition: 'Holding on firmly; persistent and determined',
    decoys: ['tedious', 'tenuous'],
  },
  {
    word: 'ineffable',
    definition: 'Too great or extreme to be expressed in words',
    decoys: ['ineffective', 'inevitable'],
  },
  {
    word: 'indelible',
    definition: 'Impossible to erase or forget',
    decoys: ['inedible', 'incredible'],
  },
  {
    word: 'altruism',
    definition: 'Selfless concern for the well-being of others',
    decoys: ['truism', 'aphorism'],
  },
  {
    word: 'anomaly',
    definition: 'Something that deviates from what is normal or expected',
    decoys: ['anatomy', 'analogy'],
  },
  {
    word: 'hyperbole',
    definition: 'Deliberate exaggeration not meant to be taken literally',
    decoys: ['hyperbola', 'hypothesis'],
  },
  {
    word: 'paradox',
    definition: 'A statement that seems to contradict itself but may still be true',
    decoys: ['paradigm', 'parody'],
  },
  {
    word: 'juxtapose',
    definition: 'To place side by side to compare or contrast',
    decoys: ['transpose', 'superimpose'],
  },
  {
    word: 'euphemism',
    definition: 'A gentle word used in place of a harsh or blunt one',
    decoys: ['eulogy', 'emphasis'],
  },
  {
    word: 'mnemonic',
    definition: 'A trick, like a rhyme, that helps you remember something',
    decoys: ['pneumonia', 'monogram'],
  },
  {
    word: 'onomatopoeia',
    definition: 'A word that imitates the sound it names, like buzz or sizzle',
    decoys: ['alliteration', 'personification'],
  },
  {
    word: 'alliteration',
    definition: 'Starting nearby words with the same sound, as in “Peter Piper picked”',
    decoys: ['obliteration', 'iteration'],
  },
  {
    word: 'sanguine',
    definition: 'Cheerfully optimistic, even in a bad situation',
    decoys: ['sanguinary', 'sanitary'],
  },
  {
    word: 'diligent',
    definition: 'Careful and hardworking',
    decoys: ['delinquent', 'indulgent'],
  },
  {
    word: 'frugal',
    definition: 'Careful not to waste money',
    decoys: ['fragile', 'futile'],
  },
  {
    word: 'futile',
    definition: 'Pointless; having no chance of success',
    decoys: ['fertile', 'facile'],
  },
  {
    word: 'gullible',
    definition: 'Easily tricked into believing something',
    decoys: ['culpable', 'legible'],
  },
  {
    word: 'lucid',
    definition: 'Clear and easy to understand',
    decoys: ['lurid', 'placid'],
  },
  {
    word: 'mundane',
    definition: 'Ordinary and dull',
    decoys: ['humane', 'germane'],
  },
  {
    word: 'ominous',
    definition: 'Giving the feeling that something bad is about to happen',
    decoys: ['luminous', 'voluminous'],
  },
  {
    word: 'plethora',
    definition: 'An overabundance of something',
    decoys: ['platitude', 'plateau'],
  },
  {
    word: 'zealous',
    definition: 'Full of passionate enthusiasm for a cause',
    decoys: ['jealous', 'callous'],
  },
  {
    word: 'callous',
    definition: 'Unfeeling and insensitive toward others',
    decoys: ['callow', 'cautious'],
  },
  {
    word: 'diffident',
    definition: 'Shy and lacking self-confidence',
    decoys: ['different', 'confident'],
  },
  {
    word: 'surreptitious',
    definition: 'Done secretly, so as not to be noticed',
    decoys: ['repetitious', 'superstitious'],
  },
  {
    word: 'superfluous',
    definition: 'More than is needed; unnecessary',
    decoys: ['superficial', 'supercilious'],
  },
  {
    word: 'venerable',
    definition: 'Respected because of age, wisdom, or character',
    decoys: ['vulnerable', 'variable'],
  },
  {
    word: 'vindicate',
    definition: 'To clear someone of blame or suspicion',
    decoys: ['indicate', 'syndicate'],
  },
  {
    word: 'exacerbate',
    definition: 'To make a bad situation worse',
    decoys: ['exasperate', 'exaggerate'],
  },
  {
    word: 'alleviate',
    definition: 'To make pain or a problem easier to bear',
    decoys: ['alienate', 'abbreviate'],
  },
  {
    word: 'mitigate',
    definition: 'To make something less severe',
    decoys: ['militate', 'migrate'],
  },
  {
    word: 'ameliorate',
    definition: 'To make something bad better',
    decoys: ['amalgamate', 'deteriorate'],
  },
  {
    word: 'obfuscate',
    definition: 'To make something deliberately unclear or confusing',
    decoys: ['obligate', 'obviate'],
  },
  {
    word: 'corroborate',
    definition: 'To confirm or support with evidence',
    decoys: ['collaborate', 'correlate'],
  },
  {
    word: 'extrapolate',
    definition: 'To estimate by extending a known trend beyond its range',
    decoys: ['interpolate', 'extricate'],
  },
  {
    word: 'admonish',
    definition: 'To warn or scold someone firmly',
    decoys: ['astonish', 'diminish'],
  },
  {
    word: 'relinquish',
    definition: 'To willingly give something up',
    decoys: ['replenish', 'extinguish'],
  },
  {
    word: 'emulate',
    definition: 'To imitate someone you admire, hoping to match them',
    decoys: ['emanate', 'emigrate'],
  },
  {
    word: 'ruminate',
    definition: 'To think deeply about something for a long time',
    decoys: ['illuminate', 'nominate'],
  },
  {
    word: 'scrutinize',
    definition: 'To examine very closely and carefully',
    decoys: ['summarize', 'sermonize'],
  },
  {
    word: 'squander',
    definition: 'To waste something, especially money or time',
    decoys: ['squabble', 'saunter'],
  },
  {
    word: 'meander',
    definition: 'To wander along a winding course',
    decoys: ['pander', 'slander'],
  },
  {
    word: 'dawdle',
    definition: 'To waste time by being slow',
    decoys: ['doodle', 'dwindle'],
  },
  {
    word: 'dwindle',
    definition: 'To gradually shrink in size or amount',
    decoys: ['swindle', 'kindle'],
  },
  {
    word: 'bamboozle',
    definition: 'To trick or fool someone',
    decoys: ['bumble', 'babble'],
  },
  {
    word: 'kerfuffle',
    definition: 'A commotion or fuss',
    decoys: ['kerchief', 'waffle'],
  },
  {
    word: 'petrichor',
    definition: 'The earthy smell that comes with rain on dry ground',
    decoys: ['petroglyph', 'petulance'],
  },
  {
    word: 'halcyon',
    definition: 'Calm and happy, especially of a time in the past',
    decoys: ['hallowed', 'hackneyed'],
  },
  {
    word: 'effervescent',
    definition: 'Bubbly and fizzy; also lively and enthusiastic',
    decoys: ['evanescent', 'iridescent'],
  },
  {
    word: 'iridescent',
    definition: 'Shimmering with rainbow colors that shift with the light',
    decoys: ['incandescent', 'irreverent'],
  },
  {
    word: 'mellifluous',
    definition: 'Sweet and smooth to hear',
    decoys: ['superfluous', 'multifarious'],
  },
  {
    word: 'mendacious',
    definition: 'Not telling the truth; lying',
    decoys: ['audacious', 'pugnacious'],
  },
  {
    word: 'sycophant',
    definition: 'Someone who flatters powerful people to win favor',
    decoys: ['saxophone', 'sycamore'],
  },
  {
    word: 'connoisseur',
    definition: 'An expert judge of taste, as in food, wine, or art',
    decoys: ['entrepreneur', 'raconteur'],
  },
  {
    word: 'charlatan',
    definition: "A fake who claims skills or knowledge they don't have",
    decoys: ['chaplain', 'chieftain'],
  },
  {
    word: 'protagonist',
    definition: 'The main character of a story',
    decoys: ['antagonist', 'pragmatist'],
  },
  {
    word: 'epiphany',
    definition: 'A sudden, striking realization',
    decoys: ['epitaph', 'epitome'],
  },
  {
    word: 'epitome',
    definition: 'A perfect example of a quality or type',
    decoys: ['epitaph', 'epithet'],
  },
  {
    word: 'conundrum',
    definition: 'A confusing and difficult problem',
    decoys: ['continuum', 'colloquium'],
  },
  {
    word: 'dichotomy',
    definition: 'A division into two opposite or contrasting parts',
    decoys: ['autonomy', 'anatomy'],
  },
  {
    word: 'wanderlust',
    definition: 'A strong desire to travel',
    decoys: ['wonderment', 'wanderer'],
  },
  {
    word: 'reverie',
    definition: 'A pleasant daydream',
    decoys: ['revelry', 'reverence'],
  },
  {
    word: 'solace',
    definition: 'Comfort in a time of sadness',
    decoys: ['solstice', 'solitude'],
  },
  {
    word: 'vestige',
    definition: 'A small trace of something that once existed',
    decoys: ['vestibule', 'prestige'],
  },
  {
    word: 'zenith',
    definition: 'The highest point; the peak',
    decoys: ['zealot', 'zephyr'],
  },
  {
    word: 'zephyr',
    definition: 'A soft, gentle breeze',
    decoys: ['zither', 'zenith'],
  },
  {
    word: 'idiosyncrasy',
    definition: 'A quirk or habit unique to one person',
    decoys: ['hypocrisy', 'idiocy'],
  },
  {
    word: 'lackadaisical',
    definition: 'Lazy and lacking enthusiasm',
    decoys: ['lachrymose', 'laconic'],
  },
  {
    word: 'laconic',
    definition: 'Using very few words',
    decoys: ['iconic', 'sardonic'],
  },
  {
    word: 'verbose',
    definition: 'Using more words than needed',
    decoys: ['morose', 'grandiose'],
  },
  {
    word: 'pernicious',
    definition: 'Harmful in a gradual or subtle way',
    decoys: ['auspicious', 'suspicious'],
  },
  {
    word: 'auspicious',
    definition: 'Promising a good outcome; favorable',
    decoys: ['ambitious', 'avaricious'],
  },
  {
    word: 'precocious',
    definition: 'Developing certain abilities unusually early',
    decoys: ['precarious', 'precious'],
  },
  {
    word: 'salient',
    definition: 'Most noticeable or important',
    decoys: ['saline', 'sentient'],
  },
  {
    word: 'tangible',
    definition: 'Able to be touched; real and concrete',
    decoys: ['tangential', 'tenable'],
  },
  {
    word: 'impeccable',
    definition: 'Flawless; meeting the highest standards',
    decoys: ['impeachable', 'implacable'],
  },
  {
    word: 'inquisitive',
    definition: 'Curious and eager to learn',
    decoys: ['acquisitive', 'intuitive'],
  },
  {
    word: 'perfunctory',
    definition: 'Done with minimal effort or care, just to get it over with',
    decoys: ['peremptory', 'prefatory'],
  },
  {
    word: 'magnanimous',
    definition: 'Generous and forgiving, especially toward a rival',
    decoys: ['unanimous', 'anonymous'],
  },
  {
    word: 'nonchalant',
    definition: 'Calm and relaxed, seeming not to care',
    decoys: ['nonplussed', 'noncompliant'],
  },
  {
    word: 'nefarious',
    definition: 'Wicked or villainous',
    decoys: ['hilarious', 'various'],
  },
  {
    word: 'insipid',
    definition: 'Bland; lacking flavor or interest',
    decoys: ['intrepid', 'insidious'],
  },
  {
    word: 'intrepid',
    definition: 'Fearless and adventurous',
    decoys: ['tepid', 'insipid'],
  },
  {
    word: 'sporadic',
    definition: 'Happening now and then at irregular intervals',
    decoys: ['periodic', 'sardonic'],
  },
  {
    word: 'esoteric',
    definition: 'Understood by only a small group with special knowledge',
    decoys: ['exotic', 'ascetic'],
  },
  {
    word: 'aesthetic',
    definition: 'Concerned with beauty or the appreciation of beauty',
    decoys: ['anesthetic', 'athletic'],
  },
  {
    word: 'complement',
    definition: 'To complete or go well with something',
    decoys: ['compliment', 'implement'],
  },
  {
    word: 'compliment',
    definition: 'A polite expression of praise',
    decoys: ['complement', 'condiment'],
  },
  {
    word: 'stationary',
    definition: 'Not moving',
    decoys: ['stationery', 'sanctuary'],
  },
  {
    word: 'stationery',
    definition: 'Writing paper, envelopes, and other writing supplies',
    decoys: ['stationary', 'statuary'],
  },
  {
    word: 'principle',
    definition: 'A basic truth or rule that guides behavior or thinking',
    decoys: ['principal', 'participle'],
  },
  {
    word: 'dessert',
    definition: 'The sweet course at the end of a meal',
    decoys: ['desert', 'dissent'],
  },
  {
    word: 'affect',
    definition: 'To have an influence on something',
    decoys: ['effect', 'infect'],
  },
  {
    word: 'elicit',
    definition: 'To draw out a response or reaction',
    decoys: ['illicit', 'explicit'],
  },
  {
    word: 'allusion',
    definition: 'An indirect reference to something',
    decoys: ['illusion', 'delusion'],
  },
  {
    word: 'discreet',
    definition: 'Careful not to draw attention or give away secrets',
    decoys: ['discrete', 'concrete'],
  },
  {
    word: 'conscience',
    definition: 'Your inner sense of right and wrong',
    decoys: ['consciousness', 'consensus'],
  },
  {
    word: 'emigrate',
    definition: 'To leave your own country to live in another',
    decoys: ['immigrate', 'emanate'],
  },
  {
    word: 'eminent',
    definition: 'Famous and respected in a particular field',
    decoys: ['imminent', 'pertinent'],
  },
  {
    word: 'averse',
    definition: 'Having a strong dislike of something',
    decoys: ['adverse', 'diverse'],
  },
  {
    word: 'censor',
    definition: 'To remove parts considered offensive or unacceptable',
    decoys: ['censure', 'sensor'],
  },
  {
    word: 'flaunt',
    definition: 'To show something off proudly',
    decoys: ['flout', 'flounder'],
  },
  {
    word: 'palette',
    definition: 'The range of colors an artist uses',
    decoys: ['palate', 'pallet'],
  },
  {
    word: 'apprise',
    definition: 'To inform someone of something',
    decoys: ['appraise', 'surprise'],
  },
  {
    word: 'precede',
    definition: 'To come before something in time or order',
    decoys: ['proceed', 'recede'],
  },
  {
    word: 'counsel',
    definition: 'Advice, especially from someone with expertise',
    decoys: ['council', 'consul'],
  },
  {
    word: 'aural',
    definition: 'Relating to the ear or hearing',
    decoys: ['oral', 'mural'],
  },
  {
    word: 'faze',
    definition: 'To disturb or unsettle someone',
    decoys: ['phase', 'fuse'],
  },
  {
    word: 'peruse',
    definition: 'To read something carefully and thoroughly',
    decoys: ['pursue', 'persuade'],
  },
  {
    word: 'thingamajig',
    definition: "A word for something whose name you can't remember",
    decoys: ['whirligig', 'jigsaw'],
  },
  {
    word: 'flibbertigibbet',
    definition: 'A flighty, silly, overly chatty person',
    decoys: ['gibberish', 'flapdoodle'],
  },
  {
    word: 'flummox',
    definition: 'To completely baffle someone',
    decoys: ['flourish', 'flatter'],
  },
  {
    word: 'discombobulate',
    definition: 'To confuse or disconcert someone',
    decoys: ['disambiguate', 'discriminate'],
  },
  {
    word: 'skedaddle',
    definition: 'To run away in a hurry',
    decoys: ['straddle', 'swaddle'],
  },
  {
    word: 'gallivant',
    definition: 'To roam from place to place in search of fun',
    decoys: ['galvanize', 'glamorize'],
  },
  {
    word: 'widdershins',
    definition: 'In a counterclockwise direction',
    decoys: ['windward', 'worldwide'],
  },
  {
    word: 'bumbershoot',
    definition: 'An umbrella',
    decoys: ['bumblebee', 'offshoot'],
  },
  {
    word: 'collywobbles',
    definition: 'A nervous, fluttery feeling in the stomach',
    decoys: ['cobblestones', 'caterwaul'],
  },
  {
    word: 'malarkey',
    definition: 'Meaningless talk; nonsense',
    decoys: ['malady', 'marquee'],
  },
  {
    word: 'hodgepodge',
    definition: 'A confused mixture of different things',
    decoys: ['hedgehog', 'hopscotch'],
  },
  {
    word: 'pandemonium',
    definition: 'Wild and noisy chaos',
    decoys: ['pandemic', 'pendulum'],
  },
  {
    word: 'panacea',
    definition: 'A cure-all for every problem',
    decoys: ['pancreas', 'paranoia'],
  },
  {
    word: 'rigmarole',
    definition: 'A long, complicated, and tedious procedure',
    decoys: ['ragamuffin', 'rigatoni'],
  },
  {
    word: 'shenanigans',
    definition: 'Silly or mischievous behavior',
    decoys: ['shindig', 'shingles'],
  },
  {
    word: 'pollinate',
    definition: 'To carry pollen to a flower so it can make seeds',
    decoys: ['pollute', 'populate'],
  },
  {
    word: 'germinate',
    definition: 'To begin to grow and sprout',
    decoys: ['terminate', 'generate'],
  },
  {
    word: 'deciduous',
    definition: 'Shedding its leaves every year',
    decoys: ['delicious', 'assiduous'],
  },
  {
    word: 'verdant',
    definition: 'Green with lush plants',
    decoys: ['vigilant', 'mordant'],
  },
  {
    word: 'dappled',
    definition: 'Marked with spots of light and shade',
    decoys: ['dimpled', 'crumpled'],
  },
  {
    word: 'gossamer',
    definition: 'Something extremely light, thin, and delicate',
    decoys: ['gossip', 'glamour'],
  },
  {
    word: 'sesquipedalian',
    definition: 'Fond of using long words',
    decoys: ['pedestrian', 'equestrian'],
  },
  {
    word: 'defenestration',
    definition: 'The act of throwing someone or something out of a window',
    decoys: ['deforestation', 'demonstration'],
  },
  {
    word: 'susurrus',
    definition: 'A soft whispering or rustling sound',
    decoys: ['sassafras', 'syllabus'],
  },
  {
    word: 'bucolic',
    definition: 'Charmingly rural; relating to the countryside',
    decoys: ['bubonic', 'symbolic'],
  },
  {
    word: 'idyllic',
    definition: 'Extremely happy, peaceful, and picturesque',
    decoys: ['idiotic', 'acrylic'],
  },
  {
    word: 'ethereal',
    definition: 'Delicate and light in a way that seems too perfect for this world',
    decoys: ['material', 'imperial'],
  },
  {
    word: 'opulent',
    definition: 'Rich and luxurious',
    decoys: ['succulent', 'truculent'],
  },
  {
    word: 'scintillating',
    definition: 'Sparkling, or brilliantly clever and lively',
    decoys: ['oscillating', 'assimilating'],
  },
  {
    word: 'curious',
    definition: 'Eager to know or learn something',
    decoys: ['furious', 'spurious'],
  },
  {
    word: 'snuggle',
    definition: 'To nestle close to someone for warmth or comfort',
    decoys: ['smuggle', 'struggle'],
  },
  {
    word: 'giggle',
    definition: 'To laugh lightly in a silly or nervous way',
    decoys: ['wiggle', 'jiggle'],
  },
  {
    word: 'ponder',
    definition: 'To think carefully about something',
    decoys: ['wander', 'plunder'],
  },
  {
    word: 'dainty',
    definition: 'Delicately small and pretty',
    decoys: ['daunting', 'jaunty'],
  },
  {
    word: 'nimble',
    definition: 'Quick and light in movement',
    decoys: ['humble', 'noble'],
  },
  {
    word: 'cherish',
    definition: 'To hold something dear and care for it lovingly',
    decoys: ['perish', 'garnish'],
  },
  {
    word: 'smitten',
    definition: 'Suddenly and completely in love',
    decoys: ['mitten', 'bitten'],
  },
  {
    word: 'besotted',
    definition: 'Infatuated to the point of being a little silly',
    decoys: ['bespoke', 'beholden'],
  },
  {
    word: 'swoon',
    definition: 'To be overcome with delight or adoration',
    decoys: ['swoop', 'snoop'],
  },
  {
    word: 'kindred',
    definition: 'Similar in nature, as in two ___ spirits',
    decoys: ['kindling', 'hundred'],
  },
  {
    word: 'quaint',
    definition: 'Charmingly unusual or old-fashioned',
    decoys: ['faint', 'quail'],
  },
  {
    word: 'frolic',
    definition: 'To play and move about cheerfully',
    decoys: ['colic', 'frantic'],
  },
  {
    word: 'bungle',
    definition: 'To do something clumsily or badly',
    decoys: ['bundle', 'bugle'],
  },
  {
    word: 'muddle',
    definition: 'To mix things up in a confused way',
    decoys: ['puddle', 'huddle'],
  },
  {
    word: 'guffaw',
    definition: 'A loud, hearty burst of laughter',
    decoys: ['gaffe', 'giraffe'],
  },
  {
    word: 'zany',
    definition: 'Amusingly wacky and offbeat',
    decoys: ['zesty', 'brainy'],
  },
  {
    word: 'quirk',
    definition: 'A peculiar little habit or trait',
    decoys: ['quark', 'quiche'],
  },
];
