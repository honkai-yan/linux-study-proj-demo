import mysql from "mysql2/promise";
import { TestUser } from "../definition/data";
import { NextResponse } from "next/server";

export async function isConnectionActive(conn: mysql.Connection) {
  try {
    await conn.ping();
    return {
      status: true,
      message: "数据库连接活跃",
    };
  } catch (err) {
    return {
      status: false,
      message: "数据库连接意外关闭",
    };
  }
}

export function validateUserdata(user: TestUser): NextResponse | boolean {
  const { username, age } = user;
  if (username.length === 0) {
    return NextResponse.json(
      {
        message: "用户名不能为空！",
      },
      { status: 400 }
    );
  } else if (username.length > 255) {
    return NextResponse.json(
      {
        message: "用户名长度不能超过255位！",
      },
      { status: 400 }
    );
  } else if (age < 0 || age > 255) {
    return NextResponse.json(
      {
        message: "年龄范围为 0～255！",
      },
      { status: 400 }
    );
  } else return true;
}
