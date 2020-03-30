import {Player} from "./player";
import {BlackCard} from "./blackCard";
import {GameManager} from "~/server/classes/gameManager";
import {WhiteCard} from "./whiteCard";
import cards from "../../assets/cards";

interface CustomCard {
  text: string;
  black: boolean;
}

export class Game {
  code: string = "";
  players: Array<Player> = [];
  judge: Player;
  blackCard: BlackCard;
  started: boolean = false;
  manager: GameManager;
  blackCards: Array<BlackCard> = [];
  whiteCards: Array<WhiteCard> = [];
  notifications: string[] = [];
  previousCard: BlackCard | null = null;
  winingCards: WhiteCard[] | null = [];
  lastWinner: string | null = null;
  shuffledJudgingCards: string[][] = [];
  admin: string;

  constructor(manager: GameManager, judge: Player, packs: string[], customCards: CustomCard[]) {
    // this.code = Math.random().toString(36).substring(7);
    this.code = "test";
    this.manager = manager;
    this.setupCards(packs, customCards);
    this.judge = judge;
    judge.cards = this.getCards();
    this.admin = judge.username;
    this.players = [judge];
    this.sendNotification(`${judge.username} created the game`);
    this.blackCard = new BlackCard("", 1);
  }

  setupCards(packs: string[], customCards: CustomCard[]) {

    cards.white.filter(card => packs.includes(card.deck)).forEach(text => {
      this.whiteCards.push(new WhiteCard(text.text));
    });

    cards.black.filter(card => packs.includes(card.deck)).forEach(card => {
      this.blackCards.push(new BlackCard(card.text, card.pick));
    });
    customCards.filter(card => card.text.trim() != "").forEach(card => {
      if (card.black) {
        let pick = (card.text.match(/_/g) || []).length;
        this.blackCards.push(new BlackCard(card.text, pick > 0 ? pick : 1));
      }
    });

    this.blackCards.sort(() => Math.random() - 0.5);
    this.whiteCards.sort(() => Math.random() - 0.5);

  }

  sendNotification(text: string) {
    this.notifications.push(text);
  }

  addPlayer(username: string, password: string): Player {

    let player = this.findPlayer(username);
    if (!player) {
      player = new Player(username, password);
      player.cards = this.getCards();
      this.players.push(player);
      this.sync(`${player.username} joined the game`, 'joined');

    }
    return player;
  }

  getCard(): WhiteCard | undefined {
    return this.whiteCards.pop();
  }

  getCards(): Array<WhiteCard> {
    let cards: Array<WhiteCard> = [];
    for (let i = 0; i < 8; i++) {
      let card = this.getCard();
      if (card)
        cards.push(card);
    }
    return cards;
  }

  sync(message: string, sound?: string) {
    this.sendNotification(message);
    this.manager.emit(`update.${this.code}`, {
      message: message,
      data: this.serialize(),
      sound: sound
    });
  }

  isJudging(): boolean {
    return this.players.filter(player => !player.played && (this.judge.username != player.username)).length === 0;
  }

  findPlayer(username: string): Player | undefined {

    return this.players.find(player => player.username === username);
  }

  skipBlackCard() {
    this.drawBlackCard();
    if (this.players.filter(player => player.played).length > 0) {
      return;
    }
    // this.judge = this.nextPlayer();
    this.players.forEach(player => {
      player.playedCards = [];
      player.played = false;
    });
    this.shuffledJudgingCards = [];

    if (!this.judge)
      return;

    this.sync(`The judge skipped a card`, 'skip');

  }

  start() {
    if (this.started)
      return;


    this.started = true;
    while (this.judge === null)
      this.judge = this.nextPlayer();

    this.drawBlackCard();
    this.sync("The game has been started");
  }

  drawBlackCard() {
    let card = this.blackCards.pop();
    this.previousCard = this.blackCard;
    if (card) {
      this.blackCard = card;
    }
  }

  judgingCards(): string[][] {
    if (!this.isJudging()) {
      return [];
    }
    return this.shuffledJudgingCards;
  }

  pick(cards: Array<string>) {
    let winner = this.players.find(player => {
      let result = false;
      cards.forEach(card => {
        result = player.playedCards.includes(card);
      });

      return result;
    });

    if (winner) {
      winner.wins++;
      this.lastWinner = winner.username;
      this.drawBlackCard();
      this.judge = this.nextPlayer();
      this.winingCards = winner.playedCards.map(text => {
        return new WhiteCard(text);
      });
      this.shuffledJudgingCards = [];
      this.players.forEach(player => {
        player.playedCards = [];
        player.played = false;
      });


      this.sync(`${winner.username} won this round!`, 'won');
    }

  }

  check() {
    console.log(this.players);
    let waitingPlayers = this.players.filter(player => !player.played && (this.judge.username != player.username));
    if (waitingPlayers.length === 0) {
      this.shuffledJudgingCards = this.players.filter(player => player.username != this.judge.username).map(player => {
        return player.playedCards;
      }).sort(() => Math.random() - 0.5);
      this.sync(`${this.judge.username} should start judging now`, 'start');
    }
    console.log(`Waiting Players: ${waitingPlayers.length}`);
  }

  nextPlayer(): Player {
    if (this.judge === null)
      return this.players[0];

    this.players.forEach(player => {
      player.played = false;
    });
    let index = this.players.indexOf(this.judge);
    if (index < this.players.length - 1) {
      return this.players[index + 1];
    }

    return this.players[0];
  }

  leave(player: Player, kick: boolean = false, successor: string | undefined = undefined) {
    let index = this.players.indexOf(player);
    if (kick && player.username === this.admin) {
      return;
    }
    if (this.admin === player.username && successor) {
      this.admin = successor;
      this.sync(`${successor} has been promoted to admin`);
    }
    if (this.judge.username === player.username) {
      this.players.forEach(player => {
        player.playedCards = [];
        player.played = false;
      });
      this.shuffledJudgingCards = [];
      let nextPlayer = this.players[index + 1];
      if (nextPlayer)
        this.judge = nextPlayer;
      else
        this.judge = this.players[0];

      this.players.splice(index, 1);

      this.drawBlackCard();

    } else {
      this.shuffledJudgingCards = [];
      this.players.splice(index, 1);
    }
    if (kick)
      this.sync(`${this.admin} kicked ${player.username}`);
    else
      this.sync(`${player.username} left the game`);

    this.check();
  };

  kick(player: Player) {
    this.leave(player, true);

  };

  serialize() {
    let players = this.players.map(player => {
      return {
        username: player.username,
        played: player.played,
        wins: player.wins,
      }
    });

    return {
      players,
      blackCard: this.blackCard,
      started: this.started,
      judge: this.judge.username,
      judging: this.isJudging(),
      judgingCards: this.judgingCards(),
      notifications: this.notifications,
      winingCards: this.winingCards,
      previousCard: this.previousCard,
      lastWinner: this.lastWinner,
      admin: this.admin
    }
  }
}

