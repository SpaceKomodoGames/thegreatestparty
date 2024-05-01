class Hand {

  constructor() {
    this.cardsInHand = {};
  }

  addCard(card) {
    if (this._canAdd(card)) {
      this.cardsInHand[card.id] = new CardInHand(card);
      return true;
    }
    return false;
  }

  _canAdd(newCard) {
    if (this.cardsInHand[newCard.id] !== undefined) {
      return false;
    } else if (this.size() < 7) {
      return true;
    } else {
      return false;
    }
  }

  deleteCardById(id) {
    delete this.cardsInHand[id];
  }

  getCardById(id) {
    return this.cardsInHand[id];
  }

  contains(cardName) {
    for (const card of this.nonBlankedCards()) {
      if (card.name === cardName) {
        return true;
      }
    }
    return false;
  }

  containsId(cardId) {
    return this.cardsInHand[cardId] !== undefined && !this.cardsInHand[cardId].blanked;
  }

  containsSpecialty(specialtyName) {
    for (const card of this.nonBlankedCards()) {
      if (card.specialty === specialtyName) {
        return true;
      }
    }
    return false;  
  }
    
  containsSpecialtyExcluding(specialtyName, excludingCardId) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.specialty === specialtyName && card.id !== excludingCardId) {
        return true;
      }
    }
    return false;
  }
    
  countSpecialty(specialtyName) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.specialty === specialtyName) {
        count++;
      }
    }
    return count;
  }
    
  countSpecialtyExcluding(specialtyName, excludingCardId) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.specialty === specialtyName && card.id !== excludingCardId) {
        count++;
      }
    }
    return count;
  }

  containsUniverseExcluding(universeName, excludingCardId) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.universe === universeName && card.id !== excludingCardId) {
        return true;
      }
    }
    return false;
  }
    
  containsUniverse(universeName) {
    for (const card of this.nonBlankedCards()) {
      if (card.universe === universeName) {
        return true;
      }
    }
    return false;  
  }
    
  countUniverse(universeName) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.universe === universeName) {
        count++;
      }
    }
    return count;
  }
    
  countUniverseExcluding(universeName, excludingCardId) {
    var count = 0;
    for (const card of this.nonBlankedCards()) {
      if (card.universe === universeName && card.id !== excludingCardId) {
        count++;
      }
    }
    return count;
  }

  nonBlankedCards() {
    return this.cards().filter(function(card) {
      return !card.blanked;
    });
  }

  cards() {
    return Object.values(this.cardsInHand);
  }

  cardNames() {
    return this.cards().map(function(card) {
      return card.name;
    });
  }

  updateMaps(hire1Map, trend1Map, hire2Map, trend2Map) {
    for (const card of this.nonBlankedCards()) {
      card.effect1IsHireActive = hire1Map[card.id];
      card.effect1IsTrendActive = trend1Map[card.id];
      card.effect2IsHireActive = hire2Map[card.id];
      card.effect2IsTrendActive = trend2Map[card.id];
    } 
  }
    
  score(hire1Map, trend1Map, hire2Map, trend2Map) {
    var score = 0;
    this._resetHand();
    this.updateMaps(hire1Map, trend1Map, hire2Map, trend2Map);
    for (const card of this.nonBlankedCards()) {
      score += card.score(this);
    }
    return score;
  }

  _resetHand() {
    for (const card of this.cards()) {
      this.cardsInHand[card.id] = new CardInHand(card.card, card.actionData);
    }
  }

  clear() {
    this.cardsInHand = {};
  }

  size() {
    return Object.keys(this.cardsInHand).length;
  }

  limit() {
    return 7;
  }

  toString() {
    var stringValue = Object.keys(this.cardsInHand).join();
    var actions = [];
    for (const card of this.cards()) {
      if (card.actionData !== undefined) {
        actions.push(card.id + ':' + card.actionData.join(':'));
      }
    }
    return Object.keys(this.cardsInHand).join() + '+' + actions.join();
  }

  loadFromString(string) {
    var parts = string.split('+');
    var cardIds = parts[0].split(',');
    var cardActions = parts[1].split(',').map(action => action.split(':'));
    this.loadFromArrays(cardIds, cardActions);
  }

  loadFromArrays(cardIds, cardActions) {
    this.clear();
    for (const cardId of cardIds) {
      this.addCard(deck.getCardById(cardId));
    }
    for (const cardAction of cardActions) {
      if (cardAction.length > 1) {
        var cardId = parseInt(cardAction[0]);
        var action = cardAction.slice(1);
        var actionCard = this.getCardById(cardId);
        this.cardsInHand[cardId] = new CardInHand(actionCard.card, action);
      }
    }
  }

  undoCardAction(id) {
    var actionCard = this.getCardById(id);
    this.cardsInHand[id] = new CardInHand(actionCard.card, undefined);
  }

}

var hand = new Hand();

class CardInHand {

  constructor(card, actionData) {
    this.card = card;
    this.actionData = actionData;
      
    this.id = card.id;
    this.name = card.name;
    this.universe = card.universe;
    this.specialty = card.specialty;
    this.fun = card.fun;
    this.hire = card.hire;
      
    this.effect1 = card.effect1;
    this.effect2 = card.effect2;
    this.effect1Score = card.effect1Score;
    this.effect2Score = card.effect2Score;
      
    this.effect1IsHire = card.effect1IsHire;
    this.effect1IsTrend = card.effect1IsTrend;
    this.effect2IsHire = card.effect2IsHire;
    this.effect2IsTrend = card.effect2IsTrend;
      
    this.effect1Points = 0;
    this.effect2Points = 0;
    this.effect1IsHireActive = false;
    this.effect1IsTrendActive = false;
    this.effect2IsHireActive = false;
    this.effect2IsTrendActive = false;
  }

  score(hand) {
    if (this.blanked) {
      return 0;
    }
    if (this.effect1Score !== undefined) {
      this.effect1Points = this.effect1Score(hand);
    } else {
      this.effect1Points = 0;
    }
    if (this.effect2Score !== undefined && !this.penaltyCleared) {
      this.effect2Points = this.effect2Score(hand);
    } else {
      this.effect2Points = 0;
    }
    return this.fun + this.effect1Points + this.effect2Points;
  }

  points() {
    return this.blanked ? 0 : (this.fun + this.effect1Points + this.effect2Points);
  }

  hire1(isHire) {
      this.effect1IsHireActive = isHire;
  }

  trend1(isTrend) {
      this.effect1IsTrendActive = isTrend;
  }

  hire2(isHire) {
      this.effect2IsHireActive = isHire;
  }

  trend2(isTrend) {
      this.effect2IsTrendActive = isTrend;
  } 
}
