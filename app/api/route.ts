import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { ConnectionOptions } from "mysql2";
import { queryUserData, modifyUser, adduser, delUser } from "../lib/data";
import { TestUser } from "../definition/data";

const access: ConnectionOptions = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "test_db",
  multipleStatements: true,
};

export async function POST(req: NextRequest) {
  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(access);
    conn.on("error", () => {
      console.error("数据库连接丢失");
    });

    const body = await req.json();
    const reqType = body.reqType;
    // 获取用户数据
    if (!reqType) {
      return await queryUserData(conn);
    }
    // 修改用户
    else if (reqType === "modify") {
      const user = body.user as TestUser;
      return await modifyUser(conn, user);
    }
    // 新增用户
    else if (reqType === "add") {
      const user = body.user as TestUser;
      return await adduser(conn, user);
    }
    // 删除用户
    else if (reqType === "del") {
      return await delUser(conn, body.id);
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
  }
}
