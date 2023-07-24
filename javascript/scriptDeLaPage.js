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


window.addEventListener("DOMContentLoaded", (event)=> {
    const el = document.getElementById("dynamicMenue");
    el.addEventListener("mouseover", (el) => headerMenuHover(true));
    el.addEventListener('mouseout', (el) => headerMenuHover(false));
});