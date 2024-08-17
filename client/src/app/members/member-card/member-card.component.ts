import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
  encapsulation:ViewEncapsulation.None
})
export class MemberCardComponent {
  member=input.required<Member>();
  private likesService=inject(LikesService);
  hasLikes=computed(()=>this.likesService.likeIds().includes(this.member().id))

  toggleLike(){
    this.likesService.toggleLike(this.member().id).subscribe({
      next: ()=>{
        if(this.hasLikes()){
          this.likesService.likeIds.update(ids=>ids.filter(x=>x!==this.member().id))
        }else{
          this.likesService.likeIds.update(ids=> [...ids, this.member().id]);
        }
      }
    })
  }

}
