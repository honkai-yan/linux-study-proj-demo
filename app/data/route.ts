import os from "os";
import { SystemDetail } from "@/app/definition/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  return NextResponse.json(systemDetailData);
}
