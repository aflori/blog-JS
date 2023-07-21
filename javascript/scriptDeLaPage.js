function recupApiJoke()
{
    return fetch("https://v2.jokeapi.dev/joke/Any?lang=fr&amount=10").then((data) => data.json());
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
    divTotal.id = "feedArticle";
    // console.log(articleContent)

    divTotal.appendChild(getArticleJoke(articleContent.setup))
    divTotal.appendChild(getArticleAnswer(articleContent.delivery))
    divTotal.appendChild(getDeleteArticleButton());

}

function EcrireArticle(Database, IdStart)
{
    const feed = document.getElementById(IdStart);
    Database.then( function(datas) {
        datas.jokes.forEach((jokesData) =>
            createArticle(feed, jokesData)
        );
    });
}

function articlesIndex()
{
    EcrireArticle(recupApiJoke(),"feed");
}