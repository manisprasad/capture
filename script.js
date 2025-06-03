document.getElementById('screenshot-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/capture', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to capture screenshot');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'pinterest-infographic.png';
        link.click();

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        alert('Failed to capture screenshot. Please try again.');
    }
});
