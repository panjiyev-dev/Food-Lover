window.addEventListener('DOMContentLoaded', () => {

    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContents = document.querySelectorAll('.tab_content'),
        tabsParents = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContents.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show')
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContents[i].classList.add('show', 'fade');
        tabsContents[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParents.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    // LOADER
    const loaderWrapper = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loaderWrapper.style.opacity = '0.3';
    }, 1800)
    setTimeout(() => {
        loaderWrapper.style.display = 'none';
        loaderWrapper.style.opacity = '0';
    }, 2000)

    // Time 
    const deadline = '2026-01-01'

    function formatNumber(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`
        } else {
            return num
        }
    }

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const time = Date.parse(endtime) - Date.parse(new Date())

        if (time <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(time / (1000 * 60 * 60 * 24))
            hours = Math.floor((time / (1000 * 60 * 60)) % 24)
            minutes = Math.floor((time / 1000 / 60) % 60)
            seconds = Math.floor((time / 1000) % 60)
        }

        return {
            totalTime: time,
            days,
            hours,
            minutes,
            seconds
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock()
        function updateClock() {
            const time = getTimeRemaining(endtime);

            days.innerHTML = formatNumber(time.days);
            hours.innerHTML = formatNumber(time.hours);
            minutes.innerHTML = formatNumber(time.minutes);
            seconds.innerHTML = formatNumber(time.seconds);

            if (time.totalTime <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline)


    //Modal
    const modalOpenBtn = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-modal-close]'),
        modelContent = document.querySelector('.modal__content');

    const openModal = () => {
        modelContent.classList.add('modal_fade')
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalOpenBtn.forEach(btn => {
        btn.addEventListener('click', openModal)
    })

    modalCloseBtn.addEventListener('click', () => closeModal)

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })


    // Form 
    const form = document.querySelector('form'),
        telegramTokenBot = "7250486573:AAEPMlLi2wKhqXpY9pkbsyDf5u_X-WQknm4",
        chatId = "7122472578",
        massage = {
            success: "Thank you! We will contact you soon",
            failure: "Something went wrong"
        }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const statusMessage = document.createElement('div'),
            loadingText = document.createElement('p'),
            loaderSpan = document.createElement('span');

        loaderSpan.classList.add('loader1')
        loadingText.textContent = "Sending "
        loadingText.classList.add('loadingText')
        loadingText.appendChild(loaderSpan);
        statusMessage.appendChild(loadingText);


        form.append(statusMessage);

        const formData = new FormData(form);

        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        })

        fetch(`https://api.telegram.org/bot${telegramTokenBot}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `
                    Name: ${object.name} \nPhone: ${object.phone}
                `
            })
        }).then(() => {
            statusMessage.textContent = massage.success;
            form.reset()
        }).catch(() => {
            statusMessage.textContent = massage.failure
        }).finally(() => {
            setTimeout(() => {
                statusMessage.remove()
            }, 3000)
        })
    })


    // Slider 
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesInner = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesInner.style.width = 100 * slides.length + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = 'all 0.5s ease';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(item => {
        item.style.width = width;
    })

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesInner.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    })
    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        slidesInner.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    })

})