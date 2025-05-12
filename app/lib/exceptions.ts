import { NextResponse } from "next/server";

// 服务器错误
export function serverException(msg?: string) {
  return NextResponse.json(
    {
      message: msg ?? "服务器错误",
    },
    { status: 500 }
  );
}

// 用户不存在
export function noSpecificUserException(msg?: string) {
  return NextResponse.json(
    {
      message: msg ?? "用户不存在",
    },
    { status: 404 }
  );
}

// 存在重复用户
export function duplicateUserException(msg?: string) {
  return NextResponse.json(
    {
      message: msg ?? "用户名重复",
    },
    { status: 409 }
  );
}
