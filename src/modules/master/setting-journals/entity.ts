import { ISettingJournalEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'setting_journals'

export class SettingJournalEntity {
  constructor(public data: ISettingJournalEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
