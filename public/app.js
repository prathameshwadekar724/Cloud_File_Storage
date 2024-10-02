document.getElementById('uploadForm').onsubmit = async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        document.getElementById('responseMessage').textContent = result.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'Upload failed';
    }
};

document.getElementById('downloadButton').onclick = async () => {
    const fileName = document.getElementById('fileNameInput').value;

    try {
        const response = await fetch(`http://localhost:3000/download?fileName=${fileName}`);
        const result = await response.json();

        if (result.success) {
            document.getElementById('downloadLink').innerHTML = `<a href="${result.url}" target="_blank">Download ${fileName}</a>`;
        } else {
            document.getElementById('downloadLink').textContent = 'Download failed';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('downloadLink').textContent = 'Download failed';
    }
};
