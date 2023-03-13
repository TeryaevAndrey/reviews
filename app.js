const nameValue = document.getElementById("name");
const ratingValue = document.getElementById("rating");
const dateValue = document.getElementById("date");
const commentValue = document.getElementById("comment");
const formSubmitBtn = document.getElementById("formSubmit");
const list = document.querySelector(".list");

const errName = document.querySelector(".error.name");
const errRating = document.querySelector(".error.rating");
const errComment = document.querySelector(".error.comment");

let postsStorage = JSON.parse(localStorage.getItem("posts")) || [];

let posts = postsStorage;

nameValue.addEventListener("input", (e) => {
  if (e.target.value.length > 0) {
    errName.style.display = "none";
  }
});

ratingValue.addEventListener("input", (e) => {
  if (e.target.value.length > 0) {
    errRating.style.display = "none";
  }
});

commentValue.addEventListener("input", (e) => {
  if (e.target.value.length > 0) {
    errComment.style.display = "none";
  }
});

const addComment = (e) => {
  e.preventDefault();

  let isError = false;

  if (nameValue.value.length === 0) {
    errName.style.display = "block";
    errName.textContent = "Напишите имя";

    isError = true;
  }

  if (ratingValue.value === "") {
    errRating.style.display = "block";
    errRating.textContent = "Оцените продукт";

    isError = true;
  } else if (
    parseInt(ratingValue.value) < 0 ||
    parseInt(ratingValue.value) > 5
  ) {
    errRating.style.display = "block";
    errRating.textContent = "Введите число в диапозоне от 1 до 5";

    isError = true;
  }

  if (commentValue.value.length === 0) {
    errComment.style.display = "block";
    errComment.textContent = "Вы ничего не написали";

    isError = true;
  }

  if (!isError) {
    var id =
      "id" +
      new Date().toLocaleTimeString() +
      Math.random().toString(16).slice(2);

    if (dateValue.value.length === 0) {
      let date = new Date();

      const hours = date.getHours();
      const minutes = date.getMinutes();

      const time = {
        hours: hours.toString().length < 2 ? "0" + hours : hours,
        minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      };

      const resData = {
        id,
        name: nameValue.value,
        rating: ratingValue.value,
        date,
        comment: commentValue.value,
        isLike: false,
      };

      posts.push(resData);

      localStorage.setItem("posts", JSON.stringify(posts));

      setHTML(
        resData.id,
        resData.name,
        resData.rating,
        `Сегодня, ${time.hours}:${time.minutes}`,
        resData.comment,
        resData.isLike
      );
    } else {
      let today = new Date();
      let postDate = new Date(dateValue.value);
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();

      const time = {
        hours: hours.toString().length < 2 ? "0" + hours : hours,
        minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      };

      const resData = {
        id,
        name: nameValue.value,
        rating: ratingValue.value,
        date: postDate,
        comment: commentValue.value,
        isLike: false,
      };

      posts.push(resData);

      localStorage.setItem("posts", JSON.stringify(posts));

      if (postDate.toDateString() === yesterday.toDateString()) {
        setHTML(
          resData.id,
          resData.name,
          resData.rating,
          `Вчера, ${time.hours}:${time.minutes}`,
          resData.comment,
          resData.isLike
        );
      } else if (postDate.toDateString() === today.toDateString()) {
        setHTML(
          resData.id,
          resData.name,
          resData.rating,
          `Сегодня, ${(time, hours)}:${time.minutes}`,
          resData.comment,
          resData.isLike
        );
      } else {
        setHTML(
          resData.id,
          resData.name,
          resData.rating,
          `${postDate.toLocaleDateString()}-${time.hours}:${time.minutes}`,
          resData.comment,
          resData.isLike
        );
      }
    }
  }
};

const deletePost = (id) => {
  list.innerHTML = "";

  let filteredPosts = posts.filter((post) => {
    return post.id !== id;
  });

  localStorage.setItem("posts", JSON.stringify(filteredPosts));

  showPosts();
};

const likePost = (id) => {
  let updatePosts = posts.map((post) => {
    if (post.id === id) {
      return { ...post, isLike: !post.isLike };
    }
  });

  localStorage.setItem("posts", JSON.stringify(updatePosts));

  list.innerHTML = "";

  showPosts();
};

const setHTML = (id, name, rating, date, comment, isLike) => {
  let html = `
    <div class="item">
    <div>
      <h1 class="item__name">${name}</h1>
      <div class="item__rating">
        <p>Оценка:</p>
        <p class="item__rating-value">${rating}</p>
      </div>
      <p class="item__text">
        ${comment}
      </p>
    </div>
    <div>${date}</div>
    <div class="item__btns">
    <div class="item__btn" onclick="deletePost('${id}')">
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
      
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
      
      <g id="SVGRepo_iconCarrier"> <path d="M4 7H20" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
      
      </svg>
    </div>

    <div class="item__btn" onclick="likePost('${id}')">
      <svg class="like" width="30px" height="30px" viewBox="0 0 24 24" fill="${
        isLike ? "red" : "none"
      }" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20C12 20 21 16 21 9.71405C21 6 18.9648 4 16.4543 4C15.2487 4 14.0925 4.49666 13.24 5.38071L12.7198 5.92016C12.3266 6.32798 11.6734 6.32798 11.2802 5.92016L10.76 5.38071C9.90749 4.49666 8.75128 4 7.54569 4C5 4 3 6 3 9.71405C3 16 12 20 12 20Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    </div>
  </div>
    `;

  return list.insertAdjacentHTML("beforeend", html);
};

const showPosts = () => {
  postsStorage = JSON.parse(localStorage.getItem("posts")) || [];
  posts = postsStorage;

  if (postsStorage.length > 0) {
    postsStorage.map((post) => {
      let today = new Date();
      let postDate = new Date(post.date);
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      let resDate;

      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();

      const time = {
        hours: hours.toString().length < 2 ? "0" + hours : hours,
        minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      };

      if (today.toDateString() === postDate.toDateString()) {
        resDate = `Сегодня, ${time.hours}:${time.minutes}`;
      } else if (postDate.toDateString() === yesterday.toDateString()) {
        resDate = `Вчера, ${time.hours}:${time.minutes}`;
      } else {
        resDate = `${postDate.toLocaleDateString()}-${time.hours}:${
          time.minutes
        }`;
      }

      return setHTML(
        post.id,
        post.name,
        post.rating,
        resDate,
        post.comment,
        post.isLike
      );
    });
  }
};

showPosts();

formSubmitBtn.addEventListener("click", addComment);
