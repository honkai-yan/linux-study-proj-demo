"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/data-table";
import DataModify from "@/components/data-modify";
import { DatabaseTestData } from "../definition/data";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function DatabaseTest() {
  const [data, setData] = useState<DatabaseTestData>({
    hostname: "None",
    writeHostname: "None",
    userdata: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function changeWriteHostname(name: string) {
    fetchData(name);
  }

  async function fetchData(newWriteHostname?: string) {
    try {
      const res = await fetch("/database-test", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const _data = await res.json();
      if (res.ok) {
        setData({
          ...(_data as DatabaseTestData),
          writeHostname: newWriteHostname ?? data.writeHostname,
        });
      } else {
        console.error(_data.message);
        toast.error(_data.message);
      }
    } catch (err) {
      console.error(`请求数据库失败：${err}`);
      toast.error(`请求数据库失败：${err}`);
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>数据库读写分离测试</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <div>
                <Badge className="mr-2">读取</Badge>
                <Badge>主机名：{data?.hostname}</Badge>
              </div>
              <DataTable data={data} onDelUser={fetchData} />
            </div>
            <div>
              <div>
                <Badge className="mr-2">写入</Badge>
                <Badge>主机名：{data?.writeHostname}</Badge>
              </div>
              <div className="mt-2">
                <DataModify userdata={data?.userdata} onModifyUser={(name: string) => fetchData(name)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
