declare module BasicListApi {
  interface Page {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  interface Child {
    id: number;
    parent_id: number;
    name: string;
    create_time: string;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
  }

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
    value: number | string;
    title: string;
    depth?: number;
    children?: Child2[];
  }

  interface Action {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method?: string;
  }

  interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    data?: Datum[];
    hideInColumn?: boolean;
    sorter?: boolean;
    mode?: string;
    actions?: Action[];
  }

  interface TableToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    id?: string;
    uri?: string;
  }

  interface BatchToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
  }

  interface Layout {
    tableColumn: TableColumn[];
    tableToolBar: TableToolBar[];
    batchToolBar: BatchToolBar[];
  }

  interface Pivot {
    id: number;
    admin_id: number;
    group_id: number;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
  }

  interface Group {
    id: number;
    parent_id: number;
    name: string;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
    pivot: Pivot;
  }

  interface DataSource {
    id: number;
    username: string;
    display_name: string;
    create_time: string;
    delete_time?: any;
    status: number;
    groups: Group[];
  }

  interface Meta {
    total: number;
    per_page: number;
    page: number;
  }

  interface Data {
    page: Page;
    layout: Layout;
    dataSource: DataSource[];
    meta: Meta;
  }

  interface RootObject {
    success: boolean;
    message: string;
    data: Data;
  }
}
