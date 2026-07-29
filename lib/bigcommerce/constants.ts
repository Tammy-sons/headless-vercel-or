export const BIGCOMMERCE_API_URL = process.env.BIGCOMMERCE_API_URL ?? 'https://api.bigcommerce.com';
export const BIGCOMMERCE_CANONICAL_STORE_DOMAIN =
  process.env.BIGCOMMERCE_CANONICAL_STORE_DOMAIN ?? 'mybigcommerce.com';
export const BIGCOMMERCE_GRAPHQL_API_ENDPOINT = `${BIGCOMMERCE_CANONICAL_STORE_DOMAIN}/graphql`;


export const HOME_SLIDES = [
  {
    title: "Shade & Flower Trees",
    description: "Trees anchor the landscape with strength and beauty, providing cooling shade, seasonal interest, and lasting value as they grow into living legacies for generations to enjoy",
    buttonText: "Shop",
    buttonLink: "/trees",
    image: {
      url: "https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/trees-image.jpg?t=1775116668"
    }
  },
  {
    title: "Shrubs & Bushes",
    description: "Shrubs form the backbone of the landscape, offering year-round structure, seasonal color, and natural privacy while growing fuller and more beautiful with each passing year",
    buttonText: "Shop",
    buttonLink: "/shrubs",
    image: {
      url: "https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/shrubs-image.jpg?t=1775116666"
    }
  },
  {
    title: "Native Fern Plants",
    description: "Ferns add timeless elegance to the garden, unfolding lush green fronds each season that thrive in shade, soften the landscape, and create a calm, woodland feel with very little maintenance",
    buttonText: "Shop",
    buttonLink: "/ferns",
    image: {
      url: "https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/ferns-image.jpg?t=1775116663"
    }
  },
  {
    title: "Perennial Plants",
    description: "Perennials bring lasting beauty to the landscape year after year, returning stronger each season with dependable blooms, rich texture, and natural resilience that supports pollinators while keeping your garden vibrant with less effort.",
    buttonText: "Shop",
    buttonLink: "/perennials",
    image: {
      url: "https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/perennials-image.jpg?t=1775116661"
    }
  }
];


export const HOME_COLLECTIONS = [
  {
    title: 'Perennials',
    handle: 'perennials',
    image: 'https://cdn11.bigcommerce.com/s-kss309bppi/images/stencil/original/image-manager/perennials-collection.jpg'
  },
  {
    title: 'Shade Ferns',
    handle: 'ferns',
    image: 'https://cdn11.bigcommerce.com/s-kss309bppi/images/stencil/original/image-manager/ferns-collection-2-.jpg'
  },
  {
    title: 'Trees',
    handle: 'trees',
    image: 'https://cdn11.bigcommerce.com/s-kss309bppi/images/stencil/original/image-manager/trees-collection-new.jpg'
  },
  {
    title: 'Shrubs',
    handle: 'shrubs',
    image: 'https://cdn11.bigcommerce.com/s-kss309bppi/images/stencil/original/image-manager/shrubs-collection.jpg'
  },
  {
    title: 'Live Stakes',
    handle: 'live-stakes',
    image: 'https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/live-stakes-for-erosion-control.jpg?t=1776273491'
  },
  {
    title: 'Vines',
    handle: 'groundcover',
    image: 'https://cdn11.bigcommerce.com/s-9nn6ejxj73/images/stencil/original/image-manager/vines-collection.jpg?t=1769041176'
  }

];