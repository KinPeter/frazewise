db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'pkstartdev',
    },
  ],
});

db = db.getSiblingDB('frazewise');

db.createCollection('init');

db.getCollection('init').insertOne({ initialized: new Date() });

db.createCollection('users');

db.getCollection('users').insertMany([
  {
    id: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    email: 'main@test.com',
    loginCode:
      '6677d1d404850244c84b8d1c33c62e78965d2fba96d0d25a094677c96f61639bbed9876d855ef9252ce9522f61b5b96b95528ef3d0975b61d2f506802b174cda', // 616782
    loginCodeExpires: new Date(2147483647000),
    salt: 'ae6d66bdb476b744c6a5fd3236427825',
    passwordHash:
      '5e2f7810c76f587afc179e534a3681d92d91280e8ec73e81d62e885a1a1386b1db1e3b0614e4665229c9d7a4b96f019c3d8f1625257047836fd974a7151f27c3', // password
    passwordSalt: 'c2eb7b8a1caeafe94c913335318ac873',
    isPro: true,
  },
  {
    id: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
    email: 'other@test.com',
    loginCode:
      '6677d1d404850244c84b8d1c33c62e78965d2fba96d0d25a094677c96f61639bbed9876d855ef9252ce9522f61b5b96b95528ef3d0975b61d2f506802b174cda', // 616782
    loginCodeExpires: new Date(2147483647000),
    salt: 'ae6d66bdb476b744c6a5fd3236427825',
    passwordHash:
      '5e2f7810c76f587afc179e534a3681d92d91280e8ec73e81d62e885a1a1386b1db1e3b0614e4665229c9d7a4b96f019c3d8f1625257047836fd974a7151f27c3', // password
    passwordSalt: 'c2eb7b8a1caeafe94c913335318ac873',
    isPro: false,
  },
]);
