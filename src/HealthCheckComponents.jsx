import React, { useState } from 'react';

async function checkHealth(urlToCheck) {
    try {
        const response = await fetch('http://localhost:5000/api/healthcheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlToCheck }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return { isSuccess: false, message: error.message };
    }
}

function HealthCheckComponent() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);

    const handleCheck = async () => {
        const res = await checkHealth(url);
        setResult(res);
    };

    return (
        <div>
            <h1>Check Health Dashboard</h1>
            <input
                type="text"
                placeholder="Enter URL to check"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleCheck}>Check</button>

            {result && (
                <div>
                    <p>Status Code: {result.statusCode || 'N/A'}</p>
                    <p>Success: {result.isSuccess ? 'Yes' : 'No'}</p>
                    {result.message && <p>Message: {result.message}</p>}
                </div>
            )}
        </div>
    );
}

export default HealthCheckComponent;
