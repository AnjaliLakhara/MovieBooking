import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MovieService } from '../../../core/services/movie.service';
import { GenreService } from '../../../core/services/genre.service';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './manage-movies.html',
  styleUrls: ['./manage-movies.css']
})
export class ManageMoviesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movieService = inject(MovieService); 
  private genreService = inject(GenreService);
  private snackBar = inject(MatSnackBar);
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  languages = ['English', 'Hindi', 'Korean', 'Japanese', 'Telugu'];
  formats = ['2D', '3D','4DX', 'IMAX', 'ScreenX'];
  certifications = ['U', 'UA13+','UA+7', 'A', 'UA16+'];
  featuredOptions = ['Top 10 Hits', 'Curated For You', 'BlockBusters', 'Cinematic Masterpiece'];
  genres$ = this.genreService.getGenres();
  
  isSubmitting = false;
  isEditMode = false;
  editingMovieId: string | null = null;

  movieForm: FormGroup = this.fb.group({
    title: ['', Validators.required], 
    description: ['', Validators.required],
    posterUrl: ['', Validators.required], 
    durationMinutes: [120, Validators.required],
    imdbRating: ['', [Validators.min(0), Validators.max(10)]],
    certification: ['', Validators.required], 
    languages: [[], Validators.required],
    formats: [[], Validators.required], 
    genres: [[], Validators.required],
    featuredLists: [[], Validators.required]
  });

  ngOnInit() {

    this.editingMovieId = this.route.snapshot.paramMap.get('id');
    
    if (this.editingMovieId) {
      this.isEditMode = true;
      
    
      this.movieService.getMovieById(this.editingMovieId).subscribe(movie => {
        if (movie) {
          this.movieForm.patchValue(movie);
        } else {
          this.snackBar.open('Movie not found!', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/dashboard']); 
        }
      });
    }
  }

  async onSubmit() {
    if (this.movieForm.invalid) return; 
    this.isSubmitting = true;
    
    try {
      if (this.isEditMode && this.editingMovieId) {
        await this.movieService.updateMovie(this.editingMovieId, this.movieForm.value);
        this.snackBar.open('Movie Updated!', 'Close', { duration: 3000 });
      } else {
        await this.movieService.addMovie(this.movieForm.value);
        this.snackBar.open('Movie Added!', 'Close', { duration: 3000 });
      }
      this.router.navigate(['/admin/dashboard']); 
      
    } catch { 
      this.snackBar.open('Error saving movie', 'Close', { duration: 3000 }); 
    }
    
    this.isSubmitting = false;
  }
}