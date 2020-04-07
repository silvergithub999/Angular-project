import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../../recipes.model";
import {RecipeService} from "../../recipes.service";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent {
  @Input() recipe: Recipe;
  @Input() id: number;
}
