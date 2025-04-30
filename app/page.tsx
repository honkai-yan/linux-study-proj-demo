"use client";

import { useEffect, useRef, useState } from "react";
import { SystemDetail } from "./definition/data";
import ps from "pretty-ms";

export default function Home() {
  // const timer = useRef<NodeJS.Timeout>(null);
  const [systemDetail, setSystemDetail] = useState<SystemDetail[]>([]);

  useEffect(() => {
    fetchData();
    return () => {
      // clearTimeout(timer.current as NodeJS.Timeout);
    };
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("/data", { method: "POST" });
      const data = (await response.json()) as SystemDetail[];
      data.map((item) => {
        if (item.name === "总内存") {
          item.value = Math.round((item.value as number) / 1024 / 1024) + " MB";
        } else if (item.name === "开机时间") {
          item.value = ps((item.value as number) * 1000, {
            secondsDecimalDigits: 0,
          });
        }
      });
      setSystemDetail(data);
      // timer.current = setTimeout(fetchData, 1000);
    } catch (_) {}
  }

  return (
    <div className="flex flex-col p-[20px] items-center w-full min-h-full bg-gray-400">
      <div className="w-full max-w-[500px] min-h-10 bg-white/75 shadow-md rounded-xl p-4">
        <h1 className="pb-5 text-2xl">Linux高可用Web服务器集群 测试应用</h1>
        <div className="flex flex-col gap-3">
          {systemDetail.map((item) => (
            <div className="flex flex-row items-center" key={item.name}>
              <span className="block w-[120px]">{item.name}：</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
