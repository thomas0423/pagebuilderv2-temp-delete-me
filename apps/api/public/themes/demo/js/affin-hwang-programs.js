if (document.querySelector('.irlBlockPrograms')) {
  function ready(f) {
    /in/.test(document.readyState) ? setTimeout('ready(' + f + ')', 9) : f()
  }

  ready(function () {
    if (document.querySelector('.irlBlockPrograms')) {
      fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
          getAffinHwangProgramsData(lang);
        });
    }
  });

  function getAffinHwangProgramsData(lang) {
    fetch('/json/affin-hwang-programs/index.json')
      .then(response => response.json())
      .then(programTypes => {
        const irlProgramTypeButtonsSection = document.querySelector('.irlBlockPrograms .irlProgramTypeButtonsSection');
        const irlProgramBlockTitleElement = document.querySelector('.irlBlockPrograms .irlProgramBlockTitle');
        const irlViewMoreButtonElement = document.querySelector('.irlBlockPrograms .irlViewMoreButton');
        switch (lang) {
          case 'zh':
            irlProgramBlockTitleElement.innerHTML = '了解我们的最新动态';
            irlViewMoreButtonElement.innerHTML = '查看详情';
            break;
          case 'ms':
            irlProgramBlockTitleElement.innerHTML = 'Dapatkan Peristiwa Terkini Kami';
            irlViewMoreButtonElement.innerHTML = 'Semak butiran';
            break;
          default:
            irlProgramBlockTitleElement.innerHTML = 'Get Our Latest Happenings';
            irlViewMoreButtonElement.innerHTML = 'Read more';
            break;
        }

        programTypes.forEach((programType, index) => {
          let programTypeName;
          switch (lang) {
            case 'zh':
              programTypeName = programType.name_in_chinese ?? programType.name_in_english;
              break;
            case 'ms':
              programTypeName = programType.name_in_malay ?? programType.name_in_english;
              break;
            default:
              programTypeName = programType.name_in_english;
              break;
          }

          const programTypeButton = document.createElement('button');
          programTypeButton.type = 'button';
          programTypeButton.value = `irlProgramButton-${programType.id}`;
          programTypeButton.className = `btn btn-rounded waves-effect waves-light mr-3 custom-btn-2 irlTabButton sliderButton custom-btn ${index === 0 ? 'active' : ''}`;
          programTypeButton.innerHTML = programTypeName;

          irlProgramTypeButtonsSection.appendChild(programTypeButton);

          const irlProgramsSection = document.querySelector('.irlBlockPrograms .irlProgramsSection');
          const programSection = document.createElement('div');
          programSection.className = `swiperContainer ${index !== 0 ? 'd-none' : ''} irlProgramContainer-${programType.id}`;
          programSection.innerHTML = `
              <div class="swiper tranding-slider">
                <div class="swiper-wrapper irlProgramCardSection-${programType.id}"></div>
                <div class="tranding-slider-control">
                  <div class="swiper-button-prev slider-arrow">
                    <i class="fa fa-arrow-left text-white"></i>
                  </div>
                  <div class="swiper-button-next slider-arrow">
                    <i class="fa fa-arrow-right text-white"></i>
                  </div>
                </div>
              </div>
          `;

          irlProgramsSection.appendChild(programSection);

          const irlProgramCardSection = document.querySelector(`.irlBlockPrograms .irlProgramCardSection-${programType.id}`);

          programType.program_categories.forEach(programCategory => {
            programCategory.programs.forEach((program) => {
              let programCoverImage, programHeadline, langPrefix, validTillText;
              switch (lang) {
                case 'zh':
                  programCoverImage = program.name_in_chinese ?? program.cover_image_in_english;
                  programHeadline = program.headline_in_chinese ?? program.headline_in_english;
                  langPrefix = '/zh';
                  validTillText = 'Valid till';
                  break;
                case 'ms':
                  programCoverImage = program.name_in_malay ?? program.cover_image_in_english;
                  programHeadline = program.headline_in_malay ?? program.headline_in_english;
                  langPrefix = '/bm';
                  validTillText = 'Sah sehingga';
                  break;
                default:
                  programCoverImage = program.cover_image_in_english;
                  programHeadline = program.headline_in_english;
                  langPrefix = '/en';
                  validTillText = 'Valid till';
                  break;
              }

              let cardUrl = `/programs/details?v=${btoa(`programId=${program.id}`)}`;
              cardUrl = cardUrl.replaceAll('%20', '-');
              const formattedDate = formatDate(program.date, lang);

              const programCard = document.createElement('div');
              programCard.className = `swiper-slide tranding-slide`;
              programCard.innerHTML = `
                <div class="tranding-slide-img">
                  <img src="${programCoverImage}" alt="Tranding">
                </div>
                <div class="tranding-slide-content">
                  <a href="${langPrefix}${cardUrl}" target="_blank">
                    <h1 class="food-price">${programHeadline}</h1>
                    <p class="card-bottom-date">${programType.name_in_english === 'Campaigns' ? `${validTillText} ` : ''}${formattedDate}</p>
                  </a>
                </div>
              `;

              irlProgramCardSection.appendChild(programCard);
            });
          });
        });

        initProgramTypeButtons(programTypes);
        initSwiper(programTypes);
      });
  }

  function initSwiper(programTypes) {
    programTypes.forEach(programType => {
      let totalItems = 0;
      programType.program_categories.forEach(category => {
        category.programs.forEach(program => {
          totalItems += 1;
        });
      });
      const TrandingSlider = new Swiper(`.irlBlockPrograms .irlProgramContainer-${programType.id} .tranding-slider`, {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: totalItems < 3 ? false : true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
    });
  }

  function initProgramTypeButtons(programTypes) {
    const irlTabButtons = document.querySelectorAll('.irlBlockPrograms .irlTabButton');
    const irlViewMoreButtonElement = document.querySelector('.irlBlockPrograms .irlViewMoreButton');

    if (irlTabButtons) {
      irlTabButtons.forEach(element => {
        element.addEventListener('click', function () {
          irlTabButtons.forEach(element => {
            element.classList.remove('active');
          });

          this.classList.add('active');

          programTypes.forEach(programType => {
            const programContainer = document.querySelector(`.irlBlockPrograms .irlProgramContainer-${programType.id}`);
            if (this.value === `irlProgramButton-${programType.id}`) {
              programContainer.classList.remove('d-none');
            } else {
              programContainer.classList.add('d-none');
            }
          });
        });
      });
    }

    if (irlViewMoreButtonElement) {
      irlViewMoreButtonElement.addEventListener('click', function () {
        const activeTab = document.querySelector('.irlBlockPrograms .irlTabButton.active');
        if (activeTab) {
          window.open(`/programs/listing?v=${btoa(`type=${activeTab.innerText.toLowerCase()}`)}`, '_blank');
        }
      });
    }
  }

  function formatDate(inputDate, lang) {
    const monthsInEnglish = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthsInMalay = [
      "Jan", "Feb", "Mac", "Apr", "Mei", "Jun",
      "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"
    ];

    const months = lang === 'en' ? monthsInEnglish : monthsInMalay;

    const date = new Date(inputDate);
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }
}
