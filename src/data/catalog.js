export const COLORS = [
  { id: 'navy', name: 'Navy', hex: '#173043' },
  { id: 'steel', name: 'Steel', hex: '#89a6b9' },
  { id: 'teal', name: 'Teal', hex: '#426e72' },
  { id: 'burgundy', name: 'Burgundy', hex: '#714855' },
  { id: 'charcoal', name: 'Charcoal', hex: '#586068' },
  { id: 'ceil', name: 'Ceil', hex: '#7a9eb0' },
  { id: 'wine', name: 'Wine', hex: '#5c3d4a' }
];

export const CATALOG = [
  {
    slug: 'everyday-essential',
    name: 'The Everyday Essential',
    category: 'set',
    categoryLabel: 'For him',
    tag: 'THE ESSENTIALS',
    summary: 'Clean lines. An easy, everyday fit.',
    price: 4900,
    featured: true,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'The everyday set for long days. A stretch top and cargo pant, cut to move through lectures, labs, and twelve-hour wards.',
    details:
      'Soft-matte stretch-woven fabric that holds its colour through repeated washing. Chest patch pocket, pen pocket, hip pockets on the top; elastic waist, drawstring, and cargo pockets on the pant. Sold as a matching set.'
  },
  {
    slug: 'comfort-considered',
    name: 'Comfort, Considered',
    category: 'set',
    categoryLabel: 'For her',
    tag: 'COMFORT, CONSIDERED',
    summary: 'Thoughtful coverage. Room to move.',
    price: 4900,
    featured: true,
    image: '/assets/women-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'Thoughtful coverage with room to move. Shaped closer through the waist and hip so it sits cleanly under a coat or ID lanyard.',
    details:
      'Women’s fit: slightly narrower shoulder, shaped waist, and a rise cut for a closer silhouette without losing pocket space. Same stretch-woven cloth and pocket layout as the everyday set.'
  },
  {
    slug: 'campus-classic',
    name: 'The Campus Classic',
    category: 'set',
    categoryLabel: 'Unisex set',
    tag: 'CAMPUS SET',
    summary: 'A straightforward set for lectures and labs.',
    price: 4700,
    featured: false,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'A clean unisex set for school and college days. Same cloth and pockets as the everyday line, cut for an easy shared fit.',
    details:
      'V-neck top and drawstring cargo pant in stretch-woven cloth. Built for mixed groups who want one look without a gendered cut.'
  },
  {
    slug: 'modest-tunic-set',
    name: 'The Modest Tunic Set',
    category: 'set',
    categoryLabel: 'For her',
    tag: 'MODEST FIT',
    summary: 'Longer coverage, the same easy cloth.',
    price: 5200,
    featured: false,
    image: '/assets/women-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'A longer tunic top and matching pant for days that ask for more coverage, without losing room to move.',
    details:
      'Tunic-length top with hip pockets and a pen slot, paired with a drawstring cargo pant. Same stretch-woven cloth as the rest of the line.'
  },
  {
    slug: 'stretch-scrub-top',
    name: 'The Essential Top',
    category: 'top',
    categoryLabel: 'Top',
    tag: 'SINGLE PIECE',
    summary: 'A V-neck that works with any pant.',
    price: 2700,
    featured: false,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'V-neck top with a chest pocket and pen slot. Mix it with any pant, or replace a worn set piece without buying the pair again.',
    details:
      'Short-sleeve V-neck in stretch-woven cloth. Chest patch pocket, pen pocket on the wearer’s left, slanted hip pockets. Pair with the cargo pant or wear over college-issued bottoms.'
  },
  {
    slug: 'cargo-scrub-pant',
    name: 'The Essential Pant',
    category: 'pants',
    categoryLabel: 'Pants',
    tag: 'SINGLE PIECE',
    summary: 'A drawstring cargo built for long rounds.',
    price: 2400,
    featured: false,
    image: '/assets/women-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'Drawstring cargo pant with a soft elastic waist. Built for standing lectures and long rounds.',
    details:
      'Elastic waistband with a front drawstring, slanted hand pockets, and a flapped cargo pocket on each thigh. Inseam cut to sit above the shoe — no pooling, no dragging on ward floors.'
  },
  {
    slug: 'soft-jogger-pant',
    name: 'The Soft Jogger',
    category: 'pants',
    categoryLabel: 'Pants',
    tag: 'SINGLE PIECE',
    summary: 'A softer ankle for all-day standing.',
    price: 2600,
    featured: false,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'A jogger-cut scrub pant with a soft cuff. Same cargo pockets, a little less bulk at the ankle.',
    details:
      'Elastic waist, front drawstring, thigh cargo pockets, and a soft ribbed cuff. Pair with any top in the line.'
  }
];
