$(document).ready(function() {
  showCards();
  getHandFromQueryString();
});

var add = new Audio('sound/add.mp3');
var remove = new Audio('sound/remove.mp3');
var clear = new Audio('sound/clear.mp3');
var bonusOn = new Audio('sound/bonusOn.mp3');
var bonusOff = new Audio('sound/bonusOff.mp3');

var effect1IsHireActiveMap = {};
var effect1IsTrendActiveMap = {};
var effect2IsHireActiveMap = {};
var effect2IsTrendActiveMap = {};

function clearHand() {
  clear.play();
  hand.clear();
  showCards();
  updateHandView();
    
  effect1IsHireActiveMap = {};
  effect1IsTrendActiveMap = {};
  effect2IsHireActiveMap = {};
  effect2IsTrendActiveMap = {};
}

function addToHand(id) {
  var card = deck.getCardById(id);
  if (hand.addCard(card)) {
    add.play();
    updateEffectMapsOnAdd(card);
    updateHandView();
  }
}

function updateEffectMapsOnAdd(card) {
    effect1IsHireActiveMap[card.id] = false;
    effect1IsTrendActiveMap[card.id] = false;
    effect2IsHireActiveMap[card.id] = false;
    effect2IsTrendActiveMap[card.id] = false;
}

function updateEffectMapsOnRemove(cardId) {
    delete effect1IsHireActiveMap[cardId];
    delete effect1IsTrendActiveMap[cardId];
    delete effect2IsHireActiveMap[cardId];
    delete effect2IsTrendActiveMap[cardId];
}

function hire1(id, isHire) {
    if (isHire) {
        bonusOn.play();
    } else {
        bonusOff.play();
    }
    
    var card = hand.getCardById(id);
    effect1IsHireActiveMap[card.id] = isHire;
    updateHandView();
}

function trend1(id, isTrend) {
    if (isTrend) {
        bonusOn.play();
    } else {
        bonusOff.play();
    }
    
    var card = hand.getCardById(id);
    effect1IsTrendActiveMap[card.id] = isTrend;
    updateHandView();
}

function hire2(id, isHire) {
    if (isHire) {
        bonusOn.play();
    } else {
        bonusOff.play();
    }
    
    var card = hand.getCardById(id);
    effect2IsHireActiveMap[card.id] = isHire;
    updateHandView();
}

function trend2(id, isTrend) {
    if (isTrend) {
        bonusOn.play();
    } else {
        bonusOff.play();
    }
    
    var card = hand.getCardById(id);
    effect2IsTrendActiveMap[card.id] = isTrend;
    updateHandView();
}

function selectFromHand(id) {
  removeFromHand(id);
}

function removeFromHand(id) {
  remove.play();
  updateEffectMapsOnRemove(id);
  hand.deleteCardById(id);
  updateHandView();
}

function updateHandView() {
  var template = Handlebars.compile($("#hand-template").html());
  var score = hand.score(effect1IsHireActiveMap, effect1IsTrendActiveMap, effect2IsHireActiveMap, effect2IsTrendActiveMap);
  var html = template(hand);
  $('#hand').html(html);
    
    Object.keys(effect1IsHireActiveMap).forEach(function(id) {
        var button = document.getElementById('card-hire1-' + id);
        if (button) {
            var card = hand.getCardById(id);
            button.textContent = effect1IsHireActiveMap[card.id] ? 'Hired' : 'Not Hired';
            button.onclick = function(event) {
                event.stopPropagation();
                hire1(id, !effect1IsHireActiveMap[card.id]);
            };
        }
    });
    
    Object.keys(effect1IsTrendActiveMap).forEach(function(id) {
        var button = document.getElementById('card-trend1-' + id);
        if (button) {
            var card = hand.getCardById(id);
            button.textContent = effect1IsTrendActiveMap[card.id] ? 'Trending' : 'Not Trending';
            button.onclick = function(event) {
                event.stopPropagation();
                trend1(id, !effect1IsTrendActiveMap[card.id]);
            };
        }
    });
    
    Object.keys(effect2IsHireActiveMap).forEach(function(id) {
        var button = document.getElementById('card-hire2-' + id);
        if (button) {
            var card = hand.getCardById(id);
            button.textContent = effect2IsHireActiveMap[card.id] ? 'Hired' : 'Not Hired';
            button.onclick = function(event) {
                event.stopPropagation();
                hire2(id, !effect2IsHireActiveMap[card.id]);
            };
        }
    });
    
    Object.keys(effect2IsTrendActiveMap).forEach(function(id) {
        var button = document.getElementById('card-trend2-' + id);
        if (button) {
            var card = hand.getCardById(id);
            button.textContent = effect2IsTrendActiveMap[card.id] ? 'Trending' : 'Not Trending';
            button.onclick = function(event) {
                event.stopPropagation();
                trend2(id, !effect2IsTrendActiveMap[card.id]);
            };
        }
    });
    
  if (score >= 0) {
    $('#points').text(('000' + score).slice(-3));
  } else {
    $('#points').text('-' + ('000' + Math.abs(score)).slice(-3));
  }
  $('#cardCount').text(hand.size());
  $('#cardLimit').text(hand.limit());
  if (hand.size() > 0) {
    history.replaceState(null, null, "index.html?hand=" + hand.toString());
  } else {
    history.replaceState(null, null, "index.html");
  }
}

function getHandFromQueryString() {
  var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split('=');
    if (param[0] === 'hand') {
      hand.loadFromString(param[1]);
      updateHandView();
    }
  }
}

function showCards(suits) {
  var allCards = [];
  allCards = allCards.concat(deck.cards);
  allCards.sort((a, b) => a.name.localeCompare(b.name)); 

  var template = Handlebars.compile($("#cards-template").html());
  var html = template({ cards: allCards });
  $('#cards').html(html);
}

