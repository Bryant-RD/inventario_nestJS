Feature: Gestión de Productos
  Como usuario del sistema, quiero gestionar productos para mantener el inventario actualizado,
  respetando las reglas de acceso de mi rol.

  Background:
    Given que la aplicación está en funcionamiento
    And un usuario "EMPLOYEE" con nombre "cucumber_employee" y contraseña "password" existe
    And un usuario "CLIENT" con nombre "cucumber_client" y contraseña "password" existe

  Scenario: Un empleado puede crear un producto exitosamente
    Given estoy autenticado como el usuario "cucumber_employee" con contraseña "password"
    When envío una petición POST a "/productos" con el siguiente cuerpo:
      """
      {
        "nombre": "Producto Cucumber",
        "descripcion": "Creado desde una prueba de aceptación",
        "categoria": "Cucumber",
        "precio": 150.50,
        "cantidad": 25,
        "cantidadMinima": 5
      }
      """
    Then la respuesta debe tener el código de estado 201
    And el cuerpo de la respuesta debe contener una propiedad "nombre" con el valor "Producto Cucumber"

  Scenario: Un cliente no tiene permisos para crear un producto
    Given estoy autenticado como el usuario "cucumber_client" con contraseña "password"
    When envío una petición POST a "/productos" con el siguiente cuerpo:
      """
      { "nombre": "Producto Ilegal" }
      """
    Then la respuesta debe tener el código de estado 403

  Scenario: Cualquier usuario autenticado puede ver la lista de productos
    Given que existe un producto con el siguiente cuerpo:
      """
      { "nombre": "Mouse Inalámbrico" }
      """
    And estoy autenticado como el usuario "cucumber_client" con contraseña "password"
    When envío una petición GET a "/productos"
    Then la respuesta debe tener el código de estado 200
    And el cuerpo de la respuesta debe ser un array
    And el array de la respuesta debe tener 1 elemento(s)
    And el primer elemento del array de la respuesta debe tener la propiedad "nombre" con el valor "Mouse Inalámbrico"
