function setHeroDropDownMethods(parentClassName, data) {
    let heroDropDown = parentClassName.getElementsByClassName('hero-dropdown');
    let discoverButton = parentClassName.getElementsByClassName('hero-discover-btn')[0];
    let combinationUrl = data[0].combination;

    // console.log(combinationUrl);

    function setDiscoverButtonUrl() {
        let selectedOption = [];

        for (let i = 0; i < heroDropDown.length; i++) {
            selectedOption[i] = heroDropDown[i].children[0].children[0].children[0].dataset.optionTitle;
            console.log(selectedOption[i]);
        }

        if (!combinationUrl) { return; }

        if (combinationUrl.length > 0) {
            for (let j = 0; j < combinationUrl.length; j++) {
                if (combinationUrl[j].list_1_item == selectedOption[0]) {
                    if (selectedOption.length == 1) {
                        discoverButton.href = combinationUrl[j].url;
                        break;
                    } else if (selectedOption.length == 2) {
                        if (combinationUrl[j].list_2_item == selectedOption[1]) {
                            discoverButton.href = combinationUrl[j].url;
                            break;
                        } else {
                            discoverButton.href = "#";
                            console.log("This combination URL is not made yet");
                        }
                    }
                } else {
                    discoverButton.href = "#";
                    console.log("This combination URL is not made yet");
                }
            }
        }
    }

    function setDropDownOnClick() {
        for (let i = 0; i < heroDropDown.length; i++) {
            let heroDropDownSelectField = heroDropDown[i].children[0].children[0];
            let heroDropDownSelectList = heroDropDown[i].children[1];

            setSelectFieldOnClick(heroDropDownSelectField, heroDropDownSelectList);
            setSelectListOptionOnClick(heroDropDownSelectField, heroDropDownSelectList);
        }
    }

    function setSelectFieldOnClick(selectField, selectList) {
        selectField.onclick = function() {
            // Make dropdown arrow rotate
            selectField.children[1].classList.toggle("rotate");
            // Open the selected dropdown list
            selectList.classList.toggle("hide");
        }
    }

    function setSelectListOptionOnClick(selectField, selectList) {
        for (let i = 0; i < selectList.children[1].children.length; i++) {
            if (selectList.children[1].children[i].className != "hero-select-option-hr") {
                selectList.children[1].children[i].children[0].onclick = function () {
                    selectField.children[0].innerText = selectList.children[1].children[i].children[0].children[1].innerText;
                    selectField.children[0].dataset.optionTitle = selectList.children[1].children[i].children[0].children[1].dataset.optionTitle;
                    selectField.children[1].classList.toggle("rotate");
                    selectList.classList.toggle("hide");
                    setDiscoverButtonUrl();
                }
            }
        }
    }

    setDropDownOnClick();
    setDiscoverButtonUrl();
}

