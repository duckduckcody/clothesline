import { universalConfig } from './universal-config';

describe('universal-config test', () => {
  it('correctly matches womens', () => {
    expect(
      universalConfig.getGender(
        'https://www.universalstore.com/womens/tops.html?p=1'
      )
    ).toEqual(['Womens']);
  });

  it('correctly matches mens', () => {
    expect(
      universalConfig.getGender(
        'https://www.universalstore.com/mens/tops.html?p=1'
      )
    ).toEqual(['Mens']);
  });

  it('correctly matches on bad url', () => {
    expect(
      universalConfig.getGender(
        'https://www.universalstore.com/collection/tops.html?p=1'
      )
    ).toEqual(['Mens', 'Womens']);
  });
});
