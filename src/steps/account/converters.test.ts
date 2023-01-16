import { createAccountEntity } from './converters';

test('convert account entity', () => {
  const account = {
    id: 'test-account-id',
    name: 'test account name',
  };
  const accountEntity = createAccountEntity(account);
  expect(accountEntity).toEqual({
    _class: ['Account'],
    _key: 'xmcyber_account_test-account-id',
    _type: 'xmcyber_account',
    displayName: 'test account name',
    name: 'test account name',
  });
});
