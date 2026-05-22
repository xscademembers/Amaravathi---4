export const STATIC_GALLERY_FALLBACK = [
  '/DSC05341.jpg',
  '/DSC05343.jpg',
  '/DSC05370.jpg',
  '/wed edit.jpeg',
  '/bday image.jpeg',
  '/religious image.jpeg',
  '/expo.png',
  '/political.jpeg',
  '/college image.jpg',
  '/product-launch-event-.png',
  '/Bday event.jpeg',
];

export function fallbackGalleryDocuments() {
  return STATIC_GALLERY_FALLBACK.map((imageUrl, order) => ({
    _id: `fallback-${order}`,
    imageUrl,
    title: '',
    order,
  }));
}
