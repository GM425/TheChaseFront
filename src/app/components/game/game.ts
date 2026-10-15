import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { GameSocket } from '../../services/game-socket';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {

  constructor(public gameSocket: GameSocket) {}
  
   ngOnInit(): void {
    this.gameSocket.connect();
  }
}
