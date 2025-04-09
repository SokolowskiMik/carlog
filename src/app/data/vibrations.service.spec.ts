import { TestBed } from '@angular/core/testing';
import { VibrationsService } from './vibrations.service';

describe('VibrationsService', () => {
  let service: VibrationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VibrationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
