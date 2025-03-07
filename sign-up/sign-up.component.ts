import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/doctor.model';
import { GenericService } from '../../services/generic.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  doctor: Doctor = new Doctor();
  showUploadPane: boolean = false;
  showPaymentsPane: boolean = false;

  uploadedFileURL: any;
  file_to_upload: any;
  specific_specialty: any;

  constructor(
    private generic_service: GenericService,
    private storage: AngularFireStorage,
    private doctor_service: DoctorService,
    private toastr: ToastrService
  ){}

    ngOnInit(): void {
     
    }
   
    skipUpload(){
      this.showPaymentsPane = true;
      this.showUploadPane = false;
    }

    submitDoctorDetails(){
      this.doctor.date_added = this.generic_service.createDate();
      this.doctor.status = 'signed_up';
      this.doctor.specialist === 'other' ? this.doctor.specialist = this.specific_specialty: this.doctor.specialist;
      this.doctor_service.saveNewDoctor(this.doctor).then((id) =>{
        this.doctor.id = id;
        this.showUploadPane = true;
      }).catch((e: Error)=>{
        console.log(e);
        this.toastr.error(e.message, 'Error While Saving Doctor Details')
      })
      console.log(this.doctor);
    }

    uploadFile(event: any) {
        const file = event; //event.target.files[0];
        const filePath = `profile-photos/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
    
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url: any) => {
              this.uploadedFileURL = url; 
              console.log(this.uploadedFileURL); 
            });
          })
        ).subscribe();
      }
    
      getFileURL() {
        return this.uploadedFileURL;
      }
}
