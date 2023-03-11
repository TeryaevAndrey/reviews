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
    if (dateValue.value.length === 0) {
      let date = new Date();

      const hours = date.getHours();
      const minutes = date.getMinutes();

      const time = {
        hours: hours.toString().length < 2 ? "0" + hours : hours,
        minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      };

      const resData = {
        name: nameValue.value,
        rating: ratingValue.value,
        date,
        comment: commentValue.value,
      };

      posts.push(resData);

      localStorage.setItem("posts", JSON.stringify(posts));

      setHTML(
        resData.name,
        resData.rating,
        `Сегодня, ${time.hours}:${time.minutes}`,
        resData.comment
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
        name: nameValue.value,
        rating: ratingValue.value,
        date: postDate,
        comment: commentValue.value,
      };

      posts.push(resData);

      localStorage.setItem("posts", JSON.stringify(posts));

      if (postDate.toDateString() === yesterday.toDateString()) {
        setHTML(
          resData.name,
          resData.rating,
          `Вчера, ${time.hours}:${time.minutes}`,
          resData.comment
        );
      }
    }
  }
};

const setHTML = (name, rating, date, comment) => {
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
  </div>
    `;

  return list.insertAdjacentHTML("beforeend", html);
};

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
      const postDate = new Date(post.date);

      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();

      const time = {
        hours: hours.toString().length < 2 ? "0" + hours : hours,
        minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      };

      resDate = `Вчера, ${time.hours}:${time.minutes}`;
    } else {
    }

    return setHTML(post.name, post.rating, resDate, post.comment);
  });
}

formSubmitBtn.addEventListener("click", addComment);
