import { DatabaseTestData } from "@/app/definition/data";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster, toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DataTable({ data, onDelUser }: { data?: DatabaseTestData; onDelUser: Function }) {
  async function handleDelUser(id: number) {
    try {
      const res = await fetch("/database-test", {
        method: "POST",
        body: JSON.stringify({
          reqType: "del",
          id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        onDelUser(data.writeHostname);
      } else {
        toast.error(`${(await res.json()).message}`);
      }
    } catch (err) {
      console.error(`删除用户失败：${err}`);
      toast.error(`删除用户失败：${err}`);
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>年龄</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.userdata.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="cursor-pointer text-red-600" variant="link">
                        删除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除用户 {item.username} 吗？</AlertDialogTitle>
                        <AlertDialogDescription>操作不可撤销。</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 text-white hover:bg-red-700"
                          onClick={() => handleDelUser(item.id)}
                        >
                          确认
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
