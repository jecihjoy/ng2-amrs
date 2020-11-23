import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as rison from 'rison-node';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { FamilyTestingButtonRendererComponent } from '../button-render/button-renderer.component';

@Component({
  selector: 'contact-profile',
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.css']
})
export class ContactProfileComponent implements OnInit {
  @Input()
  public contactInformation;
  public gridOptions = { columnDefs: [] };
  public frameComponents: any;
  public contactTraceHistory = [];
  private frameworkComponents: any;
  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = true;

  @Output() showModal = new EventEmitter();

  public columnDefs = [
    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.rowIndex + 1',
      width: 40,
      pinned: 'left'
    },
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'contact_date', headerName: 'Contacted Date' },
    { field: 'contact_type', headerName: 'Contact Type' },
    { field: 'contact_status', headerName: 'Contact status' },
    { field: 'remarks', headerName: 'Remarks' },
    {
      headerName: 'Actions',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEditClicked.bind(this),
        label: 'Edit'
      },
      width: 80,
      pinned: 'left',
      cellStyle: () => {
        return { display: 'flex', alignItems: 'center' };
      }
    }
  ];

  ngOnInit(): void {
    this.familyTestingService
      .getContactTraceHistory(this.contactInformation.obs_group_id)
      .subscribe((data: any) => {
        if (data.error) {
          console.log(data.error);
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the contact history data, please retry again`;
          this.isLoading = false;
        } else {
          this.contactTraceHistory = data.result;
          this.isLoading = false;
        }
      });
    this.gridOptions.columnDefs = this.columnDefs;
  }

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private familyTestingService: FamilyTestingService
  ) {
    this.frameworkComponents = {
      buttonRenderer: FamilyTestingButtonRendererComponent
    };
  }

  public onEditClicked(e) {
    const { event, rowData } = e;
    const stateUrl = rison.encode(rowData);
    this.router.navigate(['edit-contact-trace'], {
      relativeTo: this.route,
      queryParams: {
        state: stateUrl
      }
    });
  }

  public openAddTraceModal() {
    this.router.navigate(['add-contact-trace'], {
      relativeTo: this.route,
      queryParams: {
        contact_id: this.contactInformation.obs_group_id
      }
    });
  }
}
