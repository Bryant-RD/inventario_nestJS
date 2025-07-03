Guía de Pruebas

# Objetivo

Verificar que el sistema de gestión de inventarios cumpla con los requisitos funcionales y no funcionales, garantizando su correcta operación y seguridad.

# Tipos de pruebas realizadas

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

Descripción: Verificar que un usuario empleado no pueda crear un producto.

- Pasos:
- Autenticarse como empleado.
- Intentar enviar POST `/products`.
Resultado esperado: Código 403 (Forbidden).

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

