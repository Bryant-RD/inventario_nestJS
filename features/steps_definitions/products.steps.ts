import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../support/world';
import { Role } from '../../src/usuarios/roles/roles.enum';

Given('que la aplicación está en funcionamiento', function (this: CustomWorld) {
  expect(this.request).to.not.be.undefined;
});

Given(
  'un usuario {string} con nombre {string} y contraseña {string} existe',
  async function (this: CustomWorld, role: string, username: string, pass: string) {
    try {
      const userData = { 
        username, 
        password: pass, 
        firstName: 'NombreTest',    // Correcto: el DTO espera `firstName`
        lastName: 'ApellidoTest',   // Correcto: el DTO espera `lastName`
        email: `${username}@test.com`,
        role: Role[role.toUpperCase()],
        company: 'Empresa Test'
      };
      
      console.log('Enviando datos:', userData);
      
      const response = await this.request
        .post('/auth/register')
        .send(userData);
      
      console.log(`Usuario ${username} creado con status: ${response.status}`);
    } catch (error) {
      console.error('Error creando usuario:', error.response?.body || error.message);
    }
  },
);

Given(
  'estoy autenticado como el usuario {string} con contraseña {string}',
  async function (this: CustomWorld, username: string, pass: string) {
    // Corregido: El login se hace con email, no con username.
    const res = await this.request.post('/auth/login').send({ email: `${username}@test.com`, password: pass });
    expect(res.status).to.equal(201);
    this.token = res.body.access_token;
  },
);

When(
  'envío una petición POST a {string} con el siguiente cuerpo:',
  async function (this: CustomWorld, path: string, body: string) {
    this.response = await this.request
      .post(path)
      .set('Authorization', `Bearer ${this.token}`)
      .send(JSON.parse(body));
  },
);

When(
  'envío una petición GET a {string}',
  async function (this: CustomWorld, path: string) {
    this.response = await this.request
      .get(path)
      .set('Authorization', `Bearer ${this.token}`);
  },
);

When(
  'envío una petición {string} a {string} con el siguiente cuerpo:',
  async function (this: CustomWorld, method: string, path: string, body: string) {
    this.response = await this.request[method.toLowerCase()](path)
      .set('Authorization', `Bearer ${this.token}`)
      .send(JSON.parse(body));
  },
);

When(
  'envío una petición {string} a {string}',
  async function (this: CustomWorld, method: string, path: string) {
    this.response = await this.request[method.toLowerCase()](path)
      .set('Authorization', `Bearer ${this.token}`);
  },
);

Then(
  'el cuerpo de la respuesta debe contener una propiedad {string} con el valor {string}',
  function (this: CustomWorld, prop: string, value: string) {
    expect(this.response.body).to.have.property(prop, value);
  },
);

Then(
  'el array de la respuesta debe tener {int} elemento(s)',
  function (this: CustomWorld, count: number) {
    expect(this.response.body).to.be.an('array').with.lengthOf(count);
  },
);
