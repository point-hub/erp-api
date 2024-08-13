import { ISettingJournalEntity } from './interface'

export const collectionName = 'setting_journals'

export class SettingJournalEntity {
  constructor(public data: ISettingJournalEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
