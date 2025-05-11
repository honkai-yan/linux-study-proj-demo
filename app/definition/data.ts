export interface SystemDetail {
  name: string;
  value: string | number;
}

export interface TestUser {
  id: number;
  username: string;
  age: number;
}

export interface DatabaseTestData {
  // 读操作
  // 数据库服务器主机名
  hostname: string;
  // 数据内容
  userdata: TestUser[];

  // 写操作
  // 写入服务器主机名
  writeHostname: string;
}
