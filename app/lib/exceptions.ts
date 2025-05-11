import { NextResponse } from "next/server";

export function serverException() {
  return NextResponse.json(
    {
      message: "服务器错误",
    },
    { status: 500 }
  );
}
