import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  const fakeActivatedRoute = {
    snapshot: { data: {} },
  } as ActivatedRoute;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTabsModule, CommonModule],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have navLinks defined', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.navLinks).toBeDefined();
    expect(app.navLinks.length).toBe(2);
    expect(app.navLinks[0].label).toBe('Add Address');
    expect(app.navLinks[1].label).toBe('Read Address');
  });

  it('should display navigation links in the template', () => {
    // Arrange & Act
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelector('a[href="/add-address"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="/read-address"]')).toBeTruthy();
  });
});
