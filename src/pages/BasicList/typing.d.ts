declare namespace BasicListApi {
  type Page = {
    title: string;
    type: string;
    searchBar?: boolean;
    trash?: boolean;
  };

  type Action = {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method?: string;
  };

  // 控件上的属性
  type Field = {
    title: string;
    dataIndex: string;
    key: string;
    [keyof: string]: any; // 可以添加任意属性
  };

  type DataSource = {
    [keyof: string]: any; // 可以添加任意属性
  };

  type Meta = {
    total: number;
    per_page: number;
    page: number;
  };

  type Tabs = {
    name: string;
    title: string;
    data: Field[];
  };

  type Actions = {
    name: string;
    title: string;
    data: Action[];
  };

  type PageLayout = {
    tabs: Tabs[];
    actions: Actions[];
  };

  type ListLayout = {
    tableColumn: Field[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  };

  type PageData = {
    page: Page;
    layout: PageLayout;
    dataSource: DataSource;
  };

  type ListData = {
    page: Page;
    layout: ListLayout;
    dataSource: DataSource[];
    meta: Meta;
  };

  type Root = {
    success: boolean;
    message: string;
    data: ListData | PageData;
  };
}
