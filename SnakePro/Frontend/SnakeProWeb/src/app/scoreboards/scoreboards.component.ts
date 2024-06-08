import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-scoreboards',
  templateUrl: './scoreboards.component.html',
  styleUrl: './scoreboards.component.css'
})
export class ScoreboardsComponent implements OnInit {
  scores: { player: string, points: number }[] = [];
  isLoading = false; // Nueva variable para rastrear si los datos se están cargando

  constructor(private userService: UserService, private snakeCommunicationsService: SnakeCommunicationsService) {
  }

  ngOnInit(): void {
    this.isLoading = true; // Configura isLoading en true antes de cargar los datos
    this.snakeCommunicationsService.getBestScore(6).subscribe((bestScore: { [key: string]: number[] }) => {
      for (let user in bestScore) {
        bestScore[user].forEach((score: number) => {
          this.scores.push({player: user, points: score});
        });
      }
      this.sortScores();
      this.isLoading = false; // Configura isLoading en false una vez que los datos se han cargado
    });
  }

  sortScores(): void {
    this.scores.sort((a, b) => b.points - a.points);
  }

}
