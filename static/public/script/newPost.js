/********* MAKE NEW POST LOGIC HERE ********/


// new post clicked 
function makeNewPost() {
    console.log('clicked')
}

// preview current uploaded image
function previewUploadedImage() {
    const file = input.files[0];
    const reader = new FileReader();
  
    reader.addEventListener('load', function() {
      preview.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
}

const newPostButton = document.querySelector('#make-new-post-btn');
newPostButton.addEventListener('click', makeNewPost);

const input = document.querySelector('#uploadImage');
const preview = document.querySelector('#uploadedImage');
input.addEventListener('change', previewUploadedImage) 

