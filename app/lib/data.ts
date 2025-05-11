import os from "os";
import { DatabaseTestData, SystemDetail, TestUser } from "@/app/definition/data";
import { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function getSystemDetail() {
  const hostname = os.hostname();
  const platform = os.platform();
  const release = os.release();
  const cpuArch = os.arch();
  const totalMem = os.totalmem();
  const uptime = os.uptime();
  const nodeVersion = process.version;

  const systemDetailData: SystemDetail[] = [
    { name: "主机名", value: hostname },
    { name: "内核", value: platform },
    { name: "内核版本", value: release },
    { name: "CPU架构", value: cpuArch },
    { name: "总内存", value: totalMem },
    { name: "开机时间", value: uptime },
    { name: "Node版本", value: nodeVersion },
  ];

  return systemDetailData;
}

export async function queryUserData(conn: mysql.Connection) {
  const sql = `
      start transaction read only;
      select @@hostname;
      select * from test_tb;
      commit;
    `;
  try {
    const data = (await conn.query<RowDataPacket[][]>(sql))[0];
    return NextResponse.json<DatabaseTestData>({
      hostname: data[1][0]["@@hostname"],
      userdata: data[2] as any,
      writeHostname: "None",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: `请求数据库失败：${e}`,
      },
      { status: 500 }
    );
  }
}

export async function modifyUser(conn: mysql.Connection, user: TestUser) {
  const { id, username, age } = user;
  if (username.length > 255) {
    return NextResponse.json(
      {
        message: "用户名长度不能超过255位！",
      },
      { status: 400 }
    );
  } else if (age < 1 || age > 255) {
    return NextResponse.json(
      {
        message: "年龄范围为 0～255！",
      },
      { status: 400 }
    );
  }
  const sql = `
    start transaction;
    select @@hostname;
    update test_tb set username='${user.username}',age=${user.age} where id=${id};
    commit;
  `;
  try {
    const data = (await conn.query<RowDataPacket[][]>(sql))[0];
    return NextResponse.json({
      message: "修改用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`修改用户失败：${err}`);
    return NextResponse.json(
      {
        message: `修改用户失败：${err}`,
      },
      { status: 500 }
    );
  }
}

export async function adduser(conn: mysql.Connection, user: TestUser) {
  const { username, age } = user;
  if (username.length > 255) {
    return NextResponse.json(
      {
        message: "用户名长度不能超过255位！",
      },
      { status: 400 }
    );
  } else if (age < 1 || age > 255) {
    return NextResponse.json(
      {
        message: "年龄范围为 0～255！",
      },
      { status: 400 }
    );
  }

  try {
    const sql = `select * from test_tb where username='${username}';`;
    const data = (await conn.query<RowDataPacket[]>(sql))[0];
    if (data.length > 0) {
      return NextResponse.json(
        {
          message: "用户已存在",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(`添加用户失败：${err}`);
    return NextResponse.json(
      {
        message: `添加用户失败：${err}`,
      },
      { status: 500 }
    );
  }

  try {
    const sql = `
      start transaction;
      select @@hostname;
      insert into test_tb (username, age) value ('${username}', ${age});
      commit;
    `;
    const data = (await conn.query<RowDataPacket[][]>(sql))[0];
    return NextResponse.json({
      message: "添加用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`添加用户失败：${err}`);
    return NextResponse.json(
      {
        message: `添加用户失败：${err}`,
      },
      { status: 500 }
    );
  }
}

export async function delUser(conn: mysql.Connection, id: number) {
  try {
    const sql = `select * from test_tb where id=${id};`;
    const data = (await conn.query<RowDataPacket[]>(sql))[0];
    if (data.length <= 0) {
      return NextResponse.json(
        {
          message: "用户不存在",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(`删除用户失败：${err}`);
    return NextResponse.json(
      {
        message: `删除用户失败：${err}`,
      },
      { status: 500 }
    );
  }

  try {
    const sql = `
      start transaction;
      select @@hostname;
      delete from test_tb where id=${id};
      commit;
    `;
    const data = (await conn.query<RowDataPacket[][]>(sql))[0];
    return NextResponse.json({
      message: "删除用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`删除用户失败：${err}`);
    return NextResponse.json(
      {
        message: `删除用户失败：${err}`,
      },
      { status: 500 }
    );
  }
}
