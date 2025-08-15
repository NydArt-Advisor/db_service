const fetch = require('node-fetch');

async function testDatabaseService() {
    console.log('Testing Database Service...\n');

    // Test 1: Health check
    try {
        const healthResponse = await fetch('http://localhost:5001/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }

    // Test 2: Test user endpoints
    const testEmail = `db-test${Date.now()}@example.com`;
    const testUsername = `dbtestuser${Date.now()}`;

    console.log(`\nTesting with email: ${testEmail}`);
    console.log(`Testing with username: ${testUsername}\n`);

    // Test 2.1: Check if user exists (should return 404)
    try {
        const checkEmailResponse = await fetch(`http://localhost:5001/api/users/email/${testEmail}`);
        if (checkEmailResponse.status === 404) {
            console.log('✅ Email not found (expected for new user)');
        } else {
            console.log('❌ Unexpected response for non-existent email:', checkEmailResponse.status);
        }
    } catch (error) {
        console.log('❌ Error checking email:', error.message);
    }

    try {
        const checkUsernameResponse = await fetch(`http://localhost:5001/api/users/username/${testUsername}`);
        if (checkUsernameResponse.status === 404) {
            console.log('✅ Username not found (expected for new user)');
        } else {
            console.log('❌ Unexpected response for non-existent username:', checkUsernameResponse.status);
        }
    } catch (error) {
        console.log('❌ Error checking username:', error.message);
    }

    // Test 2.2: Create a test user
    try {
        const createResponse = await fetch('http://localhost:5001/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: testUsername,
                email: testEmail,
                password: 'hashedpassword123',
                role: 'user',
                status: 'active'
            })
        });

        if (createResponse.ok) {
            const userData = await createResponse.json();
            console.log('✅ User created successfully');
            console.log('User ID:', userData._id);
            console.log('Email:', userData.email);
            console.log('Username:', userData.username);

            // Test 2.3: Get user by ID
            try {
                const getByIdResponse = await fetch(`http://localhost:5001/api/users/${userData._id}`);
                if (getByIdResponse.ok) {
                    const retrievedUser = await getByIdResponse.json();
                    console.log('✅ Get user by ID successful');
                    console.log('Retrieved user email:', retrievedUser.email);
                } else {
                    console.log('❌ Get user by ID failed:', getByIdResponse.status);
                }
            } catch (error) {
                console.log('❌ Error getting user by ID:', error.message);
            }

            // Test 2.4: Get user by email
            try {
                const getByEmailResponse = await fetch(`http://localhost:5001/api/users/email/${testEmail}`);
                if (getByEmailResponse.ok) {
                    const retrievedUser = await getByEmailResponse.json();
                    console.log('✅ Get user by email successful');
                    console.log('Retrieved user ID:', retrievedUser._id);
                } else {
                    console.log('❌ Get user by email failed:', getByEmailResponse.status);
                }
            } catch (error) {
                console.log('❌ Error getting user by email:', error.message);
            }

            // Test 2.5: Get user by username
            try {
                const getByUsernameResponse = await fetch(`http://localhost:5001/api/users/username/${testUsername}`);
                if (getByUsernameResponse.ok) {
                    const retrievedUser = await getByUsernameResponse.json();
                    console.log('✅ Get user by username successful');
                    console.log('Retrieved user ID:', retrievedUser._id);
                } else {
                    console.log('❌ Get user by username failed:', getByUsernameResponse.status);
                }
            } catch (error) {
                console.log('❌ Error getting user by username:', error.message);
            }

            // Test 2.6: Update user
            try {
                const updateResponse = await fetch(`http://localhost:5001/api/users/${userData._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'artist',
                        profile: {
                            name: 'Test Artist',
                            bio: 'A test artist profile'
                        }
                    })
                });

                if (updateResponse.ok) {
                    const updatedUser = await updateResponse.json();
                    console.log('✅ User updated successfully');
                    console.log('Updated role:', updatedUser.role);
                    console.log('Updated profile name:', updatedUser.profile?.name);
                } else {
                    console.log('❌ User update failed:', updateResponse.status);
                }
            } catch (error) {
                console.log('❌ Error updating user:', error.message);
            }

            // Test 2.7: Try to create duplicate user (should fail)
            console.log('\n--- Testing Duplicate User Creation ---');
            try {
                const duplicateResponse = await fetch('http://localhost:5001/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: testUsername,
                        email: testEmail,
                        password: 'anotherpassword',
                        role: 'user'
                    })
                });

                if (duplicateResponse.status === 409) {
                    const error = await duplicateResponse.text();
                    console.log('✅ Duplicate user creation correctly rejected:', error);
                } else {
                    console.log('❌ Duplicate user creation should have been rejected');
                }
            } catch (error) {
                console.log('❌ Error testing duplicate user creation:', error.message);
            }

            // Test 2.8: Clean up - delete test user
            try {
                const deleteResponse = await fetch(`http://localhost:5001/api/users/${userData._id}`, {
                    method: 'DELETE'
                });

                if (deleteResponse.ok) {
                    console.log('✅ Test user deleted successfully');
                } else {
                    console.log('❌ Failed to delete test user:', deleteResponse.status);
                }
            } catch (error) {
                console.log('❌ Error deleting test user:', error.message);
            }

        } else {
            const error = await createResponse.text();
            console.log('❌ User creation failed:', error);
        }
    } catch (error) {
        console.log('❌ Error creating test user:', error.message);
    }
}

testDatabaseService().catch(console.error); 