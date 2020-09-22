export class Config {
    label: string;
    key: string;
    visible?:boolean;
    select?:{
      valueKey: string,
      displayTextKey: string,
      list: any[]
    };
    date?: boolean;
  }