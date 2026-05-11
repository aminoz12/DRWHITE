import { getProducts } from './src/lib/shopify.js';

async function test() {
  const products = await getProducts();
  console.log('Products found:', products.length);
  products.forEach(p => {
    console.log(`- ${p.node.handle}: ${p.node.title}`);
  });
}

test();
