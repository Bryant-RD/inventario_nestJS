Feature: Alertas de Stock
  Como usuario autorizado (Admin/Empleado),
  quiero poder ver los productos que tienen un stock bajo
  para poder tomar acciones de reabastecimiento.

  Background:
    Given que la aplicación está en funcionamiento
    And un usuario "ADMIN" con nombre "adminstock" y contraseña "password123" existe
    And estoy autenticado como el usuario "adminstock" con contraseña "password123"

  Scenario: Obtener productos con stock por debajo del mínimo
    Given envío una petición "POST" a "/productos" con el siguiente cuerpo:
      """
      {
        "nombre": "Laptop Modelo X",
        "descripcion": "Laptop con stock normal",
        "categoria": "Electrónica",
        "precio": 1200,
        "cantidad": 15,
        "cantidadMinima": 10,
        "proveedorId": 1
      }
      """
    And la respuesta debe tener el código de estado 201
    And envío una petición "POST" a "/productos" con el siguiente cuerpo:
      """
      {
        "nombre": "Mouse Inalámbrico",
        "descripcion": "Mouse con stock bajo",
        "categoria": "Accesorios",
        "precio": 25,
        "cantidad": 5,
        "cantidadMinima": 5,
        "proveedorId": 1
      }
      """
    And la respuesta debe tener el código de estado 201

    When envío una petición "GET" a "/productos/stock/alerts"

    Then la respuesta debe tener el código de estado 200
    And el cuerpo de la respuesta debe ser un array
    And el array de la respuesta debe tener 1 elemento(s)
    And el primer elemento del array de la respuesta debe tener la propiedad "nombre" con el valor "Mouse Inalámbrico"