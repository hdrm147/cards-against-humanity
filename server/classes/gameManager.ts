import {Game} from "./game";
import {Server} from "~/node_modules/@types/socket.io";
import {Player} from "~/server/classes/player";

interface Request {
  headers: {
    'x-username': string,
    'x-password': string,
  }
  params: {
    code: string
  }
}

interface CustomCard {
  text: string;
  black: boolean;
}

export class GameManager {
  games: Array<Game> = [];
  socket: Server | null = null;

  setSocket(socket: Server) {
    this.socket = socket;
    console.log("Setting Socket IO")
    this.socket.on('connection', function (socket: any) {
      console.log('a user connected');
    });
  }

  constructor() {

  }

  emit(event: string, data: object) {
    if (this.socket)
      this.socket.emit(event, data);
  }

  createGame(player: Player, decks: string[], customCards: CustomCard[]) {
    let game = new Game(this, player, decks, customCards);
    this.games.push(game);
    return game;
  }

  findGame(code: string) {
    return this.games.find(game => game.code === code);
  }

  joinGame(code: string, username: string, password: string): Game | undefined {
    let game = this.games.find(game => game.code === code);

    if (game) {

      game.findPlayer(username);
    }
    return game;
  }

  check(req: Request, join: boolean) {
    let game = this.findGame(req.params.code);
    if (!req.headers["x-username"]) {
      return {
        success: false,
        message: 'Username is required'
      }
    }
    if (game) {
      let player = game.findPlayer(req.headers["x-username"]);
      if (player) {
        if (player.password == req.headers["x-password"]) {
          return {
            success: true,
            player: player,
            game: game
          }
        } else {
          return {
            success: false,
            message: 'Wrong Password'
          }
        }
      } else {
        if (join) {
          console.log("Player not found will add player");
          let player = game.addPlayer(req.headers["x-username"], req.headers["x-password"]);
          return {
            success: true,
            player: player,
            game: game
          }
        } else {
          return {
            success: false,
            message: 'Player not found'
          }
        }
      }
    } else {
      return {
        success: false,
        message: 'Game not found'
      }
    }
  }
}
