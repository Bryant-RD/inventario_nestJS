Documento de Requisitos

# 1. Introducción

## 1.1. Objetivo

Desarrollar un sistema de gestión de inventarios que permita controlar los productos de una pequeña empresa, garantizar la seguridad, la trazabilidad y la facilidad de uso, cumpliendo con estándares de calidad y seguridad (QAS).

## 1.2. Alcance

El sistema permitirá la gestión completa de productos, control de stock, control de accesos por roles, integración futura con otros sistemas (por ejemplo, POS y contabilidad) y visualización de datos.

# 2. Requisitos Funcionales

Los Requisitos Funcionales definen lo que el sistema debe hacer.

## 2.1. Gestión de Productos

- RF-01: Permitir agregar productos con nombre, descripción, categoría, precio y cantidad inicial.
- RF-02: Permitir editar los datos de productos existentes.
- RF-03: Permitir eliminar productos del inventario.
- RF-04: Visualizar la lista de productos con búsqueda y filtrado.
- RF-05: Visualizar detalles de un producto específico.
## 2.2. Control de Stock

- RF-06: Permitir actualizar la cantidad en stock de los productos.
- RF-07: Registrar historial de movimientos de stock (entradas y salidas).
- RF-08: Generar alertas cuando el stock esté por debajo del mínimo definido.
## 2.3. Gestión de Usuarios y Roles

- **RF-09: Autenticación de Usuarios:** El sistema debe permitir la autenticación de usuarios mediante credenciales (email y contraseña) y generar un token JWT para gestionar la sesión.
- **RF-10: Roles y Permisos:** El sistema debe soportar tres roles con diferentes niveles de acceso:
    - **Administrador:**
        - **Permisos:** Acceso completo a todas las funcionalidades. Puede crear, ver, editar y eliminar productos. Puede gestionar usuarios y ver todos los reportes y el historial de movimientos.
    - **Empleado:**
        - **Permisos:** Acceso a funcionalidades operativas. Puede crear, ver y editar productos (no puede eliminar). Puede actualizar el stock y ver el historial de movimientos. No tiene acceso a la gestión de usuarios.
    - **Usuario Invitado/Cliente:**
        - **Permisos:** Acceso de solo lectura. Puede ver la lista de productos y sus detalles básicos (precio, stock). No puede realizar ninguna acción de escritura (crear, editar, eliminar) ni ver historiales o reportes detallados.
- **RF-11: Registro de Usuarios:** El sistema debe permitir el registro de nuevos usuarios, asignándoles por defecto el rol de "Empleado" o "Cliente" según la configuración. La creación de "Administradores" debe ser una tarea manual o restringida.
- **RF-12: Restricción de Acceso:** Los endpoints de la API deben estar protegidos y validar el rol del usuario para autorizar o denegar la operación solicitada.

## 2.4. Integración y API

- RF-13: Exponer endpoints para integración con otros sistemas (por ejemplo, contabilidad, POS).
- RF-14: Permitir exportar la lista de productos en formato CSV o Excel.
## 2.5. Reportes

- RF-15: Generar reportes de stock actual.
- RF-16: Generar reportes de movimientos por producto.
- RF-17: Generar reportes de productos más vendidos.
# 3. Requisitos No Funcionales

Los Requisitos No Funcionales definen cómo debe comportarse el sistema.

- RNF-01: Todos los endpoints deben estar protegidos mediante autenticación JWT.
- RNF-02: Los datos sensibles deben estar cifrados.
- RNF-03: Validaciones estrictas en entradas y salidas para prevenir inyecciones.
- RNF-04: **Rendimiento:** El sistema debe soportar al menos 50 usuarios concurrentes sin degradar el rendimiento. El tiempo de respuesta en las operaciones críticas no debe superar los 2 segundos.
- RNF-05: **Usabilidad:** La interfaz de usuario debe ser clara, intuitiva y fácil de usar, con una navegación accesible para usuarios no técnicos.
- RNF-06: **Compatibilidad:** La aplicación web debe ser compatible con las últimas dos versiones de los principales navegadores (Chrome, Firefox, Safari, Edge) y ser responsiva para su uso en dispositivos móviles.
- RNF-08: El código debe seguir buenas prácticas (modularización y uso de controladores y servicios separados).
- RNF-09: Debe existir documentación técnica para facilitar futuras actualizaciones.
- RNF-10: El sistema debe poder integrarse con nuevas funcionalidades sin necesidad de rediseñar el núcleo.
- RNF-11: **Gestión de Migraciones de Base de Datos:** Se deben utilizar herramientas automatizadas (como Flyway o Liquibase) para gestionar los cambios en el esquema de la base de datos de forma versionada y segura.
- RNF-12: **Observabilidad del Sistema:** El sistema debe ser instrumentado para recolectar métricas, trazas y logs (usando OpenTelemetry) que faciliten el monitoreo en tiempo real y la resolución de problemas.
# 4. Requisitos de Infraestructura

- RI-01: Base de datos PostgreSQL.
- RI-02: Posibilidad de correr en contenedores Docker.
- RI-03: Servidor Node.js con NestJS.
# 5. Conclusión

Este documento define claramente lo que el sistema debe hacer (funcional) y cómo debe comportarse (no funcional), sentando la base para el desarrollo, pruebas y aseguramiento de calidad.
