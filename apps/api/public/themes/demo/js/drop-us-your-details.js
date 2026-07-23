function safeId(value) {
    var str = (value == null ? '' : String(value));
    return /^[A-Za-z0-9_-]+$/.test(str) ? str : '';
}

function safeImgSrc(value) {
    var str = (value == null ? '' : String(value)).trim();
    if (!str) {
        return '/img/affin-always-card-boxes/delete.png';
    }
    if (/[\s"'<>`]/.test(str) || /javascript:/i.test(str) || /data:/i.test(str)) {
        return '/img/affin-always-card-boxes/delete.png';
    }
    if (str.charAt(0) === '/') {
        return str;
    }
    try {
        var parsed = new URL(str, window.location.origin);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
            return parsed.href;
        }
    } catch (e) {
        // fall through to placeholder
    }
    return '/img/affin-always-card-boxes/delete.png';
}

function safeSalesforceValue(value) {
    var str = (value == null ? '' : String(value));
    return str.replace(/[<>"'`]/g, '').slice(0, 200);
}

function fncDropUsDetails() {
    let listingCards = document.getElementsByClassName('listing-selected-cross-sell')[0];

    var currentUrl = new URL(location.href);
    var cardId = currentUrl.searchParams.getAll('productId');
    var cardNames = currentUrl.searchParams.getAll('productname');
    var cardImg = currentUrl.searchParams.getAll('productImg');
    var cardSalesforce = currentUrl.searchParams.getAll('productSalesforce');
    let cardDetails = [];

    for (let i = 0; i < cardId.length; i++) {
        let tempCard = {
            "cardId": safeId(cardId[i]),
            "cardName": cardNames[i] == null ? '' : String(cardNames[i]),
            "cardImg": safeImgSrc(cardImg[i]),
            "cardSalesforce": safeSalesforceValue(cardSalesforce[i]),
        }

        cardDetails.push(tempCard);
        createApplyingCards(tempCard);
    }

    function createApplyingCards(tempCard) {
        let cardColumnWrapper = document.createElement('DIV');
        cardColumnWrapper.className = "col-9 col-sm-6 col-lg-3 mx-auto mx-sm-0 pt-5";

        let cardWrapper = document.createElement('DIV');
        cardWrapper.className = "cross-sell-card align-items-center";
        if (tempCard.cardId) {
            cardWrapper.setAttribute("id", tempCard.cardId);
        }

        cardColumnWrapper.appendChild(cardWrapper);

        let imgEl = document.createElement('img');
        imgEl.src = tempCard.cardImg;
        imgEl.className = 'cross-sell-card-img';
        imgEl.alt = 'card-img';

        let titleEl = document.createElement('p');
        titleEl.className = 'cross-sell-card-title';
        titleEl.textContent = tempCard.cardName;

        let removeBtn = document.createElement('img');
        removeBtn.src = '/img/affin-always-card-boxes/delete.png';
        removeBtn.className = 'cross-sell-card-remove-btn';
        removeBtn.alt = 'remove-btn';

        cardWrapper.appendChild(imgEl);
        cardWrapper.appendChild(titleEl);
        cardWrapper.appendChild(removeBtn);

        $(".cross-sell-card-remove-btn", cardWrapper).on("click", function(){  removeSelectedCrossSell(cardColumnWrapper); });
        listingCards.appendChild(cardColumnWrapper);
    }

    function removeSelectedCrossSell(crossSellCard) {
        crossSellCard.classList.toggle("display-none");

        let card = crossSellCard.getElementsByClassName("cross-sell-card")[0];
        let cardId = card.id;

        for (let i = 0; i < cardDetails.length; i++) {
            if (cardDetails[i].cardId === cardId) {
                cardDetails.splice(i, 1);
                break;
            }
        }
    }
}

// TODO: complete the submit form function when get the url
// function submitForm(e) {
//     // e.preventDefault();
//     const form = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         number: document.getElementById('number').value,
//         state: document.getElementById('state').value,
//         district: document.getElementById('district').value,
//     }
//
//     console.log(form);
// }
if (document.querySelector('.block-drop-us-your-details')) {
    fncDropUsDetails();

    $(document).ready(function () {
        const currentUrl = new URL(location.href);
        const cardSalesforce = currentUrl.searchParams.getAll('productSalesforce');
        let interest = '';

        for (let data of cardSalesforce) {
            interest += safeSalesforceValue(data) + ';'
        }

        $('#00N1s000001UBWX').val(interest);

        let text =
            [
                {
                    "state": "Federal Territory of Kuala Lumpur",
                    "district": ["Bandar Tun Razak", "Batu", "Bukit Bintang", "Cheras", "Kepong", "Lembah Pantai", "Segambut", "Seputeh", "Setiawangsa", "Titiwangsa", "Wangsa Maju"]
                },
                {
                    "state": "Federal Territory of Labuan",
                    "district": ["Labuan"]
                },
                {
                    "state": "Federal Territory of Putrajaya",
                    "district": ["Putrajaya"]
                },
                {
                    "state": "Johor",
                    "district": ["Ayer Baloi", "Ayer Hitam", "Ayer Tawar 2", "Bandar Penawar", "Bandar Tenggara", "Batu Anam", "Batu Pahat", "Bekok", "Benut", "Bukit Gambir", "Bukit Pasir", "Chaah", "Endau", "Gelang Patah", "Gerisek", "Gugusan Taib Andak", "Iskandar Puteri", "Jementah", "Johor Bahru", "Kahang", "Kluang", "Kota Tinggi", "Kukup", "Kulai", "Labis", "Layang-Layang", "Masai", "Mersing", "Muar", "Pagoh", "Paloh", "Panchor", "Parit Jawa", "Parit Raja", "Parit Sulong", "Pasir Gudang", "Pekan Nenas", "Pengerang", "Pontian", "Pulau Satu", "Rengam", "Rengit", "Segamat", "Semerah", "Senai", "Senggarang", "Seri Gading", "Seri Medan", "Simpang Rengam", "Sungai Mati", "Tangkak", "Ulu Tiram", "Yong Peng"]
                },
                {
                    "state": "Kedah",
                    "district": ["Alor Setar", "Ayer Hitam", "Baling", "Bandar Baharu", "Bedong", "Bukit Kayu Hitam", "Changloon", "Gurun", "Jeniang", "Jitra", "Karangan", "Kepala Batas", "Kodiang", "Kota Kuala Muda", "Kota Sarang Semut", "Kuala Kedah", "Kuala Ketil", "Kuala Muda", "Kuala Nerang", "Kuala Pegang", "Kubang Pasu", "Kulim", "Kupang", "Langgar", "Pulau Langkawi", "Lunas", "Merbok", "Padang Serai", "Padang Terap", "Pendang", "Pokok Sena", "Serdang", "Sik", "Simpang Empat", "Sungai Petani", "Universiti Utara Malaysia", "Yan"]
                },
                {
                    "state": "Kelantan",
                    "district": ["Bachok", "Gua Musang", "Jeli", "Kota Bharu", "Kuala Krai", "Machang", "Pasir Mas", "Pasir Puteh", "Tanah Merah", "Tumpat"]
                },
                {
                    "state": "Malacca",
                    "district": ["Alor Gajah", "Asahan", "Ayer Keroh", "Bemban", "Central Malacca", "Durian Tunggal", "Jasin", "Kem Trendak", "Kuala Sungai Baru", "Lubok China", "Masjid Tanah", "Melaka", "Merlimau", "Selandar", "Sungai Rambai", "Sungai Udang", "Tanjong Kling"]
                },
                {
                    "state": "Negeri Sembilan",
                    "district": ["Jelebu", "Jempol", "Kuala Pilah", "Kuala Klawang", "Labu", "Linggi", "Mantin", "Nilai", "Port Dickson", "Pusat Bandar Palong", "Rantau", "Rembau", "Rompin", "Seremban", "Si Rusa", "Simpang Durian", "Simpang Pertang", "Tampin", "Tanjong Ipoh"]
                },
                {
                    "state": "Perak",
                    "district": ["Ayer Tawar", "Bagan Datoh", "Bagan Serai", "Bandar Seri Iskandar", "Batu Gajah", "Batu Kurau", "Behrang Stesen", "Bidor", "Bota", "Bruas", "Changkat Jering", "Changkat Keruing", "Chemor", "Chenderiang", "Chenderong Balai", "Chikus", "Enggor", "Gerik", "Gopeng", "Hutan Melintang", "Intan", "Ipoh", "Jeram", "Kampar", "Kampung Gajah", "Kampung Kepayang", "Kamunting", "Kuala Kangsar", "Kuala Kurau", "Kuala Sepetang", "Lambor Kanan", "Langkap", "Lenggong", "Lumut", "Malim Nawar", "Manong", "Matang", "Padang Rengas", "Pangkor", "Pantai Remis", "Parit", "Parit Buntar", "Pengkalan Hulu", "Pusing", "Rantau Panjang", "Sauk", "Selama", "Selekoh", "Seri Manjung", "Simpang", "Simpang Ampat Semanggol", "Sitiawan", "Slim River", "Sungai Siput", "Sungai Sumun", "Sungkai", "Taiping", "Tanjong Malim", "Tanjong Piandang", "Tanjong Rambutan", "Tanjong Tualang", "Tapah", "Tapah Road", "Teluk Intan", "Temoh", "TLDM Lumut", "Trolak", "Trong", "Ulu Bernam", "Ulu Kinta"]
                },
                {
                    "state": "Pahang",
                    "district": ["Balok", "Bandar Bera", "Bandar Pusat Jengka", "Bandar Tun Abdul Razak", "Benta", "Brinchang", "Bukit Fraser", "Kemayan", "Karak", "Genting Highlands", "Gambang", "Dong", "Damak", "Chini", "Chenor", "Bukit Kuin", "Bukit Goh", "Bentong", "Bera", "Cameron Highlands", "Jerantut", "Kuantan", "Lipis", "Maran", "Pekan", "Raub", "Rompin", "Temerloh", "Lanchang", "Lurah Bilut", "Mentakab", "Muadzam Shah", "Padang Tengku", "Ringlet", "Sega", "Sungai Koyan", "Sungai Lembing", "Tanah Rata", "Triang"]
                },
                {
                    "state": "Penang",
                    "district": ["Ayer Itam", "Balik Pulau", "Batu Ferringhi", "Batu Maung", "Bayan Lepas", "Bukit Mertajam", "Butterworth", "Georgetown", "Gelugor", "Kepala Batas", "Kubang Semang", "Nibong Tebal", "Penaga", "Penang Hill", "Perai", "Permatang Pauh", "Simpang Ampat", "Sungai Jawi", "Tanjong Bungah", "Tasek Gelugor", "USM Pulau Pinang",]
                },
                {
                    "state": "Perlis",
                    "district": ["Arau", "Kaki Bukit", "Kangar", "Kuala Perlis", "Padang Besar", "Simpang Ampat"]
                },
                {
                    "state": "Sabah",
                    "district": ["Beaufort", "Keningau", "Kuala Penyu", "Nabawan", "Sipitang", "Tambunan", "Tenom", "Kota Marudu", "Kudat", "Pitas", "Beluran", "Kinabatangan", "Sandakan", "Tongod", "Kunak", "Lahad Datu", "Semporna", "Tawau", "Kota Belud", "Kota Kinabalu", "Papar", "Penampang", "Putatan", "Ranau", "Tuaran", "Beverly", "Bongawan", "Inanam", "Kota Kinabatangan", "Kota Marudu", "Likas", "Membakut", "Menumbok", "Pamol", "Tamparuli", "Tanjung Aru", "Tenghilan"]
                },
                {
                    "state": "Sarawak",
                    "district": ["Betong", "Saratok", "Bintulu", "Tatau", "Belaga", "Kapit", "Song", "Bau", "Kuching", "Lundu", "Lawas", "Limbang", "Marudi", "Miri", "Dalat", "Daro", "Matu", "Mukah", "Asajaya", "Samarahan", "Simunjan", "Julau", "Meradong", "Sarikei", "Pakan", "Siburan", "Tebedu", "Kanowit", "Sibu", "Selangau", "Lubok Antu", "Sri Aman", "Balingian", "Baram", "Bekenu", "Belawai", "Bintangor", "Debak", "Engkilili", "Julau", "Kabong", "Kota Samarahan", "Nanga Medamit", "Niah", "Pusa", "Roban", "Sebauh", "Sebuyau", "Serian", "Spaoh", "Sundar"]
                },
                {
                    "state": "Selangor",
                    "district": ["Ampang", "Bangi", "Banting", "Gombak", "Kajang", "Klang", "Kuala Langat", "Kuala Kubu Bahru", "Kuala Selangor", "Petaling Jaya ", "Sabak Bernam", "Sepang", "Shah Alam", "Subang Jaya", "Bestari Jaya", "Bukit Rotan", "Cheras", "Cyberjaya", "Dengkil", "Hulu Langat", "Jenjarom", "Jeram", "Kapar", "Kerling", "KLIA", "Kuang", "Pelabuhan Klang", "Puchong", "Pulau Carey", "Pulau Indah", "Pulau Ketam", "Rasa", "Rawang", "Sekinchan", "Semenyih", "Serdang", "Serendah", "Seri Kembangan", "Sungai Ayer Tawar", "Sungai Besar", "Sungai Buloh", "Sungai Pelek", "Tanjong Karang", "Tanjong Sepat", "Telok Panglima Garang"]
                },
                {
                    "state": "Terengganu",
                    "district": ["Ajil", "Al Muktatfi Billah Shah", "Ayer Puteh", "Besut", "Bukit Payong", "Bukit Besi", "Ceneh", "Chalok", "Cukai", "Dungun", "Hulu Terengganu", "Jerteh", "Kampung Raja", "Kemaman", "Kemasek", "Kerteh", "Ketengah Jaya", "Kijal", "Kuala Besut", "Kuala Berang", "Kuala Nerus", "Kuala Terengganu", "Setiu", "Marang", "Paka", "Permaisuri", "Sungai Tong",]
                }
            ];

        let char =
            [
                {
                    "state": "Federal Territory of Kuala Lumpur",
                    "branch": ["Ampang Jaya", "Ampang New Village", "Bangsar", "Bangunan Getah Asli", "Batu Cantonment", "Central", "Fraser Business Centre", "Jalan Bunus", "Jalan Ipoh", "LTAT", "Mytown", "Setapak", "Taman Maluri", "Taman Midah", "Taman Tun Dr Ismail", "Wangsa Maju", "Wisma Pertahanan"],
                    "auto": ["AFFINBANK Auto Finance Centre Jalan Ipoh", "AFFINBANK Auto Finance Centre Taman Maluri"]
                },
                {
                    "state": "Federal Territory of Putrajaya",
                    "branch": ["Putrajaya"]
                },
                {
                    "state": "Johor",
                    "branch": ["Ayer Hitam", "Batu Pahat", "Danga Bay", "Johor Bahru", "Johor Jaya", "Kluang", "Kulai", "Muar", "Mutiara Rini", "Permas Jaya", "Segamat", "Taman Molek Business Center", "Tampoi"],
                    "auto": ["AFFINBANK Auto Finance Centre Batu Pahat", "AFFINBANK Auto Finance Centre Johor Bahru", "AFFINBANK Auto Finance Centre Taman Johor Jaya"]
                },
                {
                    "state": "Kedah",
                    "branch": ["Alor Setar", "Jitra", "Kulim", "Langkawi", "Sg. Petani"],
                    "auto": ["AFFINBANK Auto Finance Centre Alor Setar"]
                },
                {
                    "state": "Kelantan",
                    "branch": ["Jeli", "Kota Bharu"],
                    "auto": ["AFFINBANK Auto Finance Centre Kota Bharu"]
                },
                {
                    "state": "Malacca",
                    "branch": ["Bukit Baru", "Gemas", "Melaka Raya"],
                    "auto": ["AFFINBANK Auto Finance Centre Melaka Raya"]
                },
                {
                    "state": "Negeri Sembilan",
                    "branch": ["Bandar Seri Sendayan", "Nilai", "Port Dickson", "Senawang", "Seremban"],
                    "auto": ["AFFINBANK Auto Finance Centre Seremban"]
                },
                {
                    "state": "Perak",
                    "branch": ["Bandar Meru Raya", "Ipoh", "Ipoh Garden", "Lumut", "Sitiawan", "Taiping", "Teluk Intan"],
                    "auto": ["AFFINBANK Auto Finance Centre Ipoh"]
                },
                {
                    "state": "Pahang",
                    "branch": ["Jengka", "Kuantan", "Mentakab", "Temerloh"],
                    "auto": ["AFFINBANK Auto Finance Centre Kuantan"]
                },
                {
                    "state": "Penang",
                    "branch": ["Bayan Baru", "Butterworth", "Fettes Park", "Jalan Macalister", "Juru Business Centre", "Kepala Batas", "Prai", "Seberang Jaya", "Wisma Pelaut"],
                    "auto": ["AFFINBANK Auto Finance Centre Jalan Macalister", "AFFINBANK Auto Finance Centre Juru Business Centre"]
                },
                {
                    "state": "Perlis",
                    "branch": ["Kangar"]
                },
                {
                    "state": "Sabah",
                    "branch": ["Bintulu", "Jalan Gaya", "Kota Kinabalu", "Lahad Datu", "Sandakan", "Tawau"],
                    "auto": ["AFFINBANK Auto Finance Centre Jalan Gaya"]
                },
                {
                    "state": "Sarawak",
                    "branch": ["Kuching", "Miri", "Prince Commercial Centre", "Sibu", "Tabuan Jaya"],
                    "auto": ["AFFINBANK Auto Finance Centre Kuching"]
                },
                {
                    "state": "Selangor",
                    "branch": ["Ara Damansara", "Bandar Bukit Tinggi", "Bangi", "Cyberjaya", "Denai Alam", "Jalan Meru", "Kajang", "Kampus Puncak Alam", "Kepong", "Klang Utara", "Kota Damansara", "Kota Kemuning", "Kota Warisan", "MSU Shah Alam Business Centre", "PJ SS2", "PJ State", "Port Klang", "Puchong", "Rawang", "Sea Park", "Selayang", "Seri Kembangan", "Seri Petaling", "Shah Alam (Kom. PKNS)", "Subang Jaya", "Taman Demang", "Taman Kinrara", "The Curve", "UiTM", "USJ Taipan"],
                    "auto": ["AFFINBANK Auto Finance Centre Seri Kembangan", "AFFINBANK Auto Finance Centre PJ SS2", "AFFINBANK Auto Finance Centre PJ State"]
                },
                {
                    "state": "Terengganu",
                    "branch": ["Kemaman", "Kemaman Supply Base", "Kuala Terengganu"],
                    "auto": ["AFFIN ISLAMIC Auto Finance Centre Kuala Terengganu"]
                }
            ];

        $('.state').on('change', function () {
            var state = $(this).val();
            $('#00N1s000001UBWb').val(state);
            district_option(state);
        })

        $("#lead-gens").validate({});

        var state;

        function district_option(state) {
            var opt;
            var state2;
            for (var key in text) {
                state2 = text[key].state;
                for (var key2 in text[key].district) {
                    if (state === state2) {
                        opt += '<option value="' + text[key].district[key2] + '">' + text[key].district[key2] + '</option>';
                    }
                }
            }
            $(".areas").html(opt);
        }

        $(".state").trigger('change');
    });

}
