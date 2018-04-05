import { from, merge } from 'rxjs';
import { map, scan, tap } from 'rxjs/operators';

const accounts = from([
  { id: 1, name: 'account 1' },
  { id: 2, name: 'account 2' },
  { id: 3, name: 'account 3' }
]);

const balances = from([
  { account_id: 1, balance: 100 },
  { account_id: 2, balance: 200 },
  { account_id: 3, balance: 300 }
]);

interface Outcome {
  id: number;
  name?: string;
  balance?: number;
}

merge<Outcome>(
  accounts,
  balances.pipe(map(a => ({ id: a.account_id, balance: a.balance })))
)
  .pipe(
    scan<Outcome>((result: Outcome[], incomming) => {
      const found = result.find(row => row.id === incomming.id);
      return found
        ? (Object.assign(found, incomming), [...result])
        : [...result, incomming];
    }, []),
    tap(r => console.log(r))
  )
  .subscribe();
