import os from "os";
import { DatabaseTestData, SystemDetail, TestUser } from "@/app/definition/data";
import { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { duplicateUserException, noSpecificUserException, serverException } from "./exceptions";
import { validateUserdata } from "./utils";

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
    const [data] = await conn.query<RowDataPacket[][]>(sql);
    return NextResponse.json<DatabaseTestData>({
      hostname: data[1][0]["@@hostname"],
      userdata: data[2] as any,
      writeHostname: "None",
    });
  } catch (e) {
    console.error(`获取用户数据失败：${e}`);
    return serverException();
  }
}

export async function modifyUser(conn: mysql.Connection, user: TestUser) {
  const { id, username, age } = user;
  const validateResult = validateUserdata(user);
  if (validateResult !== true) {
    return validateResult as NextResponse;
  }

  try {
    const sql = `
      select username from test_tb where id=?;
    `;
    const [data] = await conn.query<RowDataPacket[]>(sql, [id]);
    if (data.length === 0) {
      return noSpecificUserException();
    }
  } catch (err) {
    console.error(`修改用户失败，在校验用户时：${err}`);
    return serverException();
  }

  try {
    const sql = `
      select username from test_tb where username=?;
    `;
    const [data] = await conn.query<RowDataPacket[]>(sql, [username]);
    if (data.length > 0) {
      return duplicateUserException();
    }
  } catch (err) {
    console.error(`修改用户失败，在校验用户时：${err}`);
    return serverException();
  }

  try {
    const sql = `
    start transaction;
    select @@hostname;
    update test_tb set username=?,age=? where id=?;
    commit;
  `;
    const [data] = await conn.query<RowDataPacket[][]>(sql, [username, age, id]);
    return NextResponse.json({
      message: "修改用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`修改用户失败，在修改用户时：${err}`);
    return serverException();
  }
}

export async function addUser(conn: mysql.Connection, user: TestUser) {
  const { username, age } = user;
  const validateResult = validateUserdata(user);
  if (validateResult !== true) {
    return validateResult as NextResponse;
  }

  try {
    const sql = `select * from test_tb where username=?;`;
    const [data] = await conn.query<RowDataPacket[]>(sql, [username]);
    if (data.length > 0) {
      return duplicateUserException();
    }
  } catch (err) {
    console.error(`添加用户失败，在校验用户时：${err}`);
    return serverException();
  }

  try {
    const sql = `
      start transaction;
      select @@hostname;
      insert into test_tb (username, age) value (?, ?);
      commit;
    `;
    const [data] = await conn.query<RowDataPacket[][]>(sql, [username, age]);
    return NextResponse.json({
      message: "添加用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`添加用户失败，在添加用户时：${err}`);
    return serverException();
  }
}

export async function delUser(conn: mysql.Connection, id: number) {
  try {
    const sql = `select * from test_tb where id=?;`;
    const [data] = await conn.query<RowDataPacket[]>(sql, [id]);
    if (data.length <= 0) {
      return noSpecificUserException();
    }
  } catch (err) {
    console.error(`删除用户失败，在校验用户时：${err}`);
    return serverException();
  }

  try {
    const sql = `
      start transaction;
      select @@hostname;
      delete from test_tb where id=?;
      commit;
    `;
    const [data] = await conn.query<RowDataPacket[][]>(sql, [id]);
    return NextResponse.json({
      message: "删除用户成功",
      writeHostname: data[1][0]["@@hostname"],
    });
  } catch (err) {
    console.error(`删除用户失败，在删除用户时：${err}`);
    return serverException();
  }
}
