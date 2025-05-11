import { getSystemDetail } from "../lib/data";
import ps from "pretty-ms";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function Dashboard() {
  const systemDetail = await getSystemDetail();

  systemDetail.map((item) => {
    if (item.name === "总内存") {
      item.value = Math.round((item.value as number) / 1024 / 1024) + " MB";
    } else if (item.name === "开机时间") {
      item.value = ps((item.value as number) * 1000, {
        secondsDecimalDigits: 0,
      });
    }
  });

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle>Linux高可用Web服务器集群 测试应用</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {systemDetail.map((item) => (
            <div className="flex flex-row items-center" key={item.name}>
              <span className="block w-[120px]">{item.name}：</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
