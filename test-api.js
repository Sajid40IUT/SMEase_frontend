// Simple test script to verify the API is working
const fetch = require('node-fetch');

async function testAPI() {
  const baseURL = 'http://localhost:4000/api';
  
  try {
    console.log('Testing API endpoints...\n');
    
    // Test products endpoint
    console.log('1. Testing /api/products...');
    const productsResponse = await fetch(`${baseURL}/products`);
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`✅ Products API working - Found ${products.length} products`);
      if (products.length > 0) {
        console.log(`   Sample product: ${products[0].name} (UPC: ${products[0].upc})`);
        console.log(`   Supplier: ${products[0].supplier?.name || 'No supplier data'}`);
      }
    } else {
      console.log(`❌ Products API failed - Status: ${productsResponse.status}`);
    }
    
    // Test employees endpoint
    console.log('\n2. Testing /api/employees...');
    const employeesResponse = await fetch(`${baseURL}/employees`);
    if (employeesResponse.ok) {
      const employees = await employeesResponse.json();
      console.log(`✅ Employees API working - Found ${employees.length} employees`);
    } else {
      console.log(`❌ Employees API failed - Status: ${employeesResponse.status}`);
    }
    
    // Test suppliers endpoint
    console.log('\n3. Testing /api/suppliers...');
    const suppliersResponse = await fetch(`${baseURL}/suppliers`);
    if (suppliersResponse.ok) {
      const suppliers = await suppliersResponse.json();
      console.log(`✅ Suppliers API working - Found ${suppliers.length} suppliers`);
    } else {
      console.log(`❌ Suppliers API failed - Status: ${suppliersResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\nMake sure the backend server is running on port 4000');
    console.log('Run: cd SMEease_backend && npm run dev');
  }
}

testAPI();
