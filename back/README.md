# Compra Inteligente Backend

Backend base en NestJS + TypeORM + PostgreSQL, alineado con las entidades que hoy usa el frontend:

- `User`
- `Space`
- `SpaceMember`
- `Product`
- `Location`
- `Purchase`

## Variables de entorno

Usa `.env.example` como referencia.

## Scripts

- `npm install`
- `npm run start:dev`
- `npm run build`

## Notas de modelo

- `Purchase.date` del frontend se mapea como `purchasedAt` en la entidad, manteniendo el nombre de payload `date` en los DTOs.
- `Location.imageUrl` y `Purchase.imageUrl` almacenan la URL publica del archivo en Cloudflare R2.
