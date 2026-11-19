const favorites =
JSON.parse(
    localStorage.getItem("favorites")
) || [];

const sections = {
    "Anatomia": "anatomia-cards",
    "Morfologia": "morfologia-cards",
    "Materiais": "materiais-cards",
    "Histologia": "histologia-cards",
    "Fisiologia": "fisiologia-cards",
    "Bioquímica": "bioquimica-cards",
    "Saúde Coletiva": "saude-cards"
};

function renderCards(cards = flashcards){

    Object.values(sections).forEach(id => {

        const container =
        document.getElementById(id);

        if(container){
            container.innerHTML = "";
        }

    });

    cards.forEach(card => {

        const container =
        document.getElementById(
            sections[card.materia]
        );

        if(!container) return;

        const div =
        document.createElement("div");

        div.classList.add("flashcard");

        div.innerHTML = `
            <button
                class="favorite-btn"
                onclick="toggleFavorite(${card.id})"
            >
                ${
                    favorites.includes(card.id)
                        ? "⭐"
                        : "☆"
                }
            </button>

            <h3>${card.pergunta}</h3>

            <button
                class="answer-btn"
                onclick="toggleAnswer(${card.id})"
            >
                Ver Resposta
            </button>

            <p
                id="answer-${card.id}"
                style="display:none"
            >
                ${card.resposta}
            </p>
        `;

        container.appendChild(div);

    });

    renderFavorites();
}

function toggleAnswer(id){

    const answer =
    document.getElementById(
        `answer-${id}`
    );

    if(!answer) return;

    answer.style.display =
        answer.style.display === "none"
            ? "block"
            : "none";
}

function toggleFavorite(id){

    const index =
    favorites.indexOf(id);

    if(index > -1){

        favorites.splice(index,1);

    }else{

        favorites.push(id);

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderCards();
}

function renderFavorites(){

    const container =
    document.getElementById(
        "favoritos-cards"
    );

    if(!container) return;

    container.innerHTML = "";

    const favoritos =
    flashcards.filter(card =>
        favorites.includes(card.id)
    );

    const aviso =
    document.getElementById(
        "semFavoritos"
    );

    if(favoritos.length === 0){

        if(aviso){
            aviso.style.display = "block";
        }

        return;
    }

    if(aviso){
        aviso.style.display = "none";
    }

    favoritos.forEach(card => {

        const div =
        document.createElement("div");

        div.classList.add("flashcard");

        div.innerHTML = `
            <button
                class="favorite-btn"
                onclick="toggleFavorite(${card.id})"
            >
                ⭐
            </button>

            <h3>${card.pergunta}</h3>

            <p>${card.resposta}</p>
        `;

        container.appendChild(div);

    });

}

const searchInput =
document.getElementById(
    "searchInput"
);

if(searchInput){

    searchInput.addEventListener(
        "input",
        function(e){

            const term =
            e.target.value
                .toLowerCase();

            const filtered =
            flashcards.filter(card =>

                card.pergunta
                .toLowerCase()
                .includes(term)

                ||

                card.resposta
                .toLowerCase()
                .includes(term)

                ||

                card.materia
                .toLowerCase()
                .includes(term)
            );

            renderCards(filtered);

        }
    );

}

const randomBtn =
document.getElementById(
    "randomBtn"
);

if(randomBtn){

    randomBtn.addEventListener(
        "click",
        () => {

            const randomIndex =
            Math.floor(
                Math.random() *
                flashcards.length
            );

            const card =
            flashcards[randomIndex];

            alert(
                `📚 ${card.materia}

${card.pergunta}

✅ ${card.resposta}`
            );

        }
    );

}

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;

const quizModal =
document.getElementById(
    "quizModal"
);

const quizQuestion =
document.getElementById(
    "quizQuestion"
);

const quizOptions =
document.getElementById(
    "quizOptions"
);

const quizInfo =
document.getElementById(
    "quizInfo"
);

function shuffle(array){

    return [...array]
    .sort(
        () => Math.random() - 0.5
    );
}

function startQuiz(){

    quizQuestions =
    shuffle(flashcards)
    .slice(0,10);

    currentQuestion = 0;
    score = 0;

    quizModal.style.display =
    "flex";

    loadQuestion();
}

function loadQuestion(){

    const card =
    quizQuestions[currentQuestion];

    quizInfo.innerHTML =
    `Questão ${currentQuestion + 1}
     de 10`;

    quizQuestion.innerHTML =
    card.pergunta;

    quizOptions.innerHTML = "";

    const respostas =
    [card.resposta];

    while(
        respostas.length < 4
    ){

        const random =
        flashcards[
            Math.floor(
                Math.random() *
                flashcards.length
            )
        ].resposta;

        if(
            !respostas.includes(
                random
            )
        ){

            respostas.push(
                random
            );

        }
    }

    shuffle(respostas)
    .forEach(resposta => {

        const btn =
        document.createElement(
            "button"
        );

        btn.classList.add(
            "quiz-option"
        );

        btn.textContent =
        resposta;

        btn.onclick = () =>
        answerQuestion(
            resposta,
            card.resposta,
            btn
        );

        quizOptions.appendChild(
            btn
        );

    });
}

function answerQuestion(

    selected,

    correct,

    button

){

    document
    .querySelectorAll(
        ".quiz-option"
    )
    .forEach(btn => {

        btn.disabled = true;

        if(
            btn.textContent ===
            correct
        ){

            btn.classList.add(
                "correct"
            );
        }

    });

    if(
        selected === correct
    ){

        score++;

    }
    else{

        button.classList.add(
            "wrong"
        );
    }

}

document
.getElementById(
    "nextQuestionBtn"
)
.addEventListener(
    "click",
    () => {

        currentQuestion++;

        if(
            currentQuestion >=
            quizQuestions.length
        ){

            const porcentagem =
            Math.round(
                score * 10
            );

            quizQuestion.innerHTML =
            `
            🎉 Simulado Finalizado

            <br><br>

            Acertos:
            ${score}/10

            <br><br>

            Aproveitamento:
            ${porcentagem}%
            `;

            quizOptions.innerHTML =
            "";

            quizInfo.innerHTML =
            "";

            return;
        }

        loadQuestion();
    }
);

document
.getElementById(
    "closeQuizBtn"
)
.addEventListener(
    "click",
    () => {

        quizModal.style.display =
        "none";

    }
);

document
.getElementById(
    "quizBtn"
)
.addEventListener(
    "click",
    startQuiz
);

const btnTopo =
document.getElementById(
    "btnTopo"
);

if(btnTopo){

    btnTopo.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}

renderCards();

function updateBackground(section){

    console.log("Tema:", section);

    if(themeColors[section]){

        document.body.style.background =
        themeColors[section];

        document.querySelector(".hero").style.background =
        themeColors[section];

    }

}

document
.querySelectorAll(".menu-fixo a")
.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            const section =
            link
            .getAttribute("href")
            .replace("#","");

            updateBackground(section);

        }
    );

});

updateBackground("anatomia");
