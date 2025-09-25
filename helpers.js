'use strict';

import { faker } from '@faker-js/faker';

export {
  logInAndSetToken,
  generateRandomUser,
};
 
// Función para generar datos de usuario aleatorios para el registro
function generateRandomUser(context, events, done) {
  const username = faker.internet.userName().toLowerCase() + Date.now();
  context.vars.username = username;
  context.vars.email = `${username}@test.com`;
  context.vars.password = 'supersecret123';
  return done();
}

// Función que se ejecuta en el escenario de Artillery para hacer login
async function logInAndSetToken(requestParams, response, context, ee, next) {
  // Extrae el token de la respuesta del login
  const token = JSON.parse(response.body).access_token;

  // Lo guarda en las variables del escenario para usarlo en las siguientes peticiones
  context.vars.token = token;

  // Continúa con el siguiente paso del escenario
  return next();
}