function recupApiJoke()
{
    return fetch("https://v2.jokeapi.dev/joke/Any?lang=fr&amount=10");
}

console.log(recupApiJoke())