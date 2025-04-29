import os from "os";
import ps from "pretty-ms";

export function getSystemDetail() {
  const hostname = os.hostname();
  const platform = os.platform();
  const release = os.release();
  const cpuArch = os.arch();
  const totalMem = os.totalmem();
  const uptime = os.uptime();

  return [
    ["主机名", "内核", "内核版本", "CPU架构", "总内存", "开机时间"],
    [
      hostname,
      platform,
      release,
      cpuArch,
      totalMem / 1024 / 1024 + " MB",
      ps(uptime * 1000),
    ],
  ];
}
