import { TestUser } from "@/app/definition/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Toaster, toast } from "sonner";

const initialUser = {
  id: -1,
  username: "",
  age: 0,
};

export default function DataModify({ userdata, onModifyUser }: { userdata?: TestUser[]; onModifyUser: Function }) {
  const comboSelectedName = useRef("");
  const [selectedUser, setSelectUser] = useState<TestUser>(initialUser);

  async function handleModifyUser() {
    if (comboSelectedName.current === "") {
      toast.error("请选择一个用户");
      return;
    }
    try {
      const res = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          reqType: "modify",
          user: selectedUser,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        comboSelectedName.current = selectedUser.username;
        toast.success(data.message);
        onModifyUser(data.writeHostname);
      } else {
        toast.error(`修改用户失败：${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`修改用户失败：${err}`);
    }
  }

  async function handleAddUser() {
    const user = userdata?.find((item) => item.username === selectedUser.username);
    if (user) {
      toast.error("该用户已存在！");
      return;
    }
    if (selectedUser.username === "") {
      toast.error("用户名不能为空！");
      return;
    }
    if (selectedUser.age < 0 || selectedUser.age > 255) {
      toast.error("年龄范围为0～255！");
      return;
    }
    try {
      const res = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          reqType: "add",
          user: selectedUser,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        onModifyUser(data.writeHostname);
      } else {
        toast.error(`添加用户失败：${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`添加用户失败：${err}`);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Toaster position="top-center" richColors />
      <Select
        onValueChange={(val) => {
          const _val = val.trimStart().trimEnd();
          const user = userdata?.find((item) => item.username === _val);
          comboSelectedName.current = _val;
          setSelectUser(user ?? initialUser);
        }}
        value={comboSelectedName.current}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择一个user" />
        </SelectTrigger>
        <SelectContent>
          {userdata?.map((item) => (
            <SelectItem key={item.id} value={item.username}>
              {item.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-1">
        <Label htmlFor="username">姓名</Label>
        <Input
          onChange={(e) => {
            const name = e.target.value;
            setSelectUser({
              ...(selectedUser as TestUser),
              username: name.length > 255 ? name.slice(0, -1) : name,
            });
          }}
          name="username"
          value={selectedUser?.username}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="age">年龄</Label>
        <Input
          type="number"
          min={0}
          max={255}
          onChange={(e) => {
            setSelectUser({
              ...(selectedUser as TestUser),
              age: Number(e.target.value),
            });
          }}
          name="age"
          value={selectedUser?.age}
        />
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleModifyUser}>
          修改
        </Button>
        <Button className="flex-1" onClick={handleAddUser}>
          新增
        </Button>
      </div>
    </div>
  );
}
