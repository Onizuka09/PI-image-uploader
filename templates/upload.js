function uploadImage() {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");
  const responseDiv = document.getElementById("response");
  const file = fileInput.files[0];
  console.log(file);
  if (file) {
      // Create a FormData object to send the file
        formData = new FormData();
      formData.append('fileInput', file);

      // Make a POST request to your server
      fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          responseDiv.innerHTML = `File uploaded successfully. Server response: ${data.message}`;
      })
      .catch(error => {
          responseDiv.innerHTML = `Error uploading file: ${error.message}`;
      });
  } else {
      responseDiv.innerHTML = 'Please select a file to upload.';
  }
}
