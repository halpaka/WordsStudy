var choiceNum;
let QuestionList, ChoiceList;

//半角から全角に変換する関数
function htoZ(str) {
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

//正誤を判定する関数
function check(sentence, col) {
    var ans = window.prompt(sentence);
    if(ans == null) return true;
    if((ans.match(/[0-9]/g))||ans.match(/[０-９]/g)){
        if(ans.match(/[０-９]/g))ans = htoZ(ans);
        var answer = Number(ans);
        if(col == answer-1) return true;
        else return false;
    }
}

//選択肢をセットする関数
function setJP(len, sentence, que, ans){
    for(let i = 0; i < choiceNum; i++){
        let choiceString = "\n" + String(i + 1) + "." + ChoiceList[que[i]];
        sentence += choiceString;
    }
    let answer = check(sentence, ans);
    if(!answer){
        sentence = "";
        sentence += "正解は";
        sentence += "「" + ChoiceList[que[ans]] + "」\n";
        makeQuestion(len, sentence);
    }
}

function makeQuestion(len, sentence){

    //正解の選択肢を設定
    let ansNum = Math.floor(Math.random()*choiceNum);

    let questionNums = new Array(choiceNum);
    let questionCandidate, j, ansWord;
    for(let i = 0; i < choiceNum; i++){
        questionCandidate = Math.floor(Math.random()*len);
        //被ってないか探索
        for(j = 0; j < i; j++){
            if(questionNums[j] == questionCandidate) {
                i--;
                break;
            }
        }
        if(i == j){
            questionNums[i] = questionCandidate;
            if(i == ansNum) ansWord = questionCandidate;
        }
    }

    sentence += "【" + QuestionList[questionNums[ansNum]] + "】";
    setJP(len, sentence, questionNums, ansNum);
}

//起点
chrome.storage.local.get(["Questions", "Choices", "NumOfCho"], function(value){
    choiceNum = value.NumOfCho;
    QuestionList = value.Questions;
    ChoiceList = value.Choices;
    let len = QuestionList.length;
    if(len >= choiceNum){
        makeQuestion(len, "");
    }
});