import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GameSocket {

  roomId = "";

  private socket: Socket = io('http://localhost:3000', {
    autoConnect: false
  });

  waitingForPlayers$ = fromEvent<string>(this.socket, 'waitingForPlayer');
  gameStarted$ = fromEvent<any>(this.socket, 'gameStarted');
  stateUpdated$ = fromEvent<any>(this.socket, 'stateUpdated');
  errorMsg$ = fromEvent<string>(this.socket, 'errorMsg');

  //Establish the connection
  connect(): void{
    this.socket.connect()
  }

  joinRoom( roomId: string): void {
    this.socket.emit('joinRoom', roomId);
    this.roomId = roomId;
  }

  playTurn( roomId: string, points: number): void {
    this.socket.emit('playTurn', {roomId, points});
  }

  getSocketId(): string | undefined {
    return this.socket.id;
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
