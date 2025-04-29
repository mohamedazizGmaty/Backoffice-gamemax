import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RecService, Reclamation, ReclamationFilter, Attachment } from '../services/rec.service'; // Import needed interfaces

@Component({
  selector: 'app-faq', // Consider renaming selector if this is an admin list (e.g., 'app-admin-reclamations')
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, OnDestroy {

  // --- Properties for Reclamation List & Filtering ---
  recs: Reclamation[] = []; // Master list of all loaded reclamations
  filteredRecs: Reclamation[] = []; // List currently displayed after filtering
  isLoading = false; // Global loading indicator for list/filters
  errorMessage = ''; // To display errors to the user

  // Filter input properties
  filterClientId = ''; // Corresponds to backend 'clientId'
  filterTypeRec = '';  // Corresponds to backend 'typeRec'
  filterStatus = '';   // Corresponds to backend 'status'
  filterDate = '';     // Corresponds to backend 'date'

  // Dropdown options for filters
  // *** CORRECTED: Removed leading space from 'EN_COURS' ***
  // *** Ensure these EXACTLY match the strings from your backend Status enum ***
  statuses: string[] = ['OUVERT', 'EN_COURS', 'RESOLU'];
  // Example for Type Filter Dropdown (add your actual types)
  typeRecs: string[] = ['TECHNIQUE', 'FINANCIER', 'COMMERCIAL', 'AUTRE'];

  // --- Properties for Attachment Preview ---
  previewUrl: SafeResourceUrl | null = null; // Sanitized URL for safe binding in template
  isLoadingPreview = false; // Loading indicator specifically for preview
  previewError = ''; // Error message specifically for preview
  private rawObjectUrl: string | null = null; // Store the raw blob URL for revocation
  private previewSub: Subscription | null = null; // Subscription for the preview request
  private componentSubs: Subscription[] = []; // Array to hold all subscriptions

  constructor(
    private recService: RecService,
    private sanitizer: DomSanitizer // Inject DomSanitizer for URL sanitization
  ) {}

  // --- Lifecycle Hooks ---

  ngOnInit(): void {
    this.loadInitialRecs(); // Load data when the component initializes
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.componentSubs.forEach(sub => sub.unsubscribe());
    // Clean up the Blob URL if one exists
    this.revokePreviewUrl();
  }

  // --- Data Loading and Filtering ---

  loadInitialRecs(): void {
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous errors
    this.filteredRecs = []; // Clear existing data before loading

    const sub = this.recService.getAllRecs().subscribe({
      next: (data) => {
        this.recs = data;
        this.filteredRecs = [...data]; // Initialize filtered list with all data
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reclamations:', err);
        this.errorMessage = 'Failed to load reclamations. Please try again later.';
        this.isLoading = false;
      }
    });
    this.componentSubs.push(sub); // Track subscription
  }

  applyFilters(): void {
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous errors
    this.revokePreviewUrl(); // Close any open preview when filters change

    const filters: ReclamationFilter = {
      // Use the correct property names matching the ReclamationFilter interface
      clientId: this.filterClientId || undefined,
      typeRec: this.filterTypeRec || undefined,
      status: this.filterStatus || undefined,
      date: this.filterDate || undefined
    };

    const sub = this.recService.getFilteredReclamations(filters).subscribe({
      next: (data) => {
        this.filteredRecs = data; // Update the displayed list
        this.isLoading = false;
        if (data.length === 0) {
           // Optional: this.errorMessage = 'No reclamations found matching your criteria.';
        }
      },
      error: (err) => {
        console.error('Error applying filters:', err);
        this.errorMessage = 'Failed to apply filters. Please check your input or try again.';
        this.isLoading = false;
      }
    });
    this.componentSubs.push(sub); // Track subscription
  }

  resetFilters(): void {
    this.filterClientId = '';
    this.filterTypeRec = '';
    this.filterStatus = '';
    this.filterDate = '';
    this.errorMessage = '';
    this.revokePreviewUrl(); // Close preview on reset
    // Reset to the full list initially loaded (avoids backend call if `recs` is populated)
    if (this.recs.length > 0) {
       this.filteredRecs = [...this.recs];
    } else {
       // If master list is empty for some reason, reload all
       this.loadInitialRecs();
    }

  }

  // --- Reclamation Actions ---

  updateRecStatus(rec: Reclamation, newStatus: string): void {
    if (!rec || rec.id_rec === undefined) {
       console.error("Invalid reclamation object passed to updateRecStatus");
       this.errorMessage = 'Cannot update status for invalid reclamation.';
       return;
    }
    if (!newStatus || !this.statuses.includes(newStatus)) {
       console.error("Invalid status provided:", newStatus);
       this.errorMessage = 'Invalid status selected.';
       return;
    }

    // Indicate loading state (maybe on the specific row later)
    this.errorMessage = '';
    // Consider adding a visual cue that this specific record is updating

    const sub = this.recService.updateStatus(rec.id_rec, newStatus).subscribe({
      next: (updatedRec) => {
        // Update both master and filtered lists for consistency
        const updateItem = (list: Reclamation[]) => {
          const index = list.findIndex(r => r.id_rec === updatedRec.id_rec);
          if (index !== -1) {
            list[index] = updatedRec;
          }
          return list; // Return the modified list
        };
        this.recs = updateItem([...this.recs]);
        this.filteredRecs = updateItem([...this.filteredRecs]);

        // Optional: Re-apply filters if status change might affect visibility
        // this.applyFilters();
      },
      error: (err) => {
        console.error(`Error updating status for reclamation ${rec.id_rec}:`, err);
        this.errorMessage = `Failed to update status for reclamation #${rec.id_rec}.`;
        // Optional: Revert UI changes if you did optimistic update
      }
      // No need for finally/complete block to reset global isLoading unless needed
    });
    this.componentSubs.push(sub); // Track subscription
  }

  deleteRec(recId: number): void {
    if (confirm(`Are you sure you want to delete reclamation #${recId}? This action cannot be undone.`)) {
      this.isLoading = true; // Indicate global loading for delete action
      this.errorMessage = '';
      this.revokePreviewUrl(); // Close preview if related item is deleted

      const sub = this.recService.deleteRec(recId).subscribe({
        next: () => {
          // Remove from both lists
          this.recs = this.recs.filter(rec => rec.id_rec !== recId);
          this.filteredRecs = this.filteredRecs.filter(rec => rec.id_rec !== recId);
          this.isLoading = false;
          // Optional: Show success message
        },
        error: (err) => {
          console.error(`Error deleting reclamation ${recId}:`, err);
          this.errorMessage = `Failed to delete reclamation #${recId}. Please try again.`;
          this.isLoading = false;
        }
      });
      this.componentSubs.push(sub); // Track subscription
    }
  }

  // --- Attachment Preview ---

  previewFile(attachmentId: number | undefined): void {
    // Check if attachmentId is valid
    if (attachmentId === undefined) {
        console.error("Cannot preview file without an Attachment ID.");
        this.previewError = "Attachment ID is missing.";
        return;
    }

    this.isLoadingPreview = true;
    this.previewError = '';
    this.revokePreviewUrl(); // Revoke previous URL before creating a new one

    // Cancel any ongoing preview request
    this.previewSub?.unsubscribe();

    this.previewSub = this.recService.previewAttachment(attachmentId).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
            console.warn('Preview endpoint returned empty content.');
            this.previewError = 'Preview not available (empty file).';
            this.isLoadingPreview = false;
            return;
        }
        // Create a new object URL
        this.rawObjectUrl = URL.createObjectURL(blob);
        // Sanitize the URL for safe use in the template
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawObjectUrl);
        this.isLoadingPreview = false;
      },
      error: (err) => {
        console.error('Error fetching attachment preview:', err);
        if (err.status === 404) {
           this.previewError = 'Attachment not found.';
        } else {
           this.previewError = 'Could not load attachment preview. Please try again.';
        }
        this.isLoadingPreview = false;
        this.previewUrl = null; // Ensure preview is cleared on error
      }
    });
    // No need to add previewSub to componentSubs as it's managed separately and cancelled on new preview/destroy
  }

  closePreview(): void {
    this.revokePreviewUrl();
  }

  private revokePreviewUrl(): void {
    if (this.rawObjectUrl) {
      URL.revokeObjectURL(this.rawObjectUrl); // Clean up the Blob URL
      this.rawObjectUrl = null;
      this.previewUrl = null; // Clear the sanitized URL
      this.isLoadingPreview = false; // Reset loading state
      this.previewError = ''; // Clear preview error
    }
     // Also unsubscribe if the request is still in progress when closing
     this.previewSub?.unsubscribe();
  }


  // --- Utility / Display ---

  getStatusClass(status: string): string {
    // Ensure keys EXACTLY match the backend Status enum strings AND the `statuses` array
    const statusMap: { [key: string]: string } = {
      'OUVERT': 'status-open',         // Example class name
      'EN_COURS': 'status-in-progress', // Example class name (fixed space)
      'RESOLU': 'status-resolved',     // Example class name
    };
    // Trim status just in case there are hidden spaces, and convert to uppercase for robust matching
    const normalizedStatus = status ? status.trim().toUpperCase() : '';
    return statusMap[normalizedStatus] || 'status-unknown'; // Provide a default/fallback class
  }

  // Helper to safely get attachment ID (assuming first attachment if multiple)
  getAttachmentId(rec: Reclamation): number | undefined {
     return rec.attachments && rec.attachments.length > 0 ? rec.attachments[0].id : undefined;
  }

   // Helper to get attachment filename (assuming first attachment)
  getAttachmentFilename(rec: Reclamation): string | undefined {
    return rec.attachments && rec.attachments.length > 0 ? rec.attachments[0].fileName : undefined;
  }
}