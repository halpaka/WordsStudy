let QuestionList, ChoiceList;
let deleteButton = '<td class="buttonCol"><button class="delete"><img src="/img/ごみ箱のフリーアイコン.png" width="16" height="16"></button></td>'
let returnButton = '<td class="buttonCol"><button class="return"><img src="/img/Uターン矢印 1.png" width="16" height="16"></button></td>'

//登録済みの単語をセットする用の表を作成する関数
function setTable(len){
    let input_data, parent;
    for(let i = 0; i < len; i++){
        input_data = document.createElement('tr');
        input_data.className = "words"
        input_data.innerHTML = '<td class="Question"></td> <td class="Choice"></td>'+deleteButton;
        parent = document.getElementById('registerArea');
        parent.appendChild(input_data);
    }
}

//登録済みの単語を表ににセットする関数
function setWord(len){
    let Form, QuestionWord, ChoiceWord;

    Form = document.getElementsByClassName('words');
    for(let i = 0; i < len; i++){
        QuestionWord = Form[i].getElementsByClassName('Question');
        ChoiceWord = Form[i].getElementsByClassName('Choice');

        QuestionWord[0].textContent = QuestionList[i];
        ChoiceWord[0].textContent = ChoiceList[i];
    }
}

//表をロードする関数
function loadTable(){
    chrome.storage.local.get(["Questions", "Choices", "NumOfCho"], function(value){
        choiceNum = value.NumOfCho;
        QuestionList = value.Questions || [];
        ChoiceList = value.Choices || [];
        let len = QuestionList.length;

        let numRange = document.getElementById('numChoice');
        numRange.value = choiceNum;
        setTable(len);
        setWord(len);
    });
    
}

//選択肢数が範囲外であった時の処理
function checkValue(input) {
    let numRange = document.getElementById('numChoice');
    let maxValue = parseFloat(numRange.max);
    let minValue = parseFloat(numRange.min);
    if (input > maxValue) {
        input = maxValue;
    }
    else if (input < minValue) {
        input = minValue;
    }

    return input;
}

window.onload = loadTable;

//追加ボタンで単語を登録する
document.getElementById('add').addEventListener('click', () => {
    let addQuestion = document.getElementById('questionForm').value;
    let addChoice = document.getElementById('choiceForm').value;
    if((addQuestion != "") && (addChoice != "")){
        let input_data = document.createElement('tr');
        input_data.className = "words"
        input_data.innerHTML = '<td class="Question">'+addQuestion+'</td> <td class="Choice">'+addChoice+'</td>'+deleteButton;
        let parent = document.getElementById('registerArea');
        parent.appendChild(input_data);
        document.getElementById('questionForm').value = "";
        document.getElementById('choiceForm').value = "";
    }
});

//保存ボタンで単語を登録する
document.getElementById('save').addEventListener('click', () => {
    let NumChoicesForm = document.getElementById('numChoice');
    let NumberOfChoices = checkValue(parseInt(NumChoicesForm.value));

    chrome.storage.local.set({["NumOfCho"]: NumberOfChoices});

    let registerTable = document.getElementById('registerTable');
    let wordsList = registerTable.getElementsByClassName('words');
    let formLen = wordsList.length;
    let QuestionWord,ChoiceWord;

    let saveQuestions = [];
    let saveChoices = [];

    for(let i = 0; i < formLen; i++){
        QuestionWord = wordsList[i].getElementsByClassName('Question');
        ChoiceWord = wordsList[i].getElementsByClassName('Choice');

        if((QuestionWord[0].textContent != "") && (ChoiceWord[0].textContent != "")){
            saveQuestions.push(QuestionWord[0].textContent);
            saveChoices.push(ChoiceWord[0].textContent);
        }
    }

    chrome.storage.local.set({["Questions"]: saveQuestions});
    chrome.storage.local.set({["Choices"]: saveChoices});

    let date = new Date();
    let saveDate = "Saved on "+('0' + (date.getMonth() + 1)).slice(-2)+"/"+('0' + date.getDate()).slice(-2)+" "+('0' + date.getHours()).slice(-2)+":"+('0' + date.getMinutes()).slice(-2);

    let saveDateArea = document.getElementById('saveDate');
    saveDateArea.innerHTML = saveDate;
});


//表の要素を削除表に移す
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete') || event.target.closest('.delete')) {
        let buttonElement = event.target.closest('td');
        let lineElement = buttonElement.closest('tr');
        let transQuestion = lineElement.getElementsByClassName('Question')[0].textContent;
        let transChoice = lineElement.getElementsByClassName('Choice')[0].textContent;
        buttonElement.remove();
        lineElement.innerHTML += returnButton;
        lineElement.getElementsByClassName('Question')[0].textContent = transQuestion;
        lineElement.getElementsByClassName('Choice')[0].textContent = transChoice;
        let parent = document.getElementById('deleteArea');
        parent.appendChild(lineElement);
    }
});

//削除表の要素を表に移す
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('return') || event.target.closest('.return')) {
        let buttonElement = event.target.closest('td');
        let lineElement = buttonElement.closest('tr');
        let transQuestion = lineElement.getElementsByClassName('Question')[0].textContent;
        let transChoice = lineElement.getElementsByClassName('Choice')[0].textContent;
        buttonElement.remove();
        lineElement.innerHTML += deleteButton;
        lineElement.getElementsByClassName('Question')[0].textContent = transQuestion;
        lineElement.getElementsByClassName('Choice')[0].textContent = transChoice;
        let parent = document.getElementById('registerArea');
        parent.appendChild(lineElement);
    }
});