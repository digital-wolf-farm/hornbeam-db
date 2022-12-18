import { DatabaseError } from '../models/enums';
import { entryValidators } from './entry-validators';

describe('EntryValidators', () => {
    describe('isNewEntriesListValid', () => {
        it('throw error when at least one item from list is not a valid new entry', () => {
            const Adam = { _id: 1, name: 'Adam' };
            const Zoey = { name: 'Zoey' };

            try {
                entryValidators.isNewEntriesListValid([Adam, Zoey]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntryFormatError);
                expect(e.message).toBe('Added entry cannot contain _id property');
            }
        });
    });
});
