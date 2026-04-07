const RESEND_API_KEY = 're_9N6LKo7i_FUMHrnCEKy2Mk919zTWVaWdm';

async function testAdminEmail() {
    try {
        console.log('Sending to chjagadeesh.gdvl@gmail.com...');
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'ProtoGods by JK labs <onboarding@resend.dev>',
                to: ['chjagadeesh.gdvl@gmail.com'],
                subject: 'Resend Debug Test',
                html: 'If you get this, Admin email works.'
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('API Error:', data);
        } else {
            console.log('Success! ID:', data.id);
        }
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testAdminEmail();
