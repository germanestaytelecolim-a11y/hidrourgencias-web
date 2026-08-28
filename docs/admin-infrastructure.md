# Infraestructura del Panel Hidrourgencias

## Persistencia

El panel usa almacenamiento local solo para desarrollo. En Vercel Preview y Production debe operar con PostgreSQL mediante `POSTGRES_URL` o `DATABASE_URL`.

El storage de fotografías usa Vercel Blob cuando existe `BLOB_READ_WRITE_TOKEN` en el entorno server-side. El token no debe declararse como `NEXT_PUBLIC_*`.

## Migraciones

Ejecutar antes de crear usuarios o validar Preview:

```powershell
npm run admin:migrate
```

La migración es idempotente y crea tablas, índices y restricciones sin borrar datos.

## Primer usuario

Ejecutar:

```powershell
npm run admin:create-user
```

El script solicita nombre, usuario, email opcional, rol, contraseña y confirmación. No acepta `--password=...`.

## Sesiones y seguridad

Las sesiones son server-side, con cookie HttpOnly, Secure en producción, expiración, token CSRF por sesión y validación de Origin para mutaciones administrativas.

El cambio de contraseña incrementa la versión de sesión e invalida sesiones anteriores.

## Media

Límites actuales:

- 10 fotografías por carga.
- 12 MB por imagen.
- 60 MB por carga.
- Formatos admitidos: JPG, PNG y WEBP.

HEIC no se procesa todavía. El mensaje esperado es:

```text
Este formato no puede procesarse todavía. Convierte o selecciona otra fotografía.
```

Vercel Blob guarda objetos públicos por URL. Una imagen marcada como interna no se expone en DTO público ni HTML, pero si la URL del objeto público ya fue conocida, el storage no equivale a privacidad fuerte.

## Preview

Usar variables separadas de producción para base de datos y media. No mezclar trabajos de prueba con contenido real.

Validar en Preview:

1. Login.
2. Crear borrador.
3. Subir fotografías.
4. Cerrar sesión y volver.
5. Editar.
6. Publicar.
7. Ver caso en páginas públicas sin deploy.
8. Archivar.
