const slider = document.querySelector(".users_cards_wrapper");
const slides = document.querySelectorAll(".user_card");

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationId,
  currentIndex = 0;

let slidesToShow = 3;

function updateSlidesToShow() {
  if (window.innerWidth <= 768) {
    slidesToShow = 1;
  } else if (window.innerWidth <= 1024) {
    slidesToShow = 2;
  } else {
    slidesToShow = 3;
  }

  slideWidth = slider.offsetWidth / slidesToShow;

  setPositionByIndex();
}

updateSlidesToShow();

window.addEventListener("resize", updateSlidesToShow);

const cloneFirst = [];
const cloneLast = [];

for (let i = 0; i < slidesToShow; i++) {
  cloneFirst.push(slides[i].cloneNode(true));
  cloneLast.push(slides[slides.length - 1 - i].cloneNode(true));
}

cloneFirst.forEach((slide) => slider.appendChild(slide));
cloneLast.reverse().forEach((slide) => slider.prepend(slide));

slider.style.transform = `translateX(-${slidesToShow * slideWidth}px)`;

slider.addEventListener("mousedown", startDrag);
slider.addEventListener("mouseup", endDrag);
slider.addEventListener("mouseleave", endDrag);
slider.addEventListener("mousemove", moveDrag);

slider.addEventListener("touchstart", startDrag);
slider.addEventListener("touchend", endDrag);
slider.addEventListener("touchmove", moveDrag);

function startDrag(event) {
  isDragging = true;
  startPos = getPositionX(event);
  animationId = requestAnimationFrame(animation);
  slider.style.cursor = "grabbing";
}

function endDrag() {
  isDragging = false;
  cancelAnimationFrame(animationId);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -slideWidth / 2) currentIndex++;
  if (movedBy > slideWidth / 2) currentIndex--;

  setPositionByIndex();
  slider.style.cursor = "grab";
}

function moveDrag(event) {
  if (!isDragging) return;

  const currentPosition = getPositionX(event);
  currentTranslate = prevTranslate + currentPosition - startPos;
}

function animation() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = -(currentIndex + slidesToShow) * slideWidth;
  prevTranslate = currentTranslate;

  slider.style.transition = "transform 0.5s ease-in-out";
  slider.style.transform = `translateX(${currentTranslate}px)`;

  slider.addEventListener(
    "transitionend",
    () => {
      if (currentIndex >= slides.length) {
        slider.style.transition = "none";
        currentIndex = 0;
        setPositionByIndex();
      }
      if (currentIndex < 0) {
        slider.style.transition = "none";
        currentIndex = slides.length - 1;
        setPositionByIndex();
      }
    },
    { once: true }
  );
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

setInterval(() => {
  if (!isDragging) {
    currentIndex++;
    setPositionByIndex();
  }
}, 2000);
