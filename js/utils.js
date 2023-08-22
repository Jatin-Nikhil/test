/*
* THIS FILE CONTAINS CODE FOR INTRO VIDEO PLAYBACK,
* RESUME,
* DARK-MODE SWITCH
* and
* Tab Switch in the about Section
*/

/* ======RESUME====== */
function addResumeDownloadHandler(selector, fileName) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            const fileUrl = "../public/" + fileName;

            const downloadAnchor = document.createElement("a");
            downloadAnchor.href = fileUrl;
            downloadAnchor.download = fileName;
            downloadAnchor.target = "_blank";

            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();

            // Clean up: Remove the anchor element.
            document.body.removeChild(downloadAnchor);
        });
    });
}
addResumeDownloadHandler(".resumeButton_desktop", "resume.pdf");


/* ======DARKMODE====== */
const r = document.querySelector(':root');

function myFunction_set(selector) {
    const ui_switch_btn = document.querySelector(selector);
    const light_ui = { '--light-background': '#fafafa', '--Off-White': '#eeeff1', '--Black': '#1A1B1F', '--Light-black': '#62646d', '--green':'#37EBA9', '--blue':'#5B37EB' };
    const dark_ui = { '--light-background': '#212226', '--Off-White': '#000000', '--Black': '#e5e5e5', '--Light-black': '#BBBBBB','--green':'#CF43FD', '--blue':'#26113C' };
    const mode_value = ui_switch_btn.getAttribute('data-attribute');
    if (mode_value === 'light') {
        for (const [key, value] of Object.entries(dark_ui)) {
            r.style.setProperty(key, value);
        }
        ui_switch_btn.setAttribute('data-attribute', 'dark'); // Update the attribute value
    } else if (mode_value === 'dark') {
        for (const [key, value] of Object.entries(light_ui)) {
            r.style.setProperty(key, value);
        }
        ui_switch_btn.setAttribute('data-attribute', 'light'); // Update the attribute value
    }
    return ui_switch_btn.getAttribute('data-attribute');
}

$(".header__mode").click(function(){
    let modeSwitch = $('.mode-icon');
    let result =  myFunction_set('.header__mode');
    if(result === "light"){
        modeSwitch.removeClass('fa-sun').addClass('fa-moon');
    }
    else if(result === "dark"){
        modeSwitch.removeClass('fa-moon').addClass('fa-sun')
    }
});



/* ======ABOUT_ME_TABS====== */
function selectTab() {
    let selectedTab = $(this).data('attribute');
    $('.tab_content').removeClass('active');
    $('.tab_links').removeClass("active");
    $("#" + selectedTab).addClass('active');
    $(this).addClass("active");
}
$(".tab_links").click(selectTab);



/* ======DIV SLIDE_UP and ACCESSIBILITY ICONS ANIMATION====== */
function checkSlide() {
    const divs = document.querySelectorAll('.slide_up');

    divs.forEach(div => {
        const slideInAt = (window.scrollY + window.innerHeight) - div.offsetHeight / 2;
        const boxBottom = div.offsetTop + div.offsetHeight;
        const isHalfShown = slideInAt > div.offsetTop;
        const isNotScrolledPast = window.scrollY < boxBottom;

        if (isHalfShown && isNotScrolledPast) {
            div.style.opacity = 1;
            div.style.transform = 'translateY(0)';
        } else {
            div.style.opacity = 0;
            div.style.transform = 'translateY(50px)';
        }
    });
}

window.addEventListener('load', function () {
    checkSlide();
});
window.addEventListener('scroll', checkSlide);
