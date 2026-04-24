
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/gofarm-backend-db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const CATEGORY_MAP = {
  '4eb43c2e-65e5-4675-929e-da1327928bb5': { id: '4eb43c2e-65e5-4675-929e-da1327928bb5', title: 'Vegetables', slug: 'vegetables' },
  'ac18b9f2-2d6d-4772-8f19-2f692d720f90': { id: 'ac18b9f2-2d6d-4772-8f19-2f692d720f90', title: 'Fruits', slug: 'fruits' },
  'b94b8866-d978-40cc-8641-1e138cfced28': { id: 'b94b8866-d978-40cc-8641-1e138cfced28', title: 'Juices', slug: 'juices' },
  'd102f71d-8627-4b5d-b9dc-974aabbce36f': { id: 'd102f71d-8627-4b5d-b9dc-974aabbce36f', title: 'Spices & Herbs', slug: 'spices-herbs' }
};

const targetCategories = [
  {
    id: "4eb43c2e-65e5-4675-929e-da1327928bb5",
    title: "Vegetables",
    slug: "vegetables",
    imageSrc: "/images/ca2e6ecb716db66bfdcc5dc2d0f1eed24ce421b7-34x38.svg",
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "ac18b9f2-2d6d-4772-8f19-2f692d720f90",
    title: "Fruits",
    slug: "fruits",
    imageSrc: "/images/d3f76bf8d1d8c22c91bfe16349576edbfdf320aa-32x38.svg",
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "b94b8866-d978-40cc-8641-1e138cfced28",
    title: "Juices",
    slug: "juices",
    imageSrc: "/images/4ea4d386c71f3397a839fdc71beac5702bce3194-38x38.svg",
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "d102f71d-8627-4b5d-b9dc-974aabbce36f",
    title: "Spices & Herbs",
    slug: "spices-herbs",
    imageSrc: "/images/30481828d573e5121ff991cbc3a474f3b4caf008-38x38.svg",
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

db.categories = targetCategories;

const counts = {};
db.products.forEach(product => {
  const mapping = CATEGORY_MAP[product.categoryId];
  if (mapping) {
    product.categoryId = mapping.id;
    product.categoryTitle = mapping.title;
    counts[mapping.id] = (counts[mapping.id] || 0) + 1;
  }
});

db.categories.forEach(cat => {
  cat.count = counts[cat.id] || 0;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Updated categories and products to English successfully.');
