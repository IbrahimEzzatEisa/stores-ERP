export class TableConfig {

    key: string;
    label: string;
    visible?: boolean;
    type?: string;
    select?: {
      valueKey: string,
      displayTextKey: string,
      list: any[]
    };
    check?: boolean;
}