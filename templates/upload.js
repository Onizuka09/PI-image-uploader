ip="127.0.0.1"; 
port="5000"; 
url ="http://"+ip+":"+port; 
uploads_folder="uploads/"; 
console.log(url); 
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

        fetch( url+'/upload', {
        //fetch('http://192.168.1.18:5000/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                responseDiv.innerHTML = `File uploaded successfully. Server response: ${data.message}`;
                responseDiv.className = "p-3 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3";
            })
            .catch(error => {
                responseDiv.innerHTML = `Error uploading file: ${error.message}`;
                responseDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
            });
    } else {
        responseDiv.innerHTML = 'Please select a file to upload.';
        responseDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
    }
}

SelectedImages = [];
/*-----------------------------------------------------------------------------*/
function toggleImageSelection(imgElement) {
    imgElement.classList.toggle('selected'); // Toggle the 'selected' class);
    if (imgElement.classList.value.includes("selected")) {
        SelectedImages.push(imgElement.alt)
    }
    else {
        var index = SelectedImages.indexOf(imgElement.alt)
        SelectedImages.splice(index, 1);
    }
}
function createButton() {
    const button = document.createElement('button');
    button.textContent = 'Display selected image';
    button.className = "btn btn-primary"
    button.addEventListener('click', function () {
        sendRequestToDisplay();
    });
    return button;
}
function sendRequestToDisplay() {
    const errorDiv = document.getElementById("errorDiv");
    // Send a request to the server with the selected image
	
    fetch( url+'/displayImage', {
    //fetch('http://192.168.1.18:5000/displayImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SelectedImages }),
    })
        .then(function (response) {
            if (!response.ok) {
                errorDiv.innerHTML = `Request Error: ${response.message}`;
                errorDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
            }
            return response.json();
        })
        .then(function (data) {
            // Handle the server's response, if needed
            errorDiv.innerHTML = `server response : ${data.message}}`;
            errorDiv.className = "p-3 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3";
        })
        .catch(function (error) {
            errorDiv.innerHTML = `Error: ${imageerror}}`;
            errorDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
        });
}
function getAllImages() {
    const imageGallerydiv = document.getElementById("imageGallery");
    imageGallerydiv.innerHTML = "";
    // Fetch the list of images from your Flask server
    fetch(url+'/getAllImages', {
        method: 'GET',
    })
        .then(function (response) {
            if (!response.ok) {
                imageGallerydiv.innerHTML = "<p 'p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3'>Request Error: " + response.message + " </p>";

            }
            // Parse the JSON response
            return response.json();
        })
        .then(function (data) {
            if (data.images && data.images.length > 0) {
                data.images.forEach(function (image) {
                    var imgElement = document.createElement('img');
		    
                    imgElement.src = uploads_folder + image;
		    console.log(imgElement.src)	
                    imgElement.alt = image;
                    imgElement.classList.add('galleryImage');
                    imgElement.className = "m-2";
                    imgElement.height = "150";
                    imgElement.width = "150";

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
                const button1 = createButton();
                const button2 = document.createElement('button');
                button2.textContent = 'Delete selected image';
                button2.className = "btn btn-danger"
                button2.addEventListener('click', function () {
                    sendRequestToDelete();
                });
                const errorDiv = document.createElement('errorDiv');
                errorDiv.id = "errorDiv";
                imageGallerydiv.appendChild(button1);
                imageGallerydiv.appendChild(button2);
                imageGallerydiv.appendChild(errorDiv);
                document.getElementById("gallerycontainer").className += " bg-success p-3 my-3";
            } else {
                imageGallerydiv.innerHTML = "<p 'p-3 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3'>No images available.</p>";
            }
        })
        .catch(function (error) {
            imageGallerydiv.innerHTML = "<p 'p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3'>Request Error: " + error + " </p>";
        });


}
function stopImageSwitching() {
    const stopimagediv = document.getElementById("stopimagediv")
    fetch(url+'/stopImageSwitching', {
        method: 'POST',
    })
        .then(function (response) {
            if (!response.ok) {
                stopimagediv.innerHTML = `Request Error: ${response.message}`;
                stopimagediv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
            }
            return response.json();
        })
        .then(function (data) {
            // Handle the server's response, if needed
            stopimagediv.innerHTML = `server response : ${data.message}}`;
            stopimagediv.className = "p-3 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3";
        })
        .catch(function (error) {
            stopimagediv.innerHTML = `Error: ${error}}`;
            stopimagediv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
        });
}
function sendRequestToDelete() {
    const errorDiv = document.getElementById("errorDiv");
    // Send a request to the server with the selected image
    fetch(url+'/deleteImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SelectedImages }),
    })
        .then(function (response) {
            if (!response.ok) {
                errorDiv.innerHTML = `Request Error: ${response.message}`;
                errorDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
            }
            return response.json();
        })
        .then(function (data) {
            // Handle the server's response, if needed
            errorDiv.innerHTML = `server response : ${data.message}}`;
            errorDiv.className = "p-3 text-success-emphasis bg-success-subtle border border-success-subtle rounded-3";
        })
        .catch(function (error) {
            errorDiv.innerHTML = `Error: ${error}}`;
            errorDiv.className = "p-3 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3";
        });

}

