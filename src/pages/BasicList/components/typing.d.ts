declare namespace PageApi {
  interface Page {
    title: string;
    type: string;
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
    data?: Datum[];
  }

  interface Tab {
    name: string;
    title: string;
    data: Datum2[];
  }

  interface Action {
    component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
  }

  interface Actions {
    name: string;
    title: string;
    data: Action[];
  }

  interface Layout {
    tabs: Tab[];
    actions: Actions[];
  }

  interface Data {
    page: Page;
    layout: Layout;
  }

  interface RootObject {
    success: boolean;
    message: string;
    data: Data;
  }
}
