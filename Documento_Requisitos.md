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

- RF-09: Permitir autenticación de usuarios mediante JWT.
- RF-10: Permitir registro de usuarios (administrador y empleados).
- RF-11: Permitir asignar roles a los usuarios (admin, empleado).
- RF-12: Restringir funcionalidades según el rol asignado.
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
- RNF-04: El sistema debe soportar al menos 50 usuarios concurrentes sin degradar el rendimiento.
- RNF-05: El tiempo de respuesta en las operaciones críticas no debe superar 2 segundos.
- RNF-06: La interfaz debe ser clara, sencilla y accesible para usuarios no técnicos.
- RNF-07: Debe ser compatible con dispositivos móviles y diferentes navegadores modernos.
- RNF-08: El código debe seguir buenas prácticas (modularización y uso de controladores y servicios separados).
- RNF-09: Debe existir documentación técnica para facilitar futuras actualizaciones.
- RNF-10: El sistema debe poder integrarse con nuevas funcionalidades sin necesidad de rediseñar el núcleo.
# 4. Requisitos de Infraestructura

- RI-01: Base de datos PostgreSQL.
- RI-02: Posibilidad de correr en contenedores Docker.
- RI-03: Servidor Node.js con NestJS.
# 5. Conclusión

Este documento define claramente lo que el sistema debe hacer (funcional) y cómo debe comportarse (no funcional), sentando la base para el desarrollo, pruebas y aseguramiento de calidad.

