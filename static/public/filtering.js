const categoryLinks = document.querySelectorAll('#sidebar a[data-category]'); // get all category links
const postBoxes = document.querySelectorAll('.post-box[data-category]'); // get all post boxes with data-category attribute

/*Filtering around the categories */
categoryLinks.forEach(link => {
  link.addEventListener('click', () => {
    const selectedCategory = link.getAttribute('data-category'); // get selected category from clicked link

    postBoxes.forEach(postBox => {
      const postCategory = postBox.getAttribute('data-category');
      const postCategory2 = postBox.getAttribute('data-category2');
    
      if (selectedCategory === 'all' ||
          (postCategory === selectedCategory || postCategory2 === selectedCategory) ||
          (postCategory && postCategory.includes(selectedCategory) && postCategory2 && postCategory2.includes(selectedCategory))) {
        postBox.style.display = 'block';
      } else if (postCategory && postCategory2 && postCategory2.includes(selectedCategory)) {
        postBox.style.display = 'block'; // show post box if it has category2 containing the selected category
      } else {
        postBox.style.display = 'none';
      }
    });
  });
});

/* Sorting the posts by date-Asc. order "dateA-dateB" */
function sortPosts(field, category = null, category2 = null) {
  const posts = Array.from(document.querySelectorAll('.post-box'));
  if (category || category2) {
    posts.filter(post => post.getAttribute('data-category') === category || post.getAttribute('data-category2') === category2);
  }
  posts.sort((a, b) => {
    const dateA = new Date(a.querySelector('.post-text .post-location + div').textContent);
    const dateB = new Date(b.querySelector('.post-text .post-location + div').textContent);
    return dateA - dateB;
  });
  document.querySelector('#post-container').innerHTML = '';
  posts.forEach((post) => document.querySelector('#post-container').appendChild(post));
}
document.querySelector('#sort-by-date-btn').addEventListener('click', () => sortPosts('date'));

/* Sorting Lost and Found items by Toggle */
const lostFoundToggle = document.querySelector('.toggle input');

lostFoundToggle.addEventListener('change', () => {
  const isLostSelected = lostFoundToggle.checked;

  postBoxes.forEach(postBox => {
    const postType = postBox.getAttribute('data-type');

    if ((isLostSelected && postType === 'lost') || (!isLostSelected && postType === 'found')) {
      postBox.style.display = 'block'; // show post box if it matches the selected option
    } else {
      postBox.style.display = 'none'; // hide post box if it doesn't match the selected option
    }
  });
});

