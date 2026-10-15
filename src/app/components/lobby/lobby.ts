import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-lobby',
  imports: [FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby {
  
   roomId = '';
 
}
