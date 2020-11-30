var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key9lokycPO090Rlh'}).base('app9l86cCsmAxsTwf');


function listProjects(){
    base('navigation').select({
        sort: [{field: "index", direction: "asc"}]
      }).firstPage(onProjects);

    function onProjects(err, records){
        if (err) { console.error(err); return; }
        // console.log(records);
        let subNav = document.getElementsByClassName("sub-nav")[0];
        subNav.innerHTML = "";
        for (let i = 0; i < records.length; i++) {
            let a = document.createElement('a');
            let id = records[i].id;
            a.href = `project.html?${id}`;
            a.textContent = records[i].fields.short_name;
            subNav.appendChild(a);
        }
        let scrollWrapper = document.getElementsByClassName("scroll-wrapper")[0];
        scrollWrapper.innerHTML = "";
        for (let i = 0; i < records.length; i++) {
            let a = document.createElement('a');
            let id = records[i].id;
            a.href = `project.html?${id}`;
            a.textContent = records[i].fields.short_name;
            scrollWrapper.appendChild(a);
            //hover div navigation image
            a.addEventListener("mousemove", showHoverDiv);
            let hoverdiv = document.querySelector(".hover-div");
            hoverdiv.style.zIndex = -1;
            hoverdiv.style.width = "250px";
            hoverdiv.style.height = "250px";
            hoverdiv.style.filter = "blur(5px) contrast(150%)";
            hoverdiv.style.borderRadius = "200px";
            function showHoverDiv (event){
                hoverdiv.style.display = "block";
                hoverdiv.src = records[i].fields.cover_image[0].thumbnails.large.url;
                hoverdiv.style.position = "absolute";
                hoverdiv.style.top = `${event.clientY}px`;
                hoverdiv.style.left = `${event.clientX}px`;
                document.body.appendChild(hoverdiv);
            }
            a.addEventListener("mouseleave", ()=>{
                hoverdiv.style.display = "none";
                hoverdiv.src = "";
                hoverdiv.innerHTML = "";
            });
        }
    }
}

function showTitle() {
    let id = window.location.search.substring(1);
    base('navigation').find(id, function(err, record) {
        //show html title
        if (document.title != record.fields.title) {
            document.title = record.fields.title;
        }
    });
}

function showProject(){
    let id = window.location.search.substring(1);
    // console.log("id:",id);

    //show nav bar
    base('navigation').select({
        sort: [{field: "index", direction: "asc"}]
      }).firstPage(onProjects);
    
    function onProjects(err, records){
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

    base('navigation').find(id, function(err, record) {
        if (err) { console.error(err); return; }
        //console.log(record)

        //for case study
        if (record.fields.category == "case_study"){
            //show header cover image 0
            let coverImg0 = document.getElementsByClassName("cover-img")[0];
            let img0 = document.createElement("img");
            img0.classList.add("zoom-in-cover");
            img0.src = record.fields.cover_image[0].url;
            img0.alt = `${record.fields.cover_image[0].filename},${record.fields.cover_image[0].id}`;
            coverImg0.appendChild(img0);

            //show information
            let info = document.getElementsByClassName("info-wrapper")[0];
            if (record.fields.information != null){
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
            img1.src = record.fields.cover_image[1].url;
            img1.alt = `${record.fields.cover_image[1].filename},${record.fields.cover_image[1].id}`;
            coverImg1.appendChild(img1);
            if (record.fields.video != null){
                img1.classList.add("zoom-in-cover", "cover");
                let videoWrapper = document.createElement("div");
                videoWrapper.classList.add("video-wrapper");
                videoWrapper.innerHTML = record.fields.video;
                coverImg1.appendChild(videoWrapper);
            } else {
                console.log("no video");
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
            if (record.fields.info_tag != null){
                infoTag.innerHTML = record.fields.info_tag;
            }

            //show detail images
            let projectImg = document.getElementsByClassName("project-img")[0];
            base(record.fields.short_name).select({
                sort: [{field: "index", direction: "asc"}]
            }).firstPage(showDetail);
            function showDetail(err, records){
                if (err) { console.error(err); return; }
                for (let i = 0; i < records.length; i++){
                    let textImgWrapper = document.createElement("div");
                    if (records[i].fields.category[0] == "left"){
                        textImgWrapper.classList.add("text-img-wrapper");
                    } else if (records[i].fields.category[0] == "right") {
                        textImgWrapper.classList.add("img-text-wrapper");
                    }

                    let descriptionText = document.createElement("div");
                    descriptionText.classList.add("description-text");
                    if (records[i].fields.detail_text != null){
                        descriptionText.innerHTML = records[i].fields.detail_text;
                    } else {
                        descriptionText.innerHTML = ""; 
                    }

                    let detailWrapper = document.createElement("div");
                    detailWrapper.classList.add("detail-wrapper");

                    let detailImg = document.createElement("img");
                    detailImg.classList.add("zoom-in");
                    detailImg.src = records[i].fields.detail_images[0].url;
                    detailImg.alt = `${records[i].fields.detail_images[0].filename}, ${records[i].fields.detail_images[0].id}`;
                    detailWrapper.appendChild(detailImg);

                    //small detail images
                    let detailWrapperSmall = document.createElement("div");
                    detailWrapperSmall.classList.add("detail-wrapper-small");
                    if (records[i].fields.category[1] == "multiple"){
                        for (let j = 1; j < records[i].fields.detail_images.length; j ++){
                            let detailImgSmall = document.createElement("img");
                            detailImgSmall.classList.add("zoom-in");
                            detailImgSmall.src = records[i].fields.detail_images[j].url;
                            detailImgSmall.alt = `${records[i].fields.detail_images[j].filename}, ${records[i].fields.detail_images[j].id}`;
                            detailWrapperSmall.appendChild(detailImgSmall);
                            //lightbox
                            detailImgSmall.addEventListener("click",(event)=>{
                                lightbox(detailImgSmall, records[i].fields.index, record.fields.short_name);
                            });
                        } 
                        detailWrapper.appendChild(detailWrapperSmall);
                    }
                    if (records[i].fields.category[2] == "full"){
                        // detailWrapperSmall.style.width = "75%";
                        detailWrapper.style.width = "100%";
                        descriptionText.style.display = "none";
                    }
                    
                    textImgWrapper.appendChild(descriptionText);
                    textImgWrapper.appendChild(detailWrapper);
                    projectImg.appendChild(textImgWrapper);

                    //show lightbox
                    detailImg.addEventListener("click", (event)=>{
                        lightbox(detailImg, records[i].fields.index, record.fields.short_name);
                    });
                }
            }
        }
    });
}

function lightbox(img, index, tableName){
    // console.log(index, tableName);
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
        sort: [{field: "index", direction: "asc"}]
    }).firstPage(lightboxImage);
    function lightboxImage(err, records){
        if (err) { console.error(err); return; }
        let lightboxindex = index;
        rightdiv.addEventListener("click", () => {
            lightboxindex ++;
            lightboxindex = lightboxindex % records.length;
            imgdiv.innerHTML = `<img class="zoom-in" src="${records[lightboxindex].fields.detail_images[0].url}" />`;
        });
        leftdiv.addEventListener("click", () => {
            if (lightboxindex == 0) {
                lightboxindex = records.length - 1;
            } else {
                lightboxindex --;
            }
            lightboxindex = lightboxindex % records.length;
            imgdiv.innerHTML = `<img class="zoom-in" src="${records[lightboxindex].fields.detail_images[0].url}" />`;
        });
    }

    document.getElementById("back").addEventListener("click",()=>{
        expand.style.display = "none";
        imgdiv.style.display = "none";
        imgdiv.innerHTML = "";
        controldiv.style.display = "none";
        controldiv.innerHTML = "";
        backdiv.style.display = "none";
        backdiv.innerHTML = "";
    });
}

function showMainVideo(){
    base('others').find('recY4frnfxVacQC9M', function(err, record) {
        if (err) { console.error(err); return; }
        // console.log('Retrieved', record);

        //show background video
        let mainVideo = document.getElementsByClassName("main-video")[0];
        let videoDiv = document.createElement("video");
        videoDiv.autoplay = "autoplay";
        videoDiv.muted = "muted";
        videoDiv.loop = "loop";
        let videoSource = document.createElement("source");
        videoSource.src = record.fields.video[0].url;
        videoSource.type = "video/mp4";
        videoDiv.appendChild(videoSource);
        mainVideo.appendChild(videoDiv);
    });
}
function showAboutPage(){
    base('others').find('rec9gDiJVlpVl5b7Z', function(err, record) {
        if (err) { console.error(err); return; }
        console.log('Retrieved', record);
        //show about text
        let aboutText = document.getElementsByClassName("about-text")[0];
        aboutText.innerHTML = record.fields.text;
        //show contact
        let aboutContact = document.getElementsByClassName("about-contact")[0];
        aboutContact.innerHTML = record.fields.contact;
        //show img
        let aboutImg = document.getElementsByClassName("about-img")[0];
        let img = document.createElement("img");
        img.src = record.fields.image[0].url;
        img.alt = `${record.fields.image[0].filename}, ${record.fields.image[0].id}`;
        aboutImg.appendChild(img);
    });
}

