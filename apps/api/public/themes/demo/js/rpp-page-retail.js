const retailReturnParameter = [];
const retailHiddenInputForm = document.querySelector('.block-rpp-page-retail .form-hidden');

if (retailHiddenInputForm) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const dataParameter = [];
  let index = 0;
  let firstBtnURL = '';
  let secondBtnURL = '';
  
  const firstBtn = document.getElementById('first-button');
  const secondBtn = document.getElementById('second-button');

  const orbFirstDefaultURL = 'ribtest.affinalways.com/RPP/MY/Redirect/RTP';
  const orbSecondDefaultURL = 'gpuweb.affinbank.com.my/RPP/MY/Redirect/RTP';

  params.forEach((value, key) => {
    const hiddenInputData = document.createElement('input');
    hiddenInputData.setAttribute('type', 'hidden');
    hiddenInputData.setAttribute('id', `dataparameter${index}`);
    hiddenInputData.setAttribute('name', key);
    hiddenInputData.setAttribute('value', value);
    retailHiddenInputForm.appendChild(hiddenInputData);
    dataParameter[index] = value;
    retailReturnParameter[index] = `${key}=${value}`;

    index++;
  });

  const returnParams = retailReturnParameter.join('&');

  // default button url for orb
  firstBtnURL = `${location.protocol}//${orbFirstDefaultURL}?${returnParams}`;
  secondBtnURL = `${location.protocol}//${orbSecondDefaultURL}?${returnParams}`;

  firstBtn.href = firstBtn.href.slice(-1) === '#' ? firstBtnURL : `${firstBtn.href}?${returnParams}`;
  secondBtn.href = secondBtn.href.slice(-1) === '#' ? secondBtnURL : `${secondBtn.href}?${returnParams}`;

  const replaceURL = `${location.protocol}//${location.host}${location.pathname}`;
  window.history.replaceState({}, document.title, replaceURL);
}
