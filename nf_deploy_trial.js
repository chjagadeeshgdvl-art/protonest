const https = require('https');

const API_TOKEN = 'nf-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMDcyNjU5NDctZDgxMS00MDVjLWJhYjItZjQyMGFkNDVhM2Y5IiwiZW50aXR5SWQiOiI2OWNmNmU4ZWMwOGRiMjEyMzlkMmI2OGYiLCJlbnRpdHlUeXBlIjoidGVhbSIsInRva2VuSWQiOiI2OWNmODQxZjM2YjA1ZTU3YzA1MDFjNjAiLCJ0b2tlbkludGVybmFsSWQiOiJwcm90b25lc3QiLCJyb2xlSWQiOiI2OWNmNmU4ZWMwOGRiMjEyMzlkMmI2OTAiLCJyb2xlRW50aXR5SWQiOiI2OWNmNmU4ZWMwOGRiMjEyMzlkMmI2OGYiLCJyb2xlRW50aXR5VHlwZSI6InRlYW0iLCJyb2xlSW50ZXJuYWxJZCI6Im93bmVyIiwidHlwZSI6InJiYWMiLCJpYXQiOjE3NzUyMDc0NTV9.h8tVCMEJ3A10TSO84d5Jhpdvc3CkZvc1ILAWRYE-tts';

const data = JSON.stringify({
  name: 'protonest',
  description: 'ProtoGods by JK labs E-commerce deployed by AI',
  billing: {
    deploymentPlan: 'micro'
  },
  deployment: {
    instances: 1
  },
  vcsData: {
    projectUrl: "https://github.com/chjagadeeshgdvl-art/protonest",
    projectType: "github",
    projectBranch: "main"
  },
  buildSettings: {
    dockerfile: {
      dockerFilePath: "/Dockerfile",
      dockerWorkDir: "/"
    }
  },
  env: {
    "DATA_DIR": "/data"
  },
  volumes: [
    {
      name: "protonest-data",
      size: 1024,
      mountPath: "/data"
    }
  ]
});

const options = {
  hostname: 'api.northflank.com',
  path: '/v1/projects/protonest/services/combined',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => {
    body += d.toString();
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
