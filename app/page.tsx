import { getSystemDetail } from "@/app/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const systemDetail = await getSystemDetail();
  return (
    <div className="flex flex-col p-[20px] items-center w-full min-h-full bg-gray-400">
      <div className="w-full max-w-[500px] min-h-10 bg-white/75 shadow-md rounded-xl p-4">
        <h1 className="pb-5 text-2xl">Linux高可用Web服务器集群 测试应用</h1>
        <div className="flex flex-col gap-3">
          {systemDetail[1].map((item, idx) => (
            <div className="flex flex-row items-center" key={idx}>
              <span className="block w-[120px]">{systemDetail[0][idx]}：</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
