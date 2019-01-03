import { TestBed } from '@angular/core/testing';

import { IBoardService } from './board.service';

describe('BoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IBoardService = TestBed.get(IBoardService);
    expect(service).toBeTruthy();
  });
});
