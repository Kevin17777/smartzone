export function getPhoneImage(name: string, _brand: string, category?: string): string {
  const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const folder = category === 'accesorios' ? 'accesorios' : 'celulares';
  return `/images/${folder}/${slug}`;
}
