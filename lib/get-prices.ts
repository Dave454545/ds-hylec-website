import { prisma } from '@/lib/prisma';

const DEFAULT_PRICE = 89;

export async function getPrixServices(): Promise<Record<string, number>> {
  try {
    const tarifs = await prisma.tarification.findMany();
    const map: Record<string, number> = {};
    tarifs.forEach(t => { map[t.service] = t.prix; });
    return map;
  } catch {
    return {};
  }
}

export function getPrix(map: Record<string, number>, serviceId: string): number {
  return map[serviceId] ?? DEFAULT_PRICE;
}
