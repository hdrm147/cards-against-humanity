import {GameManager} from "../classes/gameManager";
import {BlackCard} from "~/server/classes/blackCard";
import {Player} from "../classes/player";
import {Game} from "~/server/classes/game";

const router = require('express').Router();

interface CheckResponse {
  game: Game
  player: Player
  success: boolean
}

module.exports = function (manager: GameManager) {


  // Pick the winner;
  router.get('/games/:code/cards', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }
    res.json({success: true, cards: data.player.cards});
  });
  router.post('/games/:code/leave', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }

    data.game.leave(data.player,false,req.body.successor);

    res.json({success: true});
  });

  router.post('/games/:code/pick', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }
    data.game.pick(req.body.cards);
    res.json({success: true});

  });
  router.post('/games/:code/kick', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data || data.player.username != data.game.admin) {
      return;
    }
    let player = data.game.findPlayer(req.body.kick);
    if (player)
      data.game.kick(player)

    res.json({success: true});
  })

  // Skip Black Card;
  router.post('/games/:code/skip', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }
    if (data.game.judge.username === data.player.username) {
      data.game.skipBlackCard();
      res.json({success: true});
    } else {
      res.status(422).json({
        message: "You're not the judge for this round"
      })
    }


  });
  router.post('/games/:code/message', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }
    data.game.sync(`${data.player.username}: ${req.body.message}`, 'message');

    res.json({
      success: true
    })
  });
  // Play Card;
  router.post('/games/:code/play', (req: any, res: any) => {
    let data = validate(req, res);
    if (!data) {
      return;
    }

    let card = data.player.playCard(req.body.card, data.game);
    data.game.check();

    res.json({
      success: true,
      draw: card,
      playedCards: data.player.playedCards.length,
    })


  });

  // Start Game;
  router.post('/games/:code/start', (req: any, res: any) => {
    let game = manager.findGame(req.params.code);
    if (game) {
      game.start();
      res.json({
        success: true
      })
    } else {
      res.status(422).json({
        message: "Game not found",
      })
    }
  });

  // Join Game;
  router.post('/games/:code', (req: any, res: any) => {
    let data = validate(req, res, true);
    if (!data) {
      return;
    }
    if (data.game) {
      res.json({
        game: data.game.serialize(),
        cards: data.player.cards
      });
    } else {
      res.status(422).json({
        message: "Game not found",
      })
    }
  });

  // Create New Game;
  router.post('/games', (req: any, res: any) => {
    let player = new Player(req.body.username, req.body.password);
    let packs = req.body.packs;
    if (packs.length === 0) {
      res.status(422).json({
        message: "You must select at least one pack"
      });
      return;
    }

    let game = manager.createGame(player, packs, req.body.customCards);

    res.json({
      code: game.code,
    })
  });

  function validate(req: any, res: any, join: boolean = false): CheckResponse | undefined {
    let response = manager.check(req, join);
    if (!response.success) {
      res.status(422).json(response);
    }
    if (response.game && response.player)
      return response;
  }

  return router;
};

