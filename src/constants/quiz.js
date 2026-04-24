import { WORLD_TYPES } from './worlds'

const H = WORLD_TYPES.HAVEN
const T = WORLD_TYPES.TOOLS
const O = WORLD_TYPES.OASIS
const N = WORLD_TYPES.NEXUS

export const WORLD_KEYS = {
  [H]: 'haven',
  [T]: 'tools',
  [O]: 'oasis',
  [N]: 'nexus',
}

export const WORLD_FROM_KEY = {
  haven: H,
  tools: T,
  oasis: O,
  nexus: N,
}

export const QUIZ_QUESTIONS = [
  {
    id: 'saturday',
    prompt: "It's Saturday morning. You're drawn to…",
    options: [
      { id: 'a', label: 'Rearranging a corner of my home until it feels right.', weights: { haven: 3, oasis: 1 } },
      { id: 'b', label: 'A long walk, slow coffee, no notifications.',         weights: { oasis: 3, haven: 1 } },
      { id: 'c', label: 'Tinkering with a side project or new tool.',          weights: { tools: 3, nexus: 1 } },
      { id: 'd', label: 'A blank canvas, a half-formed idea, loud music.',     weights: { nexus: 3, tools: 1 } },
    ],
  },
  {
    id: 'space',
    prompt: 'Pick the room you actually want to live in.',
    options: [
      { id: 'a', label: 'Warm wood, linen sheets, golden lamp light.',            weights: { haven: 3, oasis: 1 } },
      { id: 'b', label: 'A glass studio with plants and a long quiet view.',     weights: { oasis: 3, haven: 1 } },
      { id: 'c', label: 'Three monitors, mechanical keyboard, perfect cable management.', weights: { tools: 3 } },
      { id: 'd', label: 'A loft that looks like an art gallery threw up neon.',  weights: { nexus: 3, tools: 1 } },
    ],
  },
  {
    id: 'problem',
    prompt: 'Something just broke. Your instinct is to…',
    options: [
      { id: 'a', label: 'Make tea, sit with it, then handle it calmly.',         weights: { haven: 3, oasis: 1 } },
      { id: 'b', label: 'Breathe, name the feeling, then move.',                 weights: { oasis: 3 } },
      { id: 'c', label: 'Open the manual, find the root cause, fix it once.',    weights: { tools: 3 } },
      { id: 'd', label: "Reframe it. There's a better version on the other side.", weights: { nexus: 3, tools: 1 } },
    ],
  },
  {
    id: 'collect',
    prompt: 'You secretly collect…',
    options: [
      { id: 'a', label: 'Ceramics, candles, things with a story.',               weights: { haven: 3 } },
      { id: 'b', label: 'Recipes, walking routes, small rituals.',               weights: { oasis: 3, haven: 1 } },
      { id: 'c', label: 'Apps, hotkeys, productivity systems I will refine forever.', weights: { tools: 3 } },
      { id: 'd', label: 'Fonts, color palettes, weird references nobody asked for.', weights: { nexus: 3 } },
    ],
  },
  {
    id: 'phone',
    prompt: 'Your home screen, honestly…',
    options: [
      { id: 'a', label: 'Cozy. A few apps. Soft wallpaper.',                     weights: { haven: 3, oasis: 1 } },
      { id: 'b', label: 'Minimal. Almost empty. Intentional.',                   weights: { oasis: 3, tools: 1 } },
      { id: 'c', label: 'A grid. Folders. Everything findable in two taps.',     weights: { tools: 3 } },
      { id: 'd', label: 'A wallpaper I designed. Apps everywhere. Vibes.',       weights: { nexus: 3 } },
    ],
  },
  {
    id: 'compliment',
    prompt: 'The compliment that hits hardest is…',
    options: [
      { id: 'a', label: '"Your place feels like a hug."',                        weights: { haven: 3 } },
      { id: 'b', label: '"You\'re the calmest person I know."',                  weights: { oasis: 3 } },
      { id: 'c', label: '"You\'re scary efficient."',                            weights: { tools: 3 } },
      { id: 'd', label: '"I\'ve never seen anything like that before."',         weights: { nexus: 3 } },
    ],
  },
  {
    id: 'currency',
    prompt: 'The currency you spend most freely is…',
    options: [
      { id: 'a', label: 'Time at home, with the people I love.',                 weights: { haven: 3, oasis: 1 } },
      { id: 'b', label: 'Energy on my body, my breath, my space.',               weights: { oasis: 3 } },
      { id: 'c', label: 'Hours of focus on the right problem.',                  weights: { tools: 3, nexus: 1 } },
      { id: 'd', label: 'Whatever it takes to make the thing exist.',            weights: { nexus: 3, tools: 1 } },
    ],
  },
]
