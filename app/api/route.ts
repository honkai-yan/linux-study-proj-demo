import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { ConnectionOptions } from "mysql2";
import { queryUserData, modifyUser, addUser, delUser } from "../lib/data";
import { TestUser } from "../definition/data";

const access: ConnectionOptions = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "test_db",
  multipleStatements: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

if (process.env.APP_MODE === "development") {
  console.info("应用模式：开发模式");
} else {
  console.info("应用模式：生产模式");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let conn: mysql.Connection | null = null;
  let response: NextResponse | null = null;
  try {
    conn = await mysql.createConnection(access);
    conn.on("error", () => {
      console.error("数据库连接丢失");
    });

    const body = await req.json();
    const reqType = body.reqType;
    // 获取用户数据
    if (!reqType) {
      response = await queryUserData(conn);
    }
    // 修改用户
    else if (reqType === "modify") {
      const user = body.user as TestUser;
      response = await modifyUser(conn, user);
    }
    // 新增用户
    else if (reqType === "add") {
      const user = body.user as TestUser;
      response = await addUser(conn, user);
    }
    // 删除用户
    else if (reqType === "del") {
      response = await delUser(conn, body.id);
    }
  } catch (err) {
    console.error(`服务器错误：${err}`);
    return NextResponse.json(
      {
        message: "服务器错误",
      },
      { status: 500 }
    );
  } finally {
    await conn?.end();
    return response as NextResponse;
  }
}
