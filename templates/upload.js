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


/*-----------------------------------------------------------------------------*/
function getAllImages() {
    const imageGallerydiv = document.getElementById("imageGallery");
    // Fetch the list of images from your Flask server
    fetch('http://127.0.0.1:5000/getAllImages', {
          method: 'GET',
      })
      .then(function (response) {
        console.log(response)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Parse the JSON response
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        if (data.images && data.images.length > 0) {
            data.images.forEach(function (image) {
                var imgElement = document.createElement('img');
                imgElement.src = '../uploads/' + image;
                imgElement.alt = image;
                imgElement.classList.add('galleryImage');
                imgElement.height="200";
                imgElement.width ="200 ";

                 // Add a click event listener to toggle image selection
                imgElement.addEventListener('click', function () {
                    toggleImageSelection(imgElement);
                });

                // Create a div for each image
                const imageContainer = document.createElement('div');
                imageContainer.className = 'col'; // Apply the 'col' class to the div
                imageContainer.appendChild(imgElement);
                imageGallerydiv.appendChild(imageContainer);
            });
            const button = createButton();
            imageGallerydiv.appendChild(button);
        } else {
            imageGallerydiv.innerHTML = '<p>No images available.</p>';
        }
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
    SelectedImages= [];
    function toggleImageSelection(imgElement) {
        imgElement.classList.toggle('selected'); // Toggle the 'selected' class
        console.log(imgElement.classList);
        if("galleryImage selected" == imgElement.classList.value){
            SelectedImages.push(imgElement.alt)
        }
        else{
            var index = SelectedImages.indexOf(imgElement.alt)
            SelectedImages.splice(index, 1);
        }
    }
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Display selected image';
        button.addEventListener('click', function () {
            sendRequestToDisplay();
        });
        return button;
    }
    function sendRequestToDisplay() {
        // Send a request to the server with the selected image
        fetch('http://127.0.0.1:5000/displayImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({SelectedImages}),
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            // Handle the server's response, if needed
            console.log(data);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    }
    
}
