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
    const elementToShow = document.getElementById("header_links");
    if(hasToShow)
    {
        elementToShow.classList.toggle("header_hidden")
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
    const imgFront = document.createElement("img");
    const imgBack = document.createElement("img");

    newTag.appendChild(imgFront);
    newTag.appendChild(imgBack);
    imgFront.src = href.front;
    imgFront.alt = name;
    imgBack.src = href.back;
    imgBack.alt = name;
    imgBack.className = "hidden";

    newTag.addEventListener("click", tag =>{
        const divToSwitch = tag.target.parentNode;
        const children = divToSwitch.children;
        children[0].classList.toggle("hidden");
        children[1].classList.toggle("hidden");
    })

    return newTag
}

function getHTMLTag(data) {
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
                pokeData.htmlTag = getHTMLTag(pokeData);
                parentTag.appendChild(pokeData.htmlTag);
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
async function getImgList(){
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

//header informationS
window.addEventListener("DOMContentLoaded", (event)=> {
    const el = document.getElementById("dynamicMenue");
    el.addEventListener("mouseover", (el) => headerMenuHover(true));
    el.addEventListener('mouseout', (el) => headerMenuHover(false));
});

function setGaleryListener(){
    const buttonViewModeMosaic = document.querySelector("img.gallerie_imageDisplay_imgPresentation_1");
    const buttonViewModeColumn = document.querySelector("img.gallerie_imageDisplay_imgPresentation_2");
    buttonViewModeMosaic.addEventListener("click", setModeViewMosaic);
    buttonViewModeColumn.addEventListener("click", setModeViewColumn);
}