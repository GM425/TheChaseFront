import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { GameSocket } from './services/game-socket';
import { Subscription } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Lobby } from './components/lobby/lobby';
import { Game } from './components/game/game';
import { RoomService } from './services/room-service';
import { Room } from './models/room';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, Game],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  // protected readonly title = signal('chase-game-front');
  roomId = '';
  score = 0;
  turnMessage = 'Waiting ...';
  lobbyStatus = '';
  gameStarted = false;
  myTurn = false;

  //Game Properties local after started
  birch = 100;
  players = 2;
  hand = [];
  chaseCardsLaid = [];
  chaseCardsClaimed = [];
  pot = 0;
  handTotalPot = 0;
  roomsOpen = signal<Room[]>([]);
  chosenRoom = '';

  private subscriptions = new Subscription();
  constructor(
    public gameSocket: GameSocket,
    public roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.gameSocket.connect();
    this.roomService.getRoomsOpen().subscribe({
      next: (rooms) => {
        console.log(rooms);
        this.roomsOpen.set(rooms);
        console.log('rooms');
        console.log(this.roomsOpen);
      },
      error: (error) => {
        console.error('FAILED TO GET PLAYERS:', error);
      },
    });

    this.subscriptions.add(
      this.gameSocket.waitingForPlayers$.subscribe((msg) => {
        this.lobbyStatus = msg;
      }),
    );

    this.subscriptions.add(
      this.gameSocket.gameStarted$.subscribe((state) => {
        this.gameStarted = true;
        this.updateUI(state);
      }),
    );

    this.subscriptions.add(
      this.gameSocket.stateUpdated$.subscribe((state) => {
        this.updateUI(state);
      }),
    );

    this.subscriptions.add(
      this.gameSocket.errorMsg$.subscribe((msg) => {
        alert(msg);
      }),
    );
  }

  joinGame(): void {
    // if (!this.roomId.trim()) {
    //   console.log();
    //   alert('Please enter a room code!');
    //   return;
    // }
    this.roomService.getRoomsOpen().subscribe({
      next: (rooms) => {
        this.roomsOpen.set(rooms);
        // this.chosenRoom = this.roomsOpen[0].name;
        console.log(rooms);
      },
      error: (error) => {
        console.error('FAILED TO GET PLAYERS:', error);
      },
    });

    this.gameSocket.joinRoom(this.chosenRoom);
  }

  takeTurn(): void {
    this.gameSocket.playTurn(this.roomId, 10);
  }

  private updateUI(state: any): void {
    this.score = state.score;
    this.myTurn = this.gameSocket.getSocketId === state.turn;

    this.turnMessage = this.myTurn ? 'YOUR TURN!' : "Opponent's Turn...";
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.gameSocket.disconnect();
  }
}
