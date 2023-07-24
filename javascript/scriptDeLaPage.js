async function recupApiJoke()
{
    const data = await fetch("https://v2.jokeapi.dev/joke/Any?lang=fr&amount=10");
    return await data.json();
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
    console.log(articles)
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
        }
    };
}
function initImgTab(data){
    // console.log(data);
    data.forEach((pokemon)=>{
        fetch(pokemon.url).then(
            rawData => rawData.json()
        ).then(
            pokemonData => galleryImage.push(getImgInformation(pokemonData))
        )
    })
    console.log(galleryImage);
}
async function getImgList(){
    const imgURL = "https://pokeapi.co/api/v2/pokemon/";
    fetch(imgURL).then(
        rawData => rawData.json()
    ).then(
        json => json.results
    ).then(
        dataArray => initImgTab(dataArray)
    )
}

window.addEventListener("DOMContentLoaded", (event)=> {
    const el = document.getElementById("dynamicMenue");
    el.addEventListener("mouseover", (el) => headerMenuHover(true));
    el.addEventListener('mouseout', (el) => headerMenuHover(false));
});

