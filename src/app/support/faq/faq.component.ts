import { Component, OnInit } from '@angular/core';
import { RecService } from '../services/rec.service';
import { Reclamation } from '../services/rec.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {



  recs: Reclamation[] = [];
  filteredRecs: Reclamation[] = [];
  selectedStatus: string = '';
  statuses: string[] = ['OUVERT', ' EN_COURS', ' RESOLU'];
  isLoading = false;
  errorMessage = '';
  
  // Filter properties
  filterClient = '';
  filterType = '';
  filterDate = '';

  constructor(private recService: RecService) {}

  ngOnInit(): void {
    this.loadRecs();
  }

  loadRecs() {
    this.isLoading = true;
    this.recService.getAllRecs().subscribe({
      next: (data) => {
        this.recs = data;
        this.filteredRecs = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reclamations';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters() {
    this.isLoading = true;
    this.recService.filterRecs({
      client: this.filterClient || undefined,
      type: this.filterType || undefined,
      status: this.selectedStatus || undefined,
      date: this.filterDate || undefined
    }).subscribe({
      next: (data) => {
        this.filteredRecs = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to apply filters';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  resetFilters() {
    this.selectedStatus = '';
    this.filterClient = '';
    this.filterType = '';
    this.filterDate = '';
    this.filteredRecs = [...this.recs];
  }

  updateRecStatus(rec: Reclamation, newStatus: string) {
    this.recService.updateStatus(rec.id_rec, newStatus).subscribe({
      next: (updatedRec) => {
        // Update the local copy
        const index = this.recs.findIndex(r => r.id_rec === rec.id_rec);
        if (index !== -1) {
          this.recs[index] = updatedRec;
        }
        this.applyFilters(); // Reapply filters to refresh view
      },
      error: (err) => {
        this.errorMessage = 'Failed to update status';
        console.error(err);
      }
    });
  }

  deleteRec(recId: number) {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.recService.deleteRec(recId).subscribe({
        next: () => {
          this.recs = this.recs.filter(rec => rec.id_rec !== recId);
          this.filteredRecs = this.filteredRecs.filter(rec => rec.id_rec !== recId);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete reclamation';
          console.error(err);
        }
      });
    }
  }
  getStatusClass(status: string): string {
    const statusMap: {[key: string]: string} = {
      'OUVERT': 'status-open',
      'EN_COURS': 'status-in_progress',
      'RESOLU': 'status-resolved',
      
    };
    return statusMap[status] || '';
  }
}
