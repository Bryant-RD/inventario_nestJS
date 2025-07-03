import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios = require('axios');

let token: string;
let response: any;

Given('el administrador está autenticado', async function () {
  const loginResponse = await axios.post('http://localhost:3000/auth/login', {
    username: 'admin',
    password: '123456',
  });
  const data = loginResponse.data as { access_token: string };
  token = data.access_token;
});

When('crea un producto con nombre {string} y cantidad {int}', async function (name: string, quantity: number) {
  response = await axios.post(
    'http://localhost:3000/productos/',
    {
      nombre: name,
      descripcion: 'Test description',
      categoria: 'Cabello',
      precio: 10,
      cantidad: quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
});

Then('el producto debe aparecer en el inventario', async function () {
  const products = await axios.get<any[]>('http://localhost:3000/productos/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const created = products.data.find((p: any) => p.name === response.data.name);
  expect(created).to.not.be.undefined;
});



// Given('el empleado está autenticado', async function () {
//   const loginResponse = await axios.post('http://localhost:3000/auth/login', {
//     username: 'empleado',
//     password: '123456',
//   });
//     const data = loginResponse.data as { access_token: string };
//   token = data.access_token;
// });

// When('intenta crear un producto con nombre {string} y cantidad {int}', async function (name: string, quantity: number) {
//   try {
//     await axios.post(
//       'http://localhost:3000/products',
//       {
//         name,
//         description: 'Intento no autorizado',
//         category: 'Cabello',
//         price: 10,
//         stock: quantity,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//   } catch (error: any) {
//     errorResponse = error.response;
//     console.error('Error al crear el producto:', errorResponse.data);
//   }
// });

// Then('la API devuelve un error de permiso', function () {
//   expect(errorResponse).to.not.be.undefined;
//   expect(errorResponse.status).to.equal(403);
// });
