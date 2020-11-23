import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import * as Moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';

@Component({
  selector: 'add-contact-trace',
  templateUrl: './add-contact-trace.component.html',
  styleUrls: ['./add-contact-trace.component.css']
})
export class AddContactTraceComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public contactType: Array<{ label: string; val: number }> = [
    { label: 'Phone tracing', val: 1555 },
    { label: 'Physical tracing', val: 10791 }
  ];
  public displayNotContactedReasons: boolean;
  public selectedContactType: number;
  public contactedDate: string = Moment(new Date()).format('YYYY-MM-DD');
  public contactStatus: Array<{ label: string; val: number }> = [
    { label: 'Contacted and linked', val: 1065 },
    { label: 'Contacted but not linked', val: 1066 },
    { label: 'Not contact', val: 1118 }
  ];
  public selectedContactedStatus: string;
  public remarks;
  public physicalNotContactedReasons = [
    { label: 'No locator information', val: 1550 },
    { label: 'Incorrect locator information', val: 1561 },
    { label: 'Migrated ', val: 1562 },
    { label: 'Not found at home', val: 1563 },
    { label: 'Died ', val: 1593 },
    { label: 'other ', val: 5622 }
  ];

  public phoneNotContactedReasons = [
    { label: 'No locator information', val: 1550 },
    { label: 'Calls not going through', val: 1560 },
    { label: 'Incorrect locator information', val: 1561 },
    { label: 'Died', val: 1593 },
    { label: 'other', val: 5622 }
  ];
  public notContactedStatusReasons = [];
  // concept 1107 === None
  public selectedNotContactedStatusReasons = 1107;
  public contactId: number;

  public ngOnInit() {
    this.router.parent.queryParams.subscribe((param) => {
      if (param) {
        this.contactId = Number(param.contact_id);
      }
    });
  }

  constructor(
    private familyTestingService: FamilyTestingService,
    private location: Location,
    private router: ActivatedRoute
  ) {}

  public saveContactTrace() {
    const payload = {
      contact_id: this.contactId,
      contact_date: this.contactedDate,
      contact_type: this.selectedContactType,
      contact_status: this.selectedContactedStatus,
      reason_not_contacted: this.selectedNotContactedStatusReasons,
      remarks: this.remarks
    };
    this.familyTestingService.savePatientContactTrace(payload).subscribe(
      (response: Response) => {
        this.location.back();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public onContactTypeChange(contact) {
    this.selectedContactType = contact.target.value;
    if (Number(contact.target.value) === 10791) {
      this.notContactedStatusReasons = this.physicalNotContactedReasons;
    } else {
      this.notContactedStatusReasons = this.phoneNotContactedReasons;
    }
  }

  public onContactStatusChange(status) {
    this.selectedContactedStatus = status.target.value;
    if (Number(status.target.value) === 1118) {
      this.displayNotContactedReasons = true;
    } else {
      this.displayNotContactedReasons = false;
    }
  }

  public onNotContactedChange(reason) {
    this.selectedNotContactedStatusReasons = reason.target.value;
  }

  public goBack() {
    this.location.back();
  }
}
