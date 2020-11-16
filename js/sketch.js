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
            a.addEventListener("mousemove", showHoverDiv);
            let hoverdiv = document.createElement("img");
            hoverdiv.classList.add("hover-div");
            hoverdiv.style.zIndex = -1;
            hoverdiv.style.width = "250px";
            hoverdiv.style.height = "250px";
            hoverdiv.style.filter = "blur(5px) contrast(150%)";
            hoverdiv.style.borderRadius = "200px";
            function showHoverDiv (event){
                // console.log(event);
                hoverdiv.style.display = "block";
                hoverdiv.src = records[i].fields.cover_image[0].thumbnails.large.url;
                hoverdiv.style.position = "absolute";
                hoverdiv.style.top = `${event.clientY}px`;
                hoverdiv.style.left = `${event.clientX}px`;
                document.body.appendChild(hoverdiv);
            }
            a.addEventListener("mouseleave", ()=>{
                hoverdiv.style.display = "none";
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
        // console.log(`Retrieved ${record.fields.short_name}`, record.id, record);

        //show header cover image 0
        let coverImg0 = document.getElementsByClassName("cover-img")[0];
        let img0 = document.createElement("img");
        // img0.classList.add("zoom-in");
        img0.classList.add("zoom-in-cover");
        img0.src = record.fields.cover_image[0].url;
        img0.alt = `${record.fields.cover_image[0].filename},${record.fields.cover_image[0].id}`;
        coverImg0.appendChild(img0);

        //show information
        let info = document.getElementsByClassName("info-wrapper")[0];
        let divLeft = document.createElement("div");
        let divRight = document.createElement("div");
        divLeft.innerHTML = `<h1>${record.fields.title}</h1><h2>${record.fields.subtitle}</h2>`;
        divRight.innerHTML = `<h2>${record.fields.information}</h2>`;
        info.appendChild(divLeft);
        info.appendChild(divRight);

        //show video, video cover/cover image 1
        let coverImg1 = document.getElementsByClassName("cover-img")[1];
        coverImg1.innerHTML = "";
        let img1 = document.createElement("img");
        img1.src = record.fields.cover_image[1].url;
        img1.alt = `${record.fields.cover_image[1].filename},${record.fields.cover_image[1].id}`;
        coverImg1.appendChild(img1);
        if (record.fields.video != null){
            // img1.classList.add("zoom-in", "cover");
            img1.classList.add("zoom-in-cover", "cover");
            let videoWrapper = document.createElement("div");
            videoWrapper.classList.add("video-wrapper");
            videoWrapper.innerHTML = record.fields.video;
            coverImg1.appendChild(videoWrapper);
        } else {
            // console.log("no video");
            // img1.classList.add("zoom-in");
            img1.classList.add("zoom-in-cover");
        }

        //show info tag
        let infoTag = document.getElementsByClassName("info-tag")[0];
        infoTag.innerHTML = record.fields.info_tag;

        //show detail images
        let projectImg = document.getElementsByClassName("project-img")[0];
        base(record.fields.short_name).select({
            sort: [{field: "index", direction: "asc"}]
        }).firstPage(showDetail);
        function showDetail(err, records){
            if (err) { console.error(err); return; }
            for (let i = 0; i < records.length; i++){
                if (i < 2){
                    let descriptionText = document.createElement("div");
                    descriptionText.classList.add("description-text");
                    descriptionText.innerHTML = records[i].fields.detail_text;
                    projectImg.appendChild(descriptionText);
                    let detailWrapper = document.createElement("div");
                    detailWrapper.classList.add("detail-wrapper");
                    let detailImg = document.createElement("img");
                    detailImg.classList.add("zoom-in");
                    detailImg.src = records[i].fields.detail_images[0].url;
                    detailImg.alt = `${records[i].fields.detail_images[0].filename}, ${records[i].fields.detail_images[0].id}`;
                    detailWrapper.appendChild(detailImg);
                    projectImg.appendChild(detailWrapper);
                    // show lightbox
                    detailImg.addEventListener("click", (event)=>{
                        lightbox(detailImg,records[i].fields.index, record.fields.short_name);
                    });
                } else {
                    let detailWrapper = document.createElement("div");
                    let detailTextHidden = document.createElement("div");
                    let detailImgWrapper = document.createElement("div");
                    detailTextHidden.innerHTML = records[i].fields.detail_text;
                    let detailImg = document.createElement("img");
                    detailImg.src = records[i].fields.detail_images[0].url;
                    detailImg.alt = `${records[i].fields.detail_images[0].filename}, ${records[i].fields.detail_images[0].id}`;
                    detailWrapper.classList.add("detail-wrapper");
                    detailTextHidden.classList.add("detail-text-hidden");
                    detailImgWrapper.classList.add("detail-img-wrapper");
                    detailImg.classList.add("zoom-in");
                    detailImgWrapper.appendChild(detailImg);
                    detailWrapper.appendChild(detailTextHidden);
                    detailWrapper.appendChild(detailImgWrapper);
                    projectImg.appendChild(detailWrapper);
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
    console.log(index, tableName);
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
// function lightbox(){
//     let zoomIn = document.getElementsByClassName("zoom-in");
//     // let zoomIn = document.querySelectorAll(".zoom-in");
//     let expand = document.getElementById("expand");
//     console.log(zoomIn.length, zoomIn);
//     for (let i = 0; i < zoomIn.length; i++){
//         zoomIn[i].addEventListener("click", () => {
//             console.log(zoomIn[i].outerHTML);
//             console.log(zoomIn[i].currentSrc);
//             expand.style.display = "flex";
//             let imgdiv = document.createElement("div");
//             let backdiv = document.createElement("div");
//             imgdiv.innerHTML = zoomIn[i].outerHTML;
//             imgdiv.classList.add("expand-img");
//             let controldiv = document.createElement("div");
//             let leftdiv = document.createElement("div");
//             let rightdiv = document.createElement("div");
//             controldiv.appendChild(leftdiv);
//             controldiv.appendChild(rightdiv);
//             controldiv.classList.add("control-div");
//             expand.appendChild(imgdiv);
//             expand.appendChild(controldiv);
//             backdiv.innerHTML = `<img id="back" src="image/back.png">`;
//             backdiv.classList.add("back-div");
//             expand.appendChild(backdiv);
//             let j = i;
//             rightdiv.addEventListener("click", () => {
//                 j++;
//                 j = j % zoomIn.length;
//                 imgdiv.innerHTML = `${zoomIn[j].outerHTML}`;
//             });
//             leftdiv.addEventListener("click", () => {
//                 if (j == 0) {
//                     j = zoomIn.length - 1;
//                 } else {
//                     j--;
//                 }
//                 j = j % zoomIn.length;
//                 imgdiv.innerHTML = `${zoomIn[j].outerHTML}`
//             });
//             document.getElementById("back").addEventListener("click",()=>{
//                 expand.style.display = "none";
//                 imgdiv.style.display = "none";
//                 imgdiv.innerHTML = "";
//                 controldiv.style.display = "none";
//                 controldiv.innerHTML = "";
//                 backdiv.style.display = "none";
//                 backdiv.innerHTML = "";
//             });
//         });
//     }
// }
