/********* MAKE NEW POST LOGIC HERE ********/
const newPostButton = document.querySelector('#make-new-post-btn');
const exitNewPost = document.querySelector('#exitNewPost');
const submitButton = document.querySelector('#submitForm');


const input = document.querySelector('#uploadImage');
const preview = document.querySelector('#uploadedImage');


// new post clicked 
function toggleNewPostForm() {
    const newPostForm = document.querySelector('#newPostForm');

    console.log('askneflsknf')
    if (newPostForm.style.visibility === 'visible') {
        newPostForm.style.visibility = 'hidden'
        console.log('hide')
    } else {
            newPostForm.style.visibility = 'visible'
            console.log('show')
        
    }

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


newPostButton.addEventListener('click', toggleNewPostForm);
exitNewPost.addEventListener('click', toggleNewPostForm)
submitButton.addEventListener('click', toggleNewPostForm)

input.addEventListener('change', previewUploadedImage) 
