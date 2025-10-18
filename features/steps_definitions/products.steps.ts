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
      // Aseguramos enum Role de forma segura
      const roleKey = role.toUpperCase() as keyof typeof Role;
      const roleValue = (Role as any)[roleKey];
      if (!roleValue) {
        throw new Error(`Role inválido: ${role}. Revisa enum Role.`);
      }

      const userData = {
        username,
        password: pass,
        firstName: 'NombreTest',
        lastName: 'ApellidoTest',
        email: `${username}@test.com`,
        role: roleValue,
        company: 'Empresa Test'
      };

      console.log('DEBUG Enviando datos registro usuario:', userData);

      const response = await this.request
        .post('/auth/register')
        .send(userData);

      console.log(`DEBUG registro usuario status: ${response.status} body:`, response.body);

      if (![200,201].includes(response.status)) {
        throw new Error(`Registro usuario falló: status ${response.status} body ${JSON.stringify(response.body)}`);
      }
    } catch (error: any) {
      console.error('Error creando usuario:', error.response?.body || error.message);
      throw error;
    }
  },
);

Given(
  'que existe un producto con el siguiente cuerpo:',
  async function (this: CustomWorld, body: string) {
    // Login del empleado (asegúrate de que ese usuario exista)
    const loginRes = await this.request
      .post('/auth/login')
      .send({ email: 'cucumber_employee@test.com', password: 'password' });

    console.log('DEBUG loginRes:', loginRes.status, loginRes.body);

    if (!loginRes || !loginRes.body || !loginRes.body.access_token) {
      throw new Error(`Login del empleado falló. Status: ${loginRes?.status}. Body: ${JSON.stringify(loginRes?.body)}`);
    }

    const employeeToken = loginRes.body.access_token;

    const productData = JSON.parse(body);
    const fullProductData = {
      descripcion: 'desc',
      categoria: 'cat',
      precio: 10,
      cantidad: 10,
      cantidadMinima: 1,
      ...productData,
    };

    console.log('DEBUG creando producto con:', fullProductData);

    const createProductRes = await this.request
      .post('/productos')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send(fullProductData);

    console.log('DEBUG createProductRes:', createProductRes.status, createProductRes.body);

    if (![200, 201].includes(createProductRes.status)) {
      throw new Error(`Creación de producto falló: status ${createProductRes.status} body: ${JSON.stringify(createProductRes.body)}`);
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
  'la respuesta debe tener el código de estado {int}',
  function (this: CustomWorld, statusCode: number) {
    expect(this.response.status).to.equal(statusCode);
  },
);

Then(
  'el cuerpo de la respuesta debe contener una propiedad {string} con el valor {string}',
  function (this: CustomWorld, prop: string, value: string) {
    expect(this.response.body).to.have.property(prop, value);
  },
);


Then(
  'el array de la respuesta debe tener {int} elemento\\(s)',
  function (this: CustomWorld, count: number) {
    const body = this.response?.body;
    console.log('DEBUG Then -> body:', body);
    if (!Array.isArray(body)) {
      throw new Error(`Se esperaba un array pero la respuesta fue: ${JSON.stringify(body)}`);
    }
    const actual = body.length;
    if (actual !== count) {
      throw new Error(`Se esperaba ${count} elementos pero la respuesta tiene ${actual}. Body: ${JSON.stringify(body)}`);
    }
  },
);

Then(
  'el cuerpo de la respuesta debe ser un array',
  function (this: CustomWorld) {
    expect(this.response.body).to.be.an('array');
  },
);

Then(
  'el primer elemento del array de la respuesta debe tener la propiedad {string} con el valor {string}',
  function (this: CustomWorld, prop: string, value: string) {
    expect(this.response.body)
      .to.be.an('array')
      .with.length.greaterThan(0);
    expect(this.response.body[0]).to.have.property(prop, value);
  },
);
