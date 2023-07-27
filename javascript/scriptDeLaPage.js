async function recupApiJoke()
{
    const data = await fetch("https://v2.jokeapi.dev/joke/Any?lang=fr&amount=10");
    return await data.json();
}

function getRandomInt(numberMax)
{
    return Math.floor(Math.random()*numberMax);
}

function getDeleteArticleButton()
{
    const buttonObject = document.createElement('button');
    buttonObject.textContent = "effacer l'article";

    return buttonObject;
}
function getArticleJoke(jokeQuestion)
{
    const elementText = document.createElement("p");
    const elementBold = document.createElement("b");
    elementBold.textContent = jokeQuestion;
    elementText.appendChild(elementBold);
    return elementText;
}
function getArticleAnswer(jokeAnswer)
{
    const elementText = document.createElement('p');
    const elementSmall = document.createElement("small");
    elementSmall.textContent = jokeAnswer;
    elementText.appendChild(elementSmall);
    return elementText;
}
function getNewImgTag(src,name) {
    const newImage = document.createElement("img");
    newImage.src = src;
    newImage.alt = name;
    return newImage;
}
function createArticle(position, articleContent)
{
    if(articleContent.type !== "twopart") return ;

    const divTotal = document.createElement('div');
    position.appendChild(divTotal)


    divTotal.className="fondBleu";

    divTotal.appendChild(getArticleJoke(articleContent.setup))
    divTotal.appendChild(getArticleAnswer(articleContent.delivery))
    divTotal.appendChild(getDeleteArticleButton());

    return divTotal

}

function EcrireArticle(Database, IdStart)
{
    const feed = document.getElementById(IdStart);
    return Database.then( function(datas) {
        articleList = [];
        for(let i=0; i< datas.jokes.length; i++)
        {
            articleList.push(createArticle(feed, datas.jokes[i],i));
        }
        return articleList;
    });
}

function articlesIndex()
{
    return EcrireArticle(recupApiJoke(),"feed");
}

function removeFromArray(articles)
{
    // console.log(articles)
    articles.then( (datas) =>
        {
            datas.forEach((article) => { article.remove() })
        } 
    );
}

function actualiserArticle()
{
    removeFromArray(mesArticles);
    mesArticles = articlesIndex();
}

function headerMenuHover(hasToShow)
{
    const elementToShow = document.querySelector("div#header_links")
    if(hasToShow)
    {
        elementToShow.classList.remove("header_hidden")
    }
    else
    {
         elementToShow.classList.add("header_hidden")
    }
}

function getImgInformation(pokemonObject)
{
    const sprites = pokemonObject.sprites
    // console.log(pokemonObject);
    return {
        name: pokemonObject.name,
        normalMale: {
            front: sprites.front_default,
            back: sprites.back_default
        },
        normalFemale: {
            front: (sprites.back_female!==null?sprites.front_female:sprites.front_default) ,
            back: (sprites.back_female!==null?sprites.back_female:sprites.back_default)
        },
        shinyMale: {
            front: sprites.front_shiny,
            back: sprites.back_shiny
        },
        shinyFemale: {
            front: (sprites.front_shiny_female!== null? sprites.front_shiny_female : sprites.front_shiny),
            back: (sprites.back_shiny_female!== null? sprites.back_shiny_female : sprites.back_shiny)
        },
        type: {
            type1: pokemonObject.types[0].type.name,
            type2: (pokemonObject.types.length==2?pokemonObject.types[1].type.name:null)
        },
        htmlTag: null
    };
}

function createImgTag(href, name)
{
    const newTag = document.createElement("div");
    const imgFront = getNewImgTag(href.front,name);
    const imgBack = getNewImgTag(href.back,name);

    newTag.appendChild(imgFront);
    newTag.appendChild(imgBack);
    newTag.style.textAlign = "center";
    imgBack.className = "hidden";

    newTag.addEventListener("click", tag =>{
        const divToSwitch = tag.target.parentNode;
        const children = divToSwitch.children;
        children[0].classList.toggle("hidden");
        children[1].classList.toggle("hidden");
    })

    return newTag
}
function createImgCustomTag(href)
{
    const newTag = document.createElement("div");
    const img = getNewImgTag(href,"image personalisé");
    const deleteButton = document.createElement("button");

    newTag.appendChild(img);
    newTag.appendChild(deleteButton);

    newTag.className = "gallerie_imageDisplay_custom_img";
    newTag.style.textAlign = "center";
    newTag.style.marginBottom = "10px";
    
    deleteButton.textContent = "supprimé l'image";

    return newTag;
}

function getHtmlImgTag(data) {
    const isShiny = (getRandomInt(128)>=127);

    const imgSprite = {
        male : (isShiny?data.shinyMale:data.normalMale),
        female : (isShiny?data.shinyFemale:data.normalFemale)
    }

    const isMale = (getRandomInt(2)===0);
    // console.log(imgSprite);
    const tag = createImgTag((isMale?imgSprite.male:imgSprite.female),data.name);
    // console.log(tag);
    return tag;
}

function createImgAndHtml(data)
{
    // console.log(data);
    const parentTag = document.getElementById("imageGalerie");
    galleryImage = [];

    Promise.all( data.map(pokemon => fetch(pokemon.url))).then( arrayPokemon =>
    {
        cleanHTML(parentTag);
        arrayPokemon.forEach(pokemonResponse =>
        {
            pokemonResponse.json().then(pokemon =>
            {
                const pokeData = getImgInformation(pokemon);
                // console.log(pokeData);
                pokeData.htmlTag = getHtmlImgTag(pokeData);
                parentTag.appendChild(pokeData.htmlTag);
                galleryImage.push(pokeData.htmlTag);
            });
        });
    });
}

function cleanHTML(htmlTag)
{
    let child = htmlTag.firstElementChild;
    while(child!==null)
    {
        htmlTag.removeChild(child);
        child = htmlTag.firstElementChild;
    }
}
function getImgList(){
    const imgURL = "https://pokeapi.co/api/v2/pokemon/";
    fetch(imgURL).then(
        rawData => rawData.json()
    ).then(
        json => json.results
    ).then(
        dataArray => {
            createImgAndHtml(dataArray);
        }
    );
}

function setModeViewMosaic()
{
    const viewDiv = document.querySelector("div#imageGalerie");
    viewDiv.className = "gallerie_imageDisplay_mosaic";
}
function setModeViewColumn()
{
    const viewDiv = document.querySelector("div#imageGalerie");
    viewDiv.className = "gallerie_imageDisplay_column";
}

//header informations
function onArticleAdd(formTag){
    const formContent = document.getElementsByClassName(formTag)[0];

    const formParameter = formContent.children

    let articleTitle = formParameter[0];
    let articleContent = formParameter[2];

    articleTitle = articleTitle.children[1];
    articleContent = articleContent.children[1];
/*
    articleTitle = articleTitle.value;
    articleContent = articleContent.value;
*/
    const positionToInsert = document.getElementById("feed");
    articleList.push(createArticle(positionToInsert,{type:"twopart", setup:articleTitle.value, delivery: articleContent.value}));
    
    articleTitle.value = "";
    articleContent.value = "";
}

function onGaleryAdd()
{
    const formElement = document.querySelector("div.gallerie_imageDisplay_centered form");
    formElement.classList.toggle("hidden")
}
function onImgFormSent(event)
{
    event.preventDefault();
    const imgLinktag = document.querySelector("div.gallerie_imageDisplay_centered form label input");
    const imgLink = imgLinktag.value;
    const urlLinkFormat = /^https?:\/\/www./;
    if(imgLink.match(urlLinkFormat))
    {
        const newImgTag=createImgCustomTag(imgLink);
        const tagParent = document.getElementById("imageGalerie");
        tagParent.appendChild(newImgTag);
        imgLinktag.placeholder = ""
        galleryImage.push(newImgTag);
    }
    else
    {
        imgLinktag.placeholder = "Entrez une URL correct!";
    }
    imgLinktag.value = "";
}
function onCarrouselAnimationEnd(divParent, turnLeft){
    const balisteToChange = (turnLeft?divParent.lastElementChild:divParent.firstElementChild);
    divParent.removeChild(balisteToChange);
    if(turnLeft)
    {
        divParent.prepend(balisteToChange);
    }
    else
    {
        divParent.appendChild(balisteToChange);
    }
}
function onCarrouselChange(turnLeft, informationData, automaticCall=false)
{
    if(automaticCall && informationData.callToIgnore)
    {
        informationData.callToIgnore = false;
        return ;
    }
    else if (!automaticCall)
    {
        informationData.callToIgnore = true;
    }
    informationData.position += (turnLeft?1:-1);
    const childrens = informationData.parent.children;
    let finalAnimation;
    for(let i=0;i<childrens.length;i++)
    {
        finalAnimation = childrens[i].animate([
            { transform: `translateX(${turnLeft?'+':'-'}180px)`}
        ],{
            duration: 1000,
            iterations: 1
        });
    }
    finalAnimation.addEventListener("finish", (event) => onCarrouselAnimationEnd(informationData.parent, turnLeft));

}

window.addEventListener("DOMContentLoaded", (event)=> {
    const el = document.getElementById("dynamicMenue");
    el.addEventListener("mouseover", (el) => headerMenuHover(true));
    el.addEventListener('mouseout', (el) => headerMenuHover(false));
});

function setGaleryListener(){
    const buttonViewModeMosaic = document.querySelector("img.gallerie_imageDisplay_imgPresentation_1");
    buttonViewModeMosaic.addEventListener("click", setModeViewMosaic);
    
    const buttonViewModeColumn = document.querySelector("img.gallerie_imageDisplay_imgPresentation_2");
    buttonViewModeColumn.addEventListener("click", setModeViewColumn);
    
    const buttonAddImg = document.querySelector("img#imgPlus");
    buttonAddImg.addEventListener("click", onGaleryAdd);

    const formSubmit = document.querySelector("form.hidden button");
    formSubmit.addEventListener("click", onImgFormSent);

    const listCarrousselButton = document.querySelectorAll("div.gallerie_carrouselPadding_buttons button");
    const dataToCarroussel = {
        parent: document.querySelector("div.gallerie_carrouselPadding_img"),
        callToIgnore: false,
        position: 0
    }
    listCarrousselButton[0].addEventListener("click", ()=> onCarrouselChange(true, dataToCarroussel));
    listCarrousselButton[1].addEventListener("click", ()=> onCarrouselChange(false, dataToCarroussel));
    setInterval(onCarrouselChange, 3000, false, dataToCarroussel, true);
}
function createCarrouselImg(imgArray, parentElement)
{
    imgArray.forEach( (img)=> {
        const newImage = getNewImgTag(img.image, img.alt);
        parentElement.appendChild(newImage);
    })
}
function initCaroussel()
{
    const apiImgLink = "https://www.digi-api.com/api/v1/digimon?pageSize=20";
    
    const elementParent = document.querySelector("div.gallerie_carrouselPadding_img")
    cleanHTML(elementParent);

    fetch(apiImgLink).then(
        (element) => element.json()
    ).then(
        (dataArray) => createCarrouselImg(dataArray.content, elementParent)
    )
}