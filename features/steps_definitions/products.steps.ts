import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CustomWorld } from '../support/world';
import { Role } from '../../src/usuarios/roles/roles.enum';

Given('que la aplicación está en funcionamiento', function (this: CustomWorld) {
  expect(this.request).to.not.be.undefined;
});

Given(
  'un usuario "{word}" con nombre "{string}" y contraseña "{string}" existe',
  async function (this: CustomWorld, role: string, username: string, pass: string) {
    // Intentamos registrar, si falla por conflicto (ya existe), lo ignoramos.
    await this.request
      .post('/auth/register')
      .send({ username, password: pass, role: Role[role.toUpperCase()] })
      .catch(() => {});
  },
);

Given(
  'estoy autenticado como el usuario "{string}" con contraseña "{string}"',
  async function (this: CustomWorld, username: string, pass: string) {
    const res = await this.request
      .post('/auth/login')
      .send({ username, password: pass });
    expect(res.status).to.equal(201);
    this.token = res.body.access_token;
    expect(this.token).to.be.a('string');
  },
);

When(
  'envío una petición {word} a "{string}"',
  async function (this: CustomWorld, method: string, path: string) {
    this.response = await this.request[method.toLowerCase()](path).set(
      'Authorization',
      `Bearer ${this.token}`,
    );
  },
);

When(
  'envío una petición {word} a "{string}" con el siguiente cuerpo:',
  async function (this: CustomWorld, method: string, path: string, body: string) {
    this.response = await this.request[method.toLowerCase()](path)
      .set('Authorization', `Bearer ${this.token}`)
      .send(JSON.parse(body));
  },
);

Then(
  'la respuesta debe tener el código de estado {int}',
  function (this: CustomWorld, statusCode: number) {
    expect(this.response.status).to.equal(statusCode);
  },
);

Then('el cuerpo de la respuesta debe ser un array', function (this: CustomWorld) {
  expect(this.response.body).to.be.an('array');
});

Then('el cuerpo de la respuesta debe contener una propiedad "{string}" con el valor "{string}"', function (this: CustomWorld, prop: string, value: string) {
    expect(this.response.body).to.have.property(prop, value);
});


// ... tus otros steps

Then('el array de la respuesta debe tener {int} elemento(s)', function (count: number) {
  expect(this.response.body).to.be.an('array').with.lengthOf(count);
});

Then('el primer elemento del array de la respuesta debe tener la propiedad {string} con el valor {string}', function (prop: string, value: string) {
  expect(this.response.body[0]).to.have.property(prop, value);
  // Opcionalmente, puedes verificar que no esté el otro producto
  expect(this.response.body.some(p => p.nombre === 'Laptop Modelo X')).to.be.false;
});