const axios = require('axios');
const FormData = require('form-data');

async function testEmail() {
  try {
    const formData = new FormData();
    
    // Add required fields
    formData.append('name', 'Test User');
    formData.append('mail', 'paulambrose5002@gmail.com');
    formData.append('subject', 'Test Email from API');
    formData.append('text', 'This is a test email message sent from the API test script.');
    
    console.log('Sending test email...');
    console.log('To: test@example.com');
    console.log('Subject: Test Email from API');
    
    const response = await axios.post('http://localhost:3000/sendmail', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('\n✅ Success!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testEmail();
