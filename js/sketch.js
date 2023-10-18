//loading page
function loaderTimer() {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    window.addEventListener('scroll', noScroll);
    document.getElementById("loader").style.animationDuration = "1.25s";
    document.getElementById("preload-page").style.animationDuration = "1.25s";
    timervar = setTimeout(showPage, 1250);
}
function loaderTimerLong() {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    window.addEventListener('scroll', noScroll);
    document.getElementById("loader").style.animationDuration = "2s";
    document.getElementById("preload-page").style.animationDuration = "2s";
    timervar = setTimeout(showPage, 2000);
}
function showPage() {
    document.getElementById("preload-page").style.display = "none";
    document.getElementById("loader").style.display = "none";
    window.removeEventListener('scroll', noScroll);
    document.getElementsByTagName("body")[0].style.overflowY = "initial";
}
function noScroll() {
    window.scrollTo(0, 0);
}


//data airtable
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'patcxPzWy78KOMLdZ.65b6b63e7f2a213954ae23d243ebca2c0cd7fc399e961d4109dab1fdab592816'
});
var base = Airtable.base('app9l86cCsmAxsTwf');
// var base = new Airtable({ apiKey: 'key9lokycPO090Rlh' }).base('app9l86cCsmAxsTwf');
let recordMain = "recY4frnfxVacQC9M";
let recordAbout = "rec9gDiJVlpVl5b7Z";
let recordPortfolio = "recxp2hCMenh3CWXl";

function listProjects(tableTitle) {
    base(tableTitle).select({
        sort: [{ field: "index", direction: "asc" }]
    }).firstPage(onProjects);

    function onProjects(err, records) {
        if (err) { console.error(err); return; }
        let scrollWrapper = document.getElementsByClassName("scroll-wrapper")[0];
        scrollWrapper.innerHTML = "";
        for (let i = 0; i < records.length; i++) {
            let a = document.createElement('a');
            let id = records[i].id;
            a.href = `project.html?${id}`;
            a.textContent = `${records[i].fields.short_name}`;
            a.classList.add("show-on-scroll");
            scrolling(a);
            scrollWrapper.appendChild(a);
            //hover div navigation image
            a.addEventListener("mousemove", showHoverDiv);
            let hoverdiv = document.getElementsByClassName("hover-div")[0];
            hoverdiv.style.zIndex = -1;
            hoverdiv.style.width = "250px";
            hoverdiv.style.height = "250px";
            hoverdiv.style.filter = "blur(5px) contrast(150%)";
            hoverdiv.style.borderRadius = "200px";
            function showHoverDiv(event) {
                hoverdiv.style.display = "block";
                hoverdiv.src = records[i].fields.cover_image[0].thumbnails.large.url;
                hoverdiv.style.position = "absolute";
                hoverdiv.style.top = `${event.pageY - 85}px`;
                hoverdiv.style.left = `${event.clientX - 85}px`;
                document.body.appendChild(hoverdiv);
            }
            a.addEventListener("mouseleave", () => {
                hoverdiv.style.display = "none";
                hoverdiv.src = "";
                hoverdiv.innerHTML = "";
            });
        }
    }
}

function showTitle() {
    let id = window.location.search.substring(1);
    // console.log(id);
    base('navigation').find(id, function (err, record) {
        //show html title
        if (document.title != record.fields.title) {
            document.title = record.fields.title;
        }
    });
}

function showNav() {
    //show nav bar
    base('navigation').select({
        sort: [{ field: "index", direction: "asc" }]
    }).firstPage(onProjects);

    function onProjects(err, records) {
        if (err) { console.error(err); return; }
        let subNav = document.getElementsByClassName("sub-nav")[0];
        subNav.innerHTML = "";
        for (let i = 0; i < records.length; i++) {
            let a = document.createElement('a');
            let id = records[i].id;
            a.href = `project.html?${id}`;
            a.textContent = records[i].fields.short_name;
            subNav.appendChild(a);
        }
    }
    base('navigation-photo').select({
        sort: [{ field: "index", direction: "asc" }]
    }).firstPage(onPhotoProjects);
    function onPhotoProjects(err, records) {
        if (err) { console.error(err); return; }
        let subNav = document.getElementsByClassName("sub-nav")[1];
        subNav.innerHTML = "";
        for (let i = 0; i < records.length; i++) {
            let a = document.createElement('a');
            let id = records[i].id;
            a.href = `project.html?${id}`;
            a.textContent = records[i].fields.short_name;
            subNav.appendChild(a);
        }
    }
}

function langSwitchInsert() {
    let id = window.location.search.substring(1);
    // console.log(id);
    let langSwitchA = document.querySelectorAll("#lang-switch > a");
    if (langSwitchA[0].search == "") {
        // console.log(langSwitchA[0].search, langSwitchA[0].href);
        langSwitchA[0].href = `project.html?${id}`;
    }
    if (langSwitchA[1].search == "") {
        // console.log(langSwitchA[1].search, langSwitchA[1].href);
        langSwitchA[1].href = `project-cn.html?${id}`;
    }
}

function showProject(tableTitle) {
    let id = window.location.search.substring(1);
    // console.log("id:",id);
    base(tableTitle).find(id, function (err, record) {
        if (err) { console.error(err); return; }
        //for case study
        if (record.fields.category[0] == "case_study") {
            //show header cover image 0
            let coverImg0 = document.getElementsByClassName("cover-img")[0];
            let img0 = document.createElement("img");
            img0.classList.add("zoom-in-cover");
            img0.src = record.fields.cover_image[0].url;
            img0.alt = `${record.fields.cover_image[0].filename},${record.fields.cover_image[0].id}`;
            coverImg0.appendChild(img0);

            //show information
            let info = document.getElementsByClassName("info-wrapper")[0];
            if (record.fields.information != null) {
                let divLeft = document.createElement("div");
                let divRight = document.createElement("div");
                divLeft.innerHTML = `<h1>${record.fields.title}</h1><h2>${record.fields.subtitle}</h2>`;
                divRight.innerHTML = `<h2>${record.fields.information}</h2>`;
                info.appendChild(divLeft);
                info.appendChild(divRight);
            }

            //show video, video cover/cover image 1
            let coverImg1 = document.getElementsByClassName("cover-img")[1];
            coverImg1.innerHTML = "";
            let img1 = document.createElement("img");
            // img1.src = record.fields.cover_image[1].url;
            // img1.alt = `${record.fields.cover_image[1].filename},${record.fields.cover_image[1].id}`;
            // coverImg1.appendChild(img1);
            if (record.fields.video != null) {
                // img1.classList.add("zoom-in-cover", "cover");
                // let videoWrapper = document.createElement("div");
                // videoWrapper.classList.add("video-wrapper");
                // videoWrapper.innerHTML = record.fields.video;
                // coverImg1.appendChild(videoWrapper);
                // videoWrapper.appendChild(img1);
                // checkVideoSize(coverImg1, videoWrapper);

                // coverImg1.classList.add("video-wrapper");
                // coverImg1.innerHTML = record.fields.video;

                let videoWrapper = document.createElement("div");
                videoWrapper.classList.add("video-wrapper");
                videoWrapper.innerHTML = record.fields.video;
                coverImg1.appendChild(videoWrapper);
                videoWrapper.style.backgroundImage = `url(${record.fields.cover_image[1].url})`;
                videoWrapper.style.backgroundSize = "cover";
            } else {
                // console.log("no video");
                img1.src = record.fields.cover_image[1].url;
                img1.alt = `${record.fields.cover_image[1].filename},${record.fields.cover_image[1].id}`;
                coverImg1.appendChild(img1);
                img1.classList.add("zoom-in-cover");
            }

            //show info tag
            let infoTag0 = document.getElementsByClassName("info-tag")[0];
            let liTitle = document.createElement("li");
            liTitle.classList.add("info-tag-title");
            let liCreator = document.createElement("li");
            let liYear = document.createElement("li");
            liTitle.innerText = record.fields.title;
            liCreator.innerText = record.fields.creator;
            liYear.innerText = record.fields.year;
            infoTag0.appendChild(liTitle);
            infoTag0.appendChild(liCreator);
            infoTag0.appendChild(liYear);
            let infoTag = document.getElementsByClassName("info-tag")[1];
            if (record.fields.info_tag != null) {
                infoTag.innerHTML = record.fields.info_tag;
            }

            //show detail images
            let projectImg = document.getElementsByClassName("project-img")[0];
            base(record.fields.short_name).select({
                sort: [{ field: "index", direction: "asc" }]
            }).firstPage(showDetail);
            function showDetail(err, records) {
                if (err) { console.error(err); return; }
                for (let i = 0; i < records.length; i++) {
                    //show flex
                    if (records[i].fields.category[0] == "flex") {
                        let photoDiv = document.createElement("div");
                        photoDiv.style.width = "100%";
                        photoDiv.style.display = "flex";
                        photoDiv.style.flexDirection = "row";
                        photoDiv.style.flexWrap = "wrap";
                        for (let j = 0; j < records[i].fields.detail_images.length; j++) {
                            let photoImgDiv = document.createElement("div");
                            photoImgDiv.style.flex = "1";
                            let photoImg = document.createElement("img");
                            photoImg.style.maxWidth = "100%";
                            photoImg.classList.add("zoom-in", "show-on-scroll");
                            scrolling(photoImg);
                            photoImg.src = records[i].fields.detail_images[j].url;
                            photoImg.alt = `${records[i].fields.detail_images[j].filename}, ${records[i].fields.detail_images[j].id}`;
                            photoImgDiv.appendChild(photoImg);
                            photoDiv.appendChild(photoImgDiv);
                            //lightbox
                            photoImg.addEventListener("click", (event) => {
                                lightbox(photoImg, i, j, record.fields.short_name);
                            });
                            //show photo text
                            if (j == records[i].fields.detail_images.length - 1) {
                                if (records[i].fields.detail_text != null) {
                                    let photoText = document.createElement("div");
                                    photoText.style.paddingRight = "0.5rem";
                                    photoText.style.textAlign = "right";
                                    photoText.innerHTML = records[i].fields.detail_text;
                                    photoImgDiv.appendChild(photoText);
                                }
                            }
                        }
                        projectImg.appendChild(photoDiv);
                    } else {
                        let textImgWrapper = document.createElement("div");
                        if (records[i].fields.category[0] == "left") {
                            textImgWrapper.classList.add("text-img-wrapper");
                        } else if (records[i].fields.category[0] == "right") {
                            textImgWrapper.classList.add("img-text-wrapper");
                        }

                        let descriptionText = document.createElement("div");
                        descriptionText.classList.add("description-text");
                        if (records[i].fields.detail_text != null) {
                            descriptionText.innerHTML = records[i].fields.detail_text;
                        } else {
                            descriptionText.innerHTML = "";
                        }

                        let detailWrapper = document.createElement("div");
                        detailWrapper.classList.add("detail-wrapper", "show-on-scroll");
                        scrolling(detailWrapper);

                        let detailImg = document.createElement("img");
                        if (records[i].fields.detail_images != null) {
                            detailImg.classList.add("zoom-in");
                            detailImg.src = records[i].fields.detail_images[0].url;
                            detailImg.alt = `${records[i].fields.detail_images[0].filename}, ${records[i].fields.detail_images[0].id}`;
                            detailWrapper.appendChild(detailImg);

                            //small detail images
                            let detailWrapperSmall = document.createElement("div");
                            detailWrapperSmall.classList.add("detail-wrapper-small");
                            if (records[i].fields.category[1] == "multiple") {
                                for (let j = 1; j < records[i].fields.detail_images.length; j++) {
                                    let detailImgSmall = document.createElement("img");
                                    detailImgSmall.classList.add("zoom-in");
                                    detailImgSmall.src = records[i].fields.detail_images[j].url;
                                    detailImgSmall.alt = `${records[i].fields.detail_images[j].filename}, ${records[i].fields.detail_images[j].id}`;
                                    detailWrapperSmall.appendChild(detailImgSmall);
                                    //lightbox
                                    detailImgSmall.addEventListener("click", (event) => {
                                        lightbox(detailImgSmall, i, j, record.fields.short_name);
                                    });
                                }
                                detailWrapper.appendChild(detailWrapperSmall);
                            }
                        } else {
                            detailWrapper.innerHTML = "";
                        }

                        if (records[i].fields.category[2] == "full") {
                            detailWrapper.style.width = "100%";
                            descriptionText.style.display = "none";
                        }

                        textImgWrapper.appendChild(descriptionText);
                        textImgWrapper.appendChild(detailWrapper);
                        projectImg.appendChild(textImgWrapper);

                        //lightbox
                        detailImg.addEventListener("click", (event) => {
                            lightbox(detailImg, i, 0, record.fields.short_name);
                        });
                    }
                }
            }
        }
        //for gallery view
        if (record.fields.category[0] == "gallery_view") {
            base(record.fields.short_name).select({
                sort: [{ field: "index", direction: "asc" }]
            }).firstPage(showDetail);
            function showDetail(err, records) {
                if (err) { console.error(err); return; }
                let mainDiv = document.getElementsByTagName("main")[0];
                mainDiv.innerHTML = "";
                let galleryWrapper = document.createElement("div");
                galleryWrapper.classList.add("gallery-wrapper");
                mainDiv.appendChild(galleryWrapper);
                let imgContainer = document.createElement("div");
                imgContainer.classList.add("img-container");
                let imgSlide = document.createElement("div");
                imgSlide.classList.add('img-slide');
                imgContainer.appendChild(imgSlide);

                let imglast = document.createElement("img");
                imglast.src = records[records.length - 1].fields.image[0].url;
                imglast.alt = `${records[records.length - 1].fields.img_title}, ${records[records.length - 1].id}`;
                imgSlide.appendChild(imglast);
                records.forEach(record => {
                    let img = document.createElement("img");
                    img.src = record.fields.image[0].url;
                    img.alt = `${record.fields.img_title}, ${record.id}`;
                    img.title = record.fields.img_title;
                    imgSlide.appendChild(img); 
                });
                let imgfirst = document.createElement("img");
                imgfirst.src = records[0].fields.image[0].url;
                imgfirst.alt = `${records[0].fields.img_title}, ${records[0].id}`;
                imgSlide.appendChild(imgfirst);
                galleryWrapper.appendChild(imgContainer);
                let control = document.createElement("div")
                let prev = document.createElement("p");
                let next = document.createElement("p");
                prev.innerText = "prev";
                next.innerText = "next";
                control.appendChild(prev);
                control.appendChild(next);
                control.classList.add("img-control");
                galleryWrapper.appendChild(control);
                //slide control
                let counter = 1;
                let gallerySize = imgSlide.clientWidth;
                window.addEventListener('resize', () => {
                    gallerySize = imgSlide.clientWidth;
                });
                imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                setInterval(sliding, 4000);
                function sliding() {
                    if (counter >= records.length + 1) return;
                    counter++;
                    imgSlide.style.transition = "transform 0.6s ease-in-out";
                    imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                    imgSlide.addEventListener("transitionend", () => {
                        if (counter == 0) {
                            imgSlide.style.transition = "none";
                            counter = records.length;
                            imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                        }
                        if (counter == records.length + 1) {
                            imgSlide.style.transition = "none";
                            counter = records.length + 2 - counter;
                            imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                        }
                    });
                }
                prev.addEventListener("click", () => {
                    if (counter <= 0) return;
                    counter--;
                    imgSlide.style.transition = "transform 0.4s ease-in-out";
                    imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                });
                next.addEventListener("click", () => {
                    if (counter >= records.length + 1) return;
                    counter++;
                    imgSlide.style.transition = "transform 0.4s ease-in-out";
                    imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                });
                imgSlide.addEventListener("transitionend", () => {
                    if (counter == 0) {
                        imgSlide.style.transition = "none";
                        counter = records.length;
                        imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                    }
                    if (counter == records.length + 1) {
                        imgSlide.style.transition = "none";
                        counter = records.length + 2 - counter;
                        imgSlide.style.transform = `translateX(${-gallerySize * counter}px)`;
                    }
                });
            }
        }
    });
}

function checkVideoSize(coverImg1, videoWrapper) {
    let videoWidth = coverImg1.clientWidth;
    let videoHeight = coverImg1.clientHeight;
    window.addEventListener('resize', () => {
        videoWidth = coverImg1.clientWidth;
        videoHeight = coverImg1.clientHeight;
    });
    videoWrapper.style.width = videoWidth;
    videoWrapper.style.height = videoHeight;
}

function lightbox(img, index, index2, tableName) {
    let expand = document.getElementById("expand");
    expand.style.display = "flex";
    let imgdiv = document.createElement("div");
    let backdiv = document.createElement("div");
    imgdiv.innerHTML = img.outerHTML;
    imgdiv.classList.add("expand-img");
    let controldiv = document.createElement("div");
    let leftdiv = document.createElement("div");
    let rightdiv = document.createElement("div");
    controldiv.appendChild(leftdiv);
    controldiv.appendChild(rightdiv);
    controldiv.classList.add("control-div");
    expand.appendChild(imgdiv);
    expand.appendChild(controldiv);
    backdiv.innerHTML = `<img id="back" src="image/back.png">`;
    backdiv.classList.add("back-div");
    expand.appendChild(backdiv);
    base(tableName).select({
        sort: [{ field: "index", direction: "asc" }]
    }).firstPage(lightboxImage);
    function lightboxImage(err, records) {
        if (err) { console.error(err); return; }
        let lightboxindex = index;
        let lightboxindex2 = index2;
        rightdiv.addEventListener("click", () => {
            if (lightboxindex == records.length - 1) {
                if (records[lightboxindex].fields.detail_images.length > 1) {
                    lightboxindex2++;
                    lightboxindex2 = lightboxindex2 % records[lightboxindex].fields.detail_images.length;
                    if (lightboxindex2 == 0) {
                        lightboxindex = 0;
                    }
                } else {
                    lightboxindex = 0;
                }
            } else {
                if (records[lightboxindex + 1].fields.detail_images == null) {
                    if (records[lightboxindex].fields.detail_images.length > 1) {
                        lightboxindex2++;
                        lightboxindex2 = lightboxindex2 % records[lightboxindex].fields.detail_images.length;
                        if (lightboxindex2 == 0) {
                            lightboxindex += 2;
                        }
                    } else {
                        lightboxindex += 2;
                        lightboxindex2 = 0;
                    }
                } else {
                    if (records[lightboxindex].fields.detail_images.length > 1) {
                        lightboxindex2++;
                        lightboxindex2 = lightboxindex2 % records[lightboxindex].fields.detail_images.length;
                        if (lightboxindex2 == 0) {
                            lightboxindex++;
                        }
                    } else {
                        lightboxindex++;
                        lightboxindex = lightboxindex % records.length;
                    }
                }
            }
            imgdiv.innerHTML = `<img class="zoom-in" src="${records[lightboxindex].fields.detail_images[lightboxindex2].url}" />`;
        });
        leftdiv.addEventListener("click", () => {
            if (lightboxindex == 0) {
                if (lightboxindex2 == 0) {
                    lightboxindex = records.length - 1;
                    lightboxindex2 = records[lightboxindex].fields.detail_images.length - 1;
                } else {
                    lightboxindex2--;
                }
            } else {
                if (records[lightboxindex - 1].fields.detail_images == null) {
                    if (records[lightboxindex].fields.detail_images.length > 1) {
                        if (lightboxindex2 == 0) {
                            lightboxindex -= 2;
                            lightboxindex2 = records[lightboxindex].fields.detail_images.length - 1;
                        } else {
                            lightboxindex2--;
                        }
                    } else {
                        lightboxindex -= 2;
                        lightboxindex2 = records[lightboxindex].fields.detail_images.length - 1;
                    }
                } else {
                    if (lightboxindex2 == 0) {
                        lightboxindex--;
                        lightboxindex2 = records[lightboxindex].fields.detail_images.length - 1;
                    } else {
                        lightboxindex2--;
                    }
                }
            }
            imgdiv.innerHTML = `<img class="zoom-in" src="${records[lightboxindex].fields.detail_images[lightboxindex2].url}" />`;
        });
    }

    document.getElementById("back").addEventListener("click", () => {
        expand.style.display = "none";
        imgdiv.style.display = "none";
        imgdiv.innerHTML = "";
        controldiv.style.display = "none";
        controldiv.innerHTML = "";
        backdiv.style.display = "none";
        backdiv.innerHTML = "";
    });
}

function showMainVideo() {
    // base('others').find('recY4frnfxVacQC9M', function(err, record) {
    base('others').find(recordMain, function (err, record) {
        if (err) { console.error(err); return; }

        //show background video
        let mainVideo = document.getElementsByClassName("main-video")[0];
        let bgWrapper = document.createElement("div");
        mainVideo.appendChild(bgWrapper);
        let videoGifzIndex = 0;
        record.fields.image.forEach(eachimg => {
            let videoGif = document.createElement("img");
            videoGif.classList.add("bg-gif");
            videoGif.src = eachimg.url;
            videoGif.alt = "";
            videoGif.style.zIndex = videoGifzIndex;
            bgWrapper.appendChild(videoGif);
            videoGif.addEventListener("click", (event) => {
                videoGifzIndex++;
                // console.log(videoGifzIndex);
                if (videoGifzIndex >= record.fields.image.length) {
                    window.location.assign("works.html");
                } else {
                    videoGif.style.zIndex = -videoGifzIndex;
                }
            });
        });
    });
}
function showAboutPage() {
    // base('others').find('rec9gDiJVlpVl5b7Z', function(err, record) {
    base('others').find(recordAbout, function (err, record) {
        if (err) { console.error(err); return; }
        //show about text
        let aboutText = document.getElementsByClassName("about-text")[0];
        aboutText.innerHTML = record.fields.text;
        let aboutContact = document.getElementsByClassName("about-contact")[0];
        let emailA = document.createElement("a");
        emailA.href = record.fields.email;
        emailA.target = "_blank";
        let emailIcon = document.createElement("img");
        emailIcon.src = record.fields.icons[0].url;
        emailIcon.alt = "";
        emailA.appendChild(emailIcon);
        aboutContact.appendChild(emailA);
        let insA = document.createElement("a");
        insA.href = record.fields.ins;
        insA.target = "_blank";
        let insIcon = document.createElement("img");
        insIcon.src = record.fields.icons[1].url;
        insIcon.alt = "";
        insA.appendChild(insIcon);
        aboutContact.appendChild(insA);
        //show about image
        let aboutImg = document.getElementsByClassName("about-img")[0];
        let img = document.createElement("img");
        img.src = record.fields.image[0].url;
        img.alt = `${record.fields.image[0].filename}, ${record.fields.image[0].id}`;
        aboutImg.appendChild(img);
    });
}

function showPortfolio() {
    base('others').find(recordPortfolio, function (err, record) {
        // console.log(record);
        if (err) { console.error(err); return; }
        //show portfolio
        let portfolioA = document.createElement("a");
        // console.log(record.fields.portfolio_file[0].url);
        portfolioA.href = record.fields.portfolio_file[0].url;
        let aText = record.fields.text;
        portfolioA.text= aText;
        let portfolioText = document.getElementsByClassName("portfolio-div")[0];
        let p = document.createElement("p");
        p.appendChild(portfolioA);
        portfolioText.appendChild(p);
    });
}

//scrolling
function scrolling(onScrollEl) {
    let scroll = window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    function loop() {
        if (isElementInViewport(onScrollEl)) {
            onScrollEl.classList.add("is-visible");
        } else {
            onScrollEl.classList.remove("is-visible");
        }
        scroll(loop);
    }
    loop();
    function isElementInViewport(el) {
        if (typeof JQery === "function" && el instanceof JQuery) {
            el = el[0];
        }
        let rect = el.getBoundingClientRect();
        return (
            (rect.top <= 0 && rect.bottom >= 0)
            ||
            (rect.bottom >= (window.innerHeight || document
                .documentElement.clientHeight) &&
                rect.top <= (window.innerHeight || document.documentElement
                    .clientHeight))
            ||
            (rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document
                    .documentElement.clientHeight))
        );
    }
}
