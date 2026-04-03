const RESEND_API_KEY = 're_9N6LKo7i_FUMHrnCEKy2Mk919zTWVaWdm';

async function testResend(to) {
    console.log(`Checking email to: ${to}`);
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'ProtoNest by JK Labs <onboarding@resend.dev>',
                to: [to],
                subject: 'Test Email',
                html: '<p>Testing</p>'
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(`Error sending to ${to}:`, data.message || JSON.stringify(data));
        } else {
            console.log(`Success sending to ${to}:`, data.id);
        }
    } catch (err) {
        console.error(`Network Error: ${err.message}`);
    }
}

async function run() {
    await testResend('chjagadeesh.gdvl@gmail.com'); // Admin email
    await testResend('randomtestcustomer@gmail.com'); // Random customer email
}

run();
