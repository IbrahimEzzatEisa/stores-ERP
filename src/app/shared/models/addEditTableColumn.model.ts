export class AddEditTableColumn {

    constructor(label: string, key: string) {
      this.label = label;
      this.key = key;
    }
    key: string;
    label: string;
    select?: {
      valueKey: string;
      displayTextKey: string;
      list: any[];
    }
    check?: boolean;
    
  }