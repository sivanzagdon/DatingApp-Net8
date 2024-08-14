import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { CommonModule, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {FileUploader, FileUploadModule}  from 'ng2-file-upload'
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/Photo';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FileUploadModule, DecimalPipe,CommonModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private accountServise= inject(AccountService);
  private memberService= inject(MembersService);
  member=input.required<Member>();  //"member" is the variable sent from the parent component
  uploader?: FileUploader
  hasBaseDropZoneOver= false
  baseUrl= environment.apiUrl
  memberChange=output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver=e;
  }

  deletePhoto(photo: Photo){
    this.memberService.deletePhoto(photo).subscribe({
      next:_=>{
        const updatedMember= {...this.member()};
        updatedMember.photos=updatedMember.photos.filter(x=>x.id!==photo.id);
        this.memberChange.emit(updatedMember);
      }
    })

  }

  initializeUploader(){
    this.uploader= new FileUploader({
      url: this.baseUrl +'users/add-photo',
      authToken: 'Bearer '+ this.accountServise.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024
    })
    this.uploader.onAfterAddingFile=(file)=>{
      file.withCredentials=false; //The file will be uploaded without cookies or tokens
    }
    this.uploader.onSuccessItem=(item, response, status, headers)=>{
     const photo=JSON.parse(response);
     const updateMember={...this.member()}; //Creates a new Member object and copies the values ​​from the existing Member object into it.
     updateMember.photos.push(photo);
     this.memberChange.emit(updateMember); //Broadcasts the change to the parent component.
     if(photo.isMain){
      const user=this.accountServise.currentUser();
        if(user){
          user.photoUrl=photo.url;
          this.accountServise.setCurrentUser(user)
        }
        updateMember.photoUrl=photo.url;
        updateMember.photos.forEach(p=>{
          if(p.isMain) p.isMain=false;
          if(p.id===photo.id) p.isMain=true;
        });
        this.memberChange.emit(updateMember);
     }
    }
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo).subscribe({
      next: _=>{
        const user=this.accountServise.currentUser();
        if(user){
          user.photoUrl=photo.url;
          this.accountServise.setCurrentUser(user)
        }
        const updateMember={...this.member()}
        updateMember.photoUrl=photo.url;
        updateMember.photos.forEach(p=>{
          if(p.isMain) p.isMain=false;
          if(p.id===photo.id) p.isMain=true;
        });
        this.memberChange.emit(updateMember);
      }
    })

  }
}
