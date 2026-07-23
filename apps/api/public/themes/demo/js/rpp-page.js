const returnParameter = [];
const hiddenInputForm = document.querySelector('.block-rpp-page .form-hidden');

if (hiddenInputForm) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const dataParameter = [];
  let index = 0;
  let firstBtnURL = '';
  let secondBtnURL = '';

  const firstBtn = document.getElementById('first-button');
  const secondBtn = document.getElementById('second-button');

  const obwFirstDefaultURL = 'mysanafnb155:7005/cms/externalloginrtpredirect.action?/RPP/MY/Redirect/RTP';
  const obwSecondDefaultURL = 'gpuweb.affinbank.com.my/A1addinbiz/RPP/MY/Redirect/RTP';

  params.forEach((value, key) => {
    const hiddenInputData = document.createElement('input');
    hiddenInputData.setAttribute('type', 'hidden');
    hiddenInputData.setAttribute('id', `dataparameter${index}`);
    hiddenInputData.setAttribute('name', key);
    hiddenInputData.setAttribute('value', value);
    hiddenInputForm.appendChild(hiddenInputData);
    dataParameter[index] = value;
    returnParameter[index] = `${key}=${value}`;

    index++;
  });

  const returnParams = returnParameter.join('&');

  // default button url for obw
  firstBtnURL = `${location.protocol}//${obwFirstDefaultURL}?${returnParams}`;
  secondBtnURL = `${location.protocol}//${obwSecondDefaultURL}?${returnParams}`;

  firstBtn.href = firstBtn.href.slice(-1) === '#' ? firstBtnURL : `${firstBtn.href}?${returnParams}`;
  secondBtn.href = secondBtn.href.slice(-1) === '#' ? secondBtnURL : `${secondBtn.href}?${returnParams}`;

  const replaceURL = `${location.protocol}//${location.host}${location.pathname}`;
  window.history.replaceState({}, document.title, replaceURL);
}
