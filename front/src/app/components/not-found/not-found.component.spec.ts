import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TEST UNITAIRE

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS D'INTEGRATION

  it('should display "Page not found !"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Page not found !');
  });

  it('should have the correct CSS class applied', () => {
    const divElement = fixture.debugElement.query(By.css('div.flex'));
    expect(divElement).toBeTruthy(); // Vérifie que la classe CSS flex est appliquée
  });
});
