var dealerSum = 0;
var playerSum = 0;

var hasStood = false;

var dealerAceCount = 0;
var playerAceCount = 0;

var hidden;
var deck;

var canHit = true;
var splitted = false;
var canSplit = true;
//--------------------------------------------------------------------------------------------------
window.onload = function () {
  buildDeck();
  shuffleDeck();
  startBlackjack();
  checksplit();
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
  document.getElementById("split").addEventListener("click", split);
};
//--------------------------------------------------------------------------------------------------
function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}
//--------------------------------------------------------------------------------------------------
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  //console.log(deck);
}
//--------------------------------------------------------------------------------------------------
function startBlackjack() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  document.getElementById("dealerCards").append(cardImg);
  document.getElementById("dealerSum").innerText =
    (dealerSum - getValue(hidden)).toString() + " + Unknown";

  let playerCards = [];
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerCards.push(card);
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("playerCards").append(cardImg);
  }

  // Check if the player has been dealt two aces with a total greater than 21
  if (playerCards.length === 2 && playerAceCount === 2 && playerSum > 21) {
    playerSum -= 10; // Reduce the total by 10 to account for one ace being counted as 11
    playerAceCount--;
  }

  document.getElementById("playerSum").innerText = playerSum;
}
//--------------------------------------------------------------------------------------------------
function checksplit() {
  //pulling the card value directly from the html cause checkvalue uses the src already so id have to pull that anyway
  let first_value = playerCards.childNodes[0].src.split("cards/")[1].split("-")[0]
  let second_value = playerCards.childNodes[1].src.split("cards/")[1].split("-")[0]
  if (isNaN(first_value)) {
    if (first_value == "A") {
      first_value = 11;
    } else {
      first_value = 10;
    }
  }
  if (isNaN(second_value)) {
    if (second_value == "A") {
      second_value = 11;
    } else {
      second_value = 10;
    }
  }
  if(first_value == second_value){
    document.getElementById("split").style.display = "inline-block";
  } else {
    document.getElementById("split").style.display = "none";
  }
}
//--------------------------------------------------------------------------------------------------
function hit() {
  if (!canHit) {
    return;
  }
  if (!splitted) {
    canSplit = false;
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("playerCards").append(cardImg);

    if (playerSum > 21 && playerAceCount > 0) {
      playerSum = reduceAce(playerSum, playerAceCount);
      playerAceCount--;
    }

    if (playerSum > 21) {
      stand();
    }

    document.getElementById("playerSum").innerText = playerSum;
  } else {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerAceCount1 += checkAce(card);
    document.getElementById("hand1").append(cardImg);

    cardImg = document.createElement("img");
    card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerAceCount2 += checkAce(card);
    document.getElementById("hand2").append(cardImg);
    splitaces()
    splitsum()

    if (playerSum > 21) {
      stand();
    }

  }
}
//--------------------------------------------------------------------------------------------------
function stand() {
  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  let message = "";
  if (playerSum > 21) {
    message = "You Lose, you went bust.";
  } else {
    while (dealerSum < 17 || (dealerSum === 17 && dealerAceCount > 0)) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "./cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      if (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        dealerAceCount--;
      }
      document.getElementById("dealerCards").append(cardImg);
    }

    if (dealerSum > 21) {
      message = "You Win, the dealer went bust and you didn't.";
      playWin();
    } else if (playerSum == dealerSum) {
      message = "Dealer Wins, you tied!";
    } else if (playerSum > dealerSum) {
      message = "You win, you got more than the dealer.";
      playWin();
    } else if (playerSum < dealerSum) {
      message = "You Lose, the dealer got more than you.";
    }
  }

  if (!hasStood) {
    document.getElementById("dealerSum").innerText = dealerSum;
    document.getElementById("results").innerText = message;
    container = document.getElementById("refreshContainer");
    var retryButton = document.createElement("button");
    retryButton.innerText = "Retry";
    retryButton.className = "button";
    retryButton.addEventListener("click", refresh);
    container.appendChild(retryButton);
  }
  hasStood = true;
}

//--------------------------------------------------------------------------------------------------
function split(){
  playerAceCount = 0
  playerAceCount1 = 0
  playerAceCount2 = 0
  splitted = true
  playerSum = 0;
  document.getElementById("split").style.display = "none";
  
  list1 = document.createElement("div");
  list1.className = "cards";
  list1.id = "hand1";
  list2 = document.createElement("div");
  list2.className = "cards";
  list2.id = "hand2";
  document.getElementById("player").append(list1)
  document.getElementById("player").append(list2)

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  document.getElementById("playerCards").append(cardImg);

  cardImg = document.createElement("img");
  cardImg.src = document.getElementById("playerCards").childNodes[0].src;
  document.getElementById("playerCards").append(cardImg);
  document.getElementById("playerCards").removeChild(document.getElementById("playerCards").childNodes[0])

  cardImg = document.createElement("img");
  card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  document.getElementById("playerCards").append(cardImg);

  document.getElementById("hand2").append(document.getElementById("playerCards").childNodes[0]);
  document.getElementById("hand2").append(document.getElementById("playerCards").childNodes[0]);
  document.getElementById("hand1").append(document.getElementById("playerCards").childNodes[0]);
  document.getElementById("hand1").append(document.getElementById("playerCards").childNodes[0]);
  document.getElementById("playerCards").remove();
  splitaces()
  splitsum()
  document.getElementById("playerSum").innerText = playerSum;
}
//--------------------------------------------------------------------------------------------------
function splitsum(){
  sum1 = 0
  sum2 = 0
  for(let i = 0;i < document.getElementById("hand1").childElementCount ;i++){
    let j = document.getElementById("hand1").childNodes[i].src.split("cards/")[1].split("-")[0]
    if (isNaN(j)) {
      if (j == "A") {
        j = 11;
      } else {
        j = 10;
      }
    }
    sum1+= parseInt(j)
  }

  for(let i = 0;i < document.getElementById("hand2").childElementCount ;i++){
    let j = document.getElementById("hand2").childNodes[i].src.split("cards/")[1].split("-")[0]
    if (isNaN(j)) {
      if (j == "A") {
        j = 11;
      } else {
        j = 10;
      }
    }
    sum2+= parseInt(j)
  }
  if (sum1 > 21 && playerAceCount1 > 0) {
    sum1-=10;
    playerAceCount1-=1;
  }
  if (sum2 > 21 && playerAceCount2 > 0) {
    sum2-=10;
    playerAceCount2-=1
  }
  if (sum1 > sum2) {
    playerSum = sum1;
  } else {
    playerSum = sum2;
  }
  
  document.getElementById("playerSum").innerText = playerSum;
}
//--------------------------------------------------------------------------------------------------
function splitaces() {
  playerAceCount1 = 0
  playerAceCount2 = 0
  for(let i = 0;i < document.getElementById("hand2").childElementCount;i++){
    if(document.getElementById("hand2").childNodes[i].src.split("cards/")[1].split("-")[0] == "A"){
      playerAceCount1 +=1
      console.log(document.getElementById("hand2").childNodes[i].src.split("cards/")[1].split("-")[0])
    }
  }
  for(let i = 0;i < document.getElementById("hand1").childElementCount;i++){
    if(document.getElementById("hand1").childNodes[i].src.split("cards/")[1].split("-")[0] == "A"){
      playerAceCount2 +=1
    }
  }
}

//--------------------------------------------------------------------------------------------------
function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}
//--------------------------------------------------------------------------------------------------
function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}
//--------------------------------------------------------------------------------------------------
function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
//--------------------------------------------------------------------------------------------------
function refresh() {
  location.reload();
}
//--------------------------------------------------------------------------------------------------

function playWin() {
  var audio = new Audio("audio_file.mp3");
  audio.play();
}
