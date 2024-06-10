import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SnakeCommunicationsService} from "../../services/snake-communications.service";

@Component({
  selector: 'app-scoreboards',
  templateUrl: './scoreboards.component.html',
  styleUrl: './scoreboards.component.css'
})
export class ScoreboardsComponent implements OnInit {
  /**
   * scores is an array that holds the scores of the players.
   * Each score is an object with a 'player' property that represents the player's name and a 'points' property that represents the player's points.
   */
  scores: { player: string, points: number }[] = [];

  /**
   * isLoading is a boolean that indicates whether the component is currently loading data.
   */
  isLoading = false;

  /**
   * The constructor for the ScoreboardsComponent class.
   * It injects the UserService and SnakeCommunicationsService services.
   * @param {UserService} userService - The service for user-related operations.
   * @param {SnakeCommunicationsService} snakeCommunicationsService - The service for snake game-related operations.
   */
  constructor(private userService: UserService, private snakeCommunicationsService: SnakeCommunicationsService) {
  }

  /**
   * The ngOnInit method is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * In this method, it sets isLoading to true, then it calls the getBestScore method of the SnakeCommunicationsService with the number 6.
   * It subscribes to the Observable returned by getBestScore and pushes the scores to the scores array.
   * It then sorts the scores array and sets isLoading to false.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.snakeCommunicationsService.getBestScore(6).subscribe((bestScore: { [key: string]: number[] }) => {
      for (let user in bestScore) {
        bestScore[user].forEach((score: number) => {
          this.scores.push({player: user, points: score});
        });
      }
      this.sortScores();
      this.isLoading = false;
    });
  }

  /**
   * The sortScores method sorts the scores array in descending order based on the points.
   */
  sortScores(): void {
    this.scores.sort((a, b) => b.points - a.points);
  }
}
