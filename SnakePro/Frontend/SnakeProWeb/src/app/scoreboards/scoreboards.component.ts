import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-scoreboards',
  templateUrl: './scoreboards.component.html',
  styleUrl: './scoreboards.component.css'
})
export class ScoreboardsComponent implements OnInit {
  scores = [
    { player: 'Player 1', points: 60 },
    { player: 'Player 2', points: 100 },
    { player: 'Player 3', points: 80 }
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.sortScores();
    console.log(this.userService.getToken());
  }

  sortScores(): void {
    this.scores.sort((a, b) => b.points - a.points);
  }

}
