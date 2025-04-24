import { Pack } from './pack.model';

describe('Pack', () => {
  it('should create an instance', () => {
    expect(new Pack({ pack_id: 1, packName: 'Test Pack', description: 'Test Description', availableDate: '2023-01-01', expirationDate: '2023-12-31' })).toBeTruthy();
  });
});
