Feature: Gestión de Productos

  Scenario: Administrador agrega un nuevo producto
    Given el administrador está autenticado
    When crea un producto con nombre "Shampoo" y cantidad 10
    Then el producto debe aparecer en el inventario
  
  Scenario: Empleado intenta agregar un nuevo producto sin permiso
    Given el empleado está autenticado
    When intenta crear un producto con nombre "Gel" y cantidad 5
    Then la API devuelve un error de permiso
