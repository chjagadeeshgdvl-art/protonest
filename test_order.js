const order = {
    items: [{ name: 'Test Item', price: 10, quantity: 1 }],
    customer: { name: 'Test User', phone: '6303228967', email: 'test@test.com', address: 'Test Address' }
};

fetch('http://localhost:3000/api/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
}).then(res => res.json()).then(console.log).catch(console.error);
