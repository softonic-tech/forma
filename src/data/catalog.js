export const COLORS = [
  { id: 'navy', name: 'Navy', hex: '#0a2348' },
  { id: 'teal', name: 'Teal', hex: '#0e7a86' },
  { id: 'black', name: 'Black', hex: '#1a1c1e' },
  { id: 'grey', name: 'Grey', hex: '#8b9096' },
  { id: 'burgundy', name: 'Burgundy', hex: '#6b2c3a' },
  { id: 'olive', name: 'Olive', hex: '#4d5538' }
];

export const CATALOG = [
  {
    slug: 'everyday-essential',
    name: 'The Everyday Essential',
    category: 'set',
    categoryLabel: 'For him',
    tag: 'PREMIUM SET',
    summary: 'Modern design. A fit that moves with you.',
    price: 4900,
    featured: true,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'Premium quality scrubs for long days. A stretch top and cargo pant — breathable, soft, and cut to move through lectures, labs, and twelve-hour wards.',
    details:
      'Stretchable, lightweight fabric that stays breathable through a full shift and holds colour in the wash. Chest patch pocket, pen pocket, and hip pockets on the top; elastic waist, drawstring, and cargo pockets on the pant. Sold as a matching set.'
  },
  {
    slug: 'comfort-considered',
    name: 'Comfort, Considered',
    category: 'set',
    categoryLabel: 'For her',
    tag: 'PREMIUM SET',
    summary: 'Stylish look. Professional feel.',
    price: 4900,
    featured: true,
    image: '/assets/women-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'Thoughtful coverage with room to move. Soft, lightweight cloth shaped closer through the waist so it sits cleanly under a coat or ID lanyard.',
    details:
      'Women’s fit: slightly narrower shoulder, shaped waist, and a rise cut for a closer silhouette without losing pocket space. Same breathable stretch fabric and pocket layout as the everyday set.'
  },
  {
    slug: 'campus-classic',
    name: 'The Campus Classic',
    category: 'set',
    categoryLabel: 'Unisex set',
    tag: 'UNISEX FIT',
    summary: 'One modern look for lectures and labs.',
    price: 4700,
    featured: false,
    image: '/assets/men-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'A clean unisex set for school and college days. Same stretch cloth and pockets as the everyday line, cut for an easy shared fit.',
    details:
      'V-neck top and drawstring cargo pant in breathable stretch fabric. Built for mixed groups who want one professional look without a gendered cut.'
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
    blurb: 'A longer tunic top and matching pant for days that ask for more coverage, without losing stretch or breathability.',
    details:
      'Tunic-length top with hip pockets and a pen slot, paired with a drawstring cargo pant. Same soft, washable stretch cloth as the rest of the line.'
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
      'Short-sleeve V-neck in stretchable, lightweight fabric. Chest patch pocket, pen pocket on the wearer’s left, slanted hip pockets. Pair with the cargo pant or wear over college-issued bottoms.'
  },
  {
    slug: 'cargo-scrub-pant',
    name: 'The Essential Pant',
    category: 'pants',
    categoryLabel: 'Pants',
    tag: 'SINGLE PIECE',
    summary: 'Cargo pockets built for long rounds.',
    price: 2400,
    featured: false,
    image: '/assets/women-transparent.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: COLORS,
    blurb: 'Drawstring cargo pant with a soft elastic waist. Multiple pockets, easy to wash, built for standing lectures and long rounds.',
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
