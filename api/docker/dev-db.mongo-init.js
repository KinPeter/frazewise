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
    loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
    loginCodeExpires: new Date(2147483647000),
    salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
    passwordHash: '$2b$10$ESG91CanqubPddsEsRulTuePxQ3/Tnmj9Pe.hlFIcWJcJiuy2By8a', // password
    passwordSalt: '$2b$10$ESG91CanqubPddsEsRulTu',
    isPro: true,
  },
  {
    id: 'c13ef9a2-d1ff-417d-bce7-75188a6114d2',
    createdAt: new Date(),
    email: 'other@test.com',
    loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
    loginCodeExpires: new Date(2147483647000),
    salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
    passwordHash: '$2b$10$ESG91CanqubPddsEsRulTuePxQ3/Tnmj9Pe.hlFIcWJcJiuy2By8a', // password
    passwordSalt: '$2b$10$ESG91CanqubPddsEsRulTu',
    isPro: false,
  },
]);
