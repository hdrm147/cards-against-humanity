import {WhiteCard} from "./whiteCard";
import {Game} from "./game";

export class Player {
  public username: string;
  public password: string;
  cards: Array<WhiteCard> = [];
  played: boolean = false;
  playedCards: Array<string> = [];
  wins: number = 0;

  constructor(username: string, password: string) {

    console.log({username: username});
    this.username = username;
    this.password = password;

  }

  playCard(card: string, game: Game): WhiteCard | undefined {
    if (this.played)
      return undefined;

    this.playedCards.push(card);

    let draw = game.whiteCards.pop();

    if (draw) {
      let index = this.cards.findIndex(c => c.text === card);
      if (index > -1) {
        this.cards[index] = draw;
      }
    }


    this.played = game.blackCard.pick == this.playedCards.length;

    game.sync(`${this.username} played a card`);

    console.log(`Makred ${this.username} as played: ${this.played} Pick: ${game.blackCard.pick}, PlayedCount: ${this.playedCards.length}`);

    return draw;
  }
};
