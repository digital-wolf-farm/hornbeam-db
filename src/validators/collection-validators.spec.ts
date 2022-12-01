import { DatabaseError } from '../models/enums';
import { collectionValidators } from './collection-validators';

describe('CollectionValidators', () => {
    describe('isEntriesListValid', () => {
        it('throw error when at least one item from list is not a valid new entry', () => {
            const Adam = { _id: 1, name: 'Adam' };
            const Zoey = { name: 'Zoey' };

            try {
                collectionValidators.isEntriesListValid([Adam, Zoey]);
            } catch (e) {
                expect(e.name).toBe(DatabaseError.EntryFormatError);
                expect(e.message).toBe('Added entry cannot contain _id property');
            }
        });
    });
});
