const routes = [
  { path: 'home',  component: homePage },
  { path: 'about',  component: aboutPage },
  { path: 'contacts',  component: contactsPage },
  { path: 'posts',  component: postsPage }
];

const menuItems = routes.map(route => ({
  path: route.path,
  label: route.path.charAt(0).toUpperCase() + route.path.slice(1), 
}));

const menu = document.querySelector('.header__menu');

menu.innerHTML = `
    <ul class="menu">
      ${menuItems.map(item => `<li><a href="#${item.path}">${item.label}</a></li>`).join('')}
    </ul>
  </div>
`;

checkRoute();

addEventListener('hashchange', () => {
  checkRoute();
});

document.querySelector('.menu a[href="#posts"]').addEventListener('click', (event) => {
  event.preventDefault();
  window.location.hash = 'posts';
});

function checkRoute() {
  const hash = getHash();
  let route;  
  
  if (hash === 'posts') {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(posts => render(postsPage(posts)))
      .then(() => {
       
        const postLinks = document.querySelectorAll('.post-link');
        postLinks.forEach(link => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            const postId = link.getAttribute('data-post-id');
            openPostPopup(postId);
          });
        });
      })
      .catch(error => console.error('Error fetching posts:', error));
    updateActiveClass(hash);
    return;
  } else {
    route = routes.find(r => r.path === hash);
  }

  if (!route) {
    route = { path: '**', component: notFoundPage };
  }

  render(route.component());
  updateActiveClass(hash);
}

function homePage() {
  return `
  <h2 class="outlet__header">Home page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img1.avif" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>`;
}

function aboutPage() {
  return `
  <h2 class="outlet__header">About page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img2.jpg" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>
  `;
}

function contactsPage() {
  return `
  <h2 class="outlet__header">Contacts page</h2>
  <div class="outlet__content">
    <img class="outlet__img" src="img/img3.jpg" alt="">
    <p class="outlet__text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
      Ut rem voluptatem sapiente ex cum excepturi quo? Rem eius, nisi a tempora 
      temporibus facere totam quia, velit cupiditate facilis eveniet nulla?
    </p>
  </div>
  `;
}

function postsPage(posts) {
  return `
    <h2 class="outlet__header">Posts page</h2>
    <div class="outlet__content">
      <ul class="post-list">
        ${posts.map(post => `<li><a href="#" class="post-link" data-post-id="${post.id}">${post.title}</a></li>`).join('')}
      </ul>
    </div>
  `;
}

function notFoundPage() {
  return (
    `
      <h2>404!!! Page not found</h2>
      <a href="#">Home page</a>
    `
  );
}

function render(component) {
  const outlet = document.querySelector('.outlet');
  outlet.innerHTML = component;
}

function getHash() {
  const hash = window.location.hash.slice(1);
  return hash;
}

function updateActiveClass(hash) {
  const menuItems = document.querySelectorAll('.menu a');
  menuItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href').slice(1) === hash) {
      item.classList.add('active');
    }
  });
}

function openPostPopup(postId) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      const popupContent = `
        <div class="overlay">
          <div class="popup">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button class="btn__close" onclick="closePostPopup()">Close</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', popupContent);
    })
    .catch(error => console.error('Error fetching post details:', error));
}

function closePostPopup() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}