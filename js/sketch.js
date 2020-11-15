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
        console.log(`Retrieved ${record.fields.short_name}`, record.id, record);

        //show header cover image 0
        let coverImg0 = document.getElementsByClassName("cover-img")[0];
        let img0 = document.createElement("img");
        img0.classList.add("zoom-in");
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
            img1.classList.add("zoom-in", "cover");
            let videoWrapper = document.createElement("div");
            videoWrapper.classList.add("video-wrapper");
            videoWrapper.innerHTML = record.fields.video;
            coverImg1.appendChild(videoWrapper);
        } else {
            console.log("no video");
            img1.classList.add("zoom-in");
        }

        //show info tag
        let infoTag = document.getElementsByClassName("info-tag")[0];
        infoTag.innerHTML = record.fields.info_tag;

        //show project image 0
        let descriptionText0 = document.getElementsByClassName("description-text")[0];
        descriptionText0.innerHTML = record.fields.description_0;
        base('detail').find(record.fields.images[0], function(err, record){
            let detailTextHidden0 = document.getElementsByClassName("detail-text-hidden")[0];
            let detailImgWrapper0 = document.getElementsByClassName("detail-img-wrapper")[0];
            detailTextHidden0.innerHTML = record.fields.detail_text;
            detailImgWrapper0.innerHTML = `<img class="zoom-in" src="${record.fields.detail_images[0].url}" alt="${record.fields.detail_images[0].filename},${record.fields.detail_images[0].id}" />`
        });
        //show project image 1
        let descriptionText1 = document.getElementsByClassName("description-text")[1];
        descriptionText1.innerHTML = record.fields.description_1;
        base('detail').find(record.fields.images[1], function(err, record){
            let detailTextHidden1 = document.getElementsByClassName("detail-text-hidden")[1];
            let detailImgWrapper1 = document.getElementsByClassName("detail-img-wrapper")[1];
            detailTextHidden1.innerHTML = record.fields.detail_text;
            detailImgWrapper1.innerHTML = `<img class="zoom-in" src="${record.fields.detail_images[0].url}" alt="${record.fields.detail_images[0].filename},${record.fields.detail_images[0].id}" />`
        });

        //show other project images
        let otherProjectImg = document.getElementsByClassName("project-img")[2];
        let detailOtherImages = record.fields.other_images;
        detailOtherImages.forEach(eachRecordId =>{
            base('detail').find(eachRecordId, function(err, record){
                console.log(record, record.fields.index);
                let detailOtherWrapper = document.createElement("div");
                detailOtherWrapper.classList.add("detail-wrapper");
                let detailOtherTextHidden = document.createElement("div");
                detailOtherTextHidden.classList.add("detail-text-hidden");
                let detailOtherImgWrapper = document.createElement("div");
                detailOtherImgWrapper.classList.add("detail-img-wrapper");
                detailOtherTextHidden.innerHTML = record.fields.detail_text;
                let detailOtherImg = document.createElement("img");
                detailOtherImg.src = record.fields.detail_images[0].url;
                detailOtherImg.alt = `${record.fields.detail_images[0].filename},${record.fields.detail_images[0].id}`;
                detailOtherImg.classList.add("zoom-in");
                detailOtherImgWrapper.appendChild(detailOtherImg);
                detailOtherWrapper.appendChild(detailOtherTextHidden);
                detailOtherWrapper.appendChild(detailOtherImgWrapper);
                otherProjectImg.appendChild(detailOtherWrapper);
            });
        });
    });
}