const domain = 'dr-white-5537.myshopify.com';
const token = '65f8939cb5139fcae960e9aa8dbc4371';
const query = `{ products(first: 10) { edges { node { handle title } } } }`;

async function test() {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
