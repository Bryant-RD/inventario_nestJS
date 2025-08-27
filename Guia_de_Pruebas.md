Guía de Pruebas

# Objetivo

Verificar que el sistema de gestión de inventarios cumpla con los requisitos funcionales y no funcionales, garantizando su correcta operación y seguridad.

# Tipos de pruebas realizadas

- **Pruebas Unitarias y de Integración:** Realizadas con Jest para validar la lógica de negocio en servicios y controladores.
- **Pruebas de Aceptación (E2E):** Implementadas con Cucumber para simular flujos de usuario y validar los requisitos funcionales desde la perspectiva del cliente.
- **Pruebas de Seguridad:** Enfocadas en validar la autenticación, autorización y protección contra vulnerabilidades comunes.
- **Pruebas de Usabilidad y Compatibilidad:** Evaluaciones para asegurar una experiencia de usuario consistente y funcional en diferentes entornos.

# Casos de prueba (Ejemplos detallados)

## Caso 1: Crear producto (Admin)

Descripción: Verificar que un usuario con rol administrador pueda crear un nuevo producto.

- Pasos:
- Autenticarse como administrador.
- Enviar solicitud POST `/products` con datos válidos.
Resultado esperado: Código 201 (Created) y respuesta con los datos del producto creado.

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 2: Crear producto (Empleado)

Descripción: Verificar que un usuario con rol de empleado pueda crear un nuevo producto, según los requisitos.

- Pasos:
- Autenticarse como empleado.
- Enviar solicitud POST `/products` con datos válidos.
Resultado esperado: Código 201 (Created) y respuesta con los datos del producto creado.

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 3: Editar producto (Admin)

Descripción: Verificar que un administrador pueda editar un producto existente.

- Pasos:
- Autenticarse como administrador.
- Enviar PUT `/products/:id` con nuevos datos.
Resultado esperado: Código 200 (OK) y respuesta con el producto actualizado.

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 4: Ver lista de productos (Empleado)

Descripción: Verificar que un empleado pueda consultar la lista de productos.

- Pasos:
- Autenticarse como empleado.
- Enviar GET `/products`.
Resultado esperado: Código 200 y lista completa de productos.

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 5: Seguridad JWT

Descripción: Verificar que no se pueda acceder a endpoints protegidos sin token.

- Pasos:
- Enviar solicitud GET `/products` sin token.
Resultado esperado: Código 401 (Unauthorized).

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 6: Prueba de aceptación (Cucumber) - Agregar producto

Descripción: Validar mediante Cucumber que un admin pueda crear un producto y aparezca en el inventario.

Resultado esperado: Test pasa en verde.

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

## Caso 7: Prueba de aceptación (Cucumber) - Restricción de empleado

Descripción: Verificar que un empleado no pueda crear un producto (test Cucumber).

Resultado esperado: Error 403 (prohibido).

Resultado obtenido: Correcto.

Defectos encontrados: Ninguno.

# Estrategia de Pruebas Adicionales

## Pruebas de Seguridad

Para asegurar que el sistema es robusto contra amenazas, se define la siguiente estrategia de pruebas de seguridad:

- **Autenticación y Autorización:**
    - Validar que todos los endpoints protegidos devuelvan `401 Unauthorized` si no se provee un token JWT.
    - Validar que un token inválido o expirado sea rechazado.
    - Probar el acceso a endpoints con roles incorrectos (ej. un "Cliente" intentando editar un producto), esperando un `403 Forbidden`.
- **Validación de Entradas:**
    - Realizar pruebas de inyección (SQLi, XSS) enviando payloads maliciosos en los DTOs para asegurar que las validaciones de `class-validator` los rechazan.
- **Análisis de Dependencias:**
    - Utilizar herramientas como `npm audit` o Snyk de forma periódica para detectar y corregir vulnerabilidades en las librerías de terceros.

## Pruebas de Usabilidad y Compatibilidad

- **Pruebas de Usabilidad:**
    - Se realizarán revisiones de la interfaz (evaluación heurística) para identificar problemas de flujo, consistencia y claridad.
    - Se planificarán sesiones de feedback con usuarios finales para validar que la aplicación es intuitiva y cumple sus expectativas.
- **Pruebas de Compatibilidad:**
    - El objetivo es garantizar el funcionamiento en las últimas dos versiones de los navegadores: **Google Chrome, Mozilla Firefox, Safari y Microsoft Edge**.
    - Se utilizarán herramientas de automatización como **Playwright** o **Cypress** para ejecutar un conjunto de pruebas E2E clave en diferentes navegadores y asegurar una experiencia consistente.
    - Se realizarán pruebas manuales en dispositivos móviles (iOS y Android) para verificar el diseño responsivo.

# Resumen de defectos encontrados

# Resultados globales

Pruebas ejecutadas: 7

Pruebas exitosas: 7

Pruebas con defectos: 0

Cobertura aproximada: 90% funcionalidades principales

# Recomendaciones

Seguir ejecutando pruebas automáticas antes de cada despliegue (CI/CD).

Realizar pruebas de estrés y carga cuando se integre a producción.

Validar futuras nuevas funcionalidades con pruebas de aceptación adicionales.
