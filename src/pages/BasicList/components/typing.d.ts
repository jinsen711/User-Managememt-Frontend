declare namespace PageApi {
  interface Child2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: string;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children?: Child[];
  }

  interface Datum {
    id?: number;
    parent_id?: number;
    name?: string;
    create_time?: string;
    delete_time?: any;
    status?: number;
    value: number;
    title: string;
    depth?: number;
    children?: Child2[];
  }

  interface Datum2 {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    disabled?: boolean;
    data?: Datum[];
  }

  interface Tab {
    name: string;
    title: string;
    data: Datum2[];
  }

  interface Datum3 {
    component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
  }

  interface Action {
    name: string;
    title: string;
    data: Datum3[];
  }

  interface Layout {
    tabs: Tab[];
    actions: Action[];
  }

  interface DataSource {
    id: number;
    username: string;
    display_name: string;
    create_time: string;
    update_time: string;
    status: number;
    groups: number[];
  }

  interface Data {
    page: Page;
    layout: Layout;
    dataSource: DataSource;
  }

  interface RootObject {
    success: boolean;
    message: string;
    data: Data;
  }
}
