Mantenimiento y Actualizaciones

# Objetivo

Garantizar que el sistema de gestión de inventarios se mantenga seguro, estable y funcional a lo largo del tiempo mediante un ciclo planificado de mantenimiento y actualizaciones.

# Plan de mantenimiento

## 1. Mantenimiento Correctivo

Detectar y corregir errores o fallos reportados por los usuarios o detectados durante las pruebas.
Aplicar parches de seguridad urgentes para vulnerabilidades descubiertas.
Supervisar el correcto funcionamiento del sistema en producción y responder rápidamente ante incidentes.

## 2. Mantenimiento Preventivo

Realizar revisiones periódicas del código para mejorar la calidad y prevenir posibles fallos futuros.
Actualizar dependencias y librerías para evitar problemas de compatibilidad y seguridad.
Realizar pruebas automatizadas antes y después de cada actualización para validar la estabilidad.

## 3. Mantenimiento Evolutivo

Añadir nuevas funcionalidades o mejorar las existentes según feedback de usuarios o necesidades del negocio.
Adaptar el sistema a cambios normativos o tecnológicos.
Mejorar la experiencia de usuario y rendimiento conforme avance la tecnología.

# Ciclo de actualizaciones


# 4. Gestión de Migraciones de Base de Datos

Para gestionar los cambios en el esquema de la base de datos de manera segura y automatizada, se utilizarán herramientas como **Flyway** o **Liquibase**.

- **Proceso:**
  - Cada cambio en la base de datos (crear tabla, añadir columna, etc.) se escribirá en un script SQL versionado (ej. `V1__Crear_tabla_productos.sql`).
  - Estos scripts se almacenarán en el control de versiones (Git) junto con el código de la aplicación.
  - Durante el despliegue, la herramienta de migración se ejecutará automáticamente, comparará la versión de la base de datos con los scripts disponibles y aplicará solo los cambios pendientes.
- **Beneficios:**
  - **Consistencia:** Asegura que todos los entornos (desarrollo, pruebas, producción) tengan el mismo esquema de base de datos.
  - **Trazabilidad:** Permite saber quién, cuándo y por qué se realizó un cambio en la base de datos.
  - **Reversibilidad:** Facilita la reversión a una versión anterior del esquema si es necesario (rollback).

# 5. Estrategia de Monitoreo y Observabilidad

Para garantizar la salud y el rendimiento del sistema en producción, se implementará una estrategia de observabilidad basada en los tres pilares fundamentales, utilizando **OpenTelemetry** para la instrumentación.

- **Métricas (Metrics):**
  - **Herramientas:** Prometheus para la recolección y Grafana para la visualización.
  - **Métricas Clave:** Tasa de errores (HTTP 5xx), latencia de las peticiones, uso de CPU y memoria del servidor, número de usuarios activos.

- **Trazas (Traces):**
  - **Herramientas:** OpenTelemetry para generar las trazas y un backend compatible como Jaeger o Zipkin para visualizarlas.
  - **Objetivo:** Seguir el flujo de una petición a través de los diferentes servicios (ej. desde el controlador hasta la base de datos) para identificar cuellos de botella y puntos de fallo.

- **Logs:**
  - **Herramientas:** Centralización de logs mediante una pila como ELK (Elasticsearch, Logstash, Kibana) o Loki con Grafana.
  - **Objetivo:** Agregar los logs de la aplicación en un solo lugar para facilitar la búsqueda, el análisis de errores y la creación de alertas basadas en eventos específicos.

# Conclusión

El mantenimiento y actualización constantes aseguran que el sistema se mantenga confiable, seguro y alineado con las necesidades del negocio, garantizando la satisfacción de los usuarios y la continuidad operativa.
